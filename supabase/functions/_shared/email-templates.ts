/**
 * Professional email templates for mabioragau.com
 * Dark/tech aesthetic with portrait, bio, and teal + cyber-green accents
 * Email-client-safe: tables, inline styles
 */

const BRAND_TEAL = "#0d9488";
const BRAND_GREEN = "#00ff88";
const BRAND_DARK = "#080c14";
const BRAND_DARK2 = "#0f172a";
const BRAND_CARD = "#131b2e";
const BRAND_WHITE = "#f1f5f9";
const BRAND_GRAY = "#94a3b8";
const BRAND_MUTED = "#475569";
const BRAND_BORDER = "#1e293b";
const BRAND_URL = "https://mabioragau.com";
const PORTRAIT_URL = "https://www.mabioragau.com/portrait-mabior.jpg";

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ─── Layout shell ─────────────────────────────────────────

export function shell(opts: {
  previewText?: string;
  bodyContent: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    ${opts.previewText ? `<style>@media all{body{visibility:visible!important}}</style>` : ""}
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND_DARK};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
    ${opts.previewText ? `<!--[if !mso]><!--><div style="display:none;font-size:1px;color:${BRAND_DARK};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(opts.previewText)}</div><!--<![endif]-->` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_DARK};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" style="max-width:560px;background-color:${BRAND_DARK2};border-radius:10px;overflow:hidden;border:1px solid ${BRAND_BORDER};">
            ${opts.bodyContent}
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ─── Author header: portrait + name + bio ─────────────────

export function authorHeader(
  title: string,
  subtitle?: string,
): string {
  return `
    <tr>
      <td style="padding:36px 32px 20px;background:linear-gradient(160deg,#0d1b2a 0%,${BRAND_DARK2} 100%);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${BRAND_URL}" style="height:88px;width:88px;" arcsize="50%" strokecolor="${BRAND_TEAL}" strokeweight="2"><v:fill type="frame" src="${PORTRAIT_URL}" /><w:anchorlock/></v:roundrect><![endif]-->
              <!--[if !mso]><!-->
              <a href="${BRAND_URL}" style="text-decoration:none;">
                <img src="${PORTRAIT_URL}" alt="Mabior Agau" width="88" height="88" style="display:block;width:88px;height:88px;border-radius:50%;border:2px solid ${BRAND_TEAL};object-fit:cover;margin:0 auto;" />
              </a>
              <!--<![endif]-->
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:4px;">
              <div style="font-size:22px;font-weight:700;color:${BRAND_WHITE};letter-spacing:-0.3px;line-height:1.2;">
                ${esc(title)}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:12px;">
              <div style="font-size:12px;color:${BRAND_TEAL};text-transform:uppercase;letter-spacing:2px;font-weight:500;">
                Cybersecurity Professional &bull; Penetration Tester
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:4px;">
              <div style="font-size:13px;color:${BRAND_GRAY};line-height:1.5;max-width:400px;margin:0 auto;">
                Offensive security specialist with expertise in vulnerability assessment, 
                red team operations, and security engineering. Based in Juba, South Sudan.
              </div>
            </td>
          </tr>
          ${subtitle ? `
          <tr>
            <td align="center" style="padding-top:16px;">
              <div style="display:inline-block;background:rgba(13,148,136,0.12);border:1px solid rgba(13,148,136,0.25);border-radius:6px;padding:8px 20px;">
                <span style="font-size:16px;font-weight:600;color:${BRAND_WHITE};">${esc(subtitle)}</span>
              </div>
            </td>
          </tr>` : ""}
        </table>
      </td>
    </tr>
    <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND_DARK2},${BRAND_TEAL},${BRAND_GREEN},${BRAND_DARK2});"></td></tr>`;
}

// ─── Plain header (no portrait — for admin/internal) ──────

export function header(title: string): string {
  return `
    <tr>
      <td style="padding:0;background:linear-gradient(135deg,#0d1b2a,${BRAND_TEAL});">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:28px 32px;text-align:center;">
              <div style="font-size:13px;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:2px;font-weight:500;margin-bottom:4px;">mabioragau.com</div>
              <div style="font-size:24px;font-weight:700;color:${BRAND_WHITE};letter-spacing:-0.3px;line-height:1.2;">
                ${esc(title)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND_TEAL},${BRAND_GREEN});"></td></tr>`;
}

// ─── Content section ───────────────────────────────────────

export function content(...blocks: string[]): string {
  return blocks
    .filter(Boolean)
    .map(
      (b) => `
    <tr>
      <td style="padding:0 28px 20px;">
        ${b}
      </td>
    </tr>`
    )
    .join("\n");
}

// ─── Full-width content (no side padding) ─────────────────

export function contentFull(...blocks: string[]): string {
  return blocks
    .filter(Boolean)
    .map(
      (b) => `
    <tr>
      <td style="padding:0 0 16px;">
        ${b}
      </td>
    </tr>`
    )
    .join("\n");
}

// ─── Text block ────────────────────────────────────────────

export function text(content: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.75;color:#cbd5e1;">${content}</p>`;
}

// ─── Card / highlight box ──────────────────────────────────

export function card(label: string, body: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_CARD};border-radius:8px;border-left:3px solid ${BRAND_TEAL};margin-bottom:14px;">
      <tr>
        <td style="padding:14px 18px;">
          <div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:${BRAND_TEAL};margin-bottom:6px;">${esc(label)}</div>
          <div style="font-size:13.5px;line-height:1.6;color:#e2e8f0;word-break:break-word;">${body}</div>
        </td>
      </tr>
    </table>`;
}

// ─── Message bubble (for quotes / messages) ────────────────

export function messageBubble(content: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_CARD};border-radius:8px;border:1px solid ${BRAND_BORDER};margin-bottom:14px;">
      <tr>
        <td style="padding:16px 20px;">
          <div style="font-size:13.5px;line-height:1.7;color:#e2e8f0;font-style:italic;">${content}</div>
        </td>
      </tr>
    </table>`;
}

