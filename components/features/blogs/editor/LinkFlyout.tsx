'use client';

import { useRef, useState } from 'react';
import { Link } from 'lucide-react';
import { useFlyout } from './useFlyout';

export function LinkFlyout({
  onInsert,
}: {
  onInsert: (url: string, savedRange: Range | null) => void;
}) {
  const { open, setOpen, pos, btnRef, toggle } = useFlyout();
  const [url, setUrl] = useState('');
  const savedRangeRef = useRef<Range | null>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const sel = window.getSelection();
    if (!open && sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    } else if (open) {
      savedRangeRef.current = null;
    }
    toggle(e);
  };

  const handleInsert = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const href =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;
    onInsert(href, savedRangeRef.current);
    savedRangeRef.current = null;
    setUrl('');
    setOpen(false);
  };

  const hasSelection = savedRangeRef.current !== null && !savedRangeRef.current.collapsed;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title="Insert link"
        onMouseDown={handleToggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <Link className="h-4 w-4" />
      </button>
      {open && (
        <div
          data-flyout
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 260 }}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
        >
          <p className="mb-2 text-xs font-semibold text-slate-600">Insert link</p>
          {!hasSelection && (
            <p className="mb-2 text-xs text-amber-500">⚠ Select text in the editor first</p>
          )}
          <input
            type="url"
            value={url}
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsert(e);
            }}
            placeholder="https://example.com"
            className="mb-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-red"
          />
          <button
            type="button"
            disabled={!hasSelection || !url.trim()}
            onMouseDown={handleInsert}
            className="w-full rounded-lg bg-brand-red py-1.5 text-sm text-white transition-colors hover:bg-brand-red-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apply Link
          </button>
        </div>
      )}
    </>
  );
}
