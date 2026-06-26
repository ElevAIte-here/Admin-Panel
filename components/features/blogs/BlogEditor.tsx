'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BlogEditorProps, ListStyle } from './editor/types';
import { useFormatState } from './editor/useFormatState';
import { InfoPage } from './editor/InfoPage';
import { EditorPage } from './editor/EditorPage';
import { slugify } from '@/lib/slug';
import type { BlogPayload, BlogStatus } from '@/lib/types';

const readAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });

export default function BlogEditor({ blog, categories, onClose, onSave }: BlogEditorProps) {
  const isEdit = Boolean(blog);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'info' | 'editor'>('info');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [categoryId, setCategoryId] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);

  const fmt = useFormatState(editorRef);

  // Reset when blog changes (open/close)
  useEffect(() => {
    setStep('info');
    setTitle(blog?.title || '');
    setSlug(blog?.slug || '');
    setSlugEdited(Boolean(blog?.slug));
    setExcerpt(blog?.excerpt || '');
    setStatus(blog?.status || 'draft');
    setCategoryId(blog?.category_id || '');
    setSeoTitle(blog?.seo_title || '');
    setSeoDescription(blog?.seo_description || '');
    setTags(blog?.tags || []);
    setTagInput('');
    setImagePreview(blog?.cover_image_url || '');
    setImageBase64(undefined);
    if (fileRef.current) fileRef.current.value = '';
  }, [blog]);

  // Keep slug auto-synced to title until the user edits it manually.
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  };
  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlug(slugify(value));
  };

  const handleGoToEditor = () => {
    setStep('editor');
    setTimeout(() => {
      if (editorRef.current && editorRef.current.innerHTML === '') {
        editorRef.current.innerHTML = blog?.content || '';
      }
    }, 0);
  };

  // ── Tags ──────────────────────────────────────────────────────────────────
  const addTag = () => {
    const trimmed = tagInput.trim().replace(/,+$/, '');
    if (!trimmed) return;
    const newTags = trimmed
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => !tags.includes(t));
    if (newTags.length) setTags((prev) => [...prev, ...newTags]);
    setTagInput('');
  };
  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  // ── Image ───────────────────────────────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageBase64(await readAsBase64(file));
  };

  // ── Editor commands ─────────────────────────────────────────────────────────
  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }, []);

  const applyFontSize = useCallback((size: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = size;
    try {
      range.surroundContents(span);
    } catch {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    }
    sel.removeAllRanges();
  }, []);

  const applyHighlight = useCallback((color: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    const fragment = range.cloneContents();
    const stripBg = (root: Node) => {
      root.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          (child as HTMLElement).style.removeProperty('background-color');
          stripBg(child);
        }
      });
    };
    stripBg(fragment);

    range.deleteContents();
    range.insertNode(fragment);
    const restored = range.cloneRange();

    if (!color) {
      sel.removeAllRanges();
      sel.addRange(restored);
      return;
    }

    const span = document.createElement('span');
    span.style.backgroundColor = color;
    sel.removeAllRanges();
    sel.addRange(restored);
    const r2 = sel.getRangeAt(0);
    try {
      r2.surroundContents(span);
    } catch {
      span.appendChild(r2.extractContents());
      r2.insertNode(span);
    }
    sel.removeAllRanges();
  }, []);

  const insertList = useCallback((style: ListStyle, ordered: boolean) => {
    editorRef.current?.focus();
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false);
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      let node: Node | null = sel.getRangeAt(0).startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'OL' || node.nodeName === 'UL') {
          (node as HTMLElement).style.listStyleType = style;
          break;
        }
        node = node.parentNode;
      }
    }, 0);
  }, []);

  const insertTable = useCallback((rows: number, cols: number) => {
    editorRef.current?.focus();
    let html = '<table style="border-collapse:collapse;width:100%;margin:14px 0;">';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html +=
          r === 0
            ? '<th style="border:1px solid #cbd5e1;padding:8px 12px;background:#f8fafc;font-weight:600;text-align:left;">&nbsp;</th>'
            : '<td style="border:1px solid #cbd5e1;padding:8px 12px;">&nbsp;</td>';
      }
      html += '</tr>';
    }
    html += '</table><p><br></p>';
    document.execCommand('insertHTML', false, html);
  }, []);

  const insertCard = useCallback(() => {
    editorRef.current?.focus();
    const html =
      '<div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin:14px 0;background:#f8fafc;"><p>Card content here...</p></div><p><br></p>';
    document.execCommand('insertHTML', false, html);
  }, []);

  const insertBlockquote = useCallback(() => {
    editorRef.current?.focus();
    const html =
      '<blockquote style="border-left:4px solid #E63B41;margin:16px 0;padding:10px 16px;background:#fef2f2;border-radius:0 8px 8px 0;color:#991b1b;font-style:italic;"><p>Quote text here...</p></blockquote><p><br></p>';
    document.execCommand('insertHTML', false, html);
  }, []);

  const insertLink = useCallback((url: string, savedRange: Range | null) => {
    editorRef.current?.focus();
    if (savedRange) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange);
    }
    document.execCommand('createLink', false, url);
    setTimeout(() => {
      const links = editorRef.current?.querySelectorAll('a');
      links?.forEach((a) => {
        if (a.href === url || a.getAttribute('href') === url) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      });
    }, 0);
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!title.trim() || !content || content === '<br>') return;
    if (!isEdit && !imageBase64) return;

    setSaving(true);
    try {
      const payload: BlogPayload = {
        title: title.trim(),
        slug: slug || slugify(title),
        excerpt: excerpt.trim(),
        content,
        status,
        category_id: categoryId || null,
        seo_title: seoTitle.trim(),
        seo_description: seoDescription.trim(),
        tags,
      };
      if (imageBase64) payload.image_base64 = imageBase64;
      await onSave(payload, !isEdit);
    } finally {
      setSaving(false);
    }
  };

  if (step === 'info') {
    return (
      <InfoPage
        isEdit={isEdit}
        title={title}
        setTitle={handleTitleChange}
        slug={slug}
        setSlug={handleSlugChange}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        status={status}
        setStatus={setStatus}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        tagInput={tagInput}
        setTagInput={setTagInput}
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        imagePreview={imagePreview}
        fileRef={fileRef}
        onImageChange={handleImageChange}
        onClose={onClose}
        onNext={handleGoToEditor}
      />
    );
  }

  return (
    <EditorPage
      isEdit={isEdit}
      editorRef={editorRef}
      saving={saving}
      fmt={fmt}
      onBack={() => setStep('info')}
      onClose={onClose}
      onSave={handleSave}
      exec={exec}
      applyFontSize={applyFontSize}
      applyHighlight={applyHighlight}
      insertList={insertList}
      insertTable={insertTable}
      insertCard={insertCard}
      insertBlockquote={insertBlockquote}
      insertLink={insertLink}
    />
  );
}
