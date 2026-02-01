import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    // 1. Authenticate (Super Admin only)
    const currentUser = await checkUser();
    if (!currentUser) return new NextResponse("Unauthorized", { status: 401 });

    // if (currentUser.role !== "SUPER_ADMIN") {
    //   return new NextResponse("Forbidden", { status: 403 });
    // }

    const { id, action, amount } = await req.json();

    // 2. Find the pending request
    const request = await db.pendingAdmin.findUnique({
      where: { id },
    });

    if (!request) {
      return new NextResponse("Request not found", { status: 404 });
    }

    // 3. Handle QUOTE action
    if (action === "QUOTE") {
      const finalAmount = parseFloat(amount);
      await db.pendingAdmin.update({
        where: { id },
        data: {
          status: "QUOTED",
          quotedAmount: finalAmount,
        },
      });
      return NextResponse.json(
        { message: "Quoted Amount Sent to Applicant" },
        { status: 200 },
      );
    }

    // 4. Handle APPROVE action
    if (action === "APPROVE") {
      // Create new society
      const newSociety = await db.society.create({
        data: {
          name: request.apartmentName,
          address: request.address,
          registrationNumber: request.registrationNumber,
        },
      });

      // Identify the user who applied (The Applicant)
      const applicantId = request.appliedByUserId;
      if (!applicantId) {
        return new NextResponse("Applicant User ID not found on request", {
          status: 400,
        });
      }

      // Update the Applicant's User Profile
      await db.user.update({
        where: { id: applicantId },
        data: {
          role: "SOCIETY_ADMIN",
          societyId: newSociety.id,
          phoneNumber: request.phoneNumber || undefined,
        },
      });

      // Create SocietyAdmin entry linking User and Society
      await db.societyAdmin.create({
        data: {
          userId: applicantId,
          societyId: newSociety.id,
          societyName: newSociety.name,
          totalFlats: request.totalFlats,
        },
      });

      // Remove the pending request
      await db.pendingAdmin.delete({ where: { id } });

      return NextResponse.json({
        message: "Request approved and society created successfully",
      });
    }

    // 5. Handle REJECT action
    else if (action === "REJECT") {
      await db.pendingAdmin.delete({ where: { id } });
      return NextResponse.json({ message: "Request rejected successfully" });
    } else {
      return new NextResponse("Invalid action", { status: 400 });
    }
  } catch (error) {
    console.error("Error in POST /api/society-admin/approve:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
