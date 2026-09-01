import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whereClause = session.role === 'MEMBER' ? { assignedToId: session.id } : {};

    const deals = await prisma.dealLead.findMany({
      where: whereClause,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: { updates: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
