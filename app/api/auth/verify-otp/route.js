import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { identifier, otp } = await req.json();

    const otpRecord = await prisma.otp.findFirst({
      where: {
        sentTo: identifier,
        code: otp,
      },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP Expired" }, { status: 400 });
    }

    // OTP is valid.
    // In a strict system, we might return a signed token here.
    // For now, we return success and let the client proceed to Register.

    return NextResponse.json({ message: "OTP Verified" });
  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
}
