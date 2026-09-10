import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db as prisma } from '@/lib/db';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'MEMBER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { investorIds } = await request.json();
    
    if (!investorIds || !Array.isArray(investorIds) || investorIds.length === 0) {
      return NextResponse.json({ error: 'No investors provided' }, { status: 400 });
    }

    const deal = await prisma.dealLead.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const investors = await prisma.investor.findMany({
      where: { id: { in: investorIds } }
    });

    // Prepare context for the AI
    const investorContext = investors.map(inv => {
      const portfolio = Array.isArray(inv.notablePortfolio) ? inv.notablePortfolio.join(', ') : inv.notablePortfolio;
      const sectors = Array.isArray(inv.inferredSectors) ? inv.inferredSectors.join(', ') : inv.inferredSectors;
      return `ID: ${inv.id} | Name: ${inv.name} | Thesis: ${sectors} | Portfolio: ${portfolio}`;
    }).join('\n');

    const prompt = `You are a Senior Investment Banker advising on a sell-side M&A deal.
We have used a basic keyword search to find the following ${investors.length} potential buyers for our client.
Your job is to read their portfolios and thesis, and select the TOP 3 absolute best strategic buyers for this specific deal.

CLIENT DEAL INFO:
- Company Name: ${deal.companyName}
- Revenue 2025: ${deal.revenue2025 || 'Unknown'}
- Pre-Tax Profit: ${deal.preTaxProfit || 'Unknown'}
- Requesting: ${deal.requestedServices || 'Funding/M&A'}
- Notes/Description: ${deal.notes || 'A high-growth technology startup.'}

POTENTIAL BUYERS:
${investorContext}

Analyze the buyers based on their past portfolio companies (are they competitors, adjacent, or synergistic?).
Return a JSON object with a single key "topPicks" containing an array of exactly 3 objects. 
Each object MUST have:
1. "id": The ID of the investor.
2. "justification": A punchy, 1-2 sentence explanation of exactly WHY they are a perfect strategic fit based on their existing portfolio.

Format strictly as valid JSON. Example:
{
  "topPicks": [
    { "id": "cmtx...", "justification": "They invested in CompanyX, making this deal a perfect bolt-on acquisition." }
  ]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b',
      temperature: 0.1,
      response_format: { type: "json_object" },
    });
    
    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) throw new Error("No response from Groq");
    
    const parsed = JSON.parse(responseContent);
    return NextResponse.json({ topPicks: parsed.topPicks || [] });

  } catch (error) {
    console.error('Error in deep analysis:', error);
    return NextResponse.json(
      { error: 'Failed to run analysis' },
      { status: 500 }
    );
  }
}
