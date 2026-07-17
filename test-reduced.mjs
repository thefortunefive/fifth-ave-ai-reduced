#!/usr/bin/env node
/** test-reduced.mjs — reduced-launch content verification across all routes.
 *  Usage: node test-reduced.mjs <baseURL> <engine> <width> <height> */
import { chromium, webkit } from '@playwright/test';

const [baseURL, engineName, widthS, heightS] = process.argv.slice(2);
const width = parseInt(widthS, 10);
const height = parseInt(heightS, 10);
const engine = engineName === 'webkit' ? webkit : chromium;
const isMobile = Math.min(width, height) <= 600;

const ROUTES = ['/', '/services', '/ai-tools', '/ai-career-defense', '/about', '/contact'];
const BANNED = /FLOOR\s*0?2|Second Floor|2nd Floor|filmmaker|Run like a studio|premium brand|\$25,000|3 clients per quarter|three clients|Listing Intelligence|Content Systems|Email Assistant|Coming Soon|IMAGE PLACEHOLDER|Portrait 400|Seattle, WA|Atlanta|Philadelphia|Executive Program|Premium Consulting|enterprise transformation/i;

const browser = await engine.launch();
const context = await browser.newContext({
  viewport: { width, height }, screen: { width, height },
  isMobile, hasTouch: isMobile, deviceScaleFactor: isMobile ? 3 : 1,
});
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

const results = [];
for (const route of ROUTES) {
  await page.goto(baseURL + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1200);
  const r = await page.evaluate((banned) => {
    const bodyText = document.body.innerText;
    const re = new RegExp(banned.source, banned.flags);
    const m = bodyText.match(re);
    return {
      title: document.title,
      h1: document.querySelector('h1') ? document.querySelector('h1').innerText.replace(/\n/g, ' ') : null,
      bannedHit: m ? m[0] : null,
      horizOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      navLabels: [...document.querySelectorAll('nav a')].map((a) => a.innerText.trim()).filter(Boolean),
    };
  }, { source: BANNED.source, flags: BANNED.flags });
  r.route = route;
  results.push(r);
}

// Homepage structure check
await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
const home = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('main > section, main section[id]')].map(
    (s) => s.getAttribute('aria-label') || s.id || '(unnamed)'
  );
  const dir = document.getElementById('web-design');
  return {
    sections: [...new Set(sections)],
    directoryRows: dir ? [...dir.querySelectorAll('a')].map((a) => a.innerText.replace(/\n|→/g, ' ').trim()) : null,
  };
});

console.log(JSON.stringify({ engine: engineName, viewport: `${width}x${height}`, results, home, errors }, null, 2));
await browser.close();
