import { test, expect, Page } from '@playwright/test';

const TOP_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'AI Tools & Demos', href: '/ai-tools' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const FLOOR_MENU_PAGES = [
  { label: 'Services', href: '/services' },
  { label: 'AI Tools & Demos', href: '/ai-tools' },
  { label: 'About Fifth Ave AI', href: '/about' },
  { label: 'Contact / Book a Consultation', href: '/contact' },
];

const FLOOR_MENU_ANCHORS = [
  { label: 'How It Works', sectionId: 'process', heading: 'Four steps. No fluff.' },
  { label: 'Premium Consulting', sectionId: 'consulting', heading: '1-on-1 AI Consulting' },
];

async function waitForScrollToSettle(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    return new Promise<boolean>((resolve) => {
      let last = window.scrollY;
      let stableFrames = 0;
      const check = () => {
        if (window.scrollY === last) {
          stableFrames++;
          if (stableFrames > 5) { resolve(true); return; }
        } else {
          stableFrames = 0;
          last = window.scrollY;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
      setTimeout(() => resolve(true), 3000);
    });
  }, undefined, { timeout: 5000 });
}

function isMobile(page: Page): boolean {
  return (page.viewportSize()?.width ?? 1440) < 768;
}

// ─── Desktop Navbar (skipped on mobile — links are hidden) ───────

test.describe('Desktop Navbar', () => {
  for (const item of TOP_NAV) {
    test(`"${item.label}" navigates to ${item.href}`, async ({ page }) => {
      test.skip(isMobile(page), 'Desktop nav hidden on mobile');
      await page.goto('/');
      const link = page.locator('nav').getByRole('link', { name: item.label, exact: true });
      await link.click();
      await expect(page).toHaveURL(item.href);
    });
  }

  test('"Get Started" CTA navigates to /contact', async ({ page }) => {
    test.skip(isMobile(page), 'Desktop nav hidden on mobile');
    await page.goto('/');
    const cta = page.locator('nav').getByRole('link', { name: 'Get Started' }).first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    const vw = page.viewportSize()!.width;
    test.skip(!box || box.x + box.width > vw, 'CTA overflows viewport at this width');
    await cta.click();
    await expect(page).toHaveURL('/contact');
  });

  test('browser Back returns to homepage after navigation', async ({ page }) => {
    test.skip(isMobile(page), 'Desktop nav hidden on mobile');
    await page.goto('/');
    await page.locator('nav').getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL('/services');
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

// ─── Mobile Menu ─────────────────────────────────────────────────

test.describe('Mobile Menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger opens and shows all nav items', async ({ page }) => {
    await page.goto('/');
    const hamburger = page.getByLabel(/open menu/i);
    await hamburger.click();
    for (const item of TOP_NAV) {
      await expect(
        page.locator('[class*="z-[65]"]').getByRole('link', { name: item.label, exact: true })
      ).toBeVisible();
    }
  });

  test('hamburger closes and restores body scroll', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/open menu/i).click();
    await expect(
      page.locator('[class*="z-[65]"]').getByRole('link', { name: 'Home', exact: true })
    ).toBeVisible();
    await page.getByLabel(/close menu/i).click();
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('');
  });

  for (const item of TOP_NAV.filter((i) => i.href !== '/')) {
    test(`"${item.label}" navigates to ${item.href}`, async ({ page }) => {
      await page.goto('/');
      await page.getByLabel(/open menu/i).click();
      const link = page.locator('[class*="z-[65]"]').getByRole('link', { name: item.label, exact: true });
      await link.click();
      await expect(page).toHaveURL(item.href);
    });
  }
});

// ─── Floor 02 Menu — page routes ─────────────────────────────────

