#!/usr/bin/env node
/** test-idle-menu.mjs — verifies the cloud idle loop + restored directory menu.
 *  Usage: node test-idle-menu.mjs <baseURL> <engine> <width> <height> [shotDir] [label] */
import { chromium, webkit } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [baseURL, engineName, widthS, heightS, shotDir, label] = process.argv.slice(2);
const width = parseInt(widthS, 10);
const height = parseInt(heightS, 10);
const engine = engineName === 'webkit' ? webkit : chromium;
const isMobile = Math.min(width, height) <= 600;

const browser = await engine.launch();
const context = await browser.newContext({
  viewport: { width, height }, screen: { width, height },
  isMobile, hasTouch: isMobile, deviceScaleFactor: isMobile ? 3 : 1,
});
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForFunction(() => {
  const vids = document.querySelectorAll('video');
  return vids.length >= 2 && vids[1].duration > 0;
}, { timeout: 30000 });
if (isMobile) { await page.touchscreen.tap(width / 2, height / 2); await page.waitForTimeout(300); }
if (shotDir) mkdirSync(shotDir, { recursive: true });

const t0 = await page.evaluate(() => document.querySelectorAll('video')[1].currentTime);
await page.waitForTimeout(1500);
const idle = await page.evaluate((t0v) => {
  const idleEl = document.querySelectorAll('video')[1];
  return { src: idleEl.src.split('/').pop(), duration: +idleEl.duration.toFixed(2),
    advancing: idleEl.currentTime !== t0v, playing: !idleEl.paused, loop: idleEl.loop,
    opacity: getComputedStyle(idleEl).opacity };
}, t0);
if (shotDir) await page.screenshot({ path: `${shotDir}/${label}-idle-rest.png` });

await page.waitForTimeout(idle.duration * 1000 + 500);
const wrapped = await page.evaluate(() => {
  const idleEl = document.querySelectorAll('video')[1];
  return { stillPlaying: !idleEl.paused, currentTime: +idleEl.currentTime.toFixed(2) };
});

await page.evaluate(() => {
  const hero = document.querySelector('section[aria-label="Intro"]');
  window.scrollTo({ top: Math.round((hero.offsetHeight - innerHeight) * 0.3), behavior: 'instant' });
});
await page.waitForTimeout(1300);
const scrubbing = await page.evaluate(() => {
  const [scrubEl, idleEl] = document.querySelectorAll('video');
  const hero = document.querySelector('section[aria-label="Intro"]');
  const runway = hero.offsetHeight - innerHeight;
  return { idleOpacity: idleEl.style.opacity, idlePaused: idleEl.paused,
    scrubTime: +scrubEl.currentTime.toFixed(2),
    expected: +((window.scrollY / runway) * scrubEl.duration).toFixed(2) };
});
if (shotDir) await page.screenshot({ path: `${shotDir}/${label}-scrub-30.png` });

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(1200);
const backTop = await page.evaluate(() => {
  const idleEl = document.querySelectorAll('video')[1];
  return { idleOpacity: idleEl.style.opacity, idlePlaying: !idleEl.paused };
});

const menu = await page.evaluate(() => {
  const hero = document.querySelector('section[aria-label="Intro"]');
  window.scrollTo({ top: hero.offsetHeight - 100, behavior: 'instant' });
  return new Promise((res) => setTimeout(() => {
    const sec = document.getElementById('web-design');
    const rows = sec ? [...sec.querySelectorAll('a')] : [];
    res({ menuExists: !!sec, ariaLabel: sec ? sec.getAttribute('aria-label') : null,
      headline: sec ? (sec.querySelector('h2') || {}).innerText : null,
      rowCount: rows.length,
      floorWording: /FLOOR\s*0?2|Second Floor|2nd Floor/i.test(document.body.innerText),
      gapAfterHero: sec ? Math.round(sec.getBoundingClientRect().top) : null });
  }, 800));
});
if (shotDir) await page.screenshot({ path: `${shotDir}/${label}-menu.png` });

console.log(JSON.stringify({ label, idle, wrapped, scrubbing, backTop, menu, errors }, null, 2));
await browser.close();
