import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const body = await req.json();
  const { name, service, contact, email, imageUrl } = body;

  // Use a custom ID for QR generation
  const id = uuidv4();

  const vendor = await db.vendor.create({
    data: {
      id,
      name,
      service,
      contact,
      email,
      imageUrl,
    },
  });

  return NextResponse.json({ vendor, qrCodeUrl: id });
}
