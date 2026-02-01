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

  const requests = await db.pendingAccess.findMany({
    where: { societyId: meAdmin.societyId, status: "PENDING" },
    include: { user: true },
  });

  return NextResponse.json({ requests });
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
    // 1) Update User Role & Society
    await db.user.update({
      where: { id: reqEntry.userId },
      data: {
        role: reqEntry.requestedRole,
        societyId: reqEntry.societyId,
        phoneNumber: reqEntry.phoneNumber || undefined,
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
        // Need to fetch user name since it might be split in DB
        const targetUser = await db.user.findUnique({
          where: { id: reqEntry.userId },
        });

        await db.staff.create({
          data: {
            name: targetUser?.name || targetUser?.firstName || "Staff Member",
            role: reqEntry.requestedRole,
            salary: 0,
            societyId: reqEntry.societyId,
            userId: reqEntry.userId,
          },
        });
      }
    }

    // 4) Mark request done
    await db.pendingAccess.delete({ where: { id } });
  } else {
    await db.pendingAccess.update({
      where: { id },
      data: { status: "REJECTED" },
    });
  }

  return NextResponse.json({ ok: true });
}
