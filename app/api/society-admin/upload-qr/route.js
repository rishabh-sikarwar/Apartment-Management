import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Find the Society Admin entry for this user
    const adminEntry = await db.societyAdmin.findUnique({
      where: { userId: user.id },
      select: { societyId: true },
    });

    if (!adminEntry) {
      return NextResponse.json(
        { error: "Forbidden: Not a society admin" },
        { status: 403 },
      );
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Update the Society's QR Image
    await db.society.update({
      where: { id: adminEntry.societyId },
      data: { qrImageUrl: imageUrl },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
