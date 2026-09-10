import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'MEMBER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sectors, stage } = await request.json();

    const allInvestors = await prisma.investor.findMany({
      orderBy: { name: 'asc' }
    });

    const matches = allInvestors
      .map(inv => {
        let matchedSectors: string[] = [];
        
        let invSectors: string[] = [];
        if (Array.isArray(inv.inferredSectors)) {
          invSectors = inv.inferredSectors as string[];
        } else if (typeof inv.inferredSectors === 'string') {
           try { invSectors = JSON.parse(inv.inferredSectors); } catch (e) {}
        }
        
        let invStages: string[] = [];
        if (Array.isArray(inv.investmentStages)) {
          invStages = inv.investmentStages as string[];
        } else if (typeof inv.investmentStages === 'string') {
           try { invStages = JSON.parse(inv.investmentStages); } catch (e) {}
        }

        let sectorScore = 0;
        let stageScore = 0;

        if (sectors && sectors.length > 0) {
          sectors.forEach((s: string) => {
            const isMatch = invSectors.some(invS => invS.toLowerCase().includes(s.toLowerCase()));
            if (isMatch) {
              sectorScore += 10;
              matchedSectors.push(s);
            }
          });
        }

        if (stage && invStages.some(s => s.toLowerCase().includes(stage.toLowerCase()))) {
          stageScore += 10;
        }

        // TIGHTENED LOGIC: 
        // If both sector and stage are provided, BOTH must have a score > 0 to be considered a match.
        // If only sector is provided, sectorScore must be > 0.
        // If only stage is provided, stageScore must be > 0.
        let isValidMatch = false;
        if (sectors?.length > 0 && stage) {
          isValidMatch = sectorScore > 0 && stageScore > 0;
        } else if (sectors?.length > 0) {
          isValidMatch = sectorScore > 0;
        } else if (stage) {
          isValidMatch = stageScore > 0;
        }

        const score = isValidMatch ? (sectorScore + stageScore) : 0;

        return {
          ...inv,
          score,
          matchedSectors
        };
      })
      .filter(inv => inv.score > 0)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json(
      { error: 'Failed to generate matches' },
      { status: 500 }
    );
  }
}
