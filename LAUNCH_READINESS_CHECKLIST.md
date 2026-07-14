# Launch Readiness Checklist

## Build & Routes
- [x] Production build completes without errors (`npm run build`)
- [x] Static export generates all 7 pages + 404
- [x] Postbuild removes large source videos from `out/`
- [x] All routes return HTTP 200: `/`, `/services`, `/ai-tools`, `/work`, `/ai-career-defense`, `/about`, `/contact`

## Navigation
- [x] 7-item navbar: Home, Services, AI Tools, Work, AI Career Defense, About, Contact
- [x] Desktop navbar — all 9 links (7 + logo + CTA) visible and clickable
- [x] Mobile hamburger — opens, all 8 links visible, closes on click, body scroll restored
- [x] Footer — 7 internal routes + phone + email, all visible and clickable
- [x] Floor 02 menu — 8 anchor links, all target sections exist, Lenis smooth-scroll
- [x] All 20 CTAs across all pages point to real routes
- [x] Zero dead links, zero missing routes, zero console errors
- [x] `scroll-margin-top: 80px` on all section IDs (navbar offset)
- [x] Full audit documented in `NAVIGATION_MAPPING_AUDIT.md`

## Content Migration (live → local)
- [x] Services page — 6 service cards, 3 pricing tiers, 3 website packages, 6 FAQ items
- [x] AI Tools page — 6 tool cards + 3 coming-soon items + CTAs
- [x] AI Career Defense page — 4 pillars + FAQ + CTAs
- [x] About page — story, values, locations
- [x] Contact page — form, phone, email, address, consultation CTA
- [x] Work page — 6 project case studies
- [x] Homepage consulting section with testimonial
- [x] Unverified statistics replaced with qualitative language
- [x] Pricing preserved as-is (owner to confirm)
- [x] Testimonial (Vance C.) preserved as-is (owner to confirm)
- [x] Claims documented in `CLAIMS_REQUIRING_OWNER_REVIEW.md`

## SEO & Metadata
- [x] `robots.txt` in public/
- [x] `sitemap.xml` with all 7 routes
- [x] Page-specific `<title>` via layout.tsx per route
- [x] Page-specific `<meta description>` per route
- [x] OpenGraph metadata on root layout
- [x] `metadataBase` set to `https://fifthaveai.com`

## Hero / Elevator Experience
- [x] Idle clouds loop plays on load (hero-idle.mp4)
- [x] Scroll-driven video scrub (hero-web.mp4, 36.07s)
- [x] Video ends at doors-open frame (not directory close-up)
- [x] 4 text beats animate on scroll
- [x] HTML Floor 02 menu is the single directory
- [x] Scroll runway at 400vh for comfortable pacing

## Responsive
- [x] Desktop (1440px) — navbar inline links, multi-column grids
- [x] Tablet (768px) — navbar inline, 2-column card grids
- [x] Mobile (390px) — hamburger menu, single-column stacking
- [x] Contact form usable at all widths

## Assets
- [x] `crest.png` — brand logo/crest
- [x] `hero-web.mp4` — scrub video (11MB)
- [x] `hero-idle.mp4` — idle loop (518KB)
- [x] `hero-poster.jpg` — poster frame (131KB)
- [ ] Favicon (not yet provided — needs .ico or .png from owner)
- [ ] OG social preview image (needs branded image from owner)
- [ ] Portrait photo for About page (placeholder in place)
- [ ] Work page demo screenshots (placeholders in place)

## Deployment Safety
- [x] No deployment to fifthaveai.com occurred
- [x] DNS unchanged
- [x] Live site unmodified
- [x] Static export in `out/` ready for Cloudflare Pages

## Remaining Before Launch
- [ ] Owner confirms pricing is current (items 4, 7, 8 in claims doc)
- [ ] Owner confirms testimonial accuracy (item 10 in claims doc)
- [ ] Owner provides favicon asset
- [ ] Owner provides OG social preview image
- [ ] Owner provides portrait photo for About page
- [ ] Owner provides work/portfolio screenshots or demo URLs
- [ ] Owner decides on social media links for footer
- [ ] Owner provides real LinkedIn URL for About section (currently removed)
- [ ] Owner reviews FAQ answers for accuracy (item 12 in claims doc)
- [ ] Connect contact form to backend service (Formspree, Resend, etc.) — currently mailto
