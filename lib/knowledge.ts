import { randomUUID } from 'crypto';
import { createAdminClient, STORAGE_BUCKET } from '@/lib/supabase/admin';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { slugify, readingMinutes } from '@/lib/slug';
import type { Blog, BlogPayload, BlogUpdatePayload, Paged } from '@/lib/types';

// Knowledge Hub articles mirror the blog schema.
const TABLE = 'knowledge_articles';
const JOIN = 'knowledge_article_tags';
const FK = 'article_id';

const SELECT =
  `id, title, slug, excerpt, content, cover_image_url, category_id, status, published_at, seo_title, seo_description, reading_minutes, created_at, updated_at, categories(id, name, slug), ${JOIN}(tags(name, slug))`;

function mapRow(r: any): Blog {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt || '',
    content: r.content || '',
    cover_image_url: r.cover_image_url || '',
    category_id: r.category_id || null,
    status: r.status,
    published_at: r.published_at || null,
    seo_title: r.seo_title || '',
    seo_description: r.seo_description || '',
    reading_minutes: r.reading_minutes || 1,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    tags: (r[JOIN] || []).map((j: any) => j.tags?.name).filter(Boolean),
    category: r.categories || null,
  };
}

const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
function parseImage(value: string) {
  const m = value.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (m) return { contentType: m[1], buffer: Buffer.from(m[2], 'base64') };
  return { contentType: 'image/jpeg', buffer: Buffer.from(value, 'base64') };
}
async function uploadCoverImage(base64: string): Promise<string> {
  const supabase = createAdminClient();
  const { contentType, buffer } = parseImage(base64);
  const key = `knowledge/${randomUUID()}.${EXT[contentType] || 'jpg'}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(key, buffer, { contentType, upsert: false });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

async function upsertTags(names: string[]): Promise<string[]> {
  const supabase = createAdminClient();
  const clean = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
  const ids: string[] = [];
  for (const name of clean) {
    const { data } = await supabase.from('tags').upsert({ name, slug: slugify(name) }, { onConflict: 'name' }).select('id').single();
    if (data?.id) ids.push(data.id);
  }
  return ids;
}
async function syncTags(itemId: string, tagNames: string[]) {
  const supabase = createAdminClient();
  await supabase.from(JOIN).delete().eq(FK, itemId);
  const ids = await upsertTags(tagNames);
  if (ids.length) await supabase.from(JOIN).insert(ids.map((tag_id) => ({ [FK]: itemId, tag_id })));
}
async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const supabase = createAdminClient();
  const root = slugify(base) || `article-${Date.now()}`;
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from(TABLE).select('id').eq('slug', candidate).limit(1);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function listKnowledge({
  search = '',
  page = 1,
  perPage = 10,
}: { search?: string; page?: number; perPage?: number }): Promise<Paged<Blog>> {
  const supabase = createAdminClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  let query = supabase.from(TABLE).select(SELECT, { count: 'exact' });
  if (search) query = query.ilike('title', `%${search}%`);
  const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);
  const total = count ?? 0;
  return {
    items: (data || []).map(mapRow),
    pagination: { page, per_page: perPage, total_items: total, total_pages: Math.max(1, Math.ceil(total / perPage)) },
  };
}

export async function getKnowledge(id: string): Promise<Blog | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from(TABLE).select(SELECT).eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data) : null;
}

export async function createKnowledge(payload: BlogPayload): Promise<Blog | null> {
  const supabase = createAdminClient();
  const cover = payload.image_base64 ? await uploadCoverImage(payload.image_base64) : '';
  const content = sanitizeBlogHtml(payload.content || '');
  const status = payload.status === 'published' ? 'published' : 'draft';
  const slug = await ensureUniqueSlug(payload.slug || payload.title);
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: payload.title.trim(),
      slug,
      excerpt: payload.excerpt || '',
      content,
      cover_image_url: cover,
      category_id: payload.category_id || null,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
      seo_title: payload.seo_title || '',
      seo_description: payload.seo_description || '',
      reading_minutes: readingMinutes(content),
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  await syncTags(data.id, payload.tags || []);
  return getKnowledge(data.id);
}

export async function updateKnowledge(id: string, payload: BlogUpdatePayload): Promise<Blog | null> {
  const supabase = createAdminClient();
  const existing = await getKnowledge(id);
  if (!existing) throw new Error('Article not found');
  const fields: Record<string, unknown> = {};
  if (payload.title !== undefined) fields.title = payload.title.trim();
  if (payload.slug !== undefined) fields.slug = await ensureUniqueSlug(payload.slug || payload.title || existing.title, id);
  if (payload.excerpt !== undefined) fields.excerpt = payload.excerpt;
  if (payload.content !== undefined) {
    const content = sanitizeBlogHtml(payload.content);
    fields.content = content;
    fields.reading_minutes = readingMinutes(content);
  }
  if (payload.category_id !== undefined) fields.category_id = payload.category_id || null;
  if (payload.seo_title !== undefined) fields.seo_title = payload.seo_title;
  if (payload.seo_description !== undefined) fields.seo_description = payload.seo_description;
  if (payload.image_base64) fields.cover_image_url = await uploadCoverImage(payload.image_base64);
  if (payload.status !== undefined) {
    fields.status = payload.status;
    if (payload.status === 'published' && !existing.published_at) fields.published_at = new Date().toISOString();
    if (payload.status === 'draft') fields.published_at = null;
  }
  if (Object.keys(fields).length > 0) {
    const { error } = await supabase.from(TABLE).update(fields).eq('id', id);
    if (error) throw new Error(error.message);
  }
  if (payload.tags !== undefined) await syncTags(id, payload.tags);
  return getKnowledge(id);
}

export async function deleteKnowledge(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
