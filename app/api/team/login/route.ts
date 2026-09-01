import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const member = await db.teamMember.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!member) {
      return NextResponse.json(
        { error: "No team member account found with this email" },
        { status: 401 }
      );
    }

    if (member.password !== password) {
      return NextResponse.json(
        { error: "Invalid password credentials provided" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        title: member.title,
      },
    });
  } catch (error: any) {
    console.error("Team login API error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate team member" },
      { status: 500 }
    );
  }
}
