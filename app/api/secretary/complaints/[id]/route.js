import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";

export async function PATCH(req, { params }) {
  const user = await checkUser();

  if (!user || user.role !== "SOCIETY_SECRETARY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { status } = body;

  await db.complaint.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}
