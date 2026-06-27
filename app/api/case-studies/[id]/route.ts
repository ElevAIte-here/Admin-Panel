import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { updateCaseStudy, deleteCaseStudy } from '@/lib/case-studies';

export const dynamic = 'force-dynamic';

const unauthorized = () => NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getSessionUser())) return unauthorized();
  try {
    const payload = await req.json();
    const item = await updateCaseStudy(params.id, payload);
    return NextResponse.json({ success: true, data: item });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed to update case study' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await getSessionUser())) return unauthorized();
  try {
    await deleteCaseStudy(params.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed to delete case study' }, { status: 500 });
  }
}
