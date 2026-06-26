'use client';

import { ArrowLeft, Save, X } from 'lucide-react';
import { EditorPageProps } from './types';
import { EditorToolbar } from './EditorToolbar';

export function EditorPage({
  isEdit,
  editorRef,
  saving,
  fmt,
  onBack,
  onClose,
  onSave,
  exec,
  applyFontSize,
  applyHighlight,
  insertList,
  insertTable,
  insertCard,
  insertBlockquote,
  insertLink,
}: EditorPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-3">
        <button
          type="button"
          onClick={onBack}
          title="Back to details"
          className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Details
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            title={isEdit ? 'Save changes' : 'Publish blog'}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-white transition-colors hover:bg-brand-red-dark disabled:opacity-40"
          >
            <Save className="h-4 w-4" />
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

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        <EditorToolbar
          fmt={fmt}
          exec={exec}
          applyFontSize={applyFontSize}
          applyHighlight={applyHighlight}
          insertList={insertList}
          insertTable={insertTable}
          insertCard={insertCard}
          insertBlockquote={insertBlockquote}
          insertLink={insertLink}
        />

        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto w-[min(60rem,90%)] py-10">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Start writing your blog content here..."
              className="min-h-[600px] w-full rounded-2xl bg-white px-10 py-8 text-base leading-8 text-slate-800 shadow-sm outline-none"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </div>

      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        [contenteditable] a { color: #E63B41; text-decoration: underline; cursor: pointer; }
        [contenteditable] blockquote {
          border-left: 4px solid #E63B41; margin: 16px 0; padding: 10px 16px;
          background: #fef2f2; border-radius: 0 8px 8px 0; color: #991b1b; font-style: italic;
        }
        [contenteditable] table { border-collapse: collapse; width: 100%; margin: 14px 0; }
        [contenteditable] th, [contenteditable] td { border: 1px solid #cbd5e1; padding: 8px 12px; }
        [contenteditable] th { background: #f8fafc; font-weight: 600; text-align: left; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 1.5rem; margin: 8px 0; }
        [contenteditable] li { margin: 4px 0; }
        [contenteditable] p  { margin: 6px 0; }
        [contenteditable] h1 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0; }
        [contenteditable] h2 { font-size: 1.4rem; font-weight: 700; margin: 0.9rem 0; }
      `}</style>
    </div>
  );
}
