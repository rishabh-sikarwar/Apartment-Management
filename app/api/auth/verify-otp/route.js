import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { identifier, otp, type } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Find the OTP record
    // We look for the most recent OTP sent to this identifier
    const record = await db.otp.findFirst({
      where: { sentTo: identifier, type: type === "email" ? "EMAIL" : "PHONE" },
      orderBy: { createdAt: "desc" },
    });

    // 2. Check if record exists
    if (!record) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new one." }, // ✅ Toast Message
        { status: 400 },
      );
    }

    // 3. Check if OTP has expired
    const now = new Date();
    if (now > new Date(record.expiresAt)) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." }, // ✅ Toast Message
        { status: 400 },
      );
    }

    // 4. Check if OTP matches
    if (record.code !== otp) {
      return NextResponse.json(
        { error: "Incorrect OTP. Please try again." }, // ✅ Toast Message
        { status: 400 },
      );
    }

    // 5. Success - Clean up used OTP (Optional but recommended)
    await db.otp.delete({ where: { id: record.id } });

    return NextResponse.json({ message: "Verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
