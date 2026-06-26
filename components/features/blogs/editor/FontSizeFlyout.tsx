'use client';

import { ChevronRight } from 'lucide-react';
import { FONT_SIZES } from './types';
import { useFlyout } from './useFlyout';

export function FontSizeFlyout({
  onSelect,
  currentSize,
}: {
  onSelect: (size: string) => void;
  currentSize: string;
}) {
  const { open, setOpen, pos, btnRef, toggle } = useFlyout();

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title="Font size"
        onMouseDown={toggle}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
          currentSize ? 'bg-brand-red text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <span className="text-[10px] font-bold leading-none">{currentSize || 'Aa'}</span>
        <ChevronRight className="h-3 w-3" />
      </button>
      {open && (
        <div
          data-flyout
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 100 }}
          className="rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl"
        >
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(size);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 ${
                currentSize === size ? 'font-semibold text-brand-red' : 'text-slate-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
