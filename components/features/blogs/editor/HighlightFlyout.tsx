'use client';

import { Highlighter } from 'lucide-react';
import { HIGHLIGHT_COLORS } from './types';
import { useFlyout } from './useFlyout';

export function HighlightFlyout({
  onSelect,
  currentHighlight,
}: {
  onSelect: (color: string) => void;
  currentHighlight: string;
}) {
  const { open, setOpen, pos, btnRef, toggle } = useFlyout();
  const isActive = !!currentHighlight;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title="Highlight text"
        onMouseDown={toggle}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          isActive ? 'bg-brand-red text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Highlighter className="h-4 w-4" />
      </button>
      {open && (
        <div
          data-flyout
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 180 }}
          className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          <p className="mb-2 px-1 text-xs font-semibold text-slate-500">Highlight colour</p>
          <div className="mb-2 grid grid-cols-5 gap-1.5 px-1">
            {HIGHLIGHT_COLORS.filter((c) => c.value).map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(c.value);
                  setOpen(false);
                }}
                className="h-7 w-7 rounded-md border border-slate-200 transition-transform hover:scale-110"
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect('');
              setOpen(false);
            }}
            className="mt-1 block w-full border-t border-slate-100 py-1 text-center text-xs text-slate-500 hover:text-red-500"
          >
            Remove highlight
          </button>
        </div>
      )}
    </>
  );
}
