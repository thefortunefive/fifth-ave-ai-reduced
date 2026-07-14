# HANDOFF — Fifth Ave AI marketing site

Premium single-page marketing site. **Next.js 14 (App Router, static export) + Tailwind + GSAP ScrollTrigger + Lenis.** Target deploy: **Cloudflare Pages** (pure static — no Vercel-specific code anywhere; keep it that way).

## How to run

```bash
npm install
npm run encode-hero   # only needed if the source video changes (hero-web.mp4 is already generated)
npm run dev           # http://localhost:3000
npm run build         # static export → out/  (deploy out/ to Cloudflare Pages)
```

**Gotcha:** don't run `npm run build` while `next dev` is serving — the build rewrites `.next/` and the running dev server starts 404ing its own CSS/JS (page renders unstyled). If that happens: stop the dev server, `rm -rf .next`, restart `npm run dev`.

`npm run build` automatically runs `scripts/postbuild.mjs`, which deletes both encoding sources (`hero-video.mp4` ~30MB, `hero-clouds-source.mp4` ~11MB) from `out/` — they are only inputs for `scripts/encode-hero.mjs`, and the 30MB one exceeds Cloudflare Pages' 25MiB per-file limit. The site serves `hero-web.mp4` (~5.6MB) + `hero-idle.mp4` (~520KB), not the sources.

## Brand tokens

Defined in `tailwind.config.ts` (classes `dark`, `dark-2`, `gold`, `white`) and as CSS vars in `app/globals.css` (`--color-dark: #0A0A0A`, `--color-dark-2: #1A1A1A`, `--color-gold: #D7B75A`, `--color-white: #FFFFFF`). Fonts: Playfair Display (`font-display`) + Inter (body), loaded via `next/font`.

Shared cinematic pieces (already wired in `app/layout.tsx`):
- `components/ScrollProgressBar.tsx` — gold top-of-page scroll progress bar
- `components/CinematicOverlays.tsx` — film grain + vignette
- `.glass-card` utility (globals.css) — backdrop-filter glass w/ gold hover border + tint
- `components/SmoothScroll.tsx` — Lenis wired into GSAP's ticker (mounted once; every ScrollTrigger depends on it)

**Shared animation spec — do not re-invent.** `lib/animations.ts` exports `FADE_UP` (fade-up 30px, 0.8s, power2.out, stagger 0.15s, trigger at `top 80%`) and the `useFadeUp(ref)` hook. In any section: put the hook on the section ref, add `data-reveal` to each animated element, and share a `data-reveal-group="name"` to stagger a set together. All current sections show the pattern.

---

## ✅ FULLY BUILT — do not rework

### 1. HERO — video scroll scrub + static-camera clouds idle loop (`components/Hero.tsx`)

Two `<video>` layers, one visible at a time — no canvas, no frame extraction.

- **Sources** (encoding inputs only, never served; postbuild strips all three from `out/`):
  - `public/hero-video.mp4` (~30MB, from `WebsiteVideoIntroFinal_2_with_pan.mp4`) — intro footage, 15.04s, corrected FIFTH AVE AI logo: static office/clouds (0→6.9s, pan starts at a **measured** t=7.07s) → pan right → elevator arrival, ending on the closed doors.
  - `public/hero-elevator-source.mp4` (~79MB, from `WebsiteVideoIntroFinal_1.mp4`) — the original 40.94s render, the ONLY footage with the full elevator ride. Its Floor 01 sign has the old garbled logo, but the splice starts at its closed-doors shot (t=12), skipping all up-close bad signage; the elevator-interior and Floor 02 directory crests in it are clean.
  - `public/hero-clouds-source.mp4` (~11MB, from `WebsiteVideoIntroFinal_2.mp4`) — dedicated 15s **static-camera** clouds shot of the same office scene, corrected logo (only clouds/light move).
