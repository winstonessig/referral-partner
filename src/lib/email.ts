import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPartnerWelcomeEmail({
  to,
  firstName,
  lastName,
  partnerUrl,
}: {
  to: string;
  firstName: string;
  lastName: string;
  partnerUrl: string;
}) {
  await resend.emails.send({
    from: "Moving Mountains <office@movingmountainspartners.com>",
    to,
    subject: `Your Moving Mountains partner page is live, ${firstName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#052a31;font-family:'Roboto',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#052a31;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <img src="https://moving-mountains-partners.vercel.app/brand/secondary_orange.svg" alt="Moving Mountains" width="200" style="display:block;" />
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background-color:#1a2e35;padding:40px 32px;border-left:4px solid #e14b26;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.05em;">
                YOU'RE IN, ${firstName.toUpperCase()}.
              </h1>
              <p style="margin:0;font-size:16px;color:#71b0b3;">
                Your co-branded partner page is live and ready to share.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <p style="margin:0 0 24px;font-size:14px;color:#71b0b3;text-transform:uppercase;letter-spacing:0.15em;font-weight:500;">
                YOUR PARTNER PAGE
              </p>
              <a href="${partnerUrl}" style="display:inline-block;background-color:#e14b26;color:#ffffff;text-decoration:none;padding:14px 40px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">
                VIEW YOUR PAGE
              </a>
              <p style="margin:24px 0 0;font-size:12px;color:#71b0b3;word-break:break-all;">
                ${partnerUrl}
              </p>
            </td>
          </tr>

          <!-- How it works -->
          <tr>
            <td style="padding:0 32px 40px;">
              <div style="height:1px;background-color:#71b0b3;opacity:0.2;margin-bottom:32px;"></div>
              <h2 style="margin:0 0 20px;font-size:18px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.05em;">
                WHAT HAPPENS NEXT
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;vertical-align:top;width:40px;">
                    <span style="color:#e14b26;font-size:18px;font-weight:700;">01</span>
                  </td>
                  <td style="padding:8px 0;color:#eedcc5;font-size:14px;">
                    Share your page link with clients who are moving.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;vertical-align:top;width:40px;">
                    <span style="color:#e14b26;font-size:18px;font-weight:700;">02</span>
                  </td>
                  <td style="padding:8px 0;color:#eedcc5;font-size:14px;">
                    They fill out the form on your page to book their move.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;vertical-align:top;width:40px;">
                    <span style="color:#e14b26;font-size:18px;font-weight:700;">03</span>
                  </td>
                  <td style="padding:8px 0;color:#eedcc5;font-size:14px;">
                    They get $100 off. You build trust. We handle the rest.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px;text-align:center;border-top:1px solid rgba(113,176,179,0.2);">
              <p style="margin:0 0 4px;font-size:12px;color:#71b0b3;">
                Moving Mountains &mdash; Excellence on the move.
              </p>
              <p style="margin:0;font-size:11px;color:#71b0b3;opacity:0.5;">
                Questions? Reply to this email or call us anytime.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
