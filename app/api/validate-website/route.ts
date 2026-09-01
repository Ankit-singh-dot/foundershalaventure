import { NextResponse } from "next/server";
import { websiteSchema } from "@/lib/validators";
import { validateCompanyWebsiteStrict } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Zod format validation
    const parsed = websiteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          isValidCompany: false,
          reason: parsed.error.issues[0]?.message || "Invalid website URL format",
        },
        { status: 400 }
      );
    }

    const validatedUrl = parsed.data.website;

    // 2. Groq AI strict website legitimacy check
    const aiResult = await validateCompanyWebsiteStrict(validatedUrl);

    if (!aiResult.isValidCompany) {
      return NextResponse.json({
        isValidCompany: false,
        reason: aiResult.reason || "Be serious! You are a founder looking for investment banking services. Please enter your official company website.",
        websiteUrl: validatedUrl,
      });
    }

    return NextResponse.json({
      isValidCompany: true,
      websiteUrl: validatedUrl,
      detectedCompanyName: aiResult.detectedCompanyName || validatedUrl.replace(/^https?:\/\//, "").split(".")[0],
      suggestedSector: aiResult.suggestedSector || "Technology",
      reason: aiResult.reason || "Domain verified successfully.",
    });
  } catch (error: any) {
    console.error("Website validation API error:", error);
    return NextResponse.json(
      {
        isValidCompany: false,
        reason: "An error occurred while validating the website. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}
