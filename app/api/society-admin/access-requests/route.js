import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

/* GET – list pending requests for *my* society */
export async function GET() {
  const user = await checkUser();
  if (!user) return new NextResponse("Unauth", { status: 401 });

  // Use the logged-in user's ID to find their admin record
  const meAdmin = await db.societyAdmin.findUnique({
    where: { userId: user.id },
    include: { society: true },
  });

  if (!meAdmin) return new NextResponse("Forbidden", { status: 403 });

  // 1. Fetch requests with User and their Vehicles
  const requests = await db.pendingAccess.findMany({
    where: { societyId: meAdmin.societyId, status: "PENDING" },
    include: {
      user: {
        include: {
          vehicles: true, // ✅ Fetch vehicles linked to the user
        },
      },
    },
  });

  // 2. Manually fetch Building and Flat names (since PendingAccess stores IDs)
  const enrichedRequests = await Promise.all(
    requests.map(async (req) => {
      let buildingName = null;
      let flatNumber = null;

      if (req.buildingId) {
        const b = await db.building.findUnique({
          where: { id: req.buildingId },
          select: { name: true },
        });
        buildingName = b?.name;
      }

      if (req.flatId) {
        const f = await db.flat.findUnique({
          where: { id: req.flatId },
          select: { flatNumber: true },
        });
        flatNumber = f?.flatNumber;
      }

      return {
        ...req,
        building: { name: buildingName }, // Attach name for frontend
        flat: { flatNumber: flatNumber }, // Attach number for frontend
      };
    }),
  );

  return NextResponse.json({ requests: enrichedRequests });
}

/* PATCH – approve / reject */
export async function PATCH(req) {
  const user = await checkUser();
  if (!user) return new NextResponse("Unauth", { status: 401 });

  const meAdmin = await db.societyAdmin.findUnique({
    where: { userId: user.id },
  });

  if (!meAdmin) return new NextResponse("Forbidden", { status: 403 });

  const { id, action } = await req.json();

  const reqEntry = await db.pendingAccess.findUnique({ where: { id } });
  if (!reqEntry || reqEntry.societyId !== meAdmin.societyId)
    return new NextResponse("Not found", { status: 404 });

  if (action === "APPROVE") {
    // 1) Update User Role & Society & Phone
    await db.user.update({
      where: { id: reqEntry.userId },
      data: {
        role: reqEntry.requestedRole,
        societyId: reqEntry.societyId,
        buildingId: reqEntry.buildingId || undefined, // Also link user to building
        phoneNumber: reqEntry.phoneNumber || undefined,
        isActive: true,
      },
    });

    // 2) Attach to Flat
    if (reqEntry.flatId) {
      let flatUpdateField = {};
      if (reqEntry.requestedRole === "HOUSE_OWNER") {
        flatUpdateField = { ownerId: reqEntry.userId };
      } else if (
        ["SOCIETY_MEMBER", "TENANT", "RESIDENT"].includes(
          reqEntry.requestedRole,
        )
      ) {
        flatUpdateField = { residentId: reqEntry.userId };
      }

      if (Object.keys(flatUpdateField).length > 0) {
        // If a resident/tenant is moving in, mark flat as occupied
        if (flatUpdateField.residentId) {
          flatUpdateField.isOccupied = true;
        }

        await db.flat.update({
          where: { id: reqEntry.flatId },
          data: flatUpdateField,
        });
      }
    }

    // 3) Create Staff entry if role requires it
    const staffRoles = ["STAFF", "TECHNICIAN", "WATCHMAN"];
    if (staffRoles.includes(reqEntry.requestedRole)) {
      const existing = await db.staff.findFirst({
        where: { userId: reqEntry.userId, societyId: reqEntry.societyId },
      });

      if (!existing) {
        const targetUser = await db.user.findUnique({
          where: { id: reqEntry.userId },
        });

        const fullName =
          targetUser?.name ||
          (targetUser?.firstName
            ? `${targetUser.firstName} ${targetUser.lastName || ""}`
            : "Staff Member");

        await db.staff.create({
          data: {
            name: fullName,
            role: reqEntry.requestedRole,
            salary: 0,
            societyId: reqEntry.societyId,
            userId: reqEntry.userId,
            phoneNumber: reqEntry.phoneNumber || targetUser?.phoneNumber,
          },
        });
      }
    }

    // 4) Mark request done
    await db.pendingAccess.delete({ where: { id } });
  } else {
    // REJECT
    await db.pendingAccess.update({
      where: { id },
      data: { status: "REJECTED" },
    });
  }

  return NextResponse.json({ ok: true });
}
