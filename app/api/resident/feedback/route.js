import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    const newFeedback = await db.feedback.create({
      data: {
        userId: user.id, // Use local ID
        message,
      },
    });

    return NextResponse.json({ success: true, data: newFeedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
