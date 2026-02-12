import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  const user = await checkUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.societyId) {
    return NextResponse.json(
      { error: "Join a society first" },
      { status: 400 },
    );
  }

  const society = await db.society.findUnique({
    where: { id: user.societyId },
    select: { qrImageUrl: true },
  });

  return NextResponse.json({ qrImageUrl: society?.qrImageUrl });
}
