/**
 * Auth flow verification: register → /dashboard
 * Usage: node scripts/verify-auth.mjs
 *
 * Requires dev server running on http://localhost:3000.
 * Starts it automatically if not running.
 *
 * Evidence captured:
 *   - All browser console messages
 *   - All network requests to *.supabase.co
 *   - Final URL after redirect
 *   - Screenshot saved to verify-auth.png
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
  const up = await waitForServer(90_000);
  if (!up) {
    console.error("Dev server failed to start within 90s");
    devProc?.kill();
    process.exit(1);
  }
  console.log("Dev server ready.");
}

// ── Test ─────────────────────────────────────────────────────────────────────

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

let passed = 0;
let failed = 0;

function ok(msg) { console.log("  ✓ " + msg); passed++; }
function fail(msg) { console.error("  ✗ " + msg); failed++; }

const consoleMessages = [];
const supabaseRequests = [];

page.on("console", (msg) => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

page.on("request", (req) => {
  const url = req.url();
  if (url.includes("supabase.co")) {
    supabaseRequests.push({ method: req.method(), url });
  }
});

const timestamp = Date.now();
const testEmail = `verify${timestamp}@mailtest.dev`;
const testPassword = "TestPass123!";

try {
  // ── Step 1: GET / must return 200 landing ────────────────────────────────
  console.log("\n── Step 1: GET / landing page ──");
  const rootResp = await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20_000 });
  const rootStatus = rootResp?.status() ?? 0;
  const rootUrl = page.url();

  if (rootStatus === 200 && rootUrl === `${BASE_URL}/`) {
    ok(`GET / → 200, URL=${rootUrl}`);
  } else if (rootStatus === 200) {
    ok(`GET / → 200 (redirected to ${rootUrl})`);
  } else {
    fail(`GET / → ${rootStatus}, URL=${rootUrl} (expected 200 at /)`);
  }

  // ── Step 2: Navigate to /register ────────────────────────────────────────
  console.log("\n── Step 2: Open /register ──");
  await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle", timeout: 20_000 });

  const registerTitle = await page.locator("h1").first().textContent();
  if (registerTitle?.includes("Бүртгэл")) {
    ok(`/register loaded — title: "${registerTitle}"`);
  } else {
    fail(`/register title unexpected: "${registerTitle}"`);
  }

  // ── Step 3: Fill and submit registration form ─────────────────────────────
  console.log("\n── Step 3: Submit register form ──");
  console.log(`  Email: ${testEmail}`);

  // Clear any previous supabase requests
  supabaseRequests.length = 0;

  await page.fill('input[autocomplete="name"]', "Test User");
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[autocomplete="new-password"]:first-of-type', testPassword);

  // Fill confirm-password (second new-password field)
  const pwdFields = page.locator('input[autocomplete="new-password"]');
  await pwdFields.nth(1).fill(testPassword);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for navigation or error
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
    ok("Redirected to /dashboard after registration");
  } catch {
    // Check for error message
    const errorEl = page.locator("div[class*='danger']").first();
    const errorText = await errorEl.textContent().catch(() => null);
    if (errorText && errorText.includes("rate limit")) {
      fail(`Rate limit hit (429) — disable "Confirm email" in Supabase Auth → Providers → Email, then re-run. Error: "${errorText}"`);
    } else {
      fail(`Did NOT redirect to /dashboard. Error shown: "${errorText ?? "(none)"}" — URL: ${page.url()}`);
    }
  }

  // ── Step 4: Capture network evidence ─────────────────────────────────────
  console.log("\n── Step 4: Network evidence ──");
  if (supabaseRequests.length === 0) {
    fail("ZERO network requests to *.supabase.co — Supabase was never called");
  } else {
    ok(`${supabaseRequests.length} request(s) to supabase.co:`);
    supabaseRequests.forEach((r) => console.log(`    ${r.method} ${r.url}`));
  }

  // ── Step 5: Console errors ────────────────────────────────────────────────
  console.log("\n── Step 5: Browser console ──");
  const errors = consoleMessages.filter((m) => m.type === "error");
  if (errors.length === 0) {
    ok("No browser console errors");
  } else {
    errors.forEach((e) => fail(`Console error: ${e.text}`));
  }

  // ── Step 6: Screenshot ───────────────────────────────────────────────────
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
  ok(`Screenshot saved → ${SCREENSHOT_PATH}`);

  console.log("\n── All console messages ──");
  consoleMessages.forEach((m) => console.log(`  [${m.type}] ${m.text}`));

} finally {
  await browser.close();
  if (devProc) {
    devProc.kill();
    console.log("Dev server stopped.");
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(60));
console.log(`Passed: ${passed}  Failed: ${failed}`);
if (failed > 0) {
  console.error("AUTH VERIFICATION FAILED — see above");
  process.exit(1);
} else {
  console.log("All auth checks passed ✓");
}
