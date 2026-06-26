import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { listCategories } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await getSessionUser())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const categories = await listCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Failed to load categories' },
      { status: 500 }
    );
  }
}
