import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { REQUIRED_DOCUMENTS } from '@/lib/documents';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: dealId } = await params;

    // Check if documents already exist for this deal
    let documents = await prisma.dealDocument.findMany({
      where: { dealId },
      orderBy: { category: 'asc' }
    });

    // If documents are empty, auto-seed the required ones
    if (documents.length === 0) {
      const docsToCreate = REQUIRED_DOCUMENTS.map(doc => ({
        dealId,
        category: doc.category,
        documentName: doc.documentName,
        status: 'PENDING' as const,
      }));

      await prisma.dealDocument.createMany({
        data: docsToCreate,
      });

      documents = await prisma.dealDocument.findMany({
        where: { dealId },
        orderBy: { category: 'asc' }
      });
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
