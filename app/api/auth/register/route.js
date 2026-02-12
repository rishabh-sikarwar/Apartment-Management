import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { fullName, email, phone, password, countryCode } = await req.json();

    // 1. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Format Phone
    const fullPhoneNumber = phone ? `${countryCode}${phone}` : null;

    // 3. --- NEW: DETERMINE ROLE ---
    // Check if any users exist in the DB
    const userCount = await prisma.user.count();

    // If 0 users exist, this is the First User (SUPER_ADMIN). Else, VISITOR.
    const initialRole = userCount === 0 ? "SUPER_ADMIN" : "VISITOR";

    // 4. Create User
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" ") || "",
        email: email || null,
        phoneNumber: fullPhoneNumber,
        password: hashedPassword,
        isVerified: true,
        role: initialRole, // <--- Assign the dynamic role here
      },
    });

    // 5. Cleanup OTPs
    const identifier = email || fullPhoneNumber;
    if (identifier) {
      await prisma.otp.deleteMany({ where: { sentTo: identifier } });
    }

    // 6. Auto Login
    await createSession(newUser.id, newUser.role);

    return NextResponse.json({
      message: "Account created successfully",
      userId: newUser.id,
      role: initialRole,
    });
  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Registration Failed" }, { status: 500 });
  }
}
