#!/usr/bin/env node
/**
 * postbuild.mjs — runs automatically after `npm run build`.
 *
 * Removes the encoding SOURCE videos from the static export (out/). They are
 * only inputs for scripts/encode-hero.mjs — the site serves hero-web.mp4 and
 * hero-idle.mp4. hero-video.mp4 (~79MB) also exceeds Cloudflare Pages'
 * 25MiB per-file limit.
 */
import { existsSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');

for (const name of ['hero-video.mp4', 'hero-elevator-source.mp4', 'hero-clouds-source.mp4']) {
  const target = join(outDir, name);
  if (existsSync(target)) {
    const mb = (statSync(target).size / 1024 / 1024).toFixed(1);
    rmSync(target);
    console.log(`postbuild: removed ${name} (${mb}MB) from out/ — encoding source only, not served.`);
  } else {
    console.log(`postbuild: no ${name} in out/, nothing to strip.`);
  }
}
