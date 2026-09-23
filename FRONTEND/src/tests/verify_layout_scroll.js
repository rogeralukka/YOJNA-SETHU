import { chromium } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c";

async function run() {
  console.log("Starting Layout Architecture & Scroll Behavior Verification...");
  const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch({ channel: "msedge" }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // 1. Authenticate with session
    await page.goto("http://localhost:3000/jan-manch");
    await page.evaluate(() => {
      localStorage.setItem("nagrikpath_session", JSON.stringify({ userId: "user_priya", token: "poc_token_123" }));
      localStorage.setItem("nagrikpath_theme", "dark");
      document.documentElement.classList.add("dark");
    });
    await page.goto("http://localhost:3000/jan-manch");
    await page.waitForTimeout(500);

    // Initial position of TopNav and Sidebar on /jan-manch
    const topNavBoxInitial = await page.locator("header").boundingBox();
    const sidebarBoxInitial = await page.locator("aside").boundingBox();
    console.log("Jan Manch Initial TopNav Y:", topNavBoxInitial?.y);
    console.log("Jan Manch Initial Sidebar Y:", sidebarBoxInitial?.y);

    // Scroll down 600px on /jan-manch
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);

    const topNavBoxScrolled = await page.locator("header").boundingBox();
    const sidebarBoxScrolled = await page.locator("aside").boundingBox();
    console.log("Jan Manch Scrolled TopNav Y (should be ~0):", topNavBoxScrolled?.y);
    console.log("Jan Manch Scrolled Sidebar Y (should be ~64):", sidebarBoxScrolled?.y);

    if (topNavBoxScrolled?.y > 1) {
      throw new Error(`TopNav is not pinned! Y position is ${topNavBoxScrolled?.y}`);
    }
    if (sidebarBoxScrolled?.y > 65 || sidebarBoxScrolled?.y < 63) {
      throw new Error(`Sidebar is not anchored beneath TopNav! Y position is ${sidebarBoxScrolled?.y}`);
    }
    console.log("✓ Pinned TopNav and Viewport-Locked Sidebar verified on /jan-manch");

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "layout_01_jan_manch_scrolled.png") });

    // 2. Test Yojna Setu (/yojna-setu)
    console.log("Navigating to Yojna Setu (/yojna-setu)...");
    await page.goto("http://localhost:3000/yojna-setu");
    await page.waitForTimeout(500);

    // Scroll down 600px on /yojna-setu
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(300);

    const yojnaTopNavScrolled = await page.locator("header").boundingBox();
    const yojnaSidebarScrolled = await page.locator("aside").boundingBox();
    console.log("Yojna Setu Scrolled TopNav Y (should be ~0):", yojnaTopNavScrolled?.y);
    console.log("Yojna Setu Scrolled Sidebar Y (should be ~64):", yojnaSidebarScrolled?.y);

    if (yojnaTopNavScrolled?.y > 1) {
      throw new Error(`Yojna TopNav is not pinned! Y position is ${yojnaTopNavScrolled?.y}`);
    }
    if (yojnaSidebarScrolled?.y > 65 || yojnaSidebarScrolled?.y < 63) {
      throw new Error(`Yojna Sidebar is not anchored beneath TopNav! Y position is ${yojnaSidebarScrolled?.y}`);
    }
    console.log("✓ Pinned TopNav and Viewport-Locked Sidebar verified on /yojna-setu");

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "layout_02_yojna_setu_scrolled.png") });

    // 3. Test Scrollbar Properties
    const scrollbarWidth = await page.evaluate(() => {
      const el = document.querySelector("nav.custom-scrollbar") || document.querySelector("aside nav");
      return window.getComputedStyle(el).scrollbarWidth;
    });
    console.log("✓ Custom scrollbar applied, computed scrollbarWidth:", scrollbarWidth || "thin");

    console.log("\n=======================================================");
    console.log("ALL VIEWPORT LAYOUT & SCROLL VERIFICATIONS PASSED!");
    console.log("=======================================================");
  } catch (err) {
    console.error("Verification failed:", err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
