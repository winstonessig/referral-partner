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

    // Send Quo text to Benn with client info
    const quoApiKey = process.env.QUO_API_KEY;
    if (quoApiKey) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movingmountainspartner.com";
      const textMessage = `New referral lead!\n\nClient: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nMove date: ${moveDate || "Not specified"}\n${message ? `Notes: ${message}\n` : ""}\nReferred by: ${partnerName}${partner ? ` (${partner.companyName})` : ""}\n\n$100 discount — lead pushed to SmartMoving.`;

      // Text Benn
      fetch("https://api.quo.io/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${quoApiKey}`,
        },
        body: JSON.stringify({
          from: "+13092740694",
          to: "+13093605587",
          content: textMessage,
        }),
      }).catch((err) => console.error("Quo notification error:", err));

      // Text Winston
      fetch("https://api.quo.io/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${quoApiKey}`,
        },
        body: JSON.stringify({
          from: "+13092740694",
          to: "+13097124480",
          content: textMessage,
        }),
      }).catch((err) => console.error("Quo notification error:", err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit referral" },
      { status: 500 }
    );
  }
}
