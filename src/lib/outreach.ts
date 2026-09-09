// SMS outreach disabled — waiting on Blooio integration
// The sequence and logic are preserved, just need to swap the send function

interface OutreachParams {
  partnerName: string;
  partnerPhone: string;
  reviewScreenshotUrl?: string;
  portalUrl: string;
}

export async function sendReferralOutreachSequence(params: OutreachParams) {
  // TODO: Re-enable with Blooio when ready
  console.log("SMS outreach disabled. Would have sent to:", params.partnerPhone);
  console.log("Partner:", params.partnerName);
  return false;
}
