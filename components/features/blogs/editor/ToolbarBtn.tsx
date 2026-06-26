'use client';

export function ToolbarBtn({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
        active ? 'bg-brand-red text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

export function ToolbarDivider() {
  return <div className="my-1 h-px w-6 self-center bg-slate-200" />;
}
