'use client';

import { List, ChevronRight } from 'lucide-react';
import { LIST_OPTIONS, ListStyle } from './types';
import { useFlyout } from './useFlyout';

export function ListFlyout({
  onSelect,
}: {
  onSelect: (style: ListStyle, ordered: boolean) => void;
}) {
  const { open, setOpen, pos, btnRef, toggle } = useFlyout();

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title="List style"
        onMouseDown={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <List className="h-4 w-4" />
        <ChevronRight className="h-3 w-3" />
      </button>
      {open && (
        <div
          data-flyout
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 160 }}
          className="rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl"
        >
          {LIST_OPTIONS.map((opt) => (
            <button
              key={opt.style}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(opt.style, opt.ordered);
                setOpen(false);
              }}
              className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
