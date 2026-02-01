import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { visitorName, phoneNumber, vehicleNumber, purpose, imageUrl } = body;

    // Find the flat owned by the logged-in user
    const flat = await db.flat.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { residentId: user.id }],
      },
    });

    if (!flat) {
      return NextResponse.json(
        { error: "No flat assigned to user" },
        { status: 404 },
      );
    }

    // Generate QR code token
    const qrCodeToken = nanoid(32);

    // Create the visitor record
    const visitor = await db.visitor.create({
      data: {
        name: visitorName,
        phoneNumber,
        vehicleNumber: vehicleNumber || null,
        purpose,
        visitingFlatId: flat.id,
        preApprovedByUserId: user.id,
        status: "PENDING",
        qrCodeToken,
        imageUrl: imageUrl || null,
      },
    });

    const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/visitor/checkin?token=${qrCodeToken}`;

    return NextResponse.json({ visitor, qrCodeUrl });
  } catch (err) {
    console.error("Pre-approval Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
