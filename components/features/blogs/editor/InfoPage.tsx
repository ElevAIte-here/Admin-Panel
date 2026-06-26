'use client';

import { ChevronRight, X, ImagePlus, Tag, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { InfoPageProps } from './types';

export function InfoPage({
  isEdit,
  title,
  setTitle,
  slug,
  setSlug,
  excerpt,
  setExcerpt,
  status,
  setStatus,
  categoryId,
  setCategoryId,
  categories,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  tagInput,
  setTagInput,
  tags,
  addTag,
  removeTag,
  imagePreview,
  fileRef,
  onImageChange,
  onClose,
  onNext,
}: InfoPageProps) {
  const canNext = title.trim().length > 0 && (isEdit || imagePreview.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-3">
        <span className="text-base font-semibold text-slate-800">
          {isEdit ? 'Edit Blog' : 'New Blog'} — Details
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            title="Next — open editor"
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-red px-4 text-sm font-medium text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Content <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-7 px-6 py-10">
          {/* Cover image */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Cover Image {!isEdit && <span className="text-brand-red">*</span>}
            </p>
            <div
              className="relative flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 transition-colors hover:border-brand-red"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImagePlus className="h-9 w-9" />
                  <span className="text-sm">Click to upload cover image</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImageChange} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>
              Title <span className="text-brand-red">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              className="h-12 text-base"
            />
          </div>

          {/* Slug + Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-slate-400">/resources/blogs/{slug || 'your-slug'}</p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-red"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Category + Excerpt */}
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-red"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Short summary shown on cards and search results..."
            />
          </div>

          {/* Tags */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Tag className="h-4 w-4" /> Tags
              <span className="ml-1 text-xs font-normal text-slate-400">(press Enter or , to add)</span>
            </p>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="e.g. Agentic AI, Automation"
                className="flex-1"
              />
              <button
                type="button"
                onClick={addTag}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-brand-red"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-base leading-none text-red-300 transition-colors hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SEO (optional)</p>
            <div className="space-y-2">
              <Label>Meta title</Label>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Defaults to the blog title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta description</Label>
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder="Defaults to the excerpt (≤160 chars recommended)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
