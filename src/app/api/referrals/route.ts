import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { referrals } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partnerId, firstName, lastName, email, phone, moveDate, message } = body;

    if (!partnerId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    await db.insert(referrals).values({
      partnerId: Number(partnerId),
      firstName,
      lastName,
      email,
      phone,
      moveDate: moveDate || null,
      message: message || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit referral" },
      { status: 500 }
    );
  }
}
