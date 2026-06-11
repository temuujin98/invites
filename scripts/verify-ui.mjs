/**
 * UI regression check for InviteRenderer, QRPreview, and PhonePreviewFrame.
 * Usage: node scripts/verify-ui.mjs
 * Or:    npm run verify:ui
 *
 * Assumes dev server is running on http://localhost:3000.
 * Will attempt to start it if not running.
 */

import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const SCREENSHOT_PATH = resolve(PROJECT_ROOT, "verify-ui.png");
const BASE_URL = "http://localhost:3000";
const PAGE_URL = `${BASE_URL}/dev/components`;

// ── Start dev server if not running ──────────────────────────────────────────

async function isServerUp() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(maxMs = 60_000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    if (await isServerUp()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

let devProc = null;

if (!(await isServerUp())) {
  console.log("Dev server not running — starting…");
  devProc = spawn("npm", ["run", "dev"], {
    cwd: PROJECT_ROOT,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  devProc.stdout.on("data", (d) => process.stdout.write("[next] " + d));
  devProc.stderr.on("data", (d) => process.stderr.write("[next] " + d));
  const up = await waitForServer(60_000);
  if (!up) {
    console.error("Dev server failed to start within 60s");
    devProc?.kill();
    process.exit(1);
  }
  console.log("Dev server ready.");
}

// ── Run checks ───────────────────────────────────────────────────────────────

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 2400 } });

let passed = 0;
let failed = 0;

function ok(msg) {
  console.log("  ✓ " + msg);
  passed++;
}
function fail(msg) {
  console.error("  ✗ " + msg);
  failed++;
}

try {
  console.log("\nNavigating to " + PAGE_URL + "...");
  await page.goto(PAGE_URL, { waitUntil: "networkidle", timeout: 30_000 });

  // Scroll to invite-renderer section and wait for ResizeObserver + paint
  await page.evaluate(() =>
    document.getElementById("invite-renderer")?.scrollIntoView(),
  );
  await page.waitForTimeout(2000);

  // ── DEBUG: dump renderer container widths + first few children ──────────
  const debugInfo = await page.evaluate(() => {
    const renderers = Array.from(document.querySelectorAll("div")).filter(
      (el) =>
        el.style.position === "relative" &&
        el.style.width === "100%" &&
        el.style.paddingBottom &&
        el.style.overflow === "hidden",
    );
    return renderers.slice(0, 4).map((el, i) => {
      const rect = el.getBoundingClientRect();
      const children = Array.from(el.children).map((c) => {
        const ce = c;
        const cr = c.getBoundingClientRect();
        return {
          tag: c.tagName,
          style: ce.getAttribute("style") || "",
          text: ce.innerText ? ce.innerText.slice(0, 80) : "",
          w: Math.round(cr.width),
          h: Math.round(cr.height),
          left: Math.round(cr.left),
          top: Math.round(cr.top),
        };
      });
      return {
        index: i,
        containerW: Math.round(rect.width),
        containerH: Math.round(rect.height),
        paddingBottom: el.style.paddingBottom,
        childCount: children.length,
        children,
      };
    });
  });

  console.log("\n── InviteRenderer debug ──");
  debugInfo.forEach((d) => {
    console.log(
      "  Renderer[" + d.index + "]: containerW=" + d.containerW +
      " containerH=" + d.containerH +
      " paddingBottom=" + d.paddingBottom +
      " children=" + d.childCount,
    );
    d.children.forEach((c, ci) => {
      console.log(
        "    child[" + ci + "] <" + c.tag + ">" +
        " style=\"" + c.style.slice(0, 100) + "\"" +
        " rect=(" + c.left + "," + c.top + "," + c.w + "x" + c.h + ")" +
        " text=\"" + c.text.slice(0, 40) + "\"",
      );
    });
  });

  // ── CHECK A: Text "Анужин 6 нас" visible in the renderer section ────────
  console.log("\n── Check A: field text visible ──");
  const titleText = "Анужин 6 нас";

  const textMatch = await page.evaluate(({ sectionId, needle }) => {
    const section = document.getElementById(sectionId);
    if (!section) return { found: false, error: "section not found" };
    const allEls = Array.from(section.querySelectorAll("span, div, p"));
    for (const el of allEls) {
      const txt = el.innerText ? el.innerText.trim() : "";
      if (txt && txt.includes(needle)) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          found: true,
          text: txt.slice(0, 80),
          rect: {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          fontSize: style.fontSize,
          color: style.color,
          visibility: style.visibility,
          display: style.display,
        };
      }
    }
    return { found: false };
  }, { sectionId: "invite-renderer", needle: titleText });

  console.log("  Title text search result:", JSON.stringify(textMatch, null, 2));

  if (!textMatch || !textMatch.found) {
    fail("Text \"" + titleText + "\" not found inside #invite-renderer");
  } else {
    const r = textMatch.rect;
    if (r.width <= 0 || r.height <= 0) {
      fail("Text found but bounding box is zero: " + JSON.stringify(r));
    } else {
      const fs = parseFloat(textMatch.fontSize);
      if (fs <= 0) {
        fail("Text found, bbox ok, but computed font-size is " + textMatch.fontSize);
      } else {
        ok(
          "\"" + titleText + "\" visible — bbox " + r.width + "x" + r.height +
          ", fontSize=" + textMatch.fontSize,
        );
      }
    }
  }

  // ── CHECK B: Screenshot of 3-mode comparison section ────────────────────
  console.log("\n── Check B: screenshot 3-mode section ──");

  const threeMode = await page.evaluate(() => {
    const section = document.getElementById("invite-renderer");
    if (!section) return null;
    const mt4 = section.querySelector(".mt-4");
    if (!mt4) return null;
    const rect = mt4.getBoundingClientRect();
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });

  if (threeMode && threeMode.width > 0 && threeMode.height > 0) {
    await page.screenshot({
      path: SCREENSHOT_PATH,
      clip: {
        x: Math.max(0, threeMode.x - 20),
        y: Math.max(0, threeMode.y - 20),
        width: threeMode.width + 40,
        height: Math.min(threeMode.height + 40, 900),
      },
    });
    ok("Screenshot saved to " + SCREENSHOT_PATH);
    console.log("  >>> Inspect: " + SCREENSHOT_PATH);
  } else {
    await page.screenshot({ path: SCREENSHOT_PATH });
    fail(
      "3-mode container not found/zero (" + JSON.stringify(threeMode) + ") — full page screenshot taken",
    );
  }

  // ── CHECK C: QR canvas has >5% dark pixels ───────────────────────────────
  console.log("\n── Check C: QR canvas dark pixel ratio ──");

  const qrResult = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll("canvas"));
    const results = canvases.map((canvas, i) => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        return { index: i, w, h, darkRatio: 0, error: "zero size" };
      }
      try {
        const ctx = canvas.getContext("2d");
        if (!ctx) return { index: i, w, h, darkRatio: 0, error: "no 2d context" };
        const data = ctx.getImageData(0, 0, w, h).data;
        let dark = 0;
        const total = w * h;
        for (let j = 0; j < data.length; j += 4) {
          const brightness = (data[j] + data[j + 1] + data[j + 2]) / 3;
          if (brightness < 128) dark++;
        }
        return {
          index: i,
          w,
          h,
          darkRatio: parseFloat((dark / total).toFixed(4)),
          dark,
          total,
        };
      } catch (e) {
        return { index: i, w, h, darkRatio: 0, error: String(e) };
      }
    });
    return { canvasCount: canvases.length, canvases: results };
  });

  console.log("  QR canvas result:", JSON.stringify(qrResult, null, 2));

  if (qrResult.canvasCount === 0) {
    fail("No <canvas> elements found on page");
  } else {
    const best = qrResult.canvases.reduce((a, b) =>
      (b.darkRatio ?? 0) > (a.darkRatio ?? 0) ? b : a,
    );
    if (!best || best.darkRatio < 0.05) {
      fail(
        "Best canvas has only " + ((best?.darkRatio ?? 0) * 100).toFixed(1) +
        "% dark pixels — QR not drawn (need >5%)",
      );
    } else {
      ok(
        "QR canvas has " + (best.darkRatio * 100).toFixed(1) +
        "% dark pixels at " + best.w + "x" + best.h,
      );
    }
  }
} finally {
  await browser.close();
  if (devProc) {
    devProc.kill();
    console.log("Dev server stopped.");
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(50));
console.log("Passed: " + passed + "  Failed: " + failed);
if (failed > 0) {
  console.error("VERIFICATION FAILED — see debug output above");
  process.exit(1);
} else {
  console.log("All checks passed ✓");
}
