'use client';

import { useEffect, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Blog, BlogPayload, BlogUpdatePayload, Category } from '@/lib/types';
import { listContent, createContent, updateContent, deleteContent } from '@/lib/api-client';
import BlogsTable from '@/components/features/blogs/BlogsTable';
import BlogEditor from '@/components/features/blogs/BlogEditor';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default function ManageKnowledgePage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);

  const load = async (args?: { search?: string; page?: number }) => {
    setLoading(true);
    try {
      const result = await listContent('knowledge', {
        search: args?.search ?? search,
        page: args?.page ?? page,
        perPage: PAGE_SIZE,
      });
      setItems(result.items);
      setTotal(result.pagination.total_items);
      setTotalPages(result.pagination.total_pages);
      setPage(result.pagination.page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCategories(d.data);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    load({ search: value, page: 1 });
  };
  const handlePageChange = (p: number) => load({ page: p });
  const openNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };
  const openEdit = (item: Blog) => {
    setEditing(item);
    setEditorOpen(true);
  };
  const closeEditor = () => {
    setEditorOpen(false);
    setEditing(null);
  };

  const handleSave = async (payload: BlogPayload | BlogUpdatePayload, isNew: boolean) => {
    try {
      if (isNew) {
        await createContent('knowledge', payload as BlogPayload);
        toast.success('Article created');
      } else {
        await updateContent('knowledge', editing!.id, payload as BlogUpdatePayload);
        toast.success('Article updated');
      }
      closeEditor();
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save article');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent('knowledge', id);
      toast.success('Article deleted');
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete article');
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <BookOpen className="h-5 w-5 text-brand-red" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Manage Knowledge Hub</h1>
              <p className="text-sm text-slate-500">{total} total articles</p>
            </div>
          </div>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading articles...
          </div>
        ) : (
          <BlogsTable
            blogs={items}
            search={search}
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {editorOpen && (
        <BlogEditor
          blog={editing}
          categories={categories}
          label="Article"
          basePath="/resources/knowledge-hub"
          onClose={closeEditor}
          onSave={handleSave}
        />
      )}
    </>
  );
}
