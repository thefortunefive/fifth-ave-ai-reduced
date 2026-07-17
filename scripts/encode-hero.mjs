#!/usr/bin/env node
/**
 * encode-hero.mjs — Fifth Ave AI hero video → web-optimized hero assets (v2).
 *
 * Source: media/hero-master-v2.mp4 (WebsiteVideoIntroFinal_2_NoText.mp4,
 * 2552×1440, 30fps, 42.2s, single continuous shot: penthouse office →
 * elevator lobby → ride → doors open into the Fifth Ave AI office).
 *
 * Outputs:
 *   public/hero-web.mp4    — 1280px, CRF 28, GOP=3 (0.1s keyframes) for
 *                            frame-accurate scroll scrubbing, +faststart
 *   public/hero-mobile.mp4 — 854px, CRF 26, GOP=4 (0.133s keyframes),
 *                            phone-class devices load this instead
 *   public/hero-idle.mp4   — from media/hero-clouds-nopan.mp4
 *                            (WebsiteVideoIntroFinal_1_NoPan.mp4, 15s
 *                            static-camera clouds): crossfade-spliced so
 *                            <video loop> is seamless with clouds always
 *                            moving forward. The cloud field drifts slowly
 *                            and never re-matches t=0 (diff plateaus ≈4.1
 *                            luma), so the seam uses a 1.0s crossfade to
 *                            blend it invisibly → 13.5s loop
 *   public/hero-poster.jpg — exact first frame for stable first paint
 *
 * Usage:   npm run encode-hero
 * Requires ffmpeg + ffprobe on PATH.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MASTER = join(ROOT, 'media', 'hero-master-v2.mp4');
const CLOUDS = join(ROOT, 'media', 'hero-clouds-nopan.mp4');
const WEB_VIDEO = join(ROOT, 'public', 'hero-web.mp4');
const MOBILE_VIDEO = join(ROOT, 'public', 'hero-mobile.mp4');
const IDLE_CLIP = join(ROOT, 'public', 'hero-idle.mp4');
const POSTER = join(ROOT, 'public', 'hero-poster.jpg');
const IDLE_CUT = 14.5; // s — longest cut with margin from the clip end
const XFADE = 1.0;     // s — long crossfade; cloud field never re-matches t=0

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function main() {
  try {
    run('ffmpeg', ['-version']);
  } catch {
    console.error('ERROR: ffmpeg not found on PATH.');
    process.exit(1);
  }
  if (!existsSync(MASTER)) {
    console.error(`ERROR: master not found at ${MASTER}`);
    process.exit(1);
  }

  console.log('1/4 hero-web.mp4 (1280px, CRF 28, GOP=3)…');
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', MASTER,
    '-vf', 'fps=30,scale=1280:-2:flags=lanczos',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
    '-g', '3', '-keyint_min', '3', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    WEB_VIDEO,
  ]);

  console.log('2/4 hero-mobile.mp4 (854px, CRF 26, GOP=4)…');
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', MASTER,
    '-vf', 'fps=30,scale=854:-2:flags=lanczos',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '26',
    '-profile:v', 'high', '-level', '4.0',
    '-g', '4', '-keyint_min', '4', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    MOBILE_VIDEO,
  ]);

  console.log('3/4 hero-idle.mp4 (crossfade-spliced cloud loop)…');
  // [main] plays 0.5→6.0s; its tail crossfades into [head] (the first 0.5s),
  // so the output's first and last frames match → <video loop> is seamless
  // and clouds only ever move forward.
  run('ffmpeg', [
    '-y', '-v', 'error', '-t', String(IDLE_CUT), '-i', CLOUDS,
    '-filter_complex',
    `[0:v]scale=1280:-2:flags=lanczos,split=2[a][b];` +
      `[a]trim=start=${XFADE}:end=${IDLE_CUT},setpts=PTS-STARTPTS[main];` +
      `[b]trim=start=0:end=${XFADE},setpts=PTS-STARTPTS[head];` +
      `[main][head]xfade=transition=fade:duration=${XFADE}:offset=${IDLE_CUT - 2 * XFADE}[out]`,
    '-map', '[out]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    IDLE_CLIP,
  ]);

  console.log('4/4 hero-poster.jpg (first frame)…');
  run('ffmpeg', [
    '-y', '-v', 'error', '-i', MASTER,
    '-frames:v', '1', '-vf', 'scale=1280:-2:flags=lanczos',
    '-update', '1', '-qscale:v', '3',
    POSTER,
  ]);

  const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2);
  console.log(
    `Done: hero-web ${mb(WEB_VIDEO)}MB, hero-mobile ${mb(MOBILE_VIDEO)}MB, hero-idle ${mb(IDLE_CLIP)}MB`
  );
  if (statSync(WEB_VIDEO).size > 25 * 1024 * 1024) {
    console.warn('WARNING: hero-web.mp4 exceeds the Cloudflare Pages 25MiB per-file limit. Increase CRF.');
  }
}

main();
