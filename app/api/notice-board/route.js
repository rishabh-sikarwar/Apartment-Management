import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";

const ADMIN_EMAIL = "rishabhsikarwar1000@gmail.com";

export async function GET() {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.societyId) {
      return NextResponse.json(
        { error: "Please join a society to view notices" },
        { status: 403 },
      );
    }

    const notices = await db.notice.findMany({
      where: { societyId: user.societyId },
      orderBy: { postedAt: "desc" },
    });

    return NextResponse.json(notices);
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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

    // Check permissions directly on the user object
    if (user.role !== "SUPER_ADMIN" && user.role !== "SOCIETY_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content } = await req.json();

    const newNotice = await db.notice.create({
      data: {
        content,
        postedBy: user.id,
        societyId: user.societyId, // Ensure notice is linked to society
      },
    });

    return NextResponse.json(newNotice);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await checkUser();

    // Check if user is the specific admin or has SUPER_ADMIN role
    if (!user || (user.email !== ADMIN_EMAIL && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Only admin can edit" },
        { status: 403 },
      );
    }

    const { id, content } = await req.json();

    const updateNotice = await db.notice.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updateNotice);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await checkUser();

    if (!user || (user.email !== ADMIN_EMAIL && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Only admin can delete" },
        { status: 403 },
      );
    }

    const { id } = await req.json();

    await db.notice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
