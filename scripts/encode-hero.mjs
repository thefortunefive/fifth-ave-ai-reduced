#!/usr/bin/env node
/**
 * encode-hero.mjs — Fifth Ave AI hero video → web-optimized hero assets.
 *
 * Encodes the source videos into web-optimized hero assets:
 *   public/hero-web.mp4   — from hero-video.mp4: 1280px, t 0→SCRUB_END,
 *                           frequent keyframes for frame-accurate scroll
 *                           scrubbing, +faststart
 *   public/hero-idle.mp4  — from hero-clouds-source.mp4 (dedicated 15s
 *                           static-camera clouds shot): t 0→IDLE_CUT,
 *                           crossfade-spliced so <video loop> is seamless.
 *                           Clouds move; camera provably doesn't (measured
 *                           drift ≤0.21px across the full clip).
 *   public/hero-poster.jpg — still frame at t≈0.5s for stable first paint
 *
 * Usage:   npm run encode-hero
 * Re-run any time either source video changes.
 *
 * If public/hero-video.mp4 is missing, a short placeholder is generated.
 * If hero-clouds-source.mp4 is missing, the idle loop falls back to the
 * static-camera opening of hero-video.mp4 (t 0→2.5s, pan starts ≈2.73s).
 * Requires ffmpeg + ffprobe on PATH.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEO = join(ROOT, 'public', 'hero-video.mp4');
const ELEVATOR = join(ROOT, 'public', 'hero-elevator-source.mp4');
const CLOUDS = join(ROOT, 'public', 'hero-clouds-source.mp4');
const WEB_VIDEO = join(ROOT, 'public', 'hero-web.mp4');
const IDLE_CLIP = join(ROOT, 'public', 'hero-idle.mp4');
const POSTER = join(ROOT, 'public', 'hero-poster.jpg');
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 722; // both sources land here at 1280 wide (forced, so xfade inputs match)

/**
 * IDLE_CUT — loop cut point in hero-clouds-source.mp4
 * (WebsiteVideoIntroFinal_2.mp4, 15s static-camera office/clouds shot).
 * Measured (not guessed): camera drift ≤0.14px across all 15s (static
 * everywhere); luma stable (90.6–92.2, no sunset). The cloud field nearly
 * returns to its t=0 state at t=13.75s (frame diff dips to 2.66, luma Δ=0.9),
 * so cutting there gives the longest loop whose seam blends two near-matching
 * frames. If the clouds source changes, re-run the drift + luma measurement
 * before trusting these numbers.
 */
const IDLE_CUT = 13.75;      // s — cloud field nearly matches t=0 here
const XFADE = 0.5;           // s — crossfade at the loop seam
const FALLBACK_IDLE_CUT = 6.75; // s — static opening of hero-video.mp4 (pan starts ≈7.07s, measured)
/**
 * The scrub is a SPLICE of two sources (no single render has both the
 * corrected logo and the full elevator sequence):
 *   hero-video.mp4     (WebsiteVideoIntroFinal_2_with_pan.mp4, 15.04s,
 *                       CORRECT logo): static office → pan → arrival at the
 *                       closed elevator doors. Used in full.
 *   hero-elevator-source.mp4 (WebsiteVideoIntroFinal_1.mp4, 40.94s, old
 *                       logo — only shown in segments where no signage is
 *                       legible up close except the final directory):
 *                       ELEVATOR_START picks up at its closed-doors shot
 *                       (t≈8–13, matching the first clip's ending), then
 *                       doors open → board → ride to Floor 02 → doors part →
 *                       office + directory, to the end of the clip.
 * A SPLICE_XFADE crossfade blends the two closed-door shots.
 * Timeline map of hero-elevator-source.mp4 (inspected frame-by-frame):
 * doors open 14–16s, board/close 18–21s, FLOOR 02 at 24s, doors part 26–28s,
 * office 28–37s, directory close-up 38–41s.
 */
