import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Assign Task (POST)
export async function POST(req) {
  try {
    const data = await req.json();
    const { staffName, shiftTime, task } = data;

    const newAssignment = await db.shiftTask.create({
      data: { staffName, shiftTime, task },
    });

    return NextResponse.json({ success: true, assigned: newAssignment });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

// View Shifts (GET)
export async function GET() {
  try {
    const allAssignments = await db.shiftTask.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(allAssignments);
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
