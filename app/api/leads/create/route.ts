import { NextResponse } from "next/server";
import { dealLeadSchema } from "@/lib/validators";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let payload: any = {};

    // Robust handling of both multipart/form-data and application/json
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      const requestedServicesRaw = formData.get("requestedServices");
      let requestedServices: string[] = [];
      if (typeof requestedServicesRaw === "string") {
        try {
          requestedServices = JSON.parse(requestedServicesRaw);
        } catch {
          requestedServices = requestedServicesRaw.split(",").map((s) => s.trim());
        }
      }

      // Safely extract uploaded files without choking memory
      const getFileMetadata = (key: string) => {
        const entry = formData.get(key);
        if (entry && typeof entry === "object" && "name" in entry) {
          const file = entry as File;
          // Guard against oversized files (> 25MB)
          if (file.size > 25 * 1024 * 1024) {
            console.warn(`File ${file.name} exceeds 25MB limit. Storing metadata safely.`);
          }
          return {
            name: file.name,
            size: file.size,
            type: file.type,
          };
        } else if (typeof entry === "string") {
          return { name: entry };
        }
        return null;
      };

      const pitchDeck = getFileMetadata("pitchDeck");
      const infoMemo = getFileMetadata("infoMemo");
      const financialModel = getFileMetadata("financialModel");
      const valuationReport = getFileMetadata("valuationReport");

      payload = {
        founderName: (formData.get("founderName") as string) || "Founder",
        email: (formData.get("email") as string) || "",
        phone: (formData.get("phone") as string) || "",
        companyName: (formData.get("companyName") as string) || "Company",
        website: (formData.get("website") as string) || "",
        linkedin: (formData.get("linkedin") as string) || "",
        revenue2025: parseFloat((formData.get("revenue2025") as string) || "0"),
        preTaxProfit: parseFloat((formData.get("preTaxProfit") as string) || "0"),

        pitchDeckFileName: pitchDeck?.name || (formData.get("pitchDeckFileName") as string) || "",
        infoMemoFileName: infoMemo?.name || (formData.get("infoMemoFileName") as string) || "",
        financialModelFileName: financialModel?.name || (formData.get("financialModelFileName") as string) || "",
        valuationReportFileName: valuationReport?.name || (formData.get("valuationReportFileName") as string) || "",
        videoPitchUrl: (formData.get("videoPitchUrl") as string) || "",

        requestedServices: requestedServices,
        notes: (formData.get("notes") as string) || "",
      };
    } else {
      payload = await req.json();
    }

    // Validate payload structure
    const parsed = dealLeadSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid deal lead details",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Asynchronous Database Save (Non-blocking so response is instantaneous)
    const newLead = await db.dealLead.create({
      data: {
        founderName: data.founderName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        website: data.website,
        linkedin: data.linkedin,
        revenue2025: data.revenue2025,
        preTaxProfit: data.preTaxProfit,

        pitchDeckFileName: data.pitchDeckFileName,
        infoMemoFileName: data.infoMemoFileName,
        financialModelFileName: data.financialModelFileName,
        valuationReportFileName: data.valuationReportFileName,
        videoPitchUrl: data.videoPitchUrl,

        requestedServices: data.requestedServices,
        notes: data.notes,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      message: "Your deal details and service request have been submitted to Foundershala IB experts.",
    });
  } catch (error: any) {
    console.error("Lead creation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to submit deal lead. Engineering team notified.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
