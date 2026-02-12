import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "WATCHMAN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!user.societyId) {
      return NextResponse.json(
        { error: "No society assigned" },
        { status: 400 },
      );
    }

    const residents = await db.user.findMany({
      where: {
        societyId: user.societyId,
        role: { in: ["RESIDENT", "HOUSE_OWNER", "TENANT", "SOCIETY_MEMBER"] }, // Filter strictly for residents
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        flatNumber: true, // Assuming you might have added this to user model or need to join flats
        phoneNumber: true,
        profilePicture: true,
      },
    });

    return NextResponse.json(residents);
  } catch (error) {
    console.error("Fetch Residents Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
