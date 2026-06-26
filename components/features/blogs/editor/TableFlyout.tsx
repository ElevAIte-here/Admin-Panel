'use client';

import { useState } from 'react';
import { Table2 } from 'lucide-react';
import { useFlyout } from './useFlyout';

export function TableFlyout({ onInsert }: { onInsert: (rows: number, cols: number) => void }) {
  const { open, setOpen, pos, btnRef, toggle } = useFlyout();
  const [rows, setRows] = useState('3');
  const [cols, setCols] = useState('3');

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        title="Insert table"
        onMouseDown={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <Table2 className="h-4 w-4" />
      </button>
      {open && (
        <div
          data-flyout
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, width: 200 }}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
        >
          <p className="mb-2 text-xs font-semibold text-slate-600">Insert Table</p>
          <div className="mb-3 flex gap-2">
            <div className="flex-1">
              <p className="mb-1 text-xs text-slate-400">Rows</p>
              <input
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-red"
              />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs text-slate-400">Cols</p>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-red"
              />
            </div>
          </div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsert(
                Math.max(1, Math.min(20, parseInt(rows) || 3)),
                Math.max(1, Math.min(10, parseInt(cols) || 3))
              );
              setOpen(false);
            }}
            className="w-full rounded-lg bg-brand-red py-1.5 text-sm text-white transition-colors hover:bg-brand-red-dark"
          >
            Insert
          </button>
        </div>
      )}
    </>
  );
}
