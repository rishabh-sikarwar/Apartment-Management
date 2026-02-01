import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";
import { hasRouteAccess } from "@/lib/roleAccess";

export async function POST(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = [
      "SUPER_ADMIN",
      "SOCIETY_ADMIN",
      "SOCIETY_SECRETARY",
    ].includes(user.role);

    // Check role access
    if (!isAdmin && !hasRouteAccess(user.role, "/Facilities")) {
      return NextResponse.json(
        {
          error: "Access Denied. Please join a society first.",
          redirectTo: "/join-society",
        },
        { status: 403 },
      );
    }

    if (!isAdmin && !user.societyId) {
      return NextResponse.json(
        {
          error: "You must be part of a society to book facilities.",
          redirectTo: "/join-society",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { facility, startDateTime, endDateTime, reason } = body;

    if (!facility || !startDateTime || !endDateTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const startTime = new Date(startDateTime);
    const endTime = new Date(endDateTime);

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 },
      );
    }

    // Check availability
    const existingBooking = await db.booking.findFirst({
      where: {
        facility,
        startTime: { lte: endTime },
        endTime: { gte: startTime },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Slot already booked" },
        { status: 409 },
      );
    }

    const newBooking = await db.booking.create({
      data: {
        facility,
        userId: user.id,
        startTime,
        endTime,
        reason: reason || "No reason provided",
        status: "BOOKED",
      },
    });

    return NextResponse.json(
      { success: true, booking: newBooking },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