// ─── Divider ───────────────────────────────────────────────

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${BRAND_BORDER};margin:0 0 18px;" />`;
}

// ─── Spacer ────────────────────────────────────────────────

export function spacer(height: number): string {
  return `<div style="height:${height}px;line-height:${height}px;">&nbsp;</div>`;
}

// ─── CTA Button ────────────────────────────────────────────

export function ctaButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px auto 6px;">
      <tr>
        <td style="border-radius:8px;padding:0;">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(url)}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="16%" strokecolor="${BRAND_TEAL}" fillcolor="${BRAND_TEAL}"><w:anchorlock/><center style="color:#ffffff;font-size:14px;font-weight:600;">${esc(label)}</center></v:roundrect><![endif]-->
          <!--[if !mso]><!--><a href="${esc(url)}" style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;background:linear-gradient(135deg,${BRAND_TEAL},#0891b2);">${esc(label)}</a><!--<![endif]-->
        </td>
      </tr>
    </table>`;
}

// ─── Social links row ──────────────────────────────────────

export function socialLinks(): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px auto 0;">
      <tr>
        <td style="padding:0 6px;">
          <a href="https://github.com/mabiorssd" style="text-decoration:none;">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="GitHub" width="18" height="18" style="display:block;width:18px;height:18px;filter:brightness(0.6);" />
          </a>
        </td>
        <td style="padding:0 6px;">
          <a href="https://www.linkedin.com/in/mabior-agau-436825210/" style="text-decoration:none;">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="LinkedIn" width="18" height="18" style="display:block;width:18px;height:18px;filter:brightness(0.6);" />
          </a>
        </td>
        <td style="padding:0 6px;">
          <a href="https://x.com/_CyberMaster" style="text-decoration:none;">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" width="18" height="18" style="display:block;width:18px;height:18px;filter:brightness(0.6);" />
          </a>
        </td>
        <td style="padding:0 6px;">
          <a href="mailto:info@mabioragau.com" style="text-decoration:none;">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Email" width="18" height="18" style="display:block;width:18px;height:18px;filter:brightness(0.6);" />
          </a>
        </td>
      </tr>
    </table>`;
}

// ─── Footer ────────────────────────────────────────────────

export function footer(unsubscribeUrl?: string): string {
  return `
    <tr>
      <td style="padding:0;background:#080c14;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="height:1px;background:${BRAND_BORDER};"></td></tr>
          <tr>
            <td style="padding:24px 28px 20px;text-align:center;">
              <div style="font-size:14px;font-weight:600;color:${BRAND_WHITE};letter-spacing:-0.2px;margin-bottom:2px;">
                Mabior Agau
              </div>
              <div style="font-size:11px;color:${BRAND_MUTED};margin-bottom:10px;text-transform:uppercase;letter-spacing:1.5px;">
                Offensive Security &bull; South Sudan
              </div>
              ${socialLinks()}
              <div style="font-size:11px;color:#334155;line-height:1.6;margin-top:14px;">
                Juba, South Sudan<br/>
                <a href="https://mabioragau.com" style="color:${BRAND_TEAL};text-decoration:none;">mabioragau.com</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:info@mabioragau.com" style="color:${BRAND_TEAL};text-decoration:none;">info@mabioragau.com</a>
              </div>
              <div style="font-size:10px;color:#1e293b;margin-top:12px;">
                &copy; ${new Date().getFullYear()} Mabior Agau. All rights reserved.
              </div>
              ${unsubscribeUrl ? `<div style="margin-top:8px;"><a href="${esc(unsubscribeUrl)}" style="color:#334155;font-size:10px;text-decoration:underline;">Unsubscribe</a></div>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}
