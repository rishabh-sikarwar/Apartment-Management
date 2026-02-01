import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

// ───────────────────────────────────────────────────────── GET
// List all staff in the caller's society
export async function GET() {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Include latest salary status
    const staff = await db.staff.findMany({
      where: { societyId: user.societyId },
      include: {
        Salary: {
          orderBy: { payDate: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(staff);
  } catch (err) {
    console.error("GET staff error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ───────────────────────────────────────────────────────── PATCH
// Update staff status (Active/Inactive)
export async function PATCH(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if the staff belongs to the same society
    const staff = await db.staff.findUnique({
      where: { id },
    });

    if (!staff || staff.societyId !== user.societyId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await db.staff.update({
      where: { id },
      data: { staffRole: status },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH staff error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
