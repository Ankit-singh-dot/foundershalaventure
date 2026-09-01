import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Default 8 Team Members seed data if DB is empty
const DEFAULT_TEAM_MEMBERS = [
  {
    name: "CA Varun Deep Singh",
    email: "varun@foundershalaventures.com",
    password: "varun123#password",
    role: "ADMIN",
    title: "Managing Partner & Head of IB",
    status: "ACTIVE",
  },
  {
    name: "Ankit Singh",
    email: "ankit@foundershalaventures.com",
    password: "ankit123#password",
    role: "ADMIN",
    title: "Managing Partner & Technology Lead",
    status: "ACTIVE",
  },
  {
    name: "Devansh Sharma",
    email: "devansh@foundershalaventures.com",
    password: "devansh123#password",
    role: "ANALYST",
    title: "Senior Valuation & Financial Modeler",
    status: "ACTIVE",
  },
  {
    name: "Priya Nair",
    email: "priya@foundershalaventures.com",
    password: "priya123#password",
    role: "ANALYST",
    title: "SaaS & FinTech Sector Associate",
    status: "ACTIVE",
  },
  {
    name: "Rohan Mehta",
    email: "rohan@foundershalaventures.com",
    password: "rohan123#password",
    role: "ANALYST",
    title: "Confidential Info Memorandum Lead",
    status: "BUSY",
  },
  {
    name: "Sneha Kapoor",
    email: "sneha@foundershalaventures.com",
    password: "sneha123#password",
    role: "ASSOCIATE",
    title: "D2C & Consumer Brands Associate",
    status: "ACTIVE",
  },
  {
    name: "Vikramaditya Rao",
    email: "vikram@foundershalaventures.com",
    password: "vikram123#password",
    role: "ANALYST",
    title: "VC Relations & Investor Outreach Manager",
    status: "ACTIVE",
  },
  {
    name: "Tanya Verma",
    email: "tanya@foundershalaventures.com",
    password: "tanya123#password",
    role: "ASSOCIATE",
    title: "Due Diligence & Compliance Specialist",
    status: "OFFLINE",
  },
];

export async function GET() {
  try {
    let team = await db.teamMember.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { assignedDeals: true },
        },
      },
    });

    // Seed 8 default team members if empty
    if (team.length === 0) {
      await db.teamMember.createMany({
        data: DEFAULT_TEAM_MEMBERS,
      });

      team = await db.teamMember.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          _count: {
            select: { assignedDeals: true },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      teamMembers: team.map((m) => ({
        ...m,
        activeDealsCount: m._count.assignedDeals,
      })),
    });
  } catch (error: any) {
    console.error("Fetch team members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, title, status } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await db.teamMember.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A team member with this email already exists" },
        { status: 400 }
      );
    }

    const newMember = await db.teamMember.create({
      data: {
        name,
        email,
        password: password || "foundershala123",
        role: role || "ANALYST",
        title: title || "Investment Banking Associate",
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      teamMember: newMember,
    });
  } catch (error: any) {
    console.error("Create team member error:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { memberId, name, password, role, title, status } = await req.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "memberId is required" },
        { status: 400 }
      );
    }

    const updated = await db.teamMember.update({
      where: { id: memberId },
      data: {
        ...(name ? { name } : {}),
        ...(password ? { password } : {}),
        ...(role ? { role } : {}),
        ...(title ? { title } : {}),
        ...(status ? { status } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      teamMember: updated,
    });
  } catch (error: any) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}
