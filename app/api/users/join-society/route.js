import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // ✅ Use the singleton client
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    // 1. Get Current User
    const me = await checkUser();
    if (!me) return new NextResponse("Unauthorized", { status: 401 });

    // ✅ Extract 'vehicles' array from request body
    const { societyId, role, phoneNumber, buildingId, flatId, vehicles } =
      await req.json();

    // 2. Check for existing pending request
    const exist = await db.pendingAccess.findUnique({
      where: { userId: me.id },
    });

    if (exist) {
      return NextResponse.json(
        { error: "Request already pending" },
        { status: 400 },
      );
    }

    // 3. ✅ Update User's Phone Number (Sync profile)
    if (phoneNumber) {
      await db.user.update({
        where: { id: me.id },
        data: { phoneNumber },
      });
    }

    // 4. Create Access Request
    await db.pendingAccess.create({
      data: {
        userId: me.id,
        societyId,
        requestedRole: role,
        phoneNumber, // Snapshot for the request
        buildingId: buildingId || null,
        flatId: flatId || null,
      },
    });

    // 5. ✅ Handle Vehicle Registration
    if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
      for (const v of vehicles) {
        // Basic validation
        if (!v.number) continue;

        // Standardize format: Uppercase, no spaces (e.g., "mp07 ab 1234" -> "MP07AB1234")
        const cleanNumber = v.number.toUpperCase().replace(/\s/g, "");

        // Check if vehicle already exists to prevent duplicate errors
        const existingVehicle = await db.vehicle.findUnique({
          where: { number: cleanNumber },
        });

        if (!existingVehicle) {
          await db.vehicle.create({
            data: {
              number: cleanNumber,
              type: v.type, // 'TWO_WHEELER' or 'FOUR_WHEELER'
              userId: me.id,
            },
          });
        } else {
          // Optional: If vehicle exists but is claimed by someone else, you might want to log it
          console.log(`Vehicle ${cleanNumber} already registered.`);
        }
      }
    }

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    console.error("join-society error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
