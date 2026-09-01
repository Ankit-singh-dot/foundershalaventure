import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await prisma.dealLead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Failed to fetch deal:', error);
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 });
  }
}

// Update deal status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const deal = await prisma.dealLead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Failed to update deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}
