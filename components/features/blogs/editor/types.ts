import { Blog, BlogPayload, BlogStatus, BlogUpdatePayload, Category } from '@/lib/types';

export type ListStyle = 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'lower-roman';

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontSize: string;
  align: 'left' | 'center' | 'right' | '';
  highlight: string;
}

export const DEFAULT_FMT: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  fontSize: '',
  align: '',
  highlight: '',
};

export interface BlogEditorProps {
  blog: Blog | null;
  categories: Category[];
  label?: string; // "Blog" | "Case Study"
  basePath?: string; // public base path for slug preview
  onClose: () => void;
  onSave: (payload: BlogPayload | BlogUpdatePayload, isNew: boolean) => Promise<void>;
}

export interface InfoPageProps {
  isEdit: boolean;
  label: string;
  basePath: string;
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  status: BlogStatus;
  setStatus: (v: BlogStatus) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: Category[];
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  tags: string[];
  addTag: () => void;
  removeTag: (t: string) => void;
  imagePreview: string;
  fileRef: React.RefObject<HTMLInputElement>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onNext: () => void;
}

export interface EditorPageProps {
  isEdit: boolean;
  editorRef: React.RefObject<HTMLDivElement>;
  saving: boolean;
  fmt: FormatState;
  onBack: () => void;
  onClose: () => void;
  onSave: () => void;
  exec: (cmd: string, value?: string) => void;
  applyFontSize: (size: string) => void;
  applyHighlight: (color: string) => void;
  insertList: (style: ListStyle, ordered: boolean) => void;
  insertTable: (rows: number, cols: number) => void;
  insertCard: () => void;
  insertBlockquote: () => void;
  insertLink: (url: string, savedRange: Range | null) => void;
}

export const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px',
  '24px', '28px', '32px', '36px', '48px',
];

export const LIST_OPTIONS: { label: string; style: ListStyle; ordered: boolean }[] = [
  { label: '• Bullet', style: 'disc', ordered: false },
  { label: '◦ Circle', style: 'circle', ordered: false },
  { label: '▪ Square', style: 'square', ordered: false },
  { label: '1. Numeric', style: 'decimal', ordered: true },
  { label: 'a. Alpha', style: 'lower-alpha', ordered: true },
  { label: 'i. Roman', style: 'lower-roman', ordered: true },
];

export const HIGHLIGHT_COLORS = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fbcfe8' },
  { label: 'Orange', value: '#fed7aa' },
  { label: 'None', value: '' },
];
