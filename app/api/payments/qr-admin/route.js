import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const superAdmin = await db.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
        paymentQrUrl: { not: null }, // Only fetch if QR exists
      },
      select: {
        paymentQrUrl: true,
      },
    });

    if (!superAdmin || !superAdmin.paymentQrUrl) {
      return NextResponse.json(
        { error: "QR Code not setup yet" },
        { status: 404 },
      );
    }

    return NextResponse.json({ qrImageUrl: superAdmin.paymentQrUrl });
  } catch (error) {
    console.error("Error fetching Super Admin QR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
