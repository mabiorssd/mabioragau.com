/**
 * Professional email templates for mabioragau.com
 * Dark/tech aesthetic with teal + cyber-green accents
 * Email-client-safe: tables, inline styles, no <style> blocks
 */

const BRAND_TEAL = "#0d9488";
const BRAND_GREEN = "#00ff88";
const BRAND_DARK = "#0a0e17";
const BRAND_DARK2 = "#111827";
const BRAND_WHITE = "#f8fafc";
const BRAND_GRAY = "#94a3b8";
const BRAND_URL = "https://mabioragau.com";

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ─── Layout shell ─────────────────────────────────────────

export function shell({
  previewText,
  bodyContent,
}: {
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
    ${previewText ? `<!--[if !mso]><!--><meta http-equiv="x-dns-prefetch-control" content="off" /><!--<![endif]-->` : ""}
    ${previewText ? `<style>@media all{body{visibility:visible!important}}</style>` : ""}
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND_DARK};font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;">
    ${previewText ? `<!--[if !mso]><!--><div style="display:none;font-size:1px;color:${BRAND_DARK};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(previewText)}</div><!--<![endif]-->` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_DARK};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
          <table role="presentation" width="100%" style="max-width:600px;background-color:${BRAND_DARK2};border-radius:12px;overflow:hidden;border:1px solid #1e293b;">
            ${bodyContent}
          </table>
          <!--[if mso]></td></tr></table><![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ─── Header ────────────────────────────────────────────────

export function header(title: string, subtitle?: string): string {
  return `
    <tr>
      <td style="padding:0;background:linear-gradient(135deg,${BRAND_TEAL},#0891b2);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;">
              <div style="font-size:28px;line-height:1.2;font-weight:700;color:${BRAND_WHITE};letter-spacing:-0.5px;">
                ${esc(title)}
              </div>
              ${subtitle ? `<div style="margin-top:8px;font-size:14px;line-height:1.4;color:rgba(255,255,255,0.8);">${esc(subtitle)}</div>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td style="height:4px;background:${BRAND_GREEN};"></td></tr>`;
}

// ─── Content section ───────────────────────────────────────

export function content(...blocks: string[]): string {
  return blocks
    .map(
      (b) => `
    <tr>
      <td style="padding:0 32px 24px;">
        ${b}
      </td>
    </tr>`
    )
    .join("\n");
}

// ─── Text block ────────────────────────────────────────────

export function text(content: string): string {
  return `<p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#cbd5e1;">${content}</p>`;
}

// ─── Card / highlight box ──────────────────────────────────

export function card(label: string, body: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1f2e;border-radius:8px;border-left:3px solid ${BRAND_TEAL};margin-bottom:16px;">
      <tr>
        <td style="padding:16px 20px;">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:${BRAND_TEAL};margin-bottom:6px;">${esc(label)}</div>
          <div style="font-size:14px;line-height:1.6;color:#e2e8f0;word-break:break-word;">${body}</div>
        </td>
      </tr>
    </table>`;
}

// ─── Divider ───────────────────────────────────────────────

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid #1e293b;margin:0 0 20px;" />`;
}

// ─── CTA Button ────────────────────────────────────────────

export function ctaButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto 8px;">
      <tr>
        <td style="border-radius:8px;background:linear-gradient(135deg,${BRAND_TEAL},#0891b2);padding:0;">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(url)}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="16%" strokecolor="${BRAND_TEAL}" fillcolor="${BRAND_TEAL}"><w:anchorlock/><center style="color:${BRAND_WHITE};font-size:15px;font-weight:600;">${esc(label)}</center></v:roundrect><![endif]-->
          <!--[if !mso]><!--><a href="${esc(url)}" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:${BRAND_WHITE};text-decoration:none;border-radius:8px;background:linear-gradient(135deg,${BRAND_TEAL},#0891b2);">${esc(label)}</a><!--<![endif]-->
        </td>
      </tr>
    </table>`;
}

// ─── Footer ────────────────────────────────────────────────

export function footer(unsubscribeUrl?: string): string {
  return `
    <tr>
      <td style="padding:0;background:#0f1520;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="height:1px;background:#1e293b;"></td></tr>
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:${BRAND_WHITE};letter-spacing:-0.3px;margin-bottom:4px;">
                Mabior Agau
              </div>
              <div style="font-size:12px;color:${BRAND_GRAY};margin-bottom:12px;text-transform:uppercase;letter-spacing:2px;">
                Cybersecurity Professional
              </div>
              <div style="margin:12px 0;">
                <a href="${BRAND_URL}" style="color:${BRAND_TEAL};font-size:13px;text-decoration:none;margin:0 8px;">Website</a>
                <span style="color:#334155;">·</span>
                <a href="https://github.com/mabiorssd" style="color:${BRAND_TEAL};font-size:13px;text-decoration:none;margin:0 8px;">GitHub</a>
                <span style="color:#334155;">·</span>
                <a href="https://www.linkedin.com/in/mabior-agau-436825210/" style="color:${BRAND_TEAL};font-size:13px;text-decoration:none;margin:0 8px;">LinkedIn</a>
                <span style="color:#334155;">·</span>
                <a href="https://x.com/_CyberMaster" style="color:${BRAND_TEAL};font-size:13px;text-decoration:none;margin:0 8px;">X</a>
              </div>
              <div style="font-size:11px;color:#475569;line-height:1.5;margin-top:8px;">
                Juba, South Sudan<br/>
                &copy; ${new Date().getFullYear()} Mabior Agau. All rights reserved.
              </div>
              ${unsubscribeUrl ? `<div style="margin-top:8px;"><a href="${esc(unsubscribeUrl)}" style="color:#475569;font-size:11px;text-decoration:underline;">Unsubscribe</a></div>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}
