import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const visitor = await db.visitor.findUnique({
      where: { qrCodeToken: token },
    });

    if (!visitor) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    let updated;
    let message;

    if (visitor.status === "PENDING") {
      updated = await db.visitor.update({
        where: { id: visitor.id },
        data: {
          status: "CHECKED_IN",
          checkInTime: new Date(),
        },
      });
      message = "✅ Check-in successful";
    } else if (visitor.status === "CHECKED_IN") {
      updated = await db.visitor.update({
        where: { id: visitor.id },
        data: {
          status: "CHECKED_OUT",
          checkOutTime: new Date(),
        },
      });
      message = "✅ Check-out successful";
    } else {
      return NextResponse.json({ message: "⚠️ Already checked out", visitor });
    }

    return NextResponse.json({ success: true, message, visitor: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
