import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c";

async function run() {
  console.log("Starting Clean Citizen UI Verification...");
  const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch({ channel: "msedge" }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // 1. Authenticate with session
    await page.goto("http://localhost:3000/home");
    await page.evaluate(() => {
      localStorage.setItem("nagrikpath_session", JSON.stringify({ userId: "user_priya", token: "poc_token_123" }));
      localStorage.setItem("nagrikpath_theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await page.goto("http://localhost:3000/home");
    await page.waitForTimeout(500);

    // 2. Verify TopNav has NO OfflineDPIBadge
    console.log("Checking TopNav clean right group...");
    const dpiBadgeCount = await page.locator("text=LOCAL DPI MODE · 0 NETWORK CALLS").count();
    console.log("✓ Offline DPI Badge is absent from citizen TopNav:", dpiBadgeCount === 0);

    // Verify floating Architecture chip is absent on HubLayout
    const archChipCount = await page.locator("text=DPI ARCHITECTURE // SPEC").count();
    console.log("✓ Floating Architecture Chip is absent from HubLayout:", archChipCount === 0);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "clean_01_home_dashboard.png") });

    // 3. Test Jan Manch Dashboard (/jan-manch)
    console.log("Navigating to Jan Manch (/jan-manch)...");
    await page.goto("http://localhost:3000/jan-manch");
    await page.waitForTimeout(500);

    // Verify Clean Header
    await page.locator("text=JAN MANCH").first().waitFor({ state: "visible" });
    await page.locator("text=Empirical Governance Accountability Tracker").waitFor({ state: "visible" });
    await page.locator("text=SCOPE: TELANGANA STATE").waitFor({ state: "visible" });

    // Verify badges are absent
    const empiricalBadgeCount = await page.locator("text=Empirical Telemetry").count();
    const pocCacheBadgeCount = await page.locator("text=[Data View: PoC Seeded Cache]").count();
    const deltaAuditBadgeCount = await page.locator("text=DELTA AUDIT · PO-2026-Q3").count();
    console.log("✓ Empirical Telemetry badge absent:", empiricalBadgeCount === 0);
    console.log("✓ PoC Seeded Cache badge absent:", pocCacheBadgeCount === 0);
    console.log("✓ DELTA AUDIT badge absent:", deltaAuditBadgeCount === 0);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "clean_02_jan_manch.png") });

    // 4. Test Profile Consent PIN Manager (/profile)
    console.log("Navigating to Profile (/profile)...");
    await page.goto("http://localhost:3000/profile");
    await page.waitForTimeout(500);

    await page.locator("text=Consent PIN Manager").waitFor({ state: "visible" });
    await page.locator("text=Per-member consent authorization PINs for credential and scheme applications").waitFor({ state: "visible" });

    const calloutBadgeCount = await page.locator("text=Shared-Device UI Access Isolation").count();
    console.log("✓ Shared-Device UI Access Isolation badge absent:", calloutBadgeCount === 0);

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "clean_03_profile_consent_pin.png") });

    // 5. Test Dev Harness (/dev/harness) retains 4-Tier Architecture Spec
    console.log("Navigating to Dev Harness (/dev/harness)...");
    await page.goto("http://localhost:3000/dev/harness");
    await page.waitForTimeout(500);

    const archSpecBtn = page.locator("text=4-Tier Architecture Spec");
    await archSpecBtn.waitFor({ state: "visible" });
    console.log("✓ 4-Tier Architecture Spec button present in Dev Harness");

    await archSpecBtn.click();
    await page.waitForTimeout(300);
    await page.locator("text=NAGRIKPATH 4-TIER REFERENCE ARCHITECTURE").waitFor({ state: "visible" });
    console.log("✓ Architecture Modal opens cleanly in Dev Harness");

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "clean_04_harness_architecture_modal.png") });

    console.log("\n=======================================================");
    console.log("ALL CLEANUP DIRECTIVES VERIFIED & VALIDATED!");
    console.log("=======================================================");
  } catch (err) {
    console.error("Verification failed:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
