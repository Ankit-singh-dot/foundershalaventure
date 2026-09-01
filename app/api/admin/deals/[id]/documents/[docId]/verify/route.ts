import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string, docId: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { docId } = await params;
    const { status } = await request.json(); // e.g. 'VERIFIED' or 'NA' or 'PENDING'

    if (!['VERIFIED', 'NA', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const document = await prisma.dealDocument.update({
      where: { id: docId },
      data: { status }
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Failed to update document status:', error);
    return NextResponse.json({ error: 'Failed to update document status' }, { status: 500 });
  }
}
