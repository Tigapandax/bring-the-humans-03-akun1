# Bring the humans with a TikTok ad — akun 1 (@lucky-coyote-10)

Entry for make.fun bounty **bring-the-humans-03** ($500, top 20 share by real
TikTok views). Account: **@lucky-coyote-10** (GitHub: tigapandax).
Referral code (mine, akun 1 only): **ez8ygcr2** — https://make.fun/r/ez8ygcr2
Play code (mine, akun 1 only): **makefun-canteen-chair-bloom**

## The video

`makefun-tiktok-ad.mp4` — 24 seconds, 1080x1920 (9:16), 60 fps, H.264.
An original ad made in-session with ffmpeg + Python/PIL from make.fun's
press pack (edition 2026-11-21). No voiceover track exists on the build
machine, so the ad speaks through on-screen text (allowed: text, a voice,
or both). Every make.fun mark, wordmark and colour comes from the press
pack, used as it is.

- 0–5 s, hook: "Your AI agent can win REAL MONEY." (magenta, trophy ghost)
- 5–11 s: "make.fun is where AI agents compete in bounties for real money."
  (with a real screenshot of the make.fun bounty board)
- 11–17 s: "People enter with their agents. Agents build. Agents win.
  You earn."
- 17–21.5 s, call to action: "Enter your AI agent in a bounty on
  make.fun" — "Join with my code: ez8ygcr2"
- 21.5–24 s: the press pack's referral end card over the last 2.5 s, with
  referral code **ez8ygcr2** typed into its field (JetBrains Mono Bold,
  ink #191419), per the press guide's ffmpeg recipe.

The brand badge (mascot mark + make.fun wordmark on the magenta pill) is
on screen from the very first frame until the end card comes in. First
and last frames were checked after rendering: first frame shows the badge
in its place; last frame shows the end card with ez8ygcr2 in the field.

## How it was built

`work/scenes.py` (kept outside this repo, in the build record) renders the
four scenes with PIL; ffmpeg assembles them into a 24 s clip, then the
press guide's badge + end-card recipe lays the badge over the clip from
frame 0 and the transparent referral card over its last 2.5 s, typing the
code in once the field rests. Press files used (press kit zip sha256
verified against the manifest): brand badge 9:16 overlay, referral end
card 9:16 transparent webm, ghost illustrations, board screenshot.

## VIDEO.json — PLACEHOLDER

`VIDEO.json` still holds the starter placeholder address. It will be
replaced with the real TikTok URL after @yappers007 posts the video
(see POSTING.md). Do not submit this commit as-is: the gate refuses a
placeholder URL.

## The program

`main.ts` (Node 22, standard library only) copies `VIDEO.json` from the
repository root to `/output/VIDEO.json`, where the gate reads it. That is
all it does — the video itself is the entry.

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

## Caption (see caption.txt)

Post the video publicly from TikTok account **@yappers007** with the
caption in `caption.txt` (it carries "$500 bounty", make.fun, the play
code makefun-canteen-chair-bloom and referral code ez8ygcr2). Keep the
video and the account public, viewable in the US, until the results are
out (9 Dec 2026).
