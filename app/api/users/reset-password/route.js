import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // 1. Authenticate & Authorize
    const currentUser = await checkUser();

    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin only" },
        { status: 403 },
      );
    }

    // 2. Parse Request
    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 },
      );
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the user in DB
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Admin Password Reset Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
