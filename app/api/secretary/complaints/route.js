import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  const user = await checkUser();

  // Allow both Admin and Secretary
  if (
    !user ||
    (user.role !== "SOCIETY_ADMIN" && user.role !== "SOCIETY_SECRETARY")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!user.societyId) {
    return NextResponse.json({ error: "No society assigned" }, { status: 400 });
  }

  const complaints = await db.complaint.findMany({
    where: {
      user: {
        societyId: user.societyId,
      },
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(complaints);
}
