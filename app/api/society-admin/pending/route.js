import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Super Admin sees all pending
    if (user.role === "SUPER_ADMIN") {
      const pendingRequests = await db.pendingAdmin.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(pendingRequests);
    }

    // Visitor sees their own requests
    if (user.role === "VISITOR") {
      const myRequests = await db.pendingAdmin.findMany({
        where: { appliedByUserId: user.id },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json(myRequests);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Error fetching pending admin requests:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
