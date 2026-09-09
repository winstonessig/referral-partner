import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { referrals } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await db.delete(referrals).where(eq(referrals.id, Number(id)));

  return NextResponse.json({ success: true });
}
