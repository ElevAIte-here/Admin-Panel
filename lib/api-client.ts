import type { Blog, BlogPayload, BlogUpdatePayload, Paged } from '@/lib/types';

async function parse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchBlogs(params: {
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<Paged<Blog>> {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  q.set('page', String(params.page || 1));
  q.set('per_page', String(params.perPage || 10));
  const data = await parse(await fetch(`/api/blogs?${q.toString()}`));
  return data.data as Paged<Blog>;
}

export async function createBlog(payload: BlogPayload) {
  return parse(
    await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );
}

export async function updateBlog(id: string, payload: BlogUpdatePayload) {
  return parse(
    await fetch(`/api/blogs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );
}

export async function deleteBlog(id: string) {
  return parse(await fetch(`/api/blogs/${id}`, { method: 'DELETE' }));
}
