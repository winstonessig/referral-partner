import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const VIDEO_URL = process.env.PARTNER_VIDEO_URL || "";

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
  const videoSection = VIDEO_URL
    ? `
          <!-- Video -->
          <tr>
            <td style="padding:0 40px 32px;">
              <a href="${VIDEO_URL}" style="display:block;text-decoration:none;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a2e35;border:2px solid #71b0b3;">
                  <tr>
                    <td style="padding:60px 40px;text-align:center;">
                      <div style="width:72px;height:72px;border-radius:50%;background-color:#e14b26;display:inline-block;line-height:72px;text-align:center;">
                        <span style="font-size:28px;color:#ffffff;margin-left:4px;">&#9654;</span>
                      </div>
                      <p style="margin:16px 0 0;font-family:'Roboto Condensed',Arial,sans-serif;font-size:14px;color:#71b0b3;text-transform:uppercase;letter-spacing:0.15em;">
                        WATCH: HOW YOUR REFERRAL PAGE WORKS
                      </p>
                      <p style="margin:8px 0 0;font-size:13px;color:#71b0b3;opacity:0.6;">
                        2 min video from Winston Essig, Owner
                      </p>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:#e14b26;opacity:0.4;"></div>
            </td>
          </tr>`
    : "";

  await resend.emails.send({
    from: "Moving Mountains <office@movingmountainspartner.com>",
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
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#052a31;max-width:640px;margin:0 auto;">
    <tr>
      <td style="padding:0;">

        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;">
              <img src="https://www.movingmountainspartner.com/brand/secondary_orange.svg" alt="Moving Mountains" width="220" style="display:inline-block;" />
            </td>
          </tr>
        </table>

        <!-- Orange line -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="height:3px;background-color:#e14b26;"></td></tr>
        </table>

        <!-- Hero -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:40px 40px 24px;">
              <h1 style="margin:0;font-family:'Roboto Condensed',Arial,sans-serif;font-size:32px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.05em;line-height:1.1;">
                WELCOME TO THE<br/>
                <span style="color:#e14b26;">MOVING MOUNTAINS</span><br/>
                PARTNER PROGRAM
              </h1>
            </td>
          </tr>
        </table>

        <!-- Intro -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:16px;color:#71b0b3;line-height:1.6;">
                Hey <strong style="color:#eedcc5;">${firstName}</strong>,
              </p>
              <p style="margin:16px 0 0;font-size:16px;color:#71b0b3;line-height:1.6;">
                Thanks for partnering with us. Your custom referral page is live and ready to share with your clients.${VIDEO_URL ? " I recorded a quick video walking you through exactly how it works." : ""}
              </p>
            </td>
          </tr>
        </table>

        ${videoSection}

        <!-- Your page -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0;font-family:'Roboto Condensed',Arial,sans-serif;font-size:12px;color:#71b0b3;text-transform:uppercase;letter-spacing:0.15em;">
                YOUR PARTNER PAGE
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background-color:#1a2e35;border-left:4px solid #e14b26;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:14px;color:#eedcc5;word-break:break-all;">
                      ${partnerUrl}
                    </p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td>
                    <a href="${partnerUrl}" style="display:inline-block;background-color:#e14b26;color:#ffffff;text-decoration:none;padding:14px 40px;font-family:'Roboto Condensed',Arial,sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">
                      VIEW YOUR PAGE
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:#e14b26;opacity:0.4;"></div>
            </td>
          </tr>
        </table>

        <!-- How it works -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 24px;font-family:'Roboto Condensed',Arial,sans-serif;font-size:20px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:0.05em;">
                HERE'S HOW IT WORKS
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="width:48px;vertical-align:top;padding-top:2px;">
                    <span style="font-family:'Roboto Condensed',Arial,sans-serif;font-size:24px;font-weight:700;color:#e14b26;">01</span>
                  </td>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-family:'Roboto Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;">SHARE YOUR LINK</p>
                    <p style="margin:0;font-size:14px;color:#71b0b3;line-height:1.5;">Send your custom page to any client who's moving. It's branded with your name, photo, and logo.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="width:48px;vertical-align:top;padding-top:2px;">
                    <span style="font-family:'Roboto Condensed',Arial,sans-serif;font-size:24px;font-weight:700;color:#e14b26;">02</span>
                  </td>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-family:'Roboto Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;">THEY BOOK THEIR MOVE</p>
                    <p style="margin:0;font-size:14px;color:#71b0b3;line-height:1.5;">Your client fills out the form on your page. We reach out, schedule the move, and handle everything.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:48px;vertical-align:top;padding-top:2px;">
                    <span style="font-family:'Roboto Condensed',Arial,sans-serif;font-size:24px;font-weight:700;color:#e14b26;">03</span>
                  </td>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-family:'Roboto Condensed',Arial,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-transform:uppercase;">THEY SAVE $100</p>
                    <p style="margin:0;font-size:14px;color:#71b0b3;line-height:1.5;">Every client who books through your page gets $100 off their move. You look good. They save money. We do the heavy lifting.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background-color:#e14b26;opacity:0.4;"></div>
            </td>
          </tr>
        </table>

        <!-- Personal note -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0;font-size:15px;color:#eedcc5;line-height:1.6;">
                I started Moving Mountains because I believe movers should be held to a higher standard. No more poor communication, dirty crews, and run down trucks. You and your clients deserve better than that.
              </p>
              <p style="margin:16px 0 0;font-size:15px;color:#eedcc5;line-height:1.6;">
                I'm here to ensure great service to you and your clients, please don't hesitate to call me.
              </p>
              <p style="margin:24px 0 0;font-size:15px;color:#eedcc5;">
                — Winston Essig<br/>
                <span style="font-size:13px;color:#71b0b3;">Owner, Moving Mountains</span><br/>
                <a href="tel:+13096424415" style="font-size:13px;color:#e14b26;text-decoration:none;">(309) 642-4415</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- Orange line -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="height:3px;background-color:#e14b26;"></td></tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#71b0b3;">
                Moving Mountains &mdash; Excellence on the move.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#71b0b3;opacity:0.5;">
                Questions? Reply to this email or call (309) 704-4163
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
