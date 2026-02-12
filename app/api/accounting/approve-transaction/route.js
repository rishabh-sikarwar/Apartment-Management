import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

// POST: Approve a transaction
export async function POST(request) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { message: "Missing transaction ID" },
        { status: 400 },
      );
    }

    const updated = await db.transaction.update({
      where: { id: transactionId },
      data: {
        isApproved: true,
        approvedBy: user.id,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Payment approved", updated });
  } catch (error) {
    console.error("❌ Error approving transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

// GET: Fetch approved payments
export async function GET(req) {
  try {
    const user = await checkUser();
    const { searchParams } = new URL(req.url);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const year = parseInt(searchParams.get("year"));
    const month = parseInt(searchParams.get("month"));
    const flat = searchParams.get("flat");
    const type = searchParams.get("type");

    // Date Filter
    let dateFilter = {};
    if (!isNaN(year) && !isNaN(month)) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      dateFilter = {
        approvedAt: { gte: start, lt: end },
      };
    }

    // Flat Filter
    let flatFilter = {};
    if (flat) {
      flatFilter.flatNumber = { contains: flat }; // removed insensitive for mysql compatibility, add mode: 'insensitive' if using Postgres
    }

    // Type Filter
    let typeFilter = {};
    if (type === "INCOME" || type === "EXPENSE") {
      typeFilter.type = type;
    }

    const baseFilter = {
      paidStatus: true,
      isApproved: true,
      ...dateFilter,
      ...flatFilter,
      ...typeFilter,
    };

    // Admins see society data; Residents see their own data
    const filter =
      user.role === "SOCIETY_ADMIN" || user.role === "SUPER_ADMIN"
        ? {
            ...baseFilter,
            recorder: { societyId: user.societyId },
          }
        : {
            ...baseFilter,
            type: "INCOME",
            recorderId: user.id,
          };

    const approved = await db.transaction.findMany({
      where: filter,
      orderBy: { approvedAt: "desc" },
      select: {
        id: true,
        amount: true,
        forMonth: true,
        payerName: true,
        flatNumber: true,
        approvedAt: true,
        paymentMethod: true,
        transactionId: true,
        paidStatus: true,
        isApproved: true,
        type: true,
        category: true,
        description: true,
      },
    });

    return NextResponse.json(approved);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