const ELEVATOR_START = 12;   // s — closed-doors shot in the elevator source
const ELEVATOR_END = 33.5;   // s — wide office establishing shot in elevator source; before directory push-in
const SPLICE_XFADE = 0.5;    // s — crossfade between the two closed-door shots

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function assertFfmpeg() {
  try {
    run('ffmpeg', ['-version']);
    run('ffprobe', ['-version']);
  } catch {
    console.error('ERROR: ffmpeg/ffprobe not found on PATH. Install ffmpeg and retry.');
    process.exit(1);
  }
}

function generatePlaceholder() {
  console.log('hero-video.mp4 not found — generating placeholder…');
  run('ffmpeg', [
    '-y', '-f', 'lavfi',
    '-i', 'color=c=0x0A0A0A:s=1280x720:d=28:r=30',
    '-vf',
    "drawbox=y='mod(t*120\\,720)':w=iw:h=4:color=0xD7B75A@0.9:t=fill," +
      "drawbox=y='mod(t*60+300\\,720)':w=iw:h=2:color=0xD7B75A@0.5:t=fill," +
      "drawbox=y='mod(t*200+500\\,720)':w=iw:h=6:color=0xD7B75A@0.7:t=fill",
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', VIDEO,
  ]);
}

function main() {
  assertFfmpeg();
  if (!existsSync(VIDEO)) generatePlaceholder();

  const duration = parseFloat(
    run('ffprobe', [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1', VIDEO,
    ]).trim()
  );
  if (!duration || Number.isNaN(duration)) {
    console.error('ERROR: could not read video duration.');
    process.exit(1);
  }

  console.log(`Source: ${VIDEO} (${duration.toFixed(2)}s)`);

  // ---- Clean up old artifacts from the frame-extraction era ----
  const oldFrames = join(ROOT, 'public', 'frames');
  const oldManifest = join(ROOT, 'lib', 'frames.json');
  if (existsSync(oldFrames)) { rmSync(oldFrames, { recursive: true, force: true }); console.log('Removed old public/frames/'); }
  if (existsSync(oldManifest)) { unlinkSync(oldManifest); console.log('Removed old lib/frames.json'); }

  // ---- 1) Poster frame — still at t=0.5s for stable first paint ----
  console.log('Extracting poster frame…');
  run('ffmpeg', [
    '-y', '-ss', '0.5', '-i', VIDEO,
    '-vf', `scale=${FRAME_WIDTH}:-2:flags=lanczos`,
    '-frames:v', '1', '-update', '1',
    '-qscale:v', '3',
    POSTER,
  ]);

  // ---- 2) Idle loop — dedicated static-camera clouds shot ----
  // Forward-only crossfade splice: [main] starts at XFADE and plays to the
  // cut; the tail blends back into [head] (the first XFADE seconds), so the
  // output's first and last frames are identical → <video loop> is seamless.
  // The camera is static, so only cloud pixels differ at the seam — and the
  // cut point was chosen where scene brightness matches t=0.
  const idleSrc = existsSync(CLOUDS) ? CLOUDS : VIDEO;
  const idleCut = existsSync(CLOUDS) ? IDLE_CUT : FALLBACK_IDLE_CUT;
  const idleOut = idleCut - XFADE;
  console.log(
    `Idle loop: ${idleSrc === CLOUDS ? 'hero-clouds-source.mp4' : 'hero-video.mp4 (fallback)'} t 0→${idleCut}s, ${XFADE}s crossfade splice → ${idleOut.toFixed(2)}s loop…`
  );
  run('ffmpeg', [
    '-y',
    '-t', String(idleCut),
    '-i', idleSrc,
    '-filter_complex',
    [
      `[0:v]scale=${FRAME_WIDTH}:-2:flags=lanczos,split=2[a][b]`,
      `[a]trim=start=${XFADE}:end=${idleCut},setpts=PTS-STARTPTS[main]`,
      `[b]trim=start=0:end=${XFADE},setpts=PTS-STARTPTS[head]`,
      `[main][head]xfade=transition=fade:duration=${XFADE}:offset=${idleCut - 2 * XFADE}[out]`,
    ].join(';'),
    '-map', '[out]',
    '-an',
    '-c:v', 'libx264',
    '-crf', '28',
    '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    IDLE_CLIP,
  ]);

  // ---- 3) Web video — spliced full sequence for the scroll scrub ----
  // [intro] = hero-video.mp4 in full (correct logo: office → pan → closed
  // doors) crossfaded into [ride] = hero-elevator-source.mp4 from
  // ELEVATOR_START (its matching closed-doors shot) to the end (doors open →
  // board → ascend → Floor 02 office + directory). Both are normalized to
  // the same size/fps so xfade accepts them.
  // -g 3 = keyframe every 3 frames (0.1s at 30fps) for near-frame-accurate
  // seeking via video.currentTime. All-I-frame (-g 1) gives perfect accuracy
  // but roughly doubles file size; -g 3 is an excellent tradeoff — seeks land
  // within ±2 frames (0.067s), imperceptible during scroll scrub.
  if (existsSync(ELEVATOR)) {
    const elevatorDur = parseFloat(
      run('ffprobe', [
        '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', ELEVATOR,
      ]).trim()
    );
    const rideSpan = ELEVATOR_END - ELEVATOR_START;
    const total = duration + rideSpan - SPLICE_XFADE;
    console.log(
      `Encoding scrub video (spliced): intro 0→${duration.toFixed(2)}s + elevator ${ELEVATOR_START}→${ELEVATOR_END}s, ${SPLICE_XFADE}s crossfade → ${total.toFixed(2)}s total…`
    );
    run('ffmpeg', [
      '-y',
      '-i', VIDEO,
      '-ss', String(ELEVATOR_START),
      '-t', String(ELEVATOR_END - ELEVATOR_START),
      '-i', ELEVATOR,
      '-filter_complex',
      [
        `[0:v]fps=30,scale=${FRAME_WIDTH}:${FRAME_HEIGHT}:flags=lanczos,setpts=PTS-STARTPTS[intro]`,
        `[1:v]fps=30,scale=${FRAME_WIDTH}:${FRAME_HEIGHT}:flags=lanczos,setpts=PTS-STARTPTS[ride]`,
        `[intro][ride]xfade=transition=fade:duration=${SPLICE_XFADE}:offset=${duration - SPLICE_XFADE}[out]`,
      ].join(';'),
      '-map', '[out]',
      '-c:v', 'libx264',
      '-crf', '30',
      '-g', '3',
      '-preset', 'slow',
      '-pix_fmt', 'yuv420p',
      '-an',
      '-movflags', '+faststart',
      WEB_VIDEO,
    ]);
  } else {
    console.log(`Encoding scrub video: ${FRAME_WIDTH}px, ${duration.toFixed(2)}s (no elevator source — intro only)…`);
    run('ffmpeg', [
      '-y',
      '-i', VIDEO,
      '-vf', `fps=30,scale=${FRAME_WIDTH}:-2:flags=lanczos`,
      '-c:v', 'libx264',
      '-crf', '30',
      '-g', '3',
      '-preset', 'slow',
      '-pix_fmt', 'yuv420p',
      '-an',
      '-movflags', '+faststart',
      WEB_VIDEO,
    ]);
  }

  const videoKB = Math.round(statSync(WEB_VIDEO).size / 1024);
  const videoMB = (videoKB / 1024).toFixed(1);
  const idleKB = Math.round(statSync(IDLE_CLIP).size / 1024);
  const posterKB = Math.round(statSync(POSTER).size / 1024);
  console.log(`Done: hero-web.mp4 ${videoMB}MB, hero-idle.mp4 ${idleKB}KB, hero-poster.jpg ${posterKB}KB`);

  if (videoKB > 25 * 1024) {
    console.warn(`WARNING: hero-web.mp4 is ${videoMB}MB — exceeds Cloudflare Pages' 25MiB per-file limit. Increase CRF.`);
  }
}

main();
