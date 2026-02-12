import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function PUT(req) {
  try {
    // 1. Authenticate User
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get Data from Frontend
    const body = await req.json();
    const { firstName, lastName, email, phoneNumber, profilePicture } = body;

    // 3. Validation: Check for duplicates if email/phone changed
    if (email && email !== user.email) {
      const existingEmail = await db.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingPhone = await db.user.findUnique({
        where: { phoneNumber },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "Phone number already in use" },
          { status: 400 },
        );
      }
    }

    // 4. Update Database
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phoneNumber,
        profilePicture, // ✅ Saving the Image URL
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);

    // Handle Prisma unique constraint errors (P2002)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or Phone number already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
