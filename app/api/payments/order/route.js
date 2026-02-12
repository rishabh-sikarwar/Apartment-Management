import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount } = await req.json(); // { amount: 299 }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      notes: { for: "society-subscription" },
    });

    // Save log
    await db.paymentLog.create({
      data: {
        userId: user.id,
        rzOrderId: order.id,
        amount: amount,
        amountDisplay: `₹${amount}.00`,
        purpose: "Society Subscription",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error in /api/payments/order:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
