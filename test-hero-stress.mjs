#!/usr/bin/env node
/**
 * test-hero-stress.mjs — flick / stop-resume / landscape / rotation checks.
 * Usage: node test-hero-stress.mjs <baseURL> <engine> <width> <height>
 */
import { chromium, webkit } from '@playwright/test';

const [baseURL, engineName, widthS, heightS] = process.argv.slice(2);
const width = parseInt(widthS, 10);
const height = parseInt(heightS, 10);
const engine = engineName === 'webkit' ? webkit : chromium;

const run = async () => {
  const browser = await engine.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    screen: { width, height },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v && v.duration > 0;
  }, { timeout: 30000 });
  await page.touchscreen.tap(width / 2, height / 2);
  await page.waitForTimeout(400);

  const scrollToProg = (p) => page.evaluate((prog) => {
    const hero = document.querySelector('section[aria-label="Intro"]');
    const runway = hero.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.round(runway * prog), behavior: 'instant' });
  }, p);

  const read = () => page.evaluate(() => {
    const v = document.querySelector('video');
    const hero = document.querySelector('section[aria-label="Intro"]');
    const runway = hero.offsetHeight - window.innerHeight;
    return {
      progress: +(window.scrollY / runway).toFixed(3),
      expected: +((window.scrollY / runway) * v.duration).toFixed(2),
      actual: +v.currentTime.toFixed(2),
    };
  });

  // 1) FAST FLICK: 0 → 100% in 8 rapid jumps, no settle time between
  for (let i = 1; i <= 8; i++) { await scrollToProg(i / 8); await page.waitForTimeout(35); }
  await page.waitForTimeout(1400); // settle
  const flick = await read();
  flick.settled = Math.abs(flick.actual - Math.min(flick.expected, 42.16)) <= 0.15;

  // 2) STOP MIDWAY AND RESUME
  await scrollToProg(0.4);
  await page.waitForTimeout(1000);
  const mid = await read();
  await scrollToProg(0.8);
  await page.waitForTimeout(1000);
  const resumed = await read();

  // 3) REPEATED UP/DOWN
  for (const p of [0.6, 0.3, 0.7, 0.2, 0.5]) { await scrollToProg(p); await page.waitForTimeout(120); }
  await page.waitForTimeout(1200);
  const upDown = await read();

  // 4) ROTATE to landscape (width-change → ScrollTrigger.refresh) and verify
  await page.setViewportSize({ width: height, height: width });
  await page.waitForTimeout(800);
  await scrollToProg(0.5);
  await page.waitForTimeout(1000);
  const landscape = await read();

  // 5) ROTATE BACK
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(800);
  await scrollToProg(0.25);
  await page.waitForTimeout(1000);
  const portraitBack = await read();

  console.log(JSON.stringify({ flick, mid, resumed, upDown, landscape, portraitBack, errors }, null, 2));
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
