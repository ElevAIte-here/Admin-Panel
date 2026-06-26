import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { listBlogs, createBlog } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

const unauthorized = () =>
  NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!(await getSessionUser())) return unauthorized();
  try {
    const sp = req.nextUrl.searchParams;
    const result = await listBlogs({
      search: sp.get('search') || '',
      page: parseInt(sp.get('page') || '1', 10) || 1,
      perPage: parseInt(sp.get('per_page') || '10', 10) || 10,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Failed to load blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await getSessionUser())) return unauthorized();
  try {
    const payload = await req.json();
    if (!payload?.title || !payload?.content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }
    const blog = await createBlog(payload);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Failed to create blog' },
      { status: 500 }
    );
  }
}
