'use client';

import { useEffect, useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Blog, BlogPayload, BlogUpdatePayload, Category } from '@/lib/types';
import { listContent, createContent, updateContent, deleteContent } from '@/lib/api-client';
import BlogsTable from '@/components/features/blogs/BlogsTable';
import BlogEditor from '@/components/features/blogs/BlogEditor';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const loadBlogs = async (args?: { search?: string; page?: number }) => {
    setLoading(true);
    try {
      const result = await listContent('blogs', {
        search: args?.search ?? search,
        page: args?.page ?? page,
        perPage: PAGE_SIZE,
      });
      setBlogs(result.items);
      setTotalBlogs(result.pagination.total_items);
      setTotalPages(result.pagination.total_pages);
      setPage(result.pagination.page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
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
    loadBlogs({ search: value, page: 1 });
  };

  const handlePageChange = (p: number) => loadBlogs({ page: p });

  const openNew = () => {
    setEditingBlog(null);
    setEditorOpen(true);
  };
  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setEditorOpen(true);
  };
  const closeEditor = () => {
    setEditorOpen(false);
    setEditingBlog(null);
  };

  const handleSave = async (payload: BlogPayload | BlogUpdatePayload, isNew: boolean) => {
    try {
      if (isNew) {
        await createContent('blogs', payload as BlogPayload);
        toast.success('Blog created');
      } else {
        await updateContent('blogs', editingBlog!.id, payload as BlogUpdatePayload);
        toast.success('Blog updated');
      }
      closeEditor();
      await loadBlogs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save blog');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent('blogs', id);
      toast.success('Blog deleted');
      await loadBlogs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog');
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <FileText className="h-5 w-5 text-brand-red" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Manage Blogs</h1>
              <p className="text-sm text-slate-500">{totalBlogs} total blogs</p>
            </div>
          </div>

          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            New Blog
          </Button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading blogs...
          </div>
        ) : (
          <BlogsTable
            blogs={blogs}
            search={search}
            page={page}
            totalPages={totalPages}
            totalItems={totalBlogs}
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
          blog={editingBlog}
          categories={categories}
          onClose={closeEditor}
          onSave={handleSave}
        />
      )}
    </>
  );
}
