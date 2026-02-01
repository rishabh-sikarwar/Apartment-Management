import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function GET() {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const transactions = await db.transaction.findMany({
      where: { recorderId: user.id },
      orderBy: { transactionDate: "desc" },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const isAdmin =
      user.role === "SOCIETY_ADMIN" || user.role === "SUPER_ADMIN";

    const {
      amount,
      type,
      category,
      description,
      transactionDate,
      paymentMethod,
      payerName,
      flatNumber,
      forMonth,
      paidStatus,
      bankName,
      ifscCode,
      transactionId,
      upiId,
      chequeNumber,
    } = body;

    const paymentMethodMap = {
      Cash: "CASH",
      UPI: "UPI",
      "Bank Transfer": "BANK_TRANSFER",
      Cheque: "CHEQUE",
    };

    const mappedPaymentMethod = paymentMethodMap[paymentMethod] || null;

    if (!amount || !type || !["INCOME", "EXPENSE"].includes(type)) {
      return NextResponse.json(
        { message: "Amount and valid Type required." },
        { status: 400 },
      );
    }

    const newTransaction = await db.transaction.create({
      data: {
        amount: parseFloat(amount),
        type,
        category: category || null,
        description: description || null,
        transactionDate: new Date(transactionDate),
        paymentMethod: mappedPaymentMethod,
        payerName: payerName || null,
        flatNumber: flatNumber || null,
        forMonth: forMonth || null,
        // Auto-approve if created by Admin
        isApproved: isAdmin ? true : false,
        approvedAt: isAdmin ? new Date() : null,
        approvedBy: isAdmin ? user.id : null,
        paidStatus: paidStatus ?? true,
        bankName: bankName || null,
        ifscCode: ifscCode || null,
        transactionId: transactionId || null,
        upiId: upiId || null,
        chequeNumber: chequeNumber || null,
        recorderId: user.id, // Linked to local user ID
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to add transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
