#!/usr/bin/env node
/**
 * test-hero-v2.mjs â€” automated hero scrub verification against a served build.
 *
 * Usage: node test-hero-v2.mjs <baseURL> <engine> <width> <height> <label> [screenshotDir]
 *   engine: chromium | webkit
 *
 * Emulates the viewport (and phone-class screen for small viewports), drives
 * scroll through the hero runway at multiple positions, and reports
 * expected vs actual video time, active text beat, Floor 02 absence, and
 * console errors. Optionally saves screenshots at each position.
 */
import { chromium, webkit } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [baseURL, engineName, widthS, heightS, label, shotDir] = process.argv.slice(2);
const width = parseInt(widthS, 10);
const height = parseInt(heightS, 10);
const engine = engineName === 'webkit' ? webkit : chromium;
const isMobileViewport = Math.min(width, height) <= 600;

const POSITIONS = [0, 0.10, 0.25, 0.38, 0.50, 0.68, 0.75, 0.90, 1.0];

const run = async () => {
  const browser = await engine.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    // Phone-class emulation: make screen match viewport so isPhoneClass()
    // (min(screen.width, screen.height) <= 600) behaves as on a real phone.
    screen: { width, height },
    isMobile: isMobileViewport && engineName !== 'webkit' ? true : isMobileViewport && engineName === 'webkit' ? true : false,
    hasTouch: isMobileViewport,
    deviceScaleFactor: isMobileViewport ? 3 : 1,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

  await page.goto(baseURL + '/?debugHero=1', { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Wait for video metadata
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v && v.duration > 0 && isFinite(v.duration);
  }, { timeout: 30000 });

  const setup = await page.evaluate(() => {
    const v = document.querySelector('video');
    const hero = document.querySelector('section[aria-label="Intro"]');
    return {
      src: v.src.split('/').pop(),
      duration: v.duration,
      seekableEnd: v.seekable.length ? v.seekable.end(v.seekable.length - 1) : 0,
      heroHeight: hero.offsetHeight,
      runway: hero.offsetHeight - window.innerHeight,
      screenMin: Math.min(screen.width, screen.height),
      floor02: document.body.innerHTML.includes('FLOOR 02') || !!document.getElementById('web-design'),
      viewport: window.innerWidth + 'x' + window.innerHeight,
    };
  });

  // Mobile: prime the decoder with a real touch gesture
  if (isMobileViewport) {
    await page.touchscreen.tap(width / 2, height / 2);
    await page.waitForTimeout(400);
  }

  if (shotDir) mkdirSync(shotDir, { recursive: true });

  const results = [];
  for (const p of POSITIONS) {
    await page.evaluate((prog) => {
      const hero = document.querySelector('section[aria-label="Intro"]');
      const runway = hero.offsetHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(runway * prog), behavior: 'instant' });
    }, p);
    // Give RAF loop + seek time to settle (2 frames + seek latency)
    await page.waitForTimeout(900);
    const r = await page.evaluate((prog) => {
      const v = document.querySelector('video');
      const beats = [...document.querySelectorAll('section[aria-label="Intro"] .absolute.inset-0.flex')];
      const activeBeat = beats.findIndex((b) => parseFloat(b.style.opacity || '0') > 0.5);
      return {
        scrollY: window.scrollY,
        expected: +(prog * v.duration).toFixed(2),
        actual: +v.currentTime.toFixed(2),
        beat: activeBeat,
      };
    }, p);
    r.pos = Math.round(p * 100) + '%';
    r.diff = +(Math.abs(r.actual - Math.min(r.expected, setup.duration - 0.04))).toFixed(3);
    results.push(r);
    if (shotDir) {
      await page.screenshot({ path: `${shotDir}/${label}-${String(Math.round(p * 100)).padStart(3, '0')}.png` });
    }
  }

  // Reverse scroll test: jump back to 25% and verify rewind
  await page.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Intro"]');
    const runway = hero.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.round(runway * 0.25), behavior: 'instant' });
  });
  await page.waitForTimeout(900);
  const reverse = await page.evaluate(() => {
    const v = document.querySelector('video');
    return { expected: +(0.25 * v.duration).toFixed(2), actual: +v.currentTime.toFixed(2) };
  });

  // Release test: scroll past hero, confirm next section visible and header ok
  const release = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Intro"]');
    window.scrollTo({ top: hero.offsetHeight + 200, behavior: 'instant' });
    return new Promise((res) => setTimeout(() => {
      const main = document.querySelector('main');
      const afterHero = hero.nextElementSibling;
      const rect = afterHero ? afterHero.getBoundingClientRect() : null;
      res({
        nextSection: afterHero ? (afterHero.getAttribute('aria-label') || afterHero.id || afterHero.className.slice(0, 40)) : null,
        nextVisible: rect ? rect.top < window.innerHeight && rect.bottom > 0 : false,
      });
    }, 600));
  });
  if (shotDir) await page.screenshot({ path: `${shotDir}/${label}-release.png` });

  console.log(JSON.stringify({ label, setup, results, reverse, release, consoleErrors }, null, 2));
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
