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
        subject: "Verify your E-Partment Account", 
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #2563EB; margin: 0;">E-Partment</h2>
              <p style="color: #6B7280; font-size: 14px; margin-top: 5px;">Smart Society Management</p>
            </div>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #374151; font-size: 16px;">Your verification code is:</p>
              <h1 style="letter-spacing: 8px; color: #111827; font-size: 32px; margin: 15px 0;">${otpCode}</h1>
              <p style="margin: 0; color: #6B7280; font-size: 14px;">Valid for 10 minutes</p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 13px; color: #6B7280; line-height: 1.5;">
              <p><strong>Note:</strong> If you don't see this email in your inbox, please check your <strong>Spam</strong> or <strong>Junk</strong> folder.</p>
              <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
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
