#!/usr/bin/env bash
#
# Regenerates the PNG sources for the AI backdrops through the Codex CLI.
# Only the WebP output is committed, so run this first when a backdrop must
# change, then run: node scripts/optimize-backgrounds.mjs
#
# Requires a logged-in Codex CLI (ChatGPT plan). Set CODEX to its path.
# Generate invitation backgrounds via Codex, 4 at a time.
CODEX="${CODEX:-$LOCALAPPDATA/OpenAI/Codex/bin/8e8bf206e63ac436/codex.exe}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/client/public/backgrounds"
WORK="${TMPDIR:-/tmp}/invites-backdrops"
mkdir -p "$WORK"

STYLE='Photographic macro shot of a luxury invitation backdrop, portrait 9:16 aspect ratio (about 941x1672 pixels).
- Base: thick cream/ivory plaster with sculpted bas-relief scrollwork and foliage, soft studio side-light so the relief casts gentle shadows, visible paper and plaster grain.
- Accent botanicals sit ONLY in the top-right corner and the bottom-left corner, with fine sprigs trailing inward.
- The whole vertical center band is completely EMPTY smooth cream surface: no ornament, no text, no lettering, no numbers, no logo, no watermark, no people. It is reserved for typography.
- Mood: elegant, editorial, high-end stationery photography.
Accent for THIS image: '

gen() {
  local name="$1" accent="$2"
  "$CODEX" exec -s workspace-write --skip-git-repo-check -C "$WORK" \
    "Generate ONE image and save it as ./$name.png in the current directory. Do not do anything else.

$STYLE$accent" >"$WORK/$name.log" 2>&1
  if [ -f "$WORK/$name.png" ]; then echo "OK   $name"; else echo "FAIL $name"; fi
}

run_batch() {
  for spec in "$@"; do
    gen "${spec%%|*}" "${spec#*|}" &
  done
  wait
}

run_batch \
  "ai-birthday-coral|warm coral and soft peach real flowers (ranunculus, cosmos), a few tiny gold-dust speckles; festive but refined" \
  "ai-ceremony-sage|muted sage-green eucalyptus leaves and pale ivory blossoms; calm, ceremonial, restrained" \
  "ai-graduation-ocean|deep ocean-blue and teal flowers with slender green stems; fresh, confident, modern" \
  "ai-anniversary-midnight|midnight-blue and deep indigo velvet flowers with antique-silver leaf accents; intimate, nocturnal"

run_batch \
  "ai-party-noir|charcoal-black and graphite flowers with subtle metallic gunmetal sheen on a warm greige plaster base; dramatic, editorial" \
  "ai-naming-blossom|soft pastel pink and cream cherry blossom sprays with tiny buds; gentle, tender, suited to a newborn naming celebration" \
  "ai-newhome-terra|terracotta and warm clay-orange flowers with dried wheat and olive sprigs; earthy, homely, sunlit" \
  "ai-corporate-forest|deep forest-green foliage and dark ivy leaves, minimal flowers, on a cooler stone-grey plaster base; understated, professional"

echo "--- collecting ---"
for f in "$WORK"/*.png; do
  [ -f "$f" ] || continue
  cp "$f" "$OUT/$(basename "$f")" && echo "copied $(basename "$f")"
done
echo "--- done ---"
