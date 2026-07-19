#!/usr/bin/env node
/** test-linkedin.mjs — verifies portfolio video embeds + repositioned copy.
 *  Usage: node test-linkedin.mjs <baseURL> <engine> <width> <height> [shotDir] [label] */
import { chromium, webkit } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [baseURL, engineName, widthS, heightS, shotDir, label] = process.argv.slice(2);
const width = parseInt(widthS, 10);
const height = parseInt(heightS, 10);
const engine = engineName === 'webkit' ? webkit : chromium;
const isMobile = Math.min(width, height) <= 600;

const EXPECTED_VIDEOS = [
  { id: 'fy9i82qJ27s', title: 'Portfolio Overview' },
  { id: '3ei472Ym8vU', title: 'Avatar Assistant Demo' },
  { id: '50MgpHl38n8', title: 'Custom Content Creation Demo' },
];

const browser = await engine.launch();
const context = await browser.newContext({
  viewport: { width, height }, screen: { width, height },
  isMobile, hasTouch: isMobile, deviceScaleFactor: isMobile ? 3 : 1,
});
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
if (shotDir) mkdirSync(shotDir, { recursive: true });

// 1) HOMEPAGE: positioning copy + CTAs
await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1200);
const home = await page.evaluate(() => {
  const sec = document.getElementById('services-home');
  const text = sec ? sec.innerText : '';
  const links = sec ? [...sec.querySelectorAll('a')].map((a) => ({ label: a.innerText.trim(), href: a.getAttribute('href') })) : [];
  return {
    headline: text.includes('I build custom websites and AI avatar advertising for companies'),
    supporting: text.includes('visual storytelling'),
    viewMyWork: links.find((l) => l.label === 'View My Work')?.href,
    discussRole: links.find((l) => l.label === 'Discuss a Role or Project')?.href,
    cap1: text.includes('Custom Websites and Digital Experiences'),
    cap2: text.includes('AI Avatars and Advertising'),
    viewWebsiteWork: links.find((l) => l.label === 'View Website Work')?.href,
    viewAvatarWork: links.find((l) => l.label === 'View Avatar Work')?.href,
    horizOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
});
if (shotDir) {
  await page.evaluate(() => document.getElementById('services-home').scrollIntoView());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${shotDir}/${label}-home-positioning.png` });
}

// 2) PORTFOLIO: three embeds, 16:9, correct titles, no autoplay
await page.goto(baseURL + '/ai-tools', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2500);
const portfolio = await page.evaluate((expected) => {
  const iframes = [...document.querySelectorAll('iframe')];
  const bodyText = document.body.innerText;
  const results = expected.map((v) => {
    const frame = iframes.find((f) => f.src.includes(v.id));
    if (!frame) return { id: v.id, embedded: false };
    const r = frame.getBoundingClientRect ? frame.getBoundingClientRect() : null;
    const box = frame.parentElement.getBoundingClientRect();
    return {
      id: v.id,
      embedded: true,
      titleShown: bodyText.includes(v.title),
      autoplay: frame.src.includes('autoplay=1'),
      aspect: box.width > 0 ? +(box.width / box.height).toFixed(2) : null,
    };
  });
  return {
    videos: results,
    sectionHeading: bodyText.includes('AI Avatars & Advertising'),
    industriesLine: bodyText.includes('healthcare, legal services, retail'),
    horizOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
}, EXPECTED_VIDEOS);
if (shotDir) {
  await page.evaluate(() => document.getElementById('avatar-work').scrollIntoView());
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${shotDir}/${label}-portfolio-videos.png` });
}

// 3) CONTACT: selector options + button
await page.goto(baseURL + '/contact', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1200);
const contact = await page.evaluate(() => {
  const select = document.getElementById('projectType');
  const btn = [...document.querySelectorAll('button')].find((b) => b.type === 'submit');
  return {
    options: select ? [...select.options].map((o) => o.value) : null,
    button: btn ? btn.innerText.trim() : null,
    opening: document.body.innerText.includes('Contact me about a role, collaboration, or project'),
    horizOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  };
});
if (shotDir) await page.screenshot({ path: `${shotDir}/${label}-contact.png` });

// Filter benign third-party console noise (YouTube embed warnings) but keep real errors
const realErrors = errors.filter((e) => !/youtube|googlevideo|www-embed|ERR_BLOCKED_BY_CLIENT/i.test(e));

console.log(JSON.stringify({ label, home, portfolio, contact, consoleErrors: realErrors, allConsoleErrors: errors.length }, null, 2));
await browser.close();
