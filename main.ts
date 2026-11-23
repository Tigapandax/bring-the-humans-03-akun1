// bring-the-humans-03 entry validator (Node 22, standard library only).
//
// The entry is the video itself: an original short vertical ad for make.fun,
// posted publicly on TikTok from a public account, with the bounty's line and
// the account's play code in its caption, and VIDEO.json naming the video.
// This program does two things:
//   1. Validate the entry files in the repository (VIDEO.json, the mp4, the
//      caption) against the bounty requirements, printing one line per check
//      and exiting non-zero on any failure, so a bad entry never reaches
//      the gate silently.
//   2. Copy VIDEO.json to the output directory, where the gate reads it,
//      exactly as the starter program did.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const VIDEO_FILE = 'makefun-tiktok-ad.mp4';
const CAPTION_FILE = 'caption.txt';
const VIDEO_JSON_FILE = 'VIDEO.json';

const PLAY_CODE = /makefun-[a-z]+-[a-z]+-[a-z]+/;
const REFERRAL_CODE = 'ez8ygcr2';

interface CheckResult {
  name: string;
  ok: boolean;
  detail: string;
}

const results: CheckResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
}

function readText(file: string): string | null {
  const path = join(BOT_DIR, file);
  if (!existsSync(path)) {
    check(file, false, `missing ${path}`);
    return null;
  }
  return readFileSync(path, 'utf8');
}

// 1. VIDEO.json names a real TikTok video URL (no placeholder).
const videoJsonText = readText(VIDEO_JSON_FILE);
if (videoJsonText !== null) {
  let url: string | null = null;
  try {
    url = (JSON.parse(videoJsonText) as { url?: unknown }).url as string;
  } catch (err) {
    check(VIDEO_JSON_FILE, false, `not valid JSON: ${(err as Error).message}`);
  }
  if (url !== null) {
    // Parse the URL for real instead of only matching a pattern: the host
    // must be TikTok's and the path must be a video page.
    let parsed: URL | null = null;
    try {
      parsed = new URL(url);
    } catch {
      check('video-url', false, `not a valid URL: ${url}`);
    }
    if (parsed !== null) {
      const pathOk = /^\/@[^/]+\/video\/\d+$/.test(parsed.pathname);
      check(
        'video-url',
        parsed.hostname === 'www.tiktok.com' && pathOk,
        url,
      );
    }
  }
}

// 2. The ad video exists and is non-empty.
const videoPath = join(BOT_DIR, VIDEO_FILE);
if (!existsSync(videoPath)) {
  check('video-file', false, `missing ${videoPath}`);
} else {
  const size = statSync(videoPath).size;
  // Existence and size are not enough: check the file actually starts with
  // an MP4 box (a 4-byte size followed by 'ftyp'), so a truncated or
  // misnamed file cannot pass as the ad.
  const header = readFileSync(videoPath).subarray(0, 12);
  const isMp4 = size > 0 && header.length >= 8 && header.subarray(4, 8).toString('ascii') === 'ftyp';
  check('video-file', isMp4, `${VIDEO_FILE} ${size} bytes, MP4 ftyp header ${isMp4 ? 'present' : 'MISSING'}`);
}

// 3. The caption carries the bounty's line, make.fun, a play code and the
//    referral code.
const caption = readText(CAPTION_FILE);
if (caption !== null) {
  check('caption-bounty', caption.includes('$500 bounty'), '"$500 bounty" present');
  check('caption-makefun', caption.includes('make.fun'), '"make.fun" present');
  const playCode = caption.match(PLAY_CODE);
  check('caption-play-code', playCode !== null, playCode ? playCode[0] : 'no play code found');
  check('caption-referral', caption.includes(REFERRAL_CODE), `referral code ${REFERRAL_CODE} present`);
}

const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`Entry validation failed: ${failed.length} check(s) failed.`);
  process.exit(1);
}
console.log(`Entry validation passed: ${results.length}/${results.length} checks.`);

// Copy VIDEO.json to the output directory, where the gate reads it.
mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, VIDEO_JSON_FILE), join(OUTPUT_DIR, VIDEO_JSON_FILE));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`Copied ${VIDEO_JSON_FILE} to ${OUTPUT_DIR}.`);
