import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { researchReferralPartner } from "@/lib/research-agent";
import { sendReferralOutreachSequence } from "@/lib/outreach";

// Partner DB for tracking processed reviews
function getPartnerDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

// SmartMoving DB for matching customers
function getSmartMovingDb() {
  return createClient({
    url: process.env.SMARTMOVING_DB_URL!,
    authToken: process.env.SMARTMOVING_DB_TOKEN!,
  });
}

interface GoogleReview {
  name: string; // resource name like "places/xxx/reviews/xxx"
  rating: number;
  text?: { text: string };
  authorAttribution?: { displayName: string };
}

async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.error("Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID");
    return [];
  }

  // Use Places API (New) to get reviews
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}?fields=reviews&key=${apiKey}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
    }
  );

  if (!res.ok) {
    console.error("Google Places API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return data.reviews || [];
}

export async function GET(request: Request) {
  // Verify cron secret (Vercel Cron sends this header)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await fetchGoogleReviews();
    const fiveStarReviews = reviews.filter((r) => r.rating === 5);

    if (fiveStarReviews.length === 0) {
      return NextResponse.json({ status: "no_5_star_reviews" });
    }

    const partnerDb = getPartnerDb();
    const smDb = getSmartMovingDb();
    const results: Array<{ reviewer: string; status: string }> = [];

    for (const review of fiveStarReviews) {
      const reviewId = review.name; // unique resource name
      const reviewerName = review.authorAttribution?.displayName || "";
      const reviewText = review.text?.text || "";

      if (!reviewerName || !reviewId) continue;

      // Check if we already processed this review
      const existing = await partnerDb.execute({
        sql: "SELECT id FROM processed_reviews WHERE review_id = ?",
        args: [reviewId],
      });

      if (existing.rows.length > 0) {
        results.push({ reviewer: reviewerName, status: "already_processed" });
        continue;
      }

      // Match reviewer to SmartMoving customer
      let customerResult = await smDb.execute({
        sql: `SELECT customerName, originAddress, originCity, originState,
                     destinationAddress, destinationCity, destinationState, source
              FROM Lead
              WHERE LOWER(customerName) = LOWER(?)
              AND stage = 'booked'
              ORDER BY bookedDate DESC LIMIT 1`,
        args: [reviewerName],
      });

      // Fuzzy match
      if (customerResult.rows.length === 0) {
        const nameParts = reviewerName.split(" ");
        if (nameParts.length >= 2) {
          customerResult = await smDb.execute({
            sql: `SELECT customerName, originAddress, originCity, originState,
                         destinationAddress, destinationCity, destinationState, source
                  FROM Lead
                  WHERE (LOWER(customerName) LIKE LOWER(?) OR LOWER(customerName) LIKE LOWER(?))
                  AND stage = 'booked'
                  ORDER BY bookedDate DESC LIMIT 1`,
            args: [
              `%${nameParts[0]}%${nameParts[nameParts.length - 1]}%`,
              `%${nameParts[nameParts.length - 1]}%${nameParts[0]}%`,
            ],
          });
        }
      }

      const customer = customerResult.rows[0] as unknown as {
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
        // Still mark as processed so we don't keep retrying
        await partnerDb.execute({
          sql: "INSERT INTO processed_reviews (review_id, reviewer_name, rating, review_text, agent_result) VALUES (?, ?, ?, ?, ?)",
          args: [reviewId, reviewerName, 5, reviewText, "no_customer_match"],
        });
        results.push({ reviewer: reviewerName, status: "no_customer_match" });
        continue;
      }

      // Run the research agent
      const partnerResult = await researchReferralPartner(
        { reviewerName, reviewText, rating: 5 },
        customer
      );

      // Send outreach if we found a partner with a phone number
      let outreachSent = false;
      if (partnerResult.found && partnerResult.partnerPhone) {
        const portalUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.movingmountainspartner.com";
        outreachSent = await sendReferralOutreachSequence({
          partnerName: partnerResult.partnerName || "there",
          partnerPhone: partnerResult.partnerPhone,
          portalUrl,
        });
      }

      // Mark as processed
      await partnerDb.execute({
        sql: "INSERT INTO processed_reviews (review_id, reviewer_name, rating, review_text, agent_result) VALUES (?, ?, ?, ?, ?)",
        args: [
          reviewId,
          reviewerName,
          5,
          reviewText,
          JSON.stringify({ ...partnerResult, outreachSent }),
        ],
      });

      // Notify Winston
      const quoApiKey = process.env.QUO_API_KEY;
      if (quoApiKey) {
        const msg = outreachSent
          ? `AUTO: 5-star review outreach sent!\n\nReviewer: ${reviewerName}\nCustomer: ${customer.customerName}\nPartner: ${partnerResult.partnerName} (${partnerResult.partnerType})\nPhone: ${partnerResult.partnerPhone}\nCompany: ${partnerResult.company || "N/A"}`
          : `AUTO: New 5-star review from ${reviewerName}\n\nCustomer: ${customer.customerName}\nPartner found: ${partnerResult.found ? "Yes" : "No"}\n${partnerResult.partnerName ? `Name: ${partnerResult.partnerName}` : ""}\n${partnerResult.partnerPhone ? `Phone: ${partnerResult.partnerPhone}` : "No phone found"}\n\nReasoning: ${partnerResult.reasoning}`;

        await fetch("https://api.quo.io/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${quoApiKey}`,
          },
          body: JSON.stringify({
            from: "+13092740694",
            to: "+13096424415",
            content: msg,
          }),
        }).catch((err) => console.error("Quo error:", err));
      }

      results.push({
        reviewer: reviewerName,
        status: outreachSent ? "outreach_sent" : "researched",
      });
    }

    return NextResponse.json({ status: "complete", results });
  } catch (error) {
    console.error("Review poll error:", error);
    return NextResponse.json(
      { error: "Failed to poll reviews", details: String(error) },
      { status: 500 }
    );
  }
}
