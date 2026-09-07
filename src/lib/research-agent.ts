import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

interface ReviewData {
  reviewerName: string;
  reviewText: string;
  rating: number;
}

interface CustomerData {
  customerName: string;
  originAddress: string | null;
  originCity: string | null;
  originState: string | null;
  destinationAddress: string | null;
  destinationCity: string | null;
  destinationState: string | null;
  source: string | null;
}

export interface ReferralPartnerResult {
  found: boolean;
  partnerName: string | null;
  partnerType: string | null; // "realtor", "apartment_complex", "builder", "property_manager"
  partnerPhone: string | null;
  partnerEmail: string | null;
  company: string | null;
  confidence: string; // "high", "medium", "low"
  reasoning: string;
}

export async function researchReferralPartner(
  review: ReviewData,
  customer: CustomerData
): Promise<ReferralPartnerResult> {
  const address = customer.originAddress || customer.destinationAddress || "";
  const city = customer.originCity || customer.destinationCity || "";
  const state = customer.originState || customer.destinationState || "";
  const fullAddress = [address, city, state].filter(Boolean).join(", ");

  const prompt = `You are a research agent for Moving Mountains, a moving company. A customer just left a 5-star review and we want to find who referred them or who their realtor/apartment complex/builder was so we can reach out.

CUSTOMER INFO:
- Name: ${customer.customerName}
- Origin address: ${fullAddress || "Not available"}
- Lead source: ${customer.source || "Not available"}

5-STAR REVIEW:
"${review.reviewText}"

YOUR TASK:
Research and identify the most likely referral partner associated with this move. This could be:
1. The real estate agent (listing or buying agent) for the property
2. An apartment complex or property management company
3. A home builder if it's new construction
4. Any other business that could consistently refer moving clients

Use the address to determine:
- Was this a home purchase? Look up recent real estate transactions at that address to find the agents involved.
- Is this an apartment complex? Identify the complex name and management company.
- Is this new construction? Identify the builder.

If the address is not available, use the customer name and any clues from the review text.

IMPORTANT: Be specific. Give me a real name and company if you can determine it. If you can't find specific info, explain what type of referral partner to look for and how to find them.

Respond in this exact JSON format:
{
  "found": true/false,
  "partnerName": "Name of the person" or null,
  "partnerType": "realtor" | "apartment_complex" | "builder" | "property_manager" | null,
  "partnerPhone": "phone number if found" or null,
  "partnerEmail": "email if found" or null,
  "company": "Company name" or null,
  "confidence": "high" | "medium" | "low",
  "reasoning": "Brief explanation of how you determined this and what steps to take next"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    console.error("Failed to parse agent response:", text);
  }

  return {
    found: false,
    partnerName: null,
    partnerType: null,
    partnerPhone: null,
    partnerEmail: null,
    company: null,
    confidence: "low",
    reasoning: "Agent could not determine referral partner",
  };
}
