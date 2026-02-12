import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

// ───── POST /api/staff (Create Staff) ─────────────────────────────────
export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, role, salary, phoneNumber } = await req.json();
    if (!name || !role || salary === undefined || !phoneNumber)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 },
      );
    }

    const staff = await db.staff.create({
      data: {
        name,
        role,
        salary: Number(salary),
        phoneNumber,
        societyId: user.societyId,
        userId: user.id, // Linked to the creator
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (err) {
    console.error("POST /api/staff:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ───── GET /api/staff (List Staff) ────────────────────────
export async function GET() {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const staffList = await db.staff.findMany({
      where: { societyId: user.societyId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(staffList);
  } catch (err) {
    console.error("GET /api/staff:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
