import { NextResponse } from "next/server";
import { valuationInputSchema } from "@/lib/validators";
import { generateValuationAnalysis } from "@/lib/groq";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with Zod
    const parsed = valuationInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid financial inputs",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Generate AI Valuation Report with Groq
    const reportResult = await generateValuationAnalysis({
      website: data.website,
      companyName: data.companyName,
      sector: data.sector,
      revenue2025: data.revenue2025,
      preTaxProfit: data.preTaxProfit,
      ownerSalary: data.ownerSalary,
      targetValuation: data.targetValuation,
      targetDilution: data.targetDilution,
    });

    // Save to Neon DB
    try {
      await db.valuationReport.create({
        data: {
          website: data.website,
          companyName: data.companyName,
          sector: data.sector,
          revenue2025: data.revenue2025,
          preTaxProfit: data.preTaxProfit,
          ownerSalary: data.ownerSalary,
          targetValuation: data.targetValuation,
          targetDilution: data.targetDilution,
          analysisResult: JSON.stringify(reportResult),
          valuationMin: reportResult.valuationMinCr,
          valuationMax: reportResult.valuationMaxCr,
          readinessScore: reportResult.readinessScore,
        },
      });
    } catch (dbErr) {
      console.error("Non-critical: Failed to persist valuation report to DB:", dbErr);
    }

    return NextResponse.json({
      success: true,
      report: reportResult,
    });
  } catch (error: any) {
    console.error("Valuation generation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate valuation report. Please check your financial inputs.",
      },
      { status: 500 }
    );
  }
}
