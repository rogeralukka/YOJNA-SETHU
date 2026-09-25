import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Desktop verification
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await desktopPage.goto('http://localhost:3000/');
  await desktopPage.waitForTimeout(500);
  const landingScrollWidth = await desktopPage.evaluate(() => document.documentElement.scrollWidth);
  console.log('Landing Desktop scrollWidth:', landingScrollWidth, 'vs clientWidth:', 1280);
  await desktopPage.screenshot({ path: 'C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c/landing_page_fixed.png' });

  // Log in
  await desktopPage.evaluate(() => {
    localStorage.setItem('nagrikpath_session', JSON.stringify({ user: 'Rahul Kumar' }));
  });

  // Home Dashboard
  await desktopPage.goto('http://localhost:3000/home');
  await desktopPage.waitForTimeout(500);
  const homeScrollWidth = await desktopPage.evaluate(() => document.documentElement.scrollWidth);
  console.log('Home Desktop scrollWidth:', homeScrollWidth, 'vs clientWidth:', 1280);
  await desktopPage.screenshot({ path: 'C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c/home_dashboard_fixed.png' });

  // Profile
  await desktopPage.goto('http://localhost:3000/profile');
  await desktopPage.waitForTimeout(500);
  const profileScrollWidth = await desktopPage.evaluate(() => document.documentElement.scrollWidth);
  console.log('Profile Desktop scrollWidth:', profileScrollWidth, 'vs clientWidth:', 1280);
  await desktopPage.screenshot({ path: 'C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c/family_profile_fixed.png' });

  // Profile with Dropdown open
  await desktopPage.click('button:has-text("Rahul Kumar")');
  await desktopPage.waitForTimeout(300);
  await desktopPage.screenshot({ path: 'C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c/profile_dropdown_fixed.png' });

  // Mobile Viewport Verification
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await mobilePage.evaluate(() => {
    localStorage.setItem('nagrikpath_session', JSON.stringify({ user: 'Rahul Kumar' }));
  });

  await mobilePage.goto('http://localhost:3000/home');
  await mobilePage.waitForTimeout(500);
  const mobileHomeScrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  console.log('Home Mobile scrollWidth:', mobileHomeScrollWidth, 'vs clientWidth:', 375);
  await mobilePage.screenshot({ path: 'C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c/home_mobile_fixed.png' });

  await mobilePage.goto('http://localhost:3000/profile');
  await mobilePage.waitForTimeout(500);
  const mobileProfileScrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  console.log('Profile Mobile scrollWidth:', mobileProfileScrollWidth, 'vs clientWidth:', 375);
  await mobilePage.screenshot({ path: 'C:/Users/Roger/.gemini/antigravity/brain/d1e18a17-c806-477d-83bf-4be5f43e0a4c/profile_mobile_fixed.png' });

  await browser.close();
  console.log('All verification checks completed successfully!');
}

verify().catch(console.error);
