import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  const user = await checkUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ensure user is admin of the society
  if (user.role !== "SOCIETY_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { flatNumber, areaSqFt, bedrooms, buildingId, residentId } =
    await req.json();

  // Validate building belongs to society
  const building = await db.building.findFirst({
    where: { id: buildingId, societyId: user.societyId },
  });

  if (!building) {
    return NextResponse.json({ error: "Invalid building" }, { status: 400 });
  }

  // Create Flat
  const flat = await db.flat.create({
    data: {
      flatNumber,
      areaSqFt,
      bedrooms,
      buildingId,
      isOccupied: !!residentId,
      residentId: residentId || null,
    },
  });

  // If resident assigned immediately, update their role
  if (residentId) {
    await db.user.update({
      where: { id: residentId },
      data: { role: "HOUSE_OWNER" },
    });
  }

  return NextResponse.json({ flat });
}
