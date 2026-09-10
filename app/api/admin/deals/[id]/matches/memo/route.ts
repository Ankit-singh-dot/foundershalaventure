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

    const { investorId } = await request.json();

    const deal = await prisma.dealLead.findUnique({
      where: { id: resolvedParams.id },
    });

    const investor = await prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!deal || !investor) {
      return NextResponse.json({ error: 'Deal or Investor not found' }, { status: 404 });
    }

    const portfolio = Array.isArray(investor.notablePortfolio)
      ? investor.notablePortfolio.join(', ')
      : (typeof investor.notablePortfolio === 'string' ? investor.notablePortfolio : 'various startups');

    const prompt = `You are a top-tier investment banker working for Foundershala.
Write a highly personalized, compelling, and concise 2-paragraph outreach email to pitch a new deal to ${investor.name}.
    
Details about the Investor:
- They invest in: ${Array.isArray(investor.inferredSectors) ? investor.inferredSectors.join(', ') : investor.inferredSectors}
- Notable Portfolio: ${portfolio}

Details about the Deal:
- Company Name: ${deal.companyName}
- Founder Name: ${deal.founderName}
- Website: ${deal.website}

Tone: Professional, exclusive, punchy. Do not use generic placeholders if possible.
In the first paragraph, reference their existing portfolio or thesis to show why this is a strategic fit.
In the second paragraph, introduce the Deal and invite them for a quick chat to review the deck.
Keep it strictly under 150 words. Do NOT include a subject line. Just the email body.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b', // Best model in this environment
      temperature: 0.7,
    });

    const memo = chatCompletion.choices[0]?.message?.content || 'Failed to generate memo.';

    return NextResponse.json({ memo });
  } catch (error) {
    console.error('Error generating memo:', error);
    return NextResponse.json(
      { error: 'Failed to generate memo' },
      { status: 500 }
    );
  }
}
