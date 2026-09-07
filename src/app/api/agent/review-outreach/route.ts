import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { researchReferralPartner } from "@/lib/research-agent";
import { sendReferralOutreachSequence } from "@/lib/outreach";

// Connect to the call-score-dashboard DB (SmartMoving data)
function getSmartMovingDb() {
  return createClient({
    url: process.env.SMARTMOVING_DB_URL!,
    authToken: process.env.SMARTMOVING_DB_TOKEN!,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewerName, reviewText, rating, reviewScreenshotUrl } = body;

    if (!reviewerName || !reviewText || rating < 5) {
      return NextResponse.json(
        { error: "Need reviewerName, reviewText, and 5-star rating" },
        { status: 400 }
      );
    }

    // Step 1: Match reviewer to a customer in SmartMoving DB
    const smDb = getSmartMovingDb();

    // Try exact match first, then fuzzy
    let result = await smDb.execute({
      sql: `SELECT customerName, originAddress, originCity, originState,
                   destinationAddress, destinationCity, destinationState, source
            FROM Lead
            WHERE LOWER(customerName) = LOWER(?)
            AND stage = 'booked'
            ORDER BY bookedDate DESC LIMIT 1`,
      args: [reviewerName],
    });

    // If no exact match, try partial match
    if (result.rows.length === 0) {
      const nameParts = reviewerName.split(" ");
      if (nameParts.length >= 2) {
        result = await smDb.execute({
          sql: `SELECT customerName, originAddress, originCity, originState,
                       destinationAddress, destinationCity, destinationState, source
                FROM Lead
                WHERE (LOWER(customerName) LIKE LOWER(?) OR LOWER(customerName) LIKE LOWER(?))
                AND stage = 'booked'
                ORDER BY bookedDate DESC LIMIT 1`,
          args: [`%${nameParts[0]}%${nameParts[nameParts.length - 1]}%`, `%${nameParts[nameParts.length - 1]}%${nameParts[0]}%`],
        });
      }
    }

    const customer = result.rows[0] as unknown as {
      customerName: string;
      originAddress: string | null;
      originCity: string | null;
      originState: string | null;
      destinationAddress: string | null;
      destinationCity: string | null;
      destinationState: string | null;
      source: string | null;
    } | undefined;

    if (!customer) {
      return NextResponse.json({
        status: "no_match",
        message: `Could not match reviewer "${reviewerName}" to a customer in SmartMoving`,
      });
    }

    // Step 2: Research the referral partner using AI agent
    const partnerResult = await researchReferralPartner(
      { reviewerName, reviewText, rating },
      customer
    );

    // Step 3: If we found a partner with a phone number, send the outreach sequence
    let outreachSent = false;
    if (partnerResult.found && partnerResult.partnerPhone) {
      const portalUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movingmountainspartner.com";

      outreachSent = await sendReferralOutreachSequence({
        partnerName: partnerResult.partnerName || "there",
        partnerPhone: partnerResult.partnerPhone,
        reviewScreenshotUrl,
        portalUrl,
      });
    }

    // Step 4: Notify Winston about the result
    const quoApiKey = process.env.QUO_API_KEY;
    if (quoApiKey) {
      const statusMsg = outreachSent
        ? `Review outreach SENT to ${partnerResult.partnerName} (${partnerResult.partnerType}) at ${partnerResult.partnerPhone}\n\nCompany: ${partnerResult.company || "N/A"}\nConfidence: ${partnerResult.confidence}\n\nCustomer: ${customer.customerName}\nReviewer: ${reviewerName}`
        : `Review outreach agent ran for "${reviewerName}"\n\nCustomer matched: ${customer?.customerName || "No"}\nPartner found: ${partnerResult.found ? "Yes" : "No"}\nPartner: ${partnerResult.partnerName || "N/A"}\nType: ${partnerResult.partnerType || "N/A"}\nPhone: ${partnerResult.partnerPhone || "NOT FOUND"}\nConfidence: ${partnerResult.confidence}\n\nReasoning: ${partnerResult.reasoning}`;

      await fetch("https://api.quo.io/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${quoApiKey}`,
        },
        body: JSON.stringify({
          from: "+13092740694",
          to: "+13096424415",
          content: `5-Star Review Agent Update:\n\n${statusMsg}`,
        }),
      });
    }

    return NextResponse.json({
      status: outreachSent ? "outreach_sent" : "research_complete",
      customer: customer.customerName,
      partner: partnerResult,
      outreachSent,
    });
  } catch (error) {
    console.error("Review outreach agent error:", error);
    return NextResponse.json(
      { error: "Agent failed", details: String(error) },
      { status: 500 }
    );
  }
}
