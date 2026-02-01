import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");

    if (!name || !phone)
      return NextResponse.json(
        { success: false, error: "Missing name or phone" },
        { status: 400 },
      );

    const staff = await db.staff.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" }, // Ensure Prisma supports this or remove mode
        phoneNumber: phone,
      },
    });

    if (!staff)
      return NextResponse.json(
        { success: false, error: "Staff not found" },
        { status: 404 },
      );

    const salaries = await db.salary.findMany({
      where: { staff_id: staff.id },
      orderBy: { payDate: "desc" },
    });

    const formattedSlips = salaries.map((record) => ({
      id: record.id,
      amount: record.amount,
      paidAt: record.payDate,
      status: record.status,
    }));

    return NextResponse.json({
      success: true,
      slips: formattedSlips,
      staffInfo: {
        name: staff.name,
        role: staff.role,
        phone: staff.phoneNumber,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
