const QUO_FROM = "+13092740694"; // API leads activation line

interface OutreachParams {
  partnerName: string;
  partnerPhone: string;
  reviewScreenshotUrl?: string;
  portalUrl: string;
}

async function sendQuoText(to: string, content: string, apiKey: string) {
  const res = await fetch("https://api.quo.io/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: QUO_FROM,
      to,
      content,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Quo send error:", res.status, text);
  }

  return res.ok;
}

export async function sendReferralOutreachSequence(params: OutreachParams) {
  const quoApiKey = process.env.QUO_API_KEY;
  if (!quoApiKey) {
    console.error("QUO_API_KEY not set");
    return false;
  }

  const { partnerName, partnerPhone, reviewScreenshotUrl, portalUrl } = params;
  const firstName = partnerName.split(" ")[0];

  // Message 1: Introduction
  await sendQuoText(
    partnerPhone,
    `Hey ${firstName}, wanted to introduce myself. I'm Winston Essig, I own Moving Mountains.`,
    quoApiKey
  );

  // Small delay between messages
  await new Promise((r) => setTimeout(r, 3000));

  // Message 2: Context + review
  if (reviewScreenshotUrl) {
    await sendQuoText(
      partnerPhone,
      `We just serviced a client of yours, and it went really well!`,
      quoApiKey
    );

    await new Promise((r) => setTimeout(r, 2000));

    // Message 3: Review screenshot
    await sendQuoText(
      partnerPhone,
      reviewScreenshotUrl,
      quoApiKey
    );
  } else {
    await sendQuoText(
      partnerPhone,
      `We just serviced a client of yours, and it went really well! They left us a 5-star review.`,
      quoApiKey
    );
  }

  await new Promise((r) => setTimeout(r, 3000));

  // Message 4: The ask
  await sendQuoText(
    partnerPhone,
    `I'd love to make this happen for more of your clients.`,
    quoApiKey
  );

  await new Promise((r) => setTimeout(r, 3000));

  // Message 5: Portal link
  await sendQuoText(
    partnerPhone,
    `Here's a link to our referral portal — fill it out and it'll give you a custom co-branded link you can share with your future clients:\n\n${portalUrl}`,
    quoApiKey
  );

  return true;
}
