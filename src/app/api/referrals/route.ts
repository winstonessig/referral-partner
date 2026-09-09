import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners, referrals } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partnerId, firstName, lastName, email, phone, moveDate, message } = body;

    if (!partnerId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // Get the partner info for the notification
    const partner = await db
      .select()
      .from(partners)
      .where(eq(partners.id, Number(partnerId)))
      .get();

    const partnerName = partner
      ? `${partner.firstName} ${partner.lastName}`
      : "Unknown";

    await db.insert(referrals).values({
      partnerId: Number(partnerId),
      firstName,
      lastName,
      email,
      phone,
      moveDate: moveDate || null,
      message: message || null,
    });

    // Push lead to SmartMoving
    const smApiKey = process.env.SMARTMOVING_API_KEY;
    if (smApiKey) {
      const smPayload = {
        firstName,
        lastName,
        phoneNumber: phone,
        email,
        moveDate: moveDate || undefined,
        notes: `Referral from partner: ${partnerName}${partner ? ` (${partner.companyName} — ${partner.brokerage})` : ""}. $100 discount applied.${message ? ` Client note: ${message}` : ""}`,
        referralSource: `Partner Referral - ${partnerName}`,
      };

      fetch(
        `https://api.smartmoving.com/api/leads/from-provider/v2?providerKey=${smApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(smPayload),
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            console.error("SmartMoving error:", res.status, text);
          }
        })
        .catch((err) => console.error("SmartMoving error:", err));
    }

    // TODO: Re-enable SMS notifications when Blooio is ready
    // Quo notifications disabled for now

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit referral" },
      { status: 500 }
    );
  }
}
