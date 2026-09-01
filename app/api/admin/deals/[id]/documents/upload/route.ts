import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: dealId } = await params;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const docId = formData.get('docId') as string;

    if (!file || !docId) {
      return NextResponse.json({ error: 'Missing file or docId' }, { status: 400 });
    }

    // Check if document exists and is not already verified
    const doc = await prisma.dealDocument.findUnique({ where: { id: docId } });
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    if (doc.status === 'VERIFIED') {
      return NextResponse.json({ error: 'Cannot upload over a verified document' }, { status: 403 });
    }

    // Ensure upload directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads', dealId);
    await mkdir(uploadsDir, { recursive: true });

    // Save file locally (In production, use S3)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${dealId}/${fileName}`;

    const updatedDoc = await prisma.dealDocument.update({
      where: { id: docId },
      data: {
        status: 'UPLOADED',
        fileUrl,
        uploadedAt: new Date(),
      }
    });

    return NextResponse.json({ document: updatedDoc });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
