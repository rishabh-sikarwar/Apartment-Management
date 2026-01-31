  import { db } from "@/lib/prisma";
  import { auth } from "@clerk/nextjs/server";
  import { NextResponse } from "next/server";

  // POST: Approve a transaction
  export async function POST(request) {
    try {
      const { userId: clerkUserId } = await auth();
      const { transactionId } = await request.json();

      if (!clerkUserId || !transactionId) {
        return NextResponse.json(
          { message: "Unauthorized or missing data" },
          { status: 400 }
        );
      }

      const admin = await db.user.findUnique({
        where: { clerkUserId },
        select: { id: true, role: true },
      });

      if (!admin || admin.role !== "SOCIETY_ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      const updated = await db.transaction.update({
        where: { id: transactionId },
        data: {
          isApproved: true,
          approvedBy: admin.id,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json({ message: "Payment approved", updated });
    } catch (error) {
      console.error("❌ Error approving transaction:", error);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
  }

  // GET: Fetch approved payments (optionally filter by month, year, flat, type)
  export async function GET(req) {
    try {
      const { userId: clerkUserId } = await auth();
      const { searchParams } = new URL(req.url);

      const year = parseInt(searchParams.get("year"));
      const month = parseInt(searchParams.get("month"));
      const flat = searchParams.get("flat"); // ✅ flat filter
      const type = searchParams.get("type"); // ✅ income/expense filter

      if (!clerkUserId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const user = await db.user.findUnique({
        where: { clerkUserId },
        select: { id: true, role: true, societyId: true },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      // ✅ Date Filter
      let dateFilter = {};
      if (!isNaN(year) && !isNaN(month)) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);
        dateFilter = {
          approvedAt: {
            gte: start,
            lt: end,
          },
        };
      }

      // ✅ Flat Number Filter
      let flatFilter = {};
      if (flat) {
        flatFilter.flatNumber = {
          contains: flat,
          mode: "insensitive",
        };
      }

      // ✅ Type Filter (only if type is either 'INCOME' or 'EXPENSE')
      let typeFilter = {};
      if (type === "INCOME" || type === "EXPENSE") {
        typeFilter.type = type;
      }

      const baseFilter = {
        paidStatus: true,
        isApproved: true,
        ...(type ? { type } : {}),
        ...dateFilter,
        ...flatFilter,
        ...typeFilter,
      };

      const filter =
        user.role === "SOCIETY_ADMIN"
          ? {
              ...baseFilter,
              recorder: {
                societyId: user.societyId,
              },
            }
          : {
              ...baseFilter,
              type: "INCOME", // residents only see income receipts
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
          type: true, // 
          category: true,         
          description: true       
        },
      });

      return NextResponse.json(approved);
    } catch (error) {
      console.error("❌ Error fetching approved transactions:", error);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
  }



