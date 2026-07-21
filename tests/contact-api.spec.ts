/**
 * Contact API — integration tests
 *
 * These tests run against a live `wrangler pages dev out` instance.
 *
 * Prerequisites:
 *   1. Build the site:  npm run build
 *   2. Create .dev.vars with:
 *        TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA   ← Cloudflare test secret
 *        RESEND_API_KEY=re_placeholder_replace_before_deploying
 *        CONTACT_TO_EMAIL=shane@fifthaveai.com
 *        CONTACT_FROM_EMAIL=Fifth Ave AI Website <website@send.fifthaveai.com>
 *        ALLOWED_HOSTNAMES=fifthaveai.com,www.fifthaveai.com,fifthaveai.pages.dev
 *   3. In a separate terminal: npx wrangler pages dev out --port=8788
 *   4. Run: CONTACT_BASE_URL=http://localhost:8788 npx playwright test tests/contact-api.spec.ts
 *
 * The Cloudflare test Turnstile SECRET (1x000...AA) always returns success:true
 * from siteverify, so validation-passing tests go through Turnstile cleanly.
 * Resend will reject the placeholder API key with 4xx, causing those tests to
 * verify the 502 error path — not a real email send.
 *
 * A real end-to-end delivery test (test #1 passing) requires:
 *   - A real RESEND_API_KEY in .dev.vars
 *   - The sending domain send.fifthaveai.com verified in Resend
 */

import { test, expect, APIRequestContext } from '@playwright/test';

const BASE = process.env['CONTACT_BASE_URL'] ?? 'http://localhost:8788';
const ENDPOINT = `${BASE}/api/contact`;

// Cloudflare Turnstile test token — accepted by the test secret key
const TEST_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX';

// A minimal valid body that passes all server-side validation
const VALID_BODY = {
  name: 'Test User',
  email: 'test@example.com',
  inquiryType: 'Other / Not Sure',
  message: 'This is a test message long enough to pass validation.',
  turnstileToken: TEST_TOKEN,
  company: '',
};

async function post(req: APIRequestContext, body: Record<string, unknown>) {
  return req.post(ENDPOINT, {
    headers: { 'Content-Type': 'application/json' },
    data: body,
  });
}

// ─── Method guard ────────────────────────────────────────────────────────────

test('GET /api/contact returns 405 with Allow: POST header', async ({ request }) => {
  const res = await request.get(ENDPOINT);
  expect(res.status()).toBe(405);
  expect(res.headers()['allow']).toContain('POST');
  const json = await res.json() as { success: boolean };
  expect(json.success).toBe(false);
});

// ─── Validation — these all fail before reaching Turnstile or Resend ─────────

test('POST missing name returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, name: '' });
  expect(res.status()).toBe(400);
  const json = await res.json() as { success: boolean };
  expect(json.success).toBe(false);
});

test('POST name too short (1 char) returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, name: 'A' });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST name too long (>100 chars) returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, name: 'A'.repeat(101) });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST invalid email returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, email: 'not-an-email' });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST email without TLD returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, email: 'user@nodot' });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST invalid inquiry type returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, inquiryType: 'Hacking' });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST message too short (<10 chars) returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, message: 'Short' });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST message too long (>5000 chars) returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, message: 'A'.repeat(5001) });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

test('POST missing turnstile token returns 400', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, turnstileToken: '' });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

// ─── Honeypot ─────────────────────────────────────────────────────────────────

test('POST with honeypot field populated returns 403', async ({ request }) => {
  const res = await post(request, { ...VALID_BODY, company: 'spam@bot.io' });
  expect(res.status()).toBe(403);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

// ─── Turnstile verification (requires wrangler pages dev with test secret) ───

test('POST with invalid Turnstile token returns 403', async ({ request }) => {
  // Any non-empty string that is NOT a valid token will be rejected by siteverify.
  // With the Cloudflare test SECRET key, only the specific test token passes.
  // A random string should fail.
  const res = await post(request, { ...VALID_BODY, turnstileToken: 'invalid-token-xyz' });
  // With the real test secret this may return 403; with a placeholder secret it may return 502.
  // Either is acceptable — the form must not succeed.
  expect([403, 502]).toContain(res.status());
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

// ─── Non-JSON body ────────────────────────────────────────────────────────────

test('POST with wrong Content-Type returns 400', async ({ request }) => {
  const res = await request.post(ENDPOINT, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: 'name=Test&email=t@t.com',
  });
  expect(res.status()).toBe(400);
  expect((await res.json() as { success: boolean }).success).toBe(false);
});

// ─── All valid fields + test Turnstile → hits Resend ─────────────────────────
// With a placeholder Resend key this returns 502; with a real key it returns 200.

test('POST valid body returns 200 or 502 (502 expected without real Resend key)', async ({ request }) => {
  const res = await post(request, VALID_BODY);
  const json = await res.json() as { success: boolean; message: string };

  if (res.status() === 200) {
    // Real key present — full success
    expect(json.success).toBe(true);
    expect(json.message).toBe('Your message has been sent.');
  } else {
    // Placeholder key — Resend rejected the request
    expect(res.status()).toBe(502);
    expect(json.success).toBe(false);
  }
});

// ─── All five valid inquiry types ─────────────────────────────────────────────

const INQUIRY_TYPES = [
  'Hiring or Employment Opportunity',
  'Custom Website Project',
  'AI Avatar Advertising Project',
  'Collaboration',
  'Other / Not Sure',
];

for (const inquiryType of INQUIRY_TYPES) {
  test(`POST accepts inquiry type: "${inquiryType}"`, async ({ request }) => {
    const res = await post(request, { ...VALID_BODY, inquiryType });
    // 200 with real Resend key, 502 with placeholder — both mean validation passed
    expect([200, 502]).toContain(res.status());
  });
}
