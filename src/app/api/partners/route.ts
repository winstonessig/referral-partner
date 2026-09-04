import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { sendPartnerWelcomeEmail } from "@/lib/email";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";

function slugify(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const companyName = formData.get("companyName") as string;
    const brokerage = formData.get("brokerage") as string;

    if (!firstName || !lastName || !email || !phone || !companyName || !brokerage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let slug = slugify(firstName, lastName);

    // If slug already taken, append a number
    const existing = await db.select().from(partners).where(eq(partners.slug, slug)).get();
    if (existing) {
      let i = 2;
      while (await db.select().from(partners).where(eq(partners.slug, `${slug}-${i}`)).get()) {
        i++;
      }
      slug = `${slug}-${i}`;
    }

    // Handle file uploads via Vercel Blob
    let headshotUrl: string | null = null;
    let logoUrl: string | null = null;

    const headshot = formData.get("headshot") as File | null;
    if (headshot && headshot.size > 0) {
      const blob = await put(`partners/${slug}/headshot-${headshot.name}`, headshot, {
        access: "public",
      });
      headshotUrl = blob.url;
    }

    const logo = formData.get("logo") as File | null;
    if (logo && logo.size > 0) {
      const blob = await put(`partners/${slug}/logo-${logo.name}`, logo, {
        access: "public",
      });
      logoUrl = blob.url;
    }

    await db.insert(partners).values({
      firstName,
      lastName,
      email,
      phone,
      companyName,
      brokerage,
      slug,
      logoUrl,
      headshotUrl,
    });

    // Send welcome email to partner with their page link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movingmountainspartner.com";
    const partnerUrl = `${siteUrl}/partner/${slug}`;

    sendPartnerWelcomeEmail({
      to: email,
      firstName,
      lastName,
      partnerUrl,
    }).catch((err) => console.error("Welcome email error:", err));

    // Send Quo text notifications to Winston and Benn
    const quoApiKey = process.env.QUO_API_KEY;
    if (quoApiKey) {
      const message = `New referral partner signup!\n\n${firstName} ${lastName}\n${companyName} — ${brokerage}\n${email} | ${phone}\n\nPartner page: ${partnerUrl}`;

      const notifyNumbers = [
        "+13093605587", // Benn
        "+13097124480", // Winston
      ];

      for (const to of notifyNumbers) {
        fetch("https://api.quo.io/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${quoApiKey}`,
          },
          body: JSON.stringify({
            from: "+13092740694",
            to,
            content: message,
          }),
        }).catch((err) => console.error("Quo notification error:", err));
      }
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Partner creation error:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}
