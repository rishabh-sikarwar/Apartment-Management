import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user || !user.societyId)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, numberOfFloors } = body;

    const building = await db.building.create({
      data: {
        name,
        numberOfFloors: parseInt(numberOfFloors),
        societyId: user.societyId,
      },
    });

    return NextResponse.json(building);
  } catch (err) {
    console.error(err);
    return new NextResponse("Server Error", { status: 500 });
  }
}

export async function GET() {
  const user = await checkUser();
  if (!user || !user.societyId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const buildings = await db.building.findMany({
    where: { societyId: user.societyId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ buildings });
}
