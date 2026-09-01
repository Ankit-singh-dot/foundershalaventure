import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await prisma.dealUpdate.findMany({
      where: { dealId: id },
      include: {
        user: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Failed to fetch updates:', error);
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await request.json();
    
    // In a real app we'd use the session, but here we can just get userId if passed,
    // or rely on session if we have request headers available.
    // For simplicity, let's extract from session.
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const update = await prisma.dealUpdate.create({
      data: {
        content,
        dealId: id,
        userId: session.id
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json({ update });
  } catch (error) {
    console.error('Failed to create update:', error);
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
}
