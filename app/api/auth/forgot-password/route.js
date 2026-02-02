import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // For security, return 200 even if user doesn't exist so scanners can't enumerate emails
      return NextResponse.json({
        message: "If an account exists, an email has been sent.",
      });
    }

    // 1. Generate Token & Expiry (1 hour)
    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    // 2. Save to DB
    await db.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    // 3. Send Email (Configure your SMTP here)
    // For Development: We will just LOG the link to the console
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    console.log("------------------------------------------------");
    console.log("🛑 RESET PASSWORD LINK (DEV MODE):");
    console.log(resetLink);
    console.log("------------------------------------------------");

    // UNCOMMENT THIS TO ACTUALLY SEND EMAIL
    
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Society App" <no-reply@society.com>',
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
    

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
