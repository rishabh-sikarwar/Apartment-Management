import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth"; // Import helper

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Check Cookie
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch User Data (Exclude Password)
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        profilePicture: true,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add a 'name' field for convenience
    const fullUser = {
      ...user,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    };

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
