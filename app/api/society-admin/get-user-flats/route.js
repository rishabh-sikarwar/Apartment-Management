import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  const user = await checkUser();

  if (!user || user.role !== "SOCIETY_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await db.user.findMany({
    where: { societyId: user.societyId },
  });

  const flats = await db.flat.findMany({
    where: { building: { societyId: user.societyId } },
    include: { building: true },
  });

  return NextResponse.json({ users, flats });
}
