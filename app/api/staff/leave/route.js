import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Case 1: Admin approving/rejecting leave
    if (body.id && body.status) {
      if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const updated = await db.leaveRequest.update({
        where: { id: body.id },
        data: { status: body.status },
      });
      return NextResponse.json(updated);
    }

    // Case 2: Staff applying for leave
    const { fromDate, toDate, reason } = body;
    const staff = await db.staff.findFirst({
      where: { userId: user.id },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff profile not found" },
        { status: 404 },
      );
    }

    const newLeave = await db.leaveRequest.create({
      data: {
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        reason,
        leaveType: "Sick Leave",
        staffId: staff.id,
        totalDays: Math.ceil(
          (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24),
        ),
      },
    });

    return NextResponse.json(newLeave);
  } catch (error) {
    console.error("Leave Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const user = await checkUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // If Admin, show all requests
  if (["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    const allLeaves = await db.leaveRequest.findMany({
      where: { staff: { societyId: user.societyId } },
      include: { staff: true },
    });
    return NextResponse.json(allLeaves);
  }

  // If Staff, show own history
  const staff = await db.staff.findFirst({
    where: { userId: user.id },
  });

  if (!staff) return NextResponse.json([], { status: 200 });

  const leaveHistory = await db.leaveRequest.findMany({
    where: { staffId: staff.id },
    orderBy: { fromDate: "desc" },
  });

  return NextResponse.json(leaveHistory);
}
