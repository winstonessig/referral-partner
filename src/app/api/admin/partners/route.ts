import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners, referrals } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  // Delete referrals tied to this partner first
  await db.delete(referrals).where(eq(referrals.partnerId, Number(id)));
  await db.delete(partners).where(eq(partners.id, Number(id)));

  return NextResponse.json({ success: true });
}
