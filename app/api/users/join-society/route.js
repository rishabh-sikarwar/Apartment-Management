import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkUser } from "@/lib/checkUser";

const db = new PrismaClient();

export async function POST(req) {
  try {
    // 1. Get Current User
    const me = await checkUser();
    if (!me) return new NextResponse("Unauthorized", { status: 401 });

    const { societyId, role, phoneNumber, buildingId, flatId } =
      await req.json();

    // 2. Check for existing pending request
    const exist = await db.pendingAccess.findUnique({
      where: { userId: me.id },
    });

    if (exist) {
      return NextResponse.json(
        { error: "Request already pending" },
        { status: 400 },
      );
    }

    // 3. Create Request
    await db.pendingAccess.create({
      data: {
        userId: me.id,
        societyId,
        requestedRole: role,
        phoneNumber,
        buildingId: buildingId || null,
        flatId: flatId || null,
      },
    });

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    console.error("join-society:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
