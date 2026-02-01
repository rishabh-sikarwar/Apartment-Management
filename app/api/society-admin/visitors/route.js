import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch Society Admin details
    const admin = await db.societyAdmin.findUnique({
      where: { userId: user.id },
      select: { societyId: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch Visitors for that society
    const visitors = await db.visitor.findMany({
      where: {
        visitingFlat: {
          building: { societyId: admin.societyId },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        visitingFlat: {
          select: {
            flatNumber: true,
            building: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json({ visitors });
  } catch (err) {
    console.error("[Visitors API] ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
