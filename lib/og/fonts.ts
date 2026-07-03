import "server-only";

// ── Font loading for satori (next/og) ────────────────────────────────────────
// satori cannot read next/font — it needs raw font ArrayBuffers, and it can only
// parse ttf/otf/woff (NOT woff2). The invite copy is Mongolian Cyrillic, so we
// MUST load a Cyrillic-covering face or every character renders as an empty box.
//
// We resolve the fonts through the Google Fonts CSS API. Modern browsers get
// woff2 from that endpoint; sending a legacy User-Agent makes it return .ttf
// URLs instead — the format satori needs. We request the cyrillic subset
// explicitly. Results are memoized per lambda instance.

type Weight = 400 | 500 | 700;

// Legacy UA → the CSS API serves .ttf src URLs (modern UAs get woff2).
const LEGACY_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64)";
const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&subset=cyrillic";

export interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  weight: Weight;
  style: "normal";
}

let cache: Promise<LoadedFont[]> | null = null;

// The CSS API groups @font-face blocks by weight in the order requested. Parse
// each block's ttf url and pair it with its font-weight.
function parseFaces(css: string): { url: string; weight: Weight }[] {
  const faces: { url: string; weight: Weight }[] = [];
  const blocks = css.split("@font-face");
  for (const block of blocks) {
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/src:\s*url\((https:[^)]+\.ttf)\)/);
    if (weightMatch && urlMatch) {
      const w = Number(weightMatch[1]) as Weight;
      if (w === 400 || w === 500 || w === 700) {
        faces.push({ url: urlMatch[1], weight: w });
      }
    }
  }
  return faces;
}

async function fetchAll(): Promise<LoadedFont[]> {
  const css = await fetch(CSS_URL, {
    headers: { "User-Agent": LEGACY_UA },
    cache: "force-cache",
  }).then((r) => {
    if (!r.ok) throw new Error(`Google Fonts CSS fetch failed (${r.status})`);
    return r.text();
  });

  const faces = parseFaces(css);
  if (faces.length === 0) {
    throw new Error("No .ttf font faces resolved from Google Fonts CSS");
  }

  // Dedupe by weight (the cyrillic subset yields one face per weight).
  const byWeight = new Map<Weight, string>();
  for (const f of faces) if (!byWeight.has(f.weight)) byWeight.set(f.weight, f.url);

  return Promise.all(
    [...byWeight.entries()].map(async ([weight, url]) => {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) throw new Error(`Font fetch failed (${res.status}) for weight ${weight}`);
      const data = await res.arrayBuffer();
      return { name: "Roboto", data, weight, style: "normal" as const };
    }),
  );
}

// Load (and memoize) the Cyrillic Roboto set satori needs. Call once per render.
export function loadOgFonts(): Promise<LoadedFont[]> {
  if (!cache) {
    cache = fetchAll().catch((err) => {
      // Reset so a transient failure doesn't poison every subsequent render.
      cache = null;
      throw err;
    });
  }
  return cache;
}
