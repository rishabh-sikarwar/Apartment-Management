import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// 1. Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { identifier, type } = await req.json(); // identifier = email or phone

    if (!identifier) {
      return NextResponse.json(
        { error: "Missing email or phone" },
        { status: 400 },
      );
    }

    // --- 1. Check if User Already Exists ---
    const existingUser = await prisma.user.findFirst({
      where:
        type === "email" ? { email: identifier } : { phoneNumber: identifier },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists. Please login." },
        { status: 409 },
      );
    }

    // --- 2. Generate OTP ---
    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Set Expiry (10 Minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // --- 3. Save OTP to Database ---
    // Remove old OTPs for this identifier first
    await prisma.otp.deleteMany({
      where: { sentTo: identifier },
    });

    await prisma.otp.create({
      data: {
        code: otpCode,
        expiresAt,
        sentTo: identifier,
        type: type === "email" ? "EMAIL" : "PHONE",
      },
    });

    // --- 4. Send The Message (Email or SMS) ---

    if (type === "email") {
      // --- SEND EMAIL ---
      await transporter.sendMail({
        from: '"E-Partment Security" <no-reply@epartment.com>',
        to: identifier,
        subject: "Verify your Account",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2563EB;">E-Partment Verification</h2>
            <p>Your One Time Password (OTP) for registration is:</p>
            <h1 style="letter-spacing: 5px; color: #1e293b;">${otpCode}</h1>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });
      console.log(`✅ Email sent to ${identifier}`);
    } else {
      // --- SEND SMS (via Fast2SMS) ---

      // Fast2SMS expects the number without +91 usually, but check their docs.
      // Usually, just the 10 digits are fine if route is 'otp'.
      const cleanPhone = identifier.replace("+91", "").trim();

      const url = "https://www.fast2sms.com/dev/bulkV2";
      const params = new URLSearchParams({
        authorization: process.env.FAST2SMS_API_KEY, // Your API Key
        variables_values: otpCode, // The OTP to replace in template
        route: "otp", // Specific route for OTPs
        numbers: cleanPhone,
      });

      // Using fetch to call the SMS API
      const smsResponse = await fetch(`${url}?${params.toString()}`, {
        method: "GET",
      });

      const smsData = await smsResponse.json();

      if (!smsData.return) {
        // If Fast2SMS fails (e.g., DLT issue or no credit)
        console.error("❌ SMS API Error:", smsData);
        // FALLBACK: Log to console so you can still test on localhost
        console.log(`⚠️ SMS Failed. MOCK OTP for ${identifier}: ${otpCode}`);

        // Optional: Throw error if you want to block the UI
        // throw new Error("Failed to send SMS. Service down.");
      } else {
        console.log(`✅ SMS sent to ${identifier}`);
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