- `scripts/encode-hero.mjs` encodes them into:
  - **`public/hero-web.mp4`** (~11MB) — scrub layer: a **SPLICE** of the intro (full 15.04s, correct logo) crossfaded (0.5s, between the two matching closed-door shots) into the elevator source from t=12 to t=33.5 → **~36s total**: clouds → pan → doors open (~18.5s) → board (~21s) → ride up (~24–26s, sign flips FLOOR 01→02) → doors part (~30s) → Floor 02 office establishing shot (end). Trimmed before the directory close-up so the HTML Floor 02 menu below is the single directory. 1280×722, 30fps, `-g 3` (keyframe every 0.1s for near-frame-accurate seeking), CRF 30, `+faststart`. Timeline constants (`ELEVATOR_START`, `ELEVATOR_END`, `SPLICE_XFADE`) documented in the script.
  - **`public/hero-idle.mp4`** (~520KB) — idle layer: t 0→13.75s of the clouds shot, **crossfade-spliced** (last 0.5s blends back into the first 0.5s via ffmpeg `xfade`) so a normal forward `<video loop>` is seamless (13.25s loop). The cut point is **measured, not guessed**: the cloud field nearly returns to its t=0 state at 13.75s (frame diff dips to a local minimum, luma Δ=0.9), and camera drift measures ≤0.14px across the whole source clip (static camera, zero pan). No ping-pong, no reversal.
  - **`public/hero-poster.jpg`** (~115KB) — still at t≈0.5s; stable first paint on both layers.
- **Behavior** (`IDLE_THRESHOLD = 0.005` in `Hero.tsx`):
  - **IDLE** (scroll at top): the clouds loop plays (muted/loop/autoplay/playsinline) above the scrub layer — gentle one-directional cloud motion, provably static camera.
  - **SCRUB** (scrolling): the idle layer fades out (500ms CSS opacity), revealing the scrub video beneath; it stays paused with `currentTime = progress * duration` across the **400vh** section (the ~36s spliced sequence, trimmed before directory close-up). Scroll back to top fades the loop back in and resumes it.
- Four text beats fade in/out at 0–15%, 20–40%, 45–65%, 70–90% progress. Desktop-only subtle parallax on the beats (disabled <768px via `gsap.matchMedia`).
- Posters provide the mobile fallback: if autoplay is blocked, the office still is shown — never a black box.
- Verified in headless Chrome (1440px + 375px): idle drift ≤0.04px across ~2 loops while sky pixels visibly change (clouds animated); scrub covers the full 0→36s (pan, doors opening 45%, ride up, doors part, Floor 02 office establishing shot at 100% — trimmed before directory close-up); only one directory visible (the HTML menu below); idle resumes at top; no horizontal overflow.

**If either source video is replaced:** drop the new file(s) in `public/`, re-measure before trusting the constants (`IDLE_CUT` came from per-frame drift + luma analysis; `SCRUB_END` is clamped to clip duration — the full clip is used), update them in `scripts/encode-hero.mjs`, run `npm run encode-hero`. If `hero-clouds-source.mp4` is missing, the script falls back to the static opening of the main video (t 0→6.75s; its pan starts at a measured ≈7.07s). If `hero-video.mp4` is missing, a placeholder is generated so the pipeline stays testable.

Also done: `app/layout.tsx`, `app/globals.css`, progress bar, grain/vignette, smooth scroll, `app/page.tsx` assembly, footer.

### 1b. FLOOR 02 — Web Design directory (`components/sections/WebDesignMenu.tsx`)

