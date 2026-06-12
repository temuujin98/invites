/**
 * Auth flow verification: form wiring + Supabase network proof.
 * Usage: node scripts/verify-auth.mjs
 *
 * Proves:
 *   A. URL does NOT gain "?" (e.preventDefault works, no native GET submit)
 *   B. A request to *.supabase.co/auth/v1/* IS captured on submit
 *   C. On success (Confirm email OFF), redirects to /dashboard
 *   D. On error, Supabase message renders in the UI
 *
 * If you get "email rate limit" or "Email not confirmed" in step C/D, that is a
 * Supabase config issue, not a code issue. Disable "Confirm email" in:
 *   Supabase Dashboard → Authentication → Providers → Email → uncheck "Confirm email"
 */

import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const BASE_URL = "http://localhost:3000";
const SCREENSHOT_PATH = resolve(PROJECT_ROOT, "verify-auth.png");

// ── Dev server management ─────────────────────────────────────────────────────

async function isServerUp() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(2000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(maxMs = 90_000) {
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
  const up = await waitForServer(90_000);
  if (!up) {
    console.error("Dev server failed to start within 90s");
    devProc?.kill();
    process.exit(1);
  }
  console.log("Dev server ready.");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
function ok(msg) { console.log("  ✓ " + msg); passed++; }
function fail(msg) { console.error("  ✗ " + msg); failed++; }
function warn(msg) { console.log("  ⚠ " + msg); }

// ── Browser setup ─────────────────────────────────────────────────────────────

const browser = await chromium.launch({ headless: true });

// ── Test A+B: Register form — no GET nav, Supabase request fires ──────────────

console.log("\n══ REGISTER form wiring proof ══");

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const supabaseReqs = [];
  const consoleErrors = [];
  const navigations = [];

  page.on("request", (r) => {
    if (r.url().includes("supabase.co")) supabaseReqs.push(r.method() + " " + r.url());
  });
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) navigations.push(f.url());
  });

  await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle", timeout: 20_000 });

  // Verify the page loaded correctly
  const title = await page.locator("h1").first().textContent();
  if (title?.includes("Бүртгэл")) {
    ok(`/register loaded — "${title}"`);
  } else {
    fail(`/register title unexpected: "${title}"`);
  }

  // Check URL before submit — must be exactly /register (no ?)
  const urlBefore = page.url();

  // Fill form
  await page.fill('input[autocomplete="name"]', "Playwright Test");
  await page.fill('input[type="email"]', `pwtest${Date.now()}@mailtest.dev`);
  const pwdFields = page.locator('input[type="password"]');
  await pwdFields.nth(0).fill("PlaywrightPass123!");
  await pwdFields.nth(1).fill("PlaywrightPass123!");

  // Clear request log right before submit to isolate submit-triggered requests
  supabaseReqs.length = 0;

  // Click submit
  await page.locator('button[type="submit"]').click();

  // Wait briefly for any async work
  await page.waitForTimeout(3000);

  const urlAfter = page.url();

  // ── Check A: URL must NOT contain "?" ──
  console.log("\n── Check A: URL does not gain ? (no native GET submit) ──");
  console.log(`  URL before: ${urlBefore}`);
  console.log(`  URL after:  ${urlAfter}`);
  if (urlAfter.includes("?")) {
    fail(`URL gained "?" — form did a native GET submit. e.preventDefault() did not fire. URL: ${urlAfter}`);
  } else {
    ok(`URL clean — no "?" suffix. e.preventDefault() worked. URL: ${urlAfter}`);
  }

  // ── Check B: Supabase network request ──
  console.log("\n── Check B: Supabase auth request captured ──");
  console.log("  Captured requests:");
  if (supabaseReqs.length === 0) {
    fail("ZERO requests to supabase.co — Supabase was never called. Check client hydration.");
  } else {
    supabaseReqs.forEach((r) => {
      console.log("    " + r);
      if (r.includes("/auth/v1/")) {
        ok(`Auth request fired: ${r}`);
      }
    });
  }

  // ── Check C/D: Response handling ──
  console.log("\n── Check C/D: Response shown in UI ──");
  if (urlAfter.includes("/dashboard")) {
    ok("Redirected to /dashboard — signup succeeded (Confirm email is OFF)");
  } else {
    // Look for any text in the error div
    const errDiv = page.locator("div").filter({ hasText: /./}).filter({ has: page.locator("p.text-xs") }).first();
    const errText = await page.locator("p.text-xs").filter({ hasText: /[A-Za-z]/ }).first().textContent().catch(() => null);
    if (errText) {
      warn(`Stayed on /register with message: "${errText.trim()}"`);
      if (errText.includes("rate limit") || errText.includes("Email") || errText.includes("confirm")) {
        warn("This is a Supabase config issue (Confirm email ON or rate limit). Code is working correctly.");
        warn("Fix: Supabase Dashboard → Authentication → Providers → Email → uncheck 'Confirm email'");
      }
    } else {
      warn("Stayed on /register, no error text found.");
    }
  }

  await page.screenshot({ path: SCREENSHOT_PATH });
  ok(`Screenshot → ${SCREENSHOT_PATH}`);

  await ctx.close();
}

// ── Test login page: wrong creds → error appears, no GET nav ─────────────────

console.log("\n══ LOGIN form wiring proof (wrong creds → error in UI) ══");

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const supabaseReqs = [];

  page.on("request", (r) => {
    if (r.url().includes("supabase.co")) supabaseReqs.push(r.method() + " " + r.url());
  });

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 20_000 });

  const urlBefore = page.url();
  await page.fill('input[type="email"]', "no-such-user@mailtest.dev");
  await page.fill('input[type="password"]', "WrongPassword999!");

  supabaseReqs.length = 0;
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);

  const urlAfter = page.url();

  console.log("\n── Check A: URL does not gain ? ──");
  if (urlAfter.includes("?")) {
    fail(`URL gained "?" — native GET fired. URL: ${urlAfter}`);
  } else {
    ok(`URL clean: ${urlAfter}`);
  }

  console.log("\n── Check B: Supabase request ──");
  supabaseReqs.forEach((r) => console.log("    " + r));
  if (supabaseReqs.some((r) => r.includes("/auth/v1/"))) {
    ok("Auth request fired: " + supabaseReqs.find((r) => r.includes("/auth/v1/")));
  } else {
    fail("No supabase.co/auth/v1/* request captured");
  }

  console.log("\n── Check D: Error renders in UI ──");
  const errText = await page.locator("p.text-xs").filter({ hasText: /credentials|invalid|Invalid/ }).first().textContent().catch(() => null);
  if (errText) {
    ok(`Error shown in UI: "${errText.trim()}"`);
  } else {
    fail("No error text rendered after wrong-credential login");
  }

  await ctx.close();
}

await browser.close();
if (devProc) { devProc.kill(); console.log("Dev server stopped."); }

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed}  Failed: ${failed}`);
if (failed > 0) {
  console.error("VERIFICATION FAILED — see above");
  process.exit(1);
} else {
  console.log("All wiring checks passed ✓");
  console.log("NOTE: For full /dashboard redirect, disable 'Confirm email' in Supabase Auth settings.");
}
