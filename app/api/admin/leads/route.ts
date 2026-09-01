import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [leads, valuationReports, teamMembers] = await Promise.all([
      db.dealLead.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          assignedTo: true,
          updates: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      }),
      db.valuationReport.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.teamMember.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: { select: { assignedDeals: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      valuationReports,
      teamMembers: teamMembers.map((m) => ({
        ...m,
        activeDealsCount: m._count.assignedDeals,
      })),
    });
  } catch (error: any) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads from database" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { leadId, status, notes } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

    const updatedLead = await db.dealLead.update({
      where: { id: leadId },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error: any) {
    console.error("Admin lead update error:", error);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}
