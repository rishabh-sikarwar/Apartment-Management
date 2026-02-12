import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();

    // Check if user already has a pending request
    const existing = await db.pendingAdmin.findFirst({
      where: { appliedByUserId: user.id }, // Use relational check
    });

    if (existing) {
      return NextResponse.json(
        { error: "Request already exists." },
        { status: 400 },
      );
    }

    const pendingAdmin = await db.pendingAdmin.create({
      data: {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || body.phoneNumber,
        address: body.address,
        registrationNumber: body.registrationNumber,
        apartmentName: body.apartmentName,
        totalFlats: parseInt(body.totalFlats),
        status: "PENDING",
        appliedByUserId: user.id, // Link to the user
      },
    });

    return NextResponse.json({
      message: "Request created successfully.",
      pendingAdmin,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