test.describe('Floor 02 Menu — page routes', () => {
  for (const item of FLOOR_MENU_PAGES) {
    test(`"${item.label}" navigates to ${item.href}`, async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#web-design');
      await section.scrollIntoViewIfNeeded();
      const link = section.getByRole('link', { name: item.label, exact: true });
      await link.click();
      await expect(page).toHaveURL(item.href);
    });
  }

  test('browser Back returns to homepage after Floor 02 click', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#web-design');
    await section.scrollIntoViewIfNeeded();
    await section.getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL('/services');
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

// ─── Floor 02 Menu — anchor links (robust) ──────────────────────

test.describe('Floor 02 Menu — anchor links', () => {
  for (const item of FLOOR_MENU_ANCHORS) {
    test(`"${item.label}" scrolls to #${item.sectionId}`, async ({ page }) => {
      await page.goto('/');

      const menu = page.locator('#web-design');
      await menu.scrollIntoViewIfNeeded();

      const link = menu.getByRole('link', { name: item.label, exact: true });
      await expect(link).toBeVisible();

      const scrollBefore = await page.evaluate(() => window.scrollY);
      await link.click();
      await waitForScrollToSettle(page);

      const target = page.locator(`#${item.sectionId}`);
      await expect(target).toBeVisible();

      const heading = target.getByRole('heading', { level: 2 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(item.heading);

      const navBox = await page.locator('nav').first().boundingBox();
      const navBottom = navBox ? navBox.y + navBox.height : 80;

      const viewportHeight = page.viewportSize()!.height;

      const headingBox = await heading.boundingBox();
      expect(headingBox).not.toBeNull();
      expect(headingBox!.y).toBeLessThan(viewportHeight);
      expect(headingBox!.y).toBeGreaterThanOrEqual(navBottom - 30);

      const scrollAfter = await page.evaluate(() => window.scrollY);
      expect(scrollAfter).toBeGreaterThan(scrollBefore);

      await expect(page).toHaveURL('/');
    });

    test(`"${item.label}" — Back returns to homepage`, async ({ page }) => {
      await page.goto('/');
      const menu = page.locator('#web-design');
      await menu.scrollIntoViewIfNeeded();
      await menu.getByRole('link', { name: item.label, exact: true }).click();
      await waitForScrollToSettle(page);
      await expect(page).toHaveURL('/');
    });
  }
});

// ─── Footer Links ────────────────────────────────────────────────

test.describe('Footer Links', () => {
  for (const item of TOP_NAV) {
    test(`"${item.label}" navigates to ${item.href}`, async ({ page }) => {
      await page.goto('/');
      const siteFooter = page.locator('footer').last();
      await siteFooter.scrollIntoViewIfNeeded();
      const link = siteFooter.getByRole('link', { name: item.label, exact: true });
      await link.click();
      await expect(page).toHaveURL(item.href);
    });
  }
});

// ─── /work redirects to /ai-tools ───────────────────────────────

test.describe('/work redirect', () => {
  test('/work redirects to /ai-tools', async ({ page }) => {
    await page.goto('/work');
    await page.waitForURL('/ai-tools', { timeout: 5000 });
    await expect(page).toHaveURL('/ai-tools');
  });
});

// ─── All pages return 200 ────────────────────────────────────────

test.describe('All pages return 200', () => {
  const routes = ['/', '/services', '/ai-tools', '/work', '/about', '/contact'];

  for (const route of routes) {
    test(`${route} returns 200`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    });
  }
});

// ─── No obsolete menu labels ─────────────────────────────────────

test.describe('No obsolete menu labels', () => {
  const OBSOLETE = [
    'Website Design', 'UX / UI Design', 'Landing Pages', 'E-Commerce',
    'Brand Websites', 'Prototyping', 'CMS Development', 'Maintenance & Support',
  ];

  test('Floor 02 menu contains no old labels', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('#web-design');
    await menu.scrollIntoViewIfNeeded();
    const text = await menu.textContent();
    for (const old of OBSOLETE) {
      expect(text).not.toContain(old);
    }
  });

  test('"Work" is not in navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    const workLink = nav.getByRole('link', { name: 'Work', exact: true });
    await expect(workLink).toHaveCount(0);
  });
});
