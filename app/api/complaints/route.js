import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    // Re-fetch user with relations to ensure society context
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      include: { society: { include: { users: true } } },
    });

    if (!fullUser || !fullUser.society) {
      return NextResponse.json(
        { error: "User or Society not found" },
        { status: 404 },
      );
    }

    const complaint = await db.complaint.create({
      data: {
        title,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json({ complaint });
  } catch (error) {
    console.error("Complaint Error:", error);
    return NextResponse.json(
      { error: "Failed to file complaint" },
      { status: 500 },
    );
  }
}
