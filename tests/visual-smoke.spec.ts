import { test, expect, Page } from '@playwright/test';

function isMobile(page: Page): boolean {
  return (page.viewportSize()?.width ?? 1440) < 768;
}

// ─── Stylesheet delivery ────────────────────────────────────────

test.describe('Stylesheet delivery', () => {
  test('page loads at least one CSS stylesheet with status 200', async ({ page }) => {
    const cssResponses: { url: string; status: number }[] = [];
    page.on('response', (res) => {
      const ct = res.headers()['content-type'] || '';
      if (ct.includes('text/css') || res.url().endsWith('.css')) {
        cssResponses.push({ url: res.url(), status: res.status() });
      }
    });
    await page.goto('/');
    expect(cssResponses.length).toBeGreaterThan(0);
    for (const css of cssResponses) {
      expect(css.status).toBe(200);
    }
  });
});

// ─── Visual smoke — body and background ─────────────────────────

test.describe('Visual smoke — rendering', () => {
  test('body background is dark, not white', async ({ page }) => {
    await page.goto('/');
    const bg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    // #0A0A0A = rgb(10, 10, 10) — must NOT be white/transparent
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('rgb(255, 255, 255)');
    // Confirm it's dark (R+G+B < 100)
    const match = bg.match(/\d+/g);
    expect(match).not.toBeNull();
    const [r, g, b] = match!.map(Number);
    expect(r + g + b).toBeLessThan(100);
  });

  test('body uses custom font, not browser default', async ({ page }) => {
    await page.goto('/');
    const fontFamily = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });
    // Browser defaults are Times New Roman, serif, or empty
    expect(fontFamily).not.toContain('Times New Roman');
    expect(fontFamily.length).toBeGreaterThan(0);
    // Should contain Inter or system-ui from our config
    const hasCustomFont = /inter|system-ui|sans-serif/i.test(fontFamily);
    expect(hasCustomFont).toBe(true);
  });

  test('nav is position fixed', async ({ page }) => {
    await page.goto('/');
    const position = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav ? getComputedStyle(nav).position : null;
    });
    expect(position).toBe('fixed');
  });

  test('nav has z-index above content', async ({ page }) => {
    await page.goto('/');
    const zIndex = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav ? getComputedStyle(nav).zIndex : null;
    });
    expect(zIndex).not.toBeNull();
    expect(Number(zIndex)).toBeGreaterThanOrEqual(60);
  });
});

// ─── Responsive class application ──────────────────────────────

test.describe('Responsive classes applied', () => {
  test('desktop nav links visible at desktop width', async ({ page }) => {
    test.skip(isMobile(page), 'Only applies to desktop/tablet viewports');
    await page.goto('/');
    const desktopLinks = page.locator('nav').locator('.hidden.md\\:flex, [class*="hidden"][class*="md:flex"]');
    // The container with desktop links should exist and be visible
    const count = await desktopLinks.count();
    if (count > 0) {
      const display = await desktopLinks.first().evaluate((el) => {
        return getComputedStyle(el).display;
      });
      expect(display).toBe('flex');
    } else {
      // Fallback: at least one nav link should be visible
      const navLink = page.locator('nav').getByRole('link', { name: 'Services', exact: true });
      await expect(navLink).toBeVisible();
    }
  });

  test('hamburger visible on mobile, hidden on desktop', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByLabel(/open menu/i);
    if (isMobile(page)) {
      await expect(hamburger).toBeVisible();
    } else {
      await expect(hamburger).toBeHidden();
    }
  });

  test('desktop and mobile nav are NOT both visible simultaneously', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByLabel(/open menu/i);
    const desktopServicesLink = page.locator('nav').getByRole('link', { name: 'Services', exact: true });

    const hamburgerVisible = await hamburger.isVisible();
    const desktopLinkVisible = await desktopServicesLink.isVisible();

    // At any given width, exactly one nav mode should be visible
    expect(hamburgerVisible !== desktopLinkVisible).toBe(true);
  });
});

// ─── Gold branding presence ─────────────────────────────────────

test.describe('Brand elements present', () => {
  test('page contains the brand name "Fifth Ave AI"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Fifth Ave AI').first()).toBeVisible();
  });

  test('hero heading uses display font (Playfair)', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    const fontFamily = await heading.evaluate((el) => {
      return getComputedStyle(el).fontFamily;
    });
    const hasDisplayFont = /playfair|georgia|serif/i.test(fontFamily);
    expect(hasDisplayFont).toBe(true);
  });
});

// ─── Oversized element guards ───────────────────────────────────

test.describe('No oversized elements', () => {
  const ALL_ROUTES = ['/', '/services', '/ai-tools', '/work', '/ai-career-defense', '/about', '/contact'];

  for (const route of ALL_ROUTES) {
    test(`${route} — no SVG exceeds 40% of viewport`, async ({ page }) => {
      await page.goto(route);
      const oversized = await page.evaluate(() => {
        const results: { tag: string; w: number; h: number; parent: string }[] = [];
        document.querySelectorAll('svg').forEach((svg) => {
          const r = svg.getBoundingClientRect();
          if (r.width > window.innerWidth * 0.4 || r.height > window.innerHeight * 0.4) {
            results.push({
              tag: svg.tagName,
              w: Math.round(r.width),
              h: Math.round(r.height),
              parent: (svg.parentElement?.className || '').substring(0, 60),
            });
          }
        });
        return results;
      });
      expect(oversized).toEqual([]);
    });

    test(`${route} — no horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test(`${route} — CSS rules loaded (Tailwind active)`, async ({ page }) => {
      await page.goto(route);
      const rules = await page.evaluate(() => {
        let total = 0;
        Array.from(document.styleSheets).forEach((s) => {
          try { total += s.cssRules?.length || 0; } catch (e) { /* cross-origin */ }
        });
        return total;
      });
      expect(rules).toBeGreaterThan(100);
    });
  }
});

// ─── Services page specific guards ──────────────────────────────

test.describe('Services page rendering', () => {
  test('Services heading is visible', async ({ page }) => {
    await page.goto('/services');
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('AI-Powered Solutions');
  });

  test('Services cards are visible', async ({ page }) => {
    await page.goto('/services');
    const cards = page.locator('.glass-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(6);
    await expect(cards.first()).toBeVisible();
  });

  test('no fixed/absolute element covers >50% of viewport', async ({ page }) => {
    await page.goto('/services');
    const covering = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const threshold = vw * vh * 0.5;
      const results: string[] = [];
      document.querySelectorAll('*').forEach((el) => {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' || s.position === 'absolute') {
          if (s.opacity === '0' || s.pointerEvents === 'none' || s.visibility === 'hidden' || s.display === 'none') return;
          if (el.getAttribute('aria-hidden') === 'true') return;
          const r = el.getBoundingClientRect();
          const area = r.width * r.height;
          if (area > threshold) {
            results.push(`${el.tagName}.${(el.className || '').substring(0, 40)} (${Math.round(r.width)}x${Math.round(r.height)})`);
          }
        }
      });
      return results;
    });
    expect(covering).toEqual([]);
  });
});
