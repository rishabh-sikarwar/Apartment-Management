import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

// ── GET (list today's logs) ─────────────────────────
export async function GET() {
  const user = await checkUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Allow Admins, Secretary, and Watchmen
  const allowed = [
    "SUPER_ADMIN",
    "SOCIETY_ADMIN",
    "SOCIETY_SECRETARY",
    "WATCHMAN",
  ];
  if (!allowed.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await db.entryLog.findMany({
    where: {
      societyId: user.societyId,
      inTime: { gte: today }, // Filter for today
    },
    include: {
      society: { select: { name: true } },
      watchman: { select: { name: true } },
    },
    orderBy: { inTime: "desc" },
  });

  return NextResponse.json(logs);
}

// ── POST (NEW entry) ─────────────────────────────────────
export async function POST(req) {
  const user = await checkUser();
  if (!user || user.role !== "WATCHMAN") {
    return NextResponse.json(
      { error: "Forbidden: Only Watchmen can create logs" },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const { personType, personName, personId, vehicleNumber } = body;

    if (!personType) {
      return NextResponse.json(
        { error: "personType is required" },
        { status: 400 },
      );
    }

    let finalPersonName = personName;

    // Logic to fetch resident name if ID is provided but name is missing
    if (personType === "RESIDENT" && personId && !personName) {
      const resident = await db.user.findUnique({
        where: { id: personId },
        select: { name: true, email: true },
      });
      if (resident) {
        finalPersonName = resident.name || resident.email;
      }
    }

    if (!finalPersonName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Find the Staff ID for this watchman user
    const staffProfile = await db.staff.findFirst({
      where: { userId: user.id },
    });

    const log = await db.entryLog.create({
      data: {
        personType,
        personName: finalPersonName,
        vehicleNumber: vehicleNumber || null,
        societyId: user.societyId,
        watchmanId: staffProfile?.id || "unknown", // Link to staff profile if exists
        inTime: new Date(),
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error creating entry log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ── PATCH (mark OUT) ─────────────────────────────────────
export async function PATCH(req) {
  const user = await checkUser();
  if (!user || user.role !== "WATCHMAN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { logId, action } = await req.json(); // Expecting body, not query params for cleaner PATCH

    if (!logId)
      return NextResponse.json({ error: "Missing logId" }, { status: 400 });

    if (action === "exit") {
      const updated = await db.entryLog.update({
        where: { id: logId },
        data: { outTime: new Date() },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating entry log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
