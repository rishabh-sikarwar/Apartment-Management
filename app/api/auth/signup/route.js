import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// 1. Email Transporter (Configure with your Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, otpMethod } = body;

    // --- Validation ---
    if (!fullName || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (otpMethod === "email" && !email) {
      return NextResponse.json(
        { error: "Email required for email verification" },
        { status: 400 },
      );
    }
    if (otpMethod === "phone" && !phone) {
      return NextResponse.json(
        { error: "Phone required for phone verification" },
        { status: 400 },
      );
    }

    // --- Check if User Exists ---
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined }, // Only check if email is provided
          { phoneNumber: phone || undefined }, // Only check if phone is provided
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or phone already exists" },
        { status: 409 },
      );
    }

    // --- Create User (Unverified) ---
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        email: email || null,
        phoneNumber: phone || null,
        password: hashedPassword,
        isVerified: false,
      },
    });

    // --- Generate OTP ---
    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // Set Expiry (10 Minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // --- Save OTP to DB ---
    await prisma.otp.create({
      data: {
        code: otpCode,
        expiresAt: expiresAt,
        userId: newUser.id,
        type: otpMethod === "email" ? "EMAIL" : "PHONE",
        sentTo: otpMethod === "email" ? email : phone,
      },
    });

    // --- SEND OTP (The Logic You Asked For) ---
    if (otpMethod === "email") {
      // Send Email
      await transporter.sendMail({
        from: '"Society App" <no-reply@societyapp.com>',
        to: email,
        subject: "Your Verification Code",
        html: `<p>Your OTP is <b>${otpCode}</b>. It expires in 10 minutes.</p>`,
      });
      console.log(`Email OTP sent to ${email}`);
    } else if (otpMethod === "phone") {
      // Send SMS
      // TODO: Integrate your "Android Gateway" or SMS Provider here.
      // For now, we just log it so you can test on localhost.
      console.log(`*** MOCK SMS SENT TO ${phone} | OTP: ${otpCode} ***`);
    }

    return NextResponse.json(
      {
        message: "User created. OTP sent.",
        userId: newUser.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