This gold-framed "FLOOR 02 / WEB DESIGN" service directory is a **pixel-faithful, interactive HTML replica** of the panel painted into the original elevator footage (that signage was video pixels, not DOM — it couldn't hold links). It sits right after the hero: the scrub ends on the closed elevator doors, and this section is the Floor 02 arrival. Each row is a real `<a href="#…">` whose click is intercepted for Lenis smooth-scroll via `lib/lenis.ts` (`scrollToId`). Rows are ≥46px, gold hover tint + lift + chevron, keyboard-focusable, stack full-width at 375px. Verified in headless Chrome: all 8 rows scroll to the correct section at both 1440px and 375px, no horizontal overflow.

**Visual match to the video panel.** Colors were sampled directly from the video frame (panel dark `#16140F`/`#1E1B13`, brass `#E4CE9C`/`#C9A46A`/`#6E5433`, cream text `#E7E1D2`). The crest is the real brand logo: `FifthAveAI_LogoFinal.png` had its background removed (ffmpeg `lumakey` + autocrop → `public/crest.png`, a transparent cream line-art crest) and is rendered gold in-component via a CSS `mask-image` over a gold gradient — so it matches the video's gold crest and stays crisp/recolorable. To re-generate the crest from a new logo, see the `panel-study` steps (lumakey threshold≈0.34/tolerance≈0.34, autocrop, scale to ~440px).

**Seamless hero→menu handoff.** The scrub footage ends on a wide establishing shot of the Floor 02 office (doors open, office visible), trimmed before the baked-in directory close-up — the HTML panel below is the single interactive directory. The hero has a bottom fade to `#0A0A0A` and this section's background is the same dark with a subtle ribbed-wall texture, so the last video frame dissolves into the HTML panel with no seam line. If you replace the hero video, re-check the constants in `scripts/encode-hero.mjs` and re-run `npm run encode-hero`.

**Row → section mapping:**

| Row | Scrolls to |
|---|---|
| Website Design | `#proof` |
| Brand Websites | `#proof` |
| Landing Pages | `#proof` |
| UX / UI Design | `#process` |
| Prototyping | `#process` |
| E-Commerce | `#cta` (contact) |
| CMS Development | `#cta` (contact) |
| Maintenance & Support | `#cta` (contact) |

"Contact" rows target the on-page `#cta` section (which itself holds the button to `/contact`) rather than navigating to `/contact` directly, so the smooth-scroll behavior is preserved instead of a hard page load.

**Lenis is now exposed** via `lib/lenis.ts` (`setLenis`/`getLenis`/`scrollToId`), set in `SmoothScroll.tsx`. Any future in-page nav (navbar, footer links) should reuse `scrollToId(id)` — don't re-implement smooth scroll.

**Pointer-events (overlay safety):** the film-grain (z-50) and vignette (z-40) are full-viewport `fixed` layers that span every section — both are `pointer-events-none` (in `CinematicOverlays.tsx`), so no overlay intercepts clicks on interactive content anywhere.

---

## 🚧 SCAFFOLDED — for the cheaper model

Every stub is styled, on-brand, responsive, and animated with the shared spec. Search for **`TODO: cheaper model`** — each file's header comment says exactly what's left. Summary:

| Section | File | Left to do |
|---|---|---|
| 2. Proof | `components/sections/Proof.tsx` | Replace 3 placeholder image divs with real imagery (`public/proof-*.jpg`); copy pass |
| 3. Process | `components/sections/Process.tsx` | Desktop horizontal-scroll treatment (pin + `containerAnimation`); currently a static 4-col grid with the animated gold line + mobile stack done |
| 4. About | `components/sections/About.tsx` | Drop real portrait at `public/shane-portrait.jpg` (400×500) and swap the placeholder div for an `<img>`; real bio; real LinkedIn URL (fifthavefilm.com link is in) |
| 5. Industries | `components/sections/Industries.tsx` | Tags + stagger done; optionally richer entrance (scale/rotation) or marquee drift |
| 6. CTA | `components/sections/Cta.tsx` | Layout, copy, cities, button, and a working gold-particle canvas are done; optionally art-direct particles (density/glow/mouse) |
| Contact page | `app/contact/page.tsx` | Currently a styled mailto stub; add a static-friendly form (Formspree/Tally) — **no server code**, this is a static export |

Rules for the cheaper model:
1. Use `useFadeUp` + `data-reveal` for all entrance animation — never write a new fade-up.
2. Use brand tokens (`bg-dark`, `bg-dark-2`, `text-gold`, `.glass-card`, `.text-gold-gradient`, `.gold-rule`) — no new hex values.
3. Keep everything static-export safe: no API routes, no server actions, no `next/image` optimization (it's set `unoptimized`), no Vercel features.
4. Test at 375px — `html, body { overflow-x: clip }` is a safety net, not a license.
5. Verify `npm run build` passes before finishing.

## Deploy (Cloudflare Pages)

Build command `npm run build`, output directory `out`. Nothing else needed. Note `.gitignore` excludes `public/hero-video.mp4` from git (~30MB, encoding source only); keep it in cloud storage and re-run `npm run encode-hero` after cloning if `hero-web.mp4` ever needs regenerating. The generated `public/hero-web.mp4`, `public/hero-idle.mp4`, and `public/hero-poster.jpg` **are** committed.
