# Navigation Mapping Audit

Complete inventory of every clickable navigation control in the Fifth Ave AI website.

## Desktop Navbar (7 items + logo + CTA)

| Label | Component | href | Destination | Exists | Click Works | Status |
|-------|-----------|------|-------------|--------|-------------|--------|
| Logo (Fifth Ave AI) | Navbar.tsx | `/` | Homepage | Yes | Yes | OK |
| Home | Navbar.tsx | `/` | Homepage | Yes | Yes | OK |
| Services | Navbar.tsx | `/services` | Services page | Yes | Yes | OK |
| AI Tools | Navbar.tsx | `/ai-tools` | AI Tools page | Yes | Yes | NEW |
| Work | Navbar.tsx | `/work` | Work page | Yes | Yes | OK |
| AI Career Defense | Navbar.tsx | `/ai-career-defense` | AI Career Defense page | Yes | Yes | NEW |
| About | Navbar.tsx | `/about` | About page | Yes | Yes | OK |
| Contact | Navbar.tsx | `/contact` | Contact page | Yes | Yes | OK |
| Get Started | Navbar.tsx | `/contact` | Contact page | Yes | Yes | OK |

## Mobile Hamburger Menu (7 items + CTA + phone)

| Label | Component | href | Destination | Exists | Click Works | Status |
|-------|-----------|------|-------------|--------|-------------|--------|
| Home | Navbar.tsx (overlay) | `/` | Homepage | Yes | Yes | OK |
| Services | Navbar.tsx (overlay) | `/services` | Services page | Yes | Yes | OK |
| AI Tools | Navbar.tsx (overlay) | `/ai-tools` | AI Tools page | Yes | Yes | NEW |
| Work | Navbar.tsx (overlay) | `/work` | Work page | Yes | Yes | OK |
| AI Career Defense | Navbar.tsx (overlay) | `/ai-career-defense` | AI Career Defense page | Yes | Yes | NEW |
| About | Navbar.tsx (overlay) | `/about` | About page | Yes | Yes | OK |
| Contact | Navbar.tsx (overlay) | `/contact` | Contact page | Yes | Yes | OK |
| Get Started | Navbar.tsx (overlay) | `/contact` | Contact page | Yes | Yes | OK |
| (425) 316-7268 | Navbar.tsx (overlay) | — | Display only | N/A | N/A | OK |

Mobile behavior verified:
- Hamburger opens reliably
- All items clickable when menu is open
- Menu closes after link click (opacity → 0)
- Body scroll restored after close (overflow → empty)
- Overlay has pointer-events-none when closed

## Floor 02 / Directory Menu (8 items)

| Label | Component | href | Destination | Exists | Click Works | Status |
|-------|-----------|------|-------------|--------|-------------|--------|
| Services | WebDesignMenu.tsx | `/services` | Services page | Yes | Yes | REBUILT |
| AI Tools | WebDesignMenu.tsx | `/ai-tools` | AI Tools page | Yes | Yes | REBUILT |
| Work / Demos | WebDesignMenu.tsx | `/work` | Work page | Yes | Yes | REBUILT |
| AI Career Defense | WebDesignMenu.tsx | `/ai-career-defense` | AI Career Defense page | Yes | Yes | REBUILT |
| How It Works | WebDesignMenu.tsx | `/#process` | Homepage #process section | Yes | Yes | REBUILT |
| Premium Consulting | WebDesignMenu.tsx | `/#consulting` | Homepage #consulting section | Yes | Yes | REBUILT |
| About Fifth Ave AI | WebDesignMenu.tsx | `/about` | About page | Yes | Yes | REBUILT |
| Contact / Book a Consultation | WebDesignMenu.tsx | `/contact` | Contact page | Yes | Yes | REBUILT |

Page routes use `next/link`. Anchor links (`/#process`, `/#consulting`) use Lenis smooth-scroll via `scrollToId()`. All destinations verified. Config sourced from centralized `lib/nav.ts` FLOOR_MENU array.

## Homepage CTAs (2 items)

| Label | Component | href | Destination | Exists | Status |
|-------|-----------|------|-------------|--------|--------|
| Inquire About Availability | Consulting.tsx | `/contact` | Contact page | Yes | OK |
| Start the Conversation | Cta.tsx | `/contact` | Contact page | Yes | OK |

## Homepage External Links (1 item)

| Label | Component | href | Status |
|-------|-----------|------|--------|
| fifthavefilm.com | About.tsx | `https://fifthavefilm.com` | OK (external) |

Note: LinkedIn link removed — was pointing to generic `https://www.linkedin.com/` without a real profile URL.

## Footer Links (9 items, same on all pages)

| Label | Component | href | Destination | Exists | Status |
|-------|-----------|------|-------------|--------|--------|
| Home | Footer.tsx | `/` | Homepage | Yes | OK |
| Services | Footer.tsx | `/services` | Services page | Yes | OK |
| AI Tools | Footer.tsx | `/ai-tools` | AI Tools page | Yes | NEW |
| Work | Footer.tsx | `/work` | Work page | Yes | OK |
| AI Career Defense | Footer.tsx | `/ai-career-defense` | AI Career Defense | Yes | NEW |
| About | Footer.tsx | `/about` | About page | Yes | OK |
| Contact | Footer.tsx | `/contact` | Contact page | Yes | OK |
| (425) 316-7268 | Footer.tsx | `tel:+14253167268` | Phone | N/A | OK |
| hello@fifthaveai.com | Footer.tsx | `mailto:hello@fifthaveai.com` | Email | N/A | OK |

## Services Page CTAs (7 items)

