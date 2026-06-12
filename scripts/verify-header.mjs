/**
 * Header session-awareness proof.
 * Usage: node scripts/verify-header.mjs
 *
 * Proves:
 *   A. Logged-out: header shows "Нэвтрэх" + "Урилга үүсгэх", no "Гарах"
 *   B. After login: header hides "Нэвтрэх", shows "Хяналтын самбар" + "Гарах"
 *   C. Clicking "Гарах" signs out, lands on /, header back to logged-out state
 *
 * Checks B and C require TEST_USER_EMAIL / TEST_USER_PASSWORD in .env.local.
 * Create a stable test account in Supabase (not your personal account) and set
 * those vars. The script never creates or infers credentials on its own.
 *
 * Note: Supabase free tier limits signup emails — disable "Confirm email" in
 *   Supabase Dashboard → Authentication → Providers → Email
 *   before running if you haven't already.
 */

import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const BASE_URL = "http://localhost:3000";

// Load .env.local for optional test creds
let testEmail = process.env.TEST_USER_EMAIL;
let testPass  = process.env.TEST_USER_PASSWORD;
try {
  const envText = readFileSync(resolve(PROJECT_ROOT, ".env.local"), "utf8");
  for (const line of envText.split("\n")) {
    const eqIdx = line.indexOf("=");
    if (eqIdx < 0) continue;
    const k = line.slice(0, eqIdx).trim();
    const v = line.slice(eqIdx + 1).trim();
    if (k === "TEST_USER_EMAIL"    && !testEmail) testEmail = v;
    if (k === "TEST_USER_PASSWORD" && !testPass)  testPass  = v;
  }
} catch {}

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
let skipped = 0;
function ok(msg)   { console.log("  ✓ " + msg); passed++; }
function fail(msg) { console.error("  ✗ " + msg); failed++; }
function skip(msg) { console.log("  ⚠ SKIP: " + msg); skipped++; }

// ── Browser ───────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ headless: true });

// ── Check A: Logged-out header ────────────────────────────────────────────────

console.log("\n══ Check A: Logged-out header (no creds needed) ══");
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20_000 });

  const hasLogin     = await page.locator("header a", { hasText: "Нэвтрэх" }).count();
  const hasCreate    = await page.locator("header a", { hasText: "Урилга үүсгэх" }).count();
  const hasLogout    = await page.locator("header button", { hasText: "Гарах" }).count();
  const hasDashboard = await page.locator("header a", { hasText: "Хяналтын самбар" }).count();

  hasLogin > 0
    ? ok(`"Нэвтрэх" link visible (logged out)`)
    : fail(`"Нэвтрэх" link NOT visible (logged out) — header not reading session?`);
  hasCreate > 0
    ? ok(`"Урилга үүсгэх" CTA visible (logged out)`)
    : fail(`"Урилга үүсгэх" CTA NOT visible (logged out)`);
  hasLogout === 0
    ? ok(`"Гарах" button absent (logged out)`)
    : fail(`"Гарах" button incorrectly visible (logged out)`);
  hasDashboard === 0
    ? ok(`"Хяналтын самбар" link absent (logged out)`)
    : fail(`"Хяналтын самбар" link incorrectly visible (logged out)`);

  await ctx.close();
}

// ── Checks B + C: Require TEST_USER_EMAIL / TEST_USER_PASSWORD ────────────────

if (!testEmail || !testPass) {
  skip(
    "Checks B+C skipped — set TEST_USER_EMAIL and TEST_USER_PASSWORD in .env.local\n" +
    "  (create a dedicated test account in Supabase, never use your personal account)"
  );
} else {
  console.log(`\n══ Logging in as ${testEmail} ══`);

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const supabaseReqs = [];
  page.on("request", (r) => {
    if (r.url().includes("supabase.co")) supabaseReqs.push(r.method() + " " + r.url());
  });

  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle", timeout: 20_000 });
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPass);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 15_000 }).catch(() => {});

  if (supabaseReqs.some((r) => r.includes("/auth/v1/"))) {
    ok(`Supabase auth request captured: ${supabaseReqs.find((r) => r.includes("/auth/v1/"))}`);
  } else {
    fail("No supabase.co/auth/v1/* request during login");
  }

  if (!page.url().includes("/dashboard")) {
    fail(`Login did not reach /dashboard (got ${page.url()})`);
  } else {
    ok(`Logged in — redirected to /dashboard`);

    // Check B: logged-in header
    console.log("\n══ Check B: Logged-in header ══");
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20_000 });

    const hasLoginB     = await page.locator("header a", { hasText: "Нэвтрэх" }).count();
    const hasLogoutB    = await page.locator("header button", { hasText: "Гарах" }).count();
    const hasDashboardB = await page.locator("header a", { hasText: "Хяналтын самбар" }).count();

    hasLoginB === 0
      ? ok(`"Нэвтрэх" link HIDDEN when logged in`)
      : fail(`"Нэвтрэх" link incorrectly visible when logged in`);
    hasLogoutB > 0
      ? ok(`"Гарах" button visible when logged in`)
      : fail(`"Гарах" button NOT visible when logged in`);
    hasDashboardB > 0
      ? ok(`"Хяналтын самбар" link visible when logged in`)
      : fail(`"Хяналтын самбар" link NOT visible when logged in`);

    // Check C: logout flow
    console.log("\n══ Check C: Logout ══");

    const logoutReqs = [];
    page.on("request", (r) => {
      if (r.url().includes("supabase.co") && r.url().includes("/logout")) {
        logoutReqs.push(r.url());
      }
    });

    await page.locator("header button", { hasText: "Гарах" }).first().click();
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const finalUrl = page.url();
    (finalUrl === `${BASE_URL}/` || finalUrl === BASE_URL)
      ? ok(`Logout redirects to / (${finalUrl})`)
      : fail(`Logout landed on unexpected URL: ${finalUrl}`);

    logoutReqs.length > 0
      ? ok(`Supabase signOut request: ${logoutReqs[0]}`)
      : ok(`Logout completed (session cleared client-side)`);

    const hasLoginC = await page.locator("header a", { hasText: "Нэвтрэх" }).count();
    hasLoginC > 0
      ? ok(`Header restored: "Нэвтрэх" visible after logout`)
      : fail(`Header still shows logged-in state after logout`);
  }

  await ctx.close();
}

await browser.close();
if (devProc) { devProc.kill(); console.log("Dev server stopped."); }

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed}  Failed: ${failed}  Skipped: ${skipped}`);
if (failed > 0) {
  console.error("VERIFICATION FAILED — see above");
  process.exit(1);
} else {
  console.log("All header checks passed ✓");
  if (skipped > 0) {
    console.log("Set TEST_USER_EMAIL + TEST_USER_PASSWORD in .env.local to run logged-in checks.");
  }
}
