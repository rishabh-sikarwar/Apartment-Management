import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    // 1. Get Current User
    const me = await checkUser();
    if (!me) return new NextResponse("Unauthorized", { status: 401 });

    // ✅ Extract fields including the new 'vehicles' array
    const { societyId, role, phoneNumber, buildingId, flatId, vehicles } =
      await req.json();

    // 2. Check for existing pending request to avoid duplicates
    const exist = await db.pendingAccess.findUnique({
      where: { userId: me.id },
    });

    if (exist) {
      return NextResponse.json(
        { error: "Request already pending" },
        { status: 400 },
      );
    }

    // 3. ✅ Update User's Phone Number (Sync profile) if provided
    if (phoneNumber) {
      await db.user.update({
        where: { id: me.id },
        data: { phoneNumber },
      });
    }

    // 4. Create Access Request
    // Note: Since PendingAccess doesn't have relations to Building/Flat in schema,
    // we store the IDs. The Admin API will need to fetch names based on these IDs.
    await db.pendingAccess.create({
      data: {
        userId: me.id,
        societyId,
        requestedRole: role,
        phoneNumber,
        buildingId: buildingId || null,
        flatId: flatId || null,
      },
    });

    // 5. ✅ Handle Vehicle Registration
    if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
      // We use Promise.all to process them in parallel for speed
      await Promise.all(
        vehicles.map(async (v) => {
          if (!v.number) return;

          // Standardize: "MP 07 AB 1234" -> "MP07AB1234"
          const cleanNumber = v.number.toUpperCase().replace(/\s/g, "");

          // Check if vehicle already exists
          const existingVehicle = await db.vehicle.findUnique({
            where: { number: cleanNumber },
          });

          // Only create if it doesn't exist.
          // (Note: In your current schema, a vehicle belongs to ONE user.
          // If it exists, we skip linking to avoid errors.)
          if (!existingVehicle) {
            await db.vehicle.create({
              data: {
                number: cleanNumber,
                type: v.type, // 'TWO_WHEELER', 'FOUR_WHEELER', 'OTHER'
                userId: me.id,
              },
            });
          }
        }),
      );
    }

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    console.error("join-society error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
