export type BlogStatus = 'draft' | 'published';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML body
  cover_image_url: string;
  category_id: string | null;
  status: BlogStatus;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  reading_minutes: number;
  createdAt: string;
  updatedAt: string;
  tags: string[]; // tag names
  category?: Category | null;
}

export interface BlogPayload {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  status?: BlogStatus;
  category_id?: string | null;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  image_base64?: string; // new/updated cover image
}

export type BlogUpdatePayload = Partial<BlogPayload>;

export interface Paged<T> {
  items: T[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}
