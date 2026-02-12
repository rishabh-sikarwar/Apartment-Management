import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await checkUser();

    if (
      !user ||
      (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Fetch transactions recorded by users in the same society, NOT just the admin's own recordings
    // Assuming you want to see Pending Incoming payments for the society
    const pending = await db.transaction.findMany({
      where: {
        type: "INCOME",
        paidStatus: true,
        isApproved: false,
        recorder: {
          societyId: user.societyId, // Match admin's society
        },
      },
      include: {
        recorder: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        flat: {
          select: {
            flatNumber: true,
          },
        },
      },
    });

    return NextResponse.json(pending);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
