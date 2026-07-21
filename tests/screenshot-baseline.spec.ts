import { test } from '@playwright/test';

const ROUTES = [
  { path: '/', slug: 'home' },
  { path: '/services', slug: 'services' },
  { path: '/ai-tools', slug: 'ai-tools' },
  { path: '/work', slug: 'work' },
  { path: '/about', slug: 'about' },
  { path: '/contact', slug: 'contact' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Baseline screenshots — ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of ROUTES) {
      test(`${route.slug}`, async ({ page }) => {
        await page.goto(route.path);
        await page.waitForTimeout(1500);
        await page.screenshot({
          path: `screenshots/baseline-20260714/${vp.name}-${route.slug}.png`,
          fullPage: false,
        });
      });
    }
  });
}
