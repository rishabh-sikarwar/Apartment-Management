import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

// POST: Add Salary Record
export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const body = await req.json();
    const { staff_id, amount, status, payDate } = body;

    const created = await db.salary.create({
      data: {
        id: crypto.randomUUID(),
        staff_id,
        amount,
        status,
        payDate: new Date(payDate),
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error("Salary upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET: List Salaries for Society
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId");

  // If staffId provided, return specific records (Public/Staff View)
  if (staffId) {
    try {
      const slips = await db.salary.findMany({
        where: { staff_id: staffId }, // Fixed field name to match schema
        orderBy: { payDate: "desc" },
      });
      return NextResponse.json({ success: true, slips });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }

  // Otherwise, return all society salaries (Admin View)
  const user = await checkUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const salaries = await db.salary.findMany({
    where: {
      Staff: { societyId: user.societyId },
    },
    include: { Staff: true },
  });

  return NextResponse.json(salaries);
}
