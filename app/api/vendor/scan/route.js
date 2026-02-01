import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { vendorId } = await req.json();
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const existing = await db.vendorLog.findFirst({
    where: {
      vendorId,
      date: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (!existing) {
    const entry = await db.vendorLog.create({
      data: {
        vendorId,
        entryTime: new Date(),
      },
    });
    return NextResponse.json({ message: "✅ Entry recorded", entry });
  } else if (!existing.exitTime) {
    const updated = await db.vendorLog.update({
      where: { id: existing.id },
      data: { exitTime: new Date() },
    });
    return NextResponse.json({ message: "✅ Exit recorded", updated });
  } else {
    return NextResponse.json({ message: "✅ Already checked out today" });
  }
}
