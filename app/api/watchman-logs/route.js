import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function GET(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to view logs
    const allowedRoles = [
      "SUPER_ADMIN",
      "SOCIETY_ADMIN",
      "SOCIETY_SECRETARY",
      "WATCHMAN",
    ];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Get society ID for filtering logs
    let societyId = user.societyId;

    // Super admin can view all logs or specific society logs
    if (user.role === "SUPER_ADMIN") {
      const url = new URL(req.url);
      const requestedSocietyId = url.searchParams.get("societyId");
      if (requestedSocietyId) {
        societyId = requestedSocietyId;
      }
    }

    // Fetch entry logs
    const whereClause = societyId ? { societyId } : {};

    const logs = await db.entryLog.findMany({
      where: whereClause,
      include: {
        society: {
          select: { name: true },
        },
        watchman: {
          select: { name: true },
        },
      },
      orderBy: {
        inTime: "desc",
      },
      take: 1000, // Limit to prevent huge responses
    });

    return NextResponse.json({
      logs,
      total: logs.length,
    });
  } catch (error) {
    console.error("Error fetching watchman logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only watchmen can create logs
    if (user.role !== "WATCHMAN") {
      return NextResponse.json(
        { error: "Only watchmen can create logs" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { personType, personName, vehicleNumber, societyId } = body;

    if (!personType || !personName) {
      return NextResponse.json(
        { error: "Person type and name are required" },
        { status: 400 },
      );
    }

    // Create entry log
    const log = await db.entryLog.create({
      data: {
        personType,
        personName,
        vehicleNumber: vehicleNumber || null,
        // Use provided societyId (if flexible) or force user's society
        societyId: societyId || user.societyId,
        watchmanId: user.id,
        inTime: new Date(),
      },
      include: {
        society: {
          select: { name: true },
        },
        watchman: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ log });
  } catch (error) {
    console.error("Error creating entry log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only watchmen can update logs
    if (user.role !== "WATCHMAN") {
      return NextResponse.json(
        { error: "Only watchmen can update logs" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { logId, action } = body;

    if (!logId || !action) {
      return NextResponse.json(
        { error: "Log ID and action are required" },
        { status: 400 },
      );
    }

    if (action === "exit") {
      // Mark exit time
      const updatedLog = await db.entryLog.update({
        where: { id: logId },
        data: { outTime: new Date() },
        include: {
          society: {
            select: { name: true },
          },
          watchman: {
            select: { name: true },
          },
        },
      });

      return NextResponse.json({ log: updatedLog });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating entry log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
