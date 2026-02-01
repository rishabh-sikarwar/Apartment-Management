import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only Admins should assign tasks
    if (!["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { staffId, taskDescription, dueDate } = await req.json();

    const task = await db.task.create({
      data: {
        staffId,
        taskDescription,
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Admins see all tasks in society, Staff see their own
    let whereClause = {};

    if (["SOCIETY_ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      whereClause = { staff: { societyId: user.societyId } };
    } else {
      // Find staff record for current user
      const staffProfile = await db.staff.findFirst({
        where: { userId: user.id },
      });
      if (!staffProfile) return NextResponse.json([]);
      whereClause = { staffId: staffProfile.id };
    }

    const tasks = await db.task.findMany({
      where: whereClause,
      include: { staff: true },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
