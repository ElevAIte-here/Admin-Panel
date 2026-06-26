# ElevAIte Admin Panel

A standalone Next.js admin for managing ElevAIte website content. **Phase 1: Blogs.**

It writes directly to the same **Supabase** project the website (`elev`) reads from —
no separate backend server. Blog images are stored in Supabase Storage; the rich
text editor produces sanitized HTML.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- Supabase (`@supabase/supabase-js` + `@supabase/ssr`) for data, storage, and auth
- `sonner` for toasts, `lucide-react` for icons

## Features (Phase 1)

- Email/password **auth** (Supabase Auth) with route protection via middleware
- **Blogs** list: search, pagination, edit/delete
- Two-step **rich editor** (details → content) with a contentEditable toolbar
  (bold/italic/underline/strike, font size, highlight, alignment, lists, tables,
  blockquote, card, links) — ports the "aerostar style" editor
- Cover-image upload to Supabase Storage
- Per-post **slug, excerpt, category, status (draft/published), and SEO** fields

## Setup

1. Provision Supabase and run the schema — see **`SUPABASE_SETUP.md` in the `elev` repo**
   (`supabase/migrations/0001_blog_module.sql` + `0002_blog_storage.sql`).
2. Create the first admin user: Supabase dashboard → Authentication → Users → Add user.
3. Copy env vars:

   ```bash
   cp .env.example .env.local
   # fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
   #         SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET
   ```

4. Install and run:

   ```bash
   npm install
   npm run dev      # http://localhost:3000  → redirects to /login
   ```

## Notes

- The **service-role key is server-only** (used in `/app/api/*` route handlers and
  server-side data access). It is never exposed to the browser.
- Writes bypass RLS via the service-role key; the public website reads only
  `published` rows with the anon key.
- Case Studies and Knowledge Hub modules are stubbed in the sidebar for later phases.
