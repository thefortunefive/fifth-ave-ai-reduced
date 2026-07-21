/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Validates the form submission, verifies the Turnstile token server-side,
 * and delivers the message via Resend. All secrets stay on the server.
 */

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
  /** Comma-separated list of allowed request hostnames */
  ALLOWED_HOSTNAMES: string;
}

interface EventContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (p: Promise<unknown>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

interface TurnstileResult {
  success: boolean;
  hostname?: string;
  action?: string;
  error_codes?: string[];
}


const VALID_INQUIRY_TYPES = new Set([
  'Hiring or Employment Opportunity',
  'Custom Website Project',
  'AI Avatar Advertising Project',
  'Collaboration',
  'Other / Not Sure',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_BODY_BYTES = 20_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function jsonResponse(data: Record<string, unknown>, status: number, extra?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

function allowedHostnames(env: Env): string[] {
  return (env.ALLOWED_HOSTNAMES ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);
}

function requestHostname(request: Request): string {
  const origin = request.headers.get('Origin') ?? '';
  const host = request.headers.get('Host') ?? '';
  try {
    return origin ? new URL(origin).hostname : host.split(':')[0];
  } catch {
    return host.split(':')[0];
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  // ── Origin check ────────────────────────────────────────────────────────────
  const hostname = requestHostname(request);
  const allowed = allowedHostnames(env);
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const noHostnameConfig = allowed.length === 0;

  if (!noHostnameConfig && !isLocalhost && !allowed.includes(hostname)) {
    return jsonResponse({ success: false, message: 'Forbidden.' }, 403);
  }

  // ── Content-Type ─────────────────────────────────────────────────────────────
  const ct = request.headers.get('Content-Type') ?? '';
  if (!ct.includes('application/json')) {
    return jsonResponse({ success: false, message: 'Please check the form and try again.' }, 400);
  }

  // ── Body size guard ──────────────────────────────────────────────────────────
  const clHeader = request.headers.get('Content-Length');
  if (clHeader && parseInt(clHeader, 10) > MAX_BODY_BYTES) {
    return jsonResponse({ success: false, message: 'Please check the form and try again.' }, 413);
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return jsonResponse({ success: false, message: 'Please check the form and try again.' }, 400);
  }

  if (rawText.length > MAX_BODY_BYTES) {
    return jsonResponse({ success: false, message: 'Please check the form and try again.' }, 413);
  }

  // ── Parse JSON ───────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    return jsonResponse({ success: false, message: 'Please check the form and try again.' }, 400);
  }

  // ── Honeypot ─────────────────────────────────────────────────────────────────
  // Return 403 per spec; a silent 200 would also be acceptable anti-bot practice.
  if (body['company']) {
    return jsonResponse({ success: false, message: 'Forbidden.' }, 403);
  }

  // ── Field extraction & validation ────────────────────────────────────────────
  const name         = typeof body['name']          === 'string' ? body['name'].trim()          : '';
  const email        = typeof body['email']         === 'string' ? body['email'].trim().toLowerCase() : '';
  const inquiryType  = typeof body['inquiryType']   === 'string' ? body['inquiryType'].trim()   : '';
  const message      = typeof body['message']       === 'string' ? body['message'].trim()       : '';
  const turnstileToken = typeof body['turnstileToken'] === 'string' ? body['turnstileToken'].trim() : '';

  const fieldErrors: string[] = [];
  if (name.length < 2 || name.length > 100)                fieldErrors.push('name');
  if (!EMAIL_RE.test(email) || email.length > 254)          fieldErrors.push('email');
  if (!VALID_INQUIRY_TYPES.has(inquiryType))                fieldErrors.push('inquiryType');
  if (message.length < 10 || message.length > 5_000)        fieldErrors.push('message');
  if (!turnstileToken)                                       fieldErrors.push('turnstileToken');

  if (fieldErrors.length > 0) {
    return jsonResponse({ success: false, message: 'Please check the form and try again.' }, 400);
  }

  // ── Turnstile server-side verification ───────────────────────────────────────
  const tsForm = new FormData();
  tsForm.append('secret', env.TURNSTILE_SECRET_KEY);
  tsForm.append('response', turnstileToken);
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) tsForm.append('remoteip', cfIp);

  let tsResult: TurnstileResult;
  try {
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: tsForm,
    });
    tsResult = await tsRes.json() as TurnstileResult;
  } catch {
    return jsonResponse(
      { success: false, message: 'Your message could not be sent right now. Please try again shortly.' },
      502,
    );
  }

  if (!tsResult.success) {
    return jsonResponse({ success: false, message: 'Verification failed. Please try again.' }, 403);
  }

  // Optional: validate Turnstile hostname against allowed list
  if (tsResult.hostname && allowed.length > 0 && !isLocalhost) {
    if (!allowed.includes(tsResult.hostname) && tsResult.hostname !== 'localhost') {
      return jsonResponse({ success: false, message: 'Verification failed. Please try again.' }, 403);
    }
  }

  // ── Build email ──────────────────────────────────────────────────────────────
  const safeName        = escapeHtml(name);
  const safeEmail       = escapeHtml(email);
  const safeInquiry     = escapeHtml(inquiryType);
  const safeMessage     = escapeHtml(message);
  const safeHostname    = escapeHtml(hostname);
  const timestamp       = new Date().toUTCString();

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>New Inquiry — Fifth Ave AI</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;max-width:600px;width:100%">
  <tr><td style="background:#111;padding:24px 32px">
    <p style="margin:0;color:#c9a46a;font-size:13px;letter-spacing:0.2em;text-transform:uppercase">Fifth Ave AI</p>
    <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600">New Inquiry</h1>
  </td></tr>
  <tr><td style="padding:32px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:130px;vertical-align:top">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#222;font-size:14px">${safeName}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#222;font-size:14px">${safeEmail}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;vertical-align:top">Inquiry Type</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#222;font-size:14px">${safeInquiry}</td></tr>
    </table>
    <h2 style="margin:28px 0 12px;color:#222;font-size:15px;font-weight:600">Message</h2>
    <div style="background:#f8f8f8;border-radius:4px;padding:20px;color:#333;font-size:14px;line-height:1.7;white-space:pre-wrap">${safeMessage}</div>
  </td></tr>
  <tr><td style="padding:20px 32px;border-top:1px solid #eee;background:#fafafa">
    <p style="margin:0;color:#aaa;font-size:11px;line-height:1.8">
      Submitted: ${timestamp}<br>
      Origin: ${safeHostname}<br>
      Source: fifthaveai.com contact form
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const textBody = [
    'New Fifth Ave AI Inquiry',
    '─'.repeat(40),
    `Name:         ${name}`,
    `Email:        ${email}`,
    `Inquiry Type: ${inquiryType}`,
    '',
    'Message:',
    message,
    '',
    '─'.repeat(40),
    `Submitted: ${timestamp}`,
    `Origin: ${hostname}`,
    'Source: fifthaveai.com contact form',
  ].join('\n');

  // ── Send via Resend ──────────────────────────────────────────────────────────
  let resendRes: Response;
  try {
    resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `New Fifth Ave AI Inquiry — ${inquiryType}`,
        html: htmlBody,
        text: textBody,
      }),
    });
  } catch {
    return jsonResponse(
      { success: false, message: 'Your message could not be sent right now. Please try again shortly.' },
      502,
    );
  }

  if (!resendRes.ok) {
    return jsonResponse(
      { success: false, message: 'Your message could not be sent right now. Please try again shortly.' },
      502,
    );
  }

  return jsonResponse({ success: true, message: 'Your message has been sent.' }, 200);
}
