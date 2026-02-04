import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Use 'db' if you have the singleton, else import PrismaClient
// import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient(); // (Fallback)
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { identifier, type, countryCode } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        { error: "Missing identifier" },
        { status: 400 },
      );
    }

    // --- 1. Rate Limit Check (Prevent Spam) ---
    // Check the LATEST OTP sent to this user
    const lastOtp = await db.otp.findFirst({
      where: { sentTo: identifier },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp) {
      const timeDiff =
        new Date().getTime() - new Date(lastOtp.createdAt).getTime();
      // If less than 30 seconds (30000 ms), block request
      if (timeDiff < 30000) {
        const waitTime = Math.ceil((30000 - timeDiff) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitTime}s before resending.` },
          { status: 429 }, // Too Many Requests
        );
      }
    }

    // --- 2. Check if User Already Exists (Only for Sign Up flow) ---
    // If you use this endpoint for login too, remove this block
    const existingUser = await db.user.findFirst({
      where:
        type === "email" ? { email: identifier } : { phoneNumber: identifier },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists. Please login." },
        { status: 409 },
      );
    }

    // --- 3. Clean up OLD OTPs ---
    // Now safe to delete since we passed the rate limit check
    await db.otp.deleteMany({ where: { sentTo: identifier } });

    // --- 4. Generate & Save New OTP ---
    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    
    console.log("***************Generated OTP:********", otpCode);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await db.otp.create({
      data: {
        code: otpCode,
        expiresAt,
        sentTo: identifier,
        type: type === "email" ? "EMAIL" : "PHONE",
      },
    });

    // --- 5. Send Message ---
    if (type === "email") {
      await transporter.sendMail({
        from: '"E-Partment Security" <no-reply@epartment.com>',
        to: identifier,
        subject: "Verify your Account",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2563EB;">E-Partment Verification</h2>
            <p>Your One Time Password (OTP) is:</p>
            <h1 style="letter-spacing: 5px; color: #1e293b;">${otpCode}</h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });
    } else {
      // SMS Logic
      // Ensure we use only the 10-digit number for Fast2SMS if they require it
      const cleanPhone = identifier.replace(/\D/g, "").slice(-10);

      const url = "https://www.fast2sms.com/dev/bulkV2";
      const params = new URLSearchParams({
        authorization: process.env.FAST2SMS_API_KEY,
        variables_values: otpCode,
        route: "otp",
        numbers: cleanPhone,
      });

      const smsResponse = await fetch(`${url}?${params.toString()}`, {
        method: "GET",
      });
      const smsData = await smsResponse.json();

      if (!smsData.return) {
        console.error("SMS Failed:", smsData);
        // Don't block UI, just log it.
        // In dev, you might want to return the code in the response for testing.
        console.log(`[DEV ONLY] SMS OTP for ${identifier}: ${otpCode}`);
      }
    }

    return NextResponse.json({ message: `OTP sent to ${identifier}` });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
