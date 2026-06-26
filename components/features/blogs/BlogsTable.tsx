'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import PaginationBar from '@/components/shared/PaginationBar';
import { Blog } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BlogsTableProps {
  blogs: Blog[];
  search: string;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function BlogsTable({
  blogs,
  search,
  page,
  totalPages,
  totalItems,
  pageSize,
  onSearch,
  onPageChange,
  onEdit,
  onDelete,
}: BlogsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deleteTarget = blogs.find((b) => b.id === deleteId);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 500);
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by title..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-400">
                  No blogs found.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-sm font-medium text-slate-900">
                    <span className="line-clamp-2">{b.title}</span>
                  </TableCell>
                  <TableCell>
                    {b.status === 'published' ? (
                      <Badge className="border-green-200 bg-green-50 text-green-700">Published</Badge>
                    ) : (
                      <Badge className="border-slate-200 bg-slate-50 text-slate-500">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {b.tags && b.tags.length > 0 ? (
                        <>
                          {b.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} className="border-red-200 bg-red-50 text-brand-red">
                              {tag}
                            </Badge>
                          ))}
                          {b.tags.length > 3 && (
                            <Badge className="border-slate-200 text-slate-500">
                              +{b.tags.length - 3}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">No tags</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-500 lg:table-cell">
                    {formatDate(b.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:bg-red-50 hover:text-brand-red"
                        onClick={() => onEdit(b)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeleteId(b.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete blog"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
