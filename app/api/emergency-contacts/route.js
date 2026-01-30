import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { NextResponse } from "next/server";

// GET: Fetch Emergency Contacts for the User's Society
export async function GET(req) {
  try {
    // 1. Authenticate User
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if user belongs to a society
    if (!user.societyId) {
      // If user isn't in a society yet, return empty list
      return NextResponse.json({
        contacts: [],
        user: { role: user.role, societyId: null },
      });
    }

    // 3. Fetch contacts for that specific society
    const contacts = await db.emergencyContact.findMany({
      where: { societyId: user.societyId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      contacts,
      user: { role: user.role, societyId: user.societyId },
    });
  } catch (error) {
    console.error("GET Emergency Contacts Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

// POST: Add New Emergency Contact (Admins Only)
export async function POST(req) {
  try {
    // 1. Authenticate User
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check Permissions (Only Admins/Secretaries can add contacts)
    const allowedRoles = ["SUPER_ADMIN", "SOCIETY_ADMIN", "SOCIETY_SECRETARY"];

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 },
      );
    }

    // 3. Validate Inputs
    const { name, phoneNumber, email, designation } = await req.json();

    if (!name || !phoneNumber || !designation || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!user.societyId) {
      return NextResponse.json(
        { error: "You must be part of a society to add contacts" },
        { status: 400 },
      );
    }

    // 4. Create Contact
    const newContact = await db.emergencyContact.create({
      data: {
        name,
        phoneNumber,
        designation,
        email,
        userId: user.id, // Linked to the admin who created it
        societyId: user.societyId, // Linked to the society
      },
    });

    return NextResponse.json(newContact);
  } catch (error) {
    console.error("POST Emergency Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
