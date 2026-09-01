import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get("dealId");

    if (!dealId) {
      return NextResponse.json({ error: "dealId parameter is required" }, { status: 400 });
    }

    const updates = await db.dealUpdateLog.findMany({
      where: { dealLeadId: dealId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      updates,
    });
  } catch (error: any) {
    console.error("Fetch deal updates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal updates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { dealLeadId, authorName, authorRole, message, taskStatus } = await req.json();

    if (!dealLeadId || !message) {
      return NextResponse.json(
        { error: "dealLeadId and message are required" },
        { status: 400 }
      );
    }

    const newUpdate = await db.dealUpdateLog.create({
      data: {
        dealLeadId,
        authorName: authorName || "IB Analyst",
        authorRole: authorRole || "ANALYST",
        message,
        taskStatus: taskStatus || "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      update: newUpdate,
    });
  } catch (error: any) {
    console.error("Create deal update error:", error);
    return NextResponse.json(
      { error: "Failed to post work update log" },
      { status: 500 }
    );
  }
}
