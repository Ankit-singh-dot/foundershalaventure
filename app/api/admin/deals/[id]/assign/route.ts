import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const deal = await prisma.dealLead.update({
      where: { id },
      data: { assignedToId: userId },
      include: { assignedTo: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Failed to assign deal:', error);
    return NextResponse.json({ error: 'Failed to assign deal' }, { status: 500 });
  }
}
