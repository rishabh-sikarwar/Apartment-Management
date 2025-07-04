import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorised", { status: 401 });

    const payload = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
    } = payload;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("[VALIDATION] Missing Razorpay fields");
      return new NextResponse("Incomplete callback payload", { status: 400 });
    }

    /* ----- verify HMAC ----- */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");


    if (expected !== razorpay_signature) {
      console.error("[VERIFY] Signature mismatch");
      return new NextResponse("Signature mismatch", { status: 400 });
    }

    /* ----- mark payment SUCCESS ----- */
    const log = await db.paymentLog.update({
      where: { rzOrderId: razorpay_order_id },
      data: {
        rzPaymentId: razorpay_payment_id,
        rzSignature: razorpay_signature,
        status: "PAID",
      },
    });


    /* ----- create PendingAdmin row (linked) ----- */
    const pending = await db.pendingAdmin.upsert({
      where: { email: formData.email },
      create: {
        apartmentName: formData.apartmentName,
        address: formData.address,
        registrationNumber: formData.registrationNumber,
        phoneNumber: formData.phoneNumber,
        totalFlats: parseInt(formData.totalFlats, 10), // 👈 cast to Int
        name: formData.name,
        email: formData.email,
        status: "PENDING",
        paymentLog: {
          connect: { id: log.id },
        },
      },
      update: {
        paymentLog: {
          connect: { id: log.id },
        },
        updatedAt: new Date(),
      },
    });


    return NextResponse.json({ ok: true, pendingId: pending.id });
  } catch (error) {
    console.error("[ERROR] Internal error in payment callback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
