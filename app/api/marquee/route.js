import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET is public (needs societyId)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const societyId = searchParams.get("societyId");

  if (!societyId) {
    return NextResponse.json([], { status: 200 });
  }

  const notices = await db.marqueeNotice.findMany({
    where: { societyId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json(notices);
}

// POST (Admins Only)
export async function POST(req) {
  try {
    const user = await checkUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowed = ["SUPER_ADMIN", "SOCIETY_ADMIN", "SOCIETY_SECRETARY"];
    if (!allowed.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content, societyId } = await req.json();

    if (!content || !societyId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const notice = await db.marqueeNotice.create({
      data: { content, societyId },
    });

    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE (Admins Only)
export async function DELETE(req) {
  try {
    const user = await checkUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allowed = ["SUPER_ADMIN", "SOCIETY_ADMIN", "SOCIETY_SECRETARY"];
    if (!allowed.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.marqueeNotice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notice deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
