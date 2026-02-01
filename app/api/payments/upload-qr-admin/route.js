import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

// // GET: Anyone (Authenticated) can fetch the Super Admin QR to make a payment
// export async function GET() {
//   try {
//     // 1. Find the Super Admin User
//     const superAdmin = await db.user.findFirst({
//       where: {
//         role: "SUPER_ADMIN",
//       },
//       select: {
//         paymentQrUrl: true, // ✅ Fetching the new specific field
//       },
//     });

//     if (!superAdmin || !superAdmin.paymentQrUrl) {
//       return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
//     }

//     return NextResponse.json({ qrImageUrl: superAdmin.paymentQrUrl });
//   } catch (error) {
//     console.error("Error fetching Super Admin QR:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// POST: Only Super Admin can upload/update this QR
export async function POST(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    await db.user.update({
      where: { id: user.id },
      data: { paymentQrUrl: imageUrl },
    });

    return NextResponse.json({ ok: true, message: "Super Admin QR updated" });
  } catch (error) {
    console.error("Error updating QR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
