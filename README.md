# Fifth Ave AI — Website

The production marketing and portfolio site for **Fifth Ave AI**, live at
[fifthaveai.com](https://fifthaveai.com). This is the reduced-launch build
that is currently deployed.

## Stack

- **Next.js 14** (App Router) with `output: 'export'` — a fully static build,
  no server runtime.
- **Tailwind CSS** for styling; a black-and-gold design system.
- **GSAP** (ScrollTrigger) + **Lenis** for the scroll-driven cinematic video
  hero and section reveals.
- **Cloudflare Pages** for hosting, with a **Pages Function**
  (`functions/api/contact.ts`) handling the contact form via
  [Resend](https://resend.com) email delivery and
  [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
  bot protection.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # static export to ./out
```

## Deploy

Deployed to the Cloudflare Pages project `fifthaveai` (production branch
`main`) via direct upload:

```bash
npx wrangler pages deploy out --project-name=fifthaveai --branch=main
```

## Environment variables

Configuration is documented in [`.env.example`](./.env.example). Secrets
(`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) are stored as encrypted variables
in the Cloudflare Pages dashboard and are never committed.

## Media

The hero source video (`media/hero-master-v2.mp4`) is tracked with
[Git LFS](https://git-lfs.github.com). Run `git lfs install` once before
cloning or pulling so the asset is fetched correctly.
