import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch({ channel: 'msedge' }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/yojna-setu with session...');
  
  await page.addInitScript(() => {
    localStorage.setItem('nagrikpath_session', 'true');
    localStorage.setItem('nagrikpath_theme', 'dark');
    localStorage.setItem('yojanasetu_theme', 'dark');
    document.documentElement.classList.add('dark');
  });

  await page.goto('http://localhost:3000/yojna-setu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const outputDir = 'C:\\Users\\Roger\\.gemini\\antigravity\\brain\\d1e18a17-c806-477d-83bf-4be5f43e0a4c';
  
  // 1. Dashboard
  await page.screenshot({ path: path.join(outputDir, 'verify_yojna_dark_dashboard.png') });
  console.log('Captured verify_yojna_dark_dashboard.png');

  // 2. Scheme Detail - Click "View Details" on PM-KISAN or Ayushman
  const viewDetailBtn = page.locator('button:has-text("View Details")').first();
  if (await viewDetailBtn.count() > 0) {
    await viewDetailBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, 'verify_yojna_dark_scheme_detail.png') });
    console.log('Captured verify_yojna_dark_scheme_detail.png');

    // 3. Application Form Modal
    const applyBtn = page.locator('button:has-text("Apply Now")').first();
    if (await applyBtn.count() > 0) {
      await applyBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, 'verify_yojna_dark_application_form.png') });
      console.log('Captured verify_yojna_dark_application_form.png');

      // Close modal
      const closeBtn = page.locator('button:has-text("Cancel"), button[title="Close"]').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Go back to schemes list
    const backBtn = page.locator('button:has-text("Back to Schemes")').first();
    if (await backBtn.count() > 0) {
      await backBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 4. My Business
  const bizBtn = page.locator('aside button:has-text("My Business")').first();
  if (await bizBtn.count() > 0) {
    await bizBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, 'verify_yojna_dark_my_businesses.png') });
    console.log('Captured verify_yojna_dark_my_businesses.png');
  }

  // 5. Saved Schemes / Bookmarks
  const bookmarksBtn = page.locator('aside button:has-text("Bookmarks")').first();
  if (await bookmarksBtn.count() > 0) {
    await bookmarksBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, 'verify_yojna_dark_bookmarks.png') });
    console.log('Captured verify_yojna_dark_bookmarks.png');
  }

  // 6. Alerts & Updates
  const notificationsBtn = page.locator('aside button:has-text("Notifications")').first();
  if (await notificationsBtn.count() > 0) {
    await notificationsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, 'verify_yojna_dark_notifications.png') });
    console.log('Captured verify_yojna_dark_notifications.png');
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