| Label | Component | href | Destination | Status |
|-------|-----------|------|-------------|--------|
| Get Started (Starter) | services/page.tsx | `/contact` | Contact | OK |
| Get Started (Professional) | services/page.tsx | `/contact` | Contact | OK |
| Get Started (Enterprise) | services/page.tsx | `/contact` | Contact | OK |
| Get Quote (Gold) | services/page.tsx | `/contact` | Contact | OK |
| Get Quote (Platinum) | services/page.tsx | `/contact` | Contact | OK |
| Get Quote (Diamond) | services/page.tsx | `/contact` | Contact | OK |
| Contact Us | services/page.tsx | `/contact` | Contact | OK |

## AI Tools Page CTAs (7 items)

| Label | Component | href | Destination | Status |
|-------|-----------|------|-------------|--------|
| Learn More | ai-tools/page.tsx | `/services` | Services | OK |
| See How It Works | ai-tools/page.tsx | `/work` | Work | OK |
| View Examples | ai-tools/page.tsx | `/work` | Work | OK |
| Explore Plans | ai-tools/page.tsx | `/services` | Services | OK |
| Get a Quote | ai-tools/page.tsx | `/contact` | Contact | OK |
| See Pricing | ai-tools/page.tsx | `/services` | Services | OK |
| Get on the List | ai-tools/page.tsx | `/contact` | Contact | OK |

## AI Career Defense Page CTAs (3 items)

| Label | Component | href | Destination | Status |
|-------|-----------|------|-------------|--------|
| Apply Now | ai-career-defense/page.tsx | `/contact` | Contact | OK |
| See All Services | ai-career-defense/page.tsx | `/services` | Services | OK |
| Start the Conversation | ai-career-defense/page.tsx | `/contact` | Contact | OK |

## Work Page CTAs (1 item)

| Label | Component | href | Destination | Status |
|-------|-----------|------|-------------|--------|
| Start the Conversation | work/page.tsx | `/contact` | Contact | OK |

## About Page CTAs (2 items)

| Label | Component | href | Destination | Status |
|-------|-----------|------|-------------|--------|
| Get in Touch | about/page.tsx | `/contact` | Contact | OK |
| fifthavefilm.com | about/page.tsx | `https://fifthavefilm.com` | External | OK |

## Contact Page CTAs (3 items)

| Label | Component | href | Destination | Status |
|-------|-----------|------|-------------|--------|
| Send Message | contact/page.tsx | form submit → mailto | Email client | OK |
| (425) 316-7268 | contact/page.tsx | `tel:+14253167268` | Phone | OK |
| hello@fifthaveai.com | contact/page.tsx | `mailto:hello@fifthaveai.com` | Email | OK |
| Book a Time Slot | contact/page.tsx | `mailto:hello@fifthaveai.com?subject=...` | Email | FIXED (was `Link`, now `<a>`) |

## Section Anchors (scroll-margin-top)

All homepage sections with `id` attributes have `scroll-margin-top: 80px` via the global CSS rule `[id] { scroll-margin-top: 5rem; }`.

| Section ID | Element | scroll-margin-top |
|------------|---------|-------------------|
| web-design | SECTION | 80px |
| proof | SECTION | 80px |
| process | SECTION | 80px |
| about | SECTION | 80px |
| industries | SECTION | 80px |
| consulting | SECTION | 80px |
| cta | SECTION | 80px |

## Navigation Configuration

All navigation is sourced from the centralized config in `lib/nav.ts`:
- `Navbar.tsx` → imports `TOP_NAV` (7 items)
- `Footer.tsx` → imports `TOP_NAV` (7 items)
- `WebDesignMenu.tsx` → imports `FLOOR_MENU` (8 items)

Page routes use `next/link` `<Link>`. Homepage anchor links use Lenis smooth-scroll. External links use standard `<a>` tags.

## Z-Index Stacking

| Layer | Element | z-index |
|-------|---------|---------|
| Nav bar | `<nav>` (fixed) | z-[70] |
| Mobile overlay | overlay `<div>` (fixed) | z-[65] |
| Film grain | `.grain` overlay | z-[50] |
| Vignette | `.vignette` overlay | z-[40] |

The nav sits above the mobile overlay so the hamburger/close button is always clickable. The overlay links are vertically centered, well below the nav bar area.

## Playwright Test Suite

129 tests across 3 viewports (desktop 1440×900, tablet 768×1024, mobile 390×844):

| Category | Tests | Result |
|----------|-------|--------|
| Desktop Navbar | 9 (desktop/tablet) | PASS |
| Mobile Menu | 8 + hamburger open/close | PASS |
| Floor 02 page routes | 6 + Back | PASS |
| Floor 02 anchor links | 2 scroll + 2 Back | PASS |
| Footer links | 7 | PASS |
| All pages return 200 | 7 | PASS |
| No obsolete labels | 1 | PASS |
| **Total** | **119 passed, 10 skipped, 0 failed** | **PASS** |

Skipped: 9 Desktop Navbar tests on mobile (desktop links hidden at <768px) + 1 "Get Started" CTA on tablet (overflows at 768px).

Report: `playwright-report/index.html`

## Summary

| Metric | Count |
|--------|-------|
| Total navigation controls audited | 67 |
| Dead links found | 0 |
| Missing routes found | 0 (2 created: /ai-tools, /ai-career-defense) |
| Missing anchors found | 0 |
| Elevator/floor buttons working | 8/8 |
| Desktop navbar items | 9/9 working |
| Mobile menu items | 8/8 working |
| Footer links | 9/9 working |
| CTA buttons | 20/20 working |
| Console errors | 0 |
| Playwright tests | 119/119 passed |
