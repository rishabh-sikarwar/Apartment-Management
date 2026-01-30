// app/api/users/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkUser } from "@/lib/checkUser";
import { getSession } from "@/lib/auth";

const db = new PrismaClient();

// GET - Get current user details
export async function GET(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - Update Profile
export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Remove fields that shouldn't be updated manually via this route
    delete body.id;
    delete body.password;
    delete body.role; // Prevent users from promoting themselves to ADMIN

    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: body,
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Admin updates a user's role
export async function PATCH(req) {
  try {
    // 1. Check if requester is Admin
    const adminUser = await checkUser();
    if (
      !adminUser ||
      (adminUser.role !== "SUPER_ADMIN" && adminUser.role !== "SOCIETY_ADMIN")
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const { targetUserId, newRole } = await req.json();

    const updatedUser = await db.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}