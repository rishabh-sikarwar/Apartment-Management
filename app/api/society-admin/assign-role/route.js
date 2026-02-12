import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  const user = await checkUser();
  if (!user || user.role !== "SOCIETY_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  // IMPORTANT: userId here is the target user's ID, not the clerk ID
  const { userId, flatId, role } = body;

  await db.user.update({
    where: { id: userId }, // Fixed: uses 'id'
    data: { role },
  });

  if (flatId) {
    await db.flat.update({
      where: { id: flatId },
      data: {
        residentId: userId,
        isOccupied: true,
      },
    });
  }

  return NextResponse.json({ success: true });
}
