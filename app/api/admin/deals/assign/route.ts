import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { dealId, assignedToId, stage, priority, targetDate } = await req.json();

    if (!dealId) {
      return NextResponse.json({ error: "dealId is required" }, { status: 400 });
    }

    let assignedMember = null;
    if (assignedToId) {
      assignedMember = await db.teamMember.findUnique({
        where: { id: assignedToId },
      });
    }

    const updatedDeal = await db.dealLead.update({
      where: { id: dealId },
      data: {
        ...(assignedToId !== undefined ? { assignedToId: assignedToId || null } : {}),
        assignedToName: assignedMember ? assignedMember.name : assignedToId === null ? null : undefined,
        assignedToEmail: assignedMember ? assignedMember.email : assignedToId === null ? null : undefined,
        ...(stage ? { stage, status: stage === "CLOSED" ? "CLOSED" : "IN_REVIEW" } : {}),
        ...(priority ? { priority } : {}),
        ...(targetDate !== undefined ? { targetDate: targetDate ? new Date(targetDate) : null } : {}),
      },
      include: {
        assignedTo: true,
        updates: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    // Create automatic system update log entry
    if (assignedMember) {
      await db.dealUpdateLog.create({
        data: {
          dealLeadId: dealId,
          authorName: "System Admin",
          authorRole: "ADMIN",
          message: `Deal allocated to ${assignedMember.name} (${assignedMember.title}). Stage updated to ${stage || updatedDeal.stage}.`,
          taskStatus: "IN_PROGRESS",
        },
      });
    }

    return NextResponse.json({
      success: true,
      deal: updatedDeal,
    });
  } catch (error: any) {
    console.error("Deal assign error:", error);
    return NextResponse.json(
      { error: "Failed to allocate deal to team member" },
      { status: 500 }
    );
  }
}
