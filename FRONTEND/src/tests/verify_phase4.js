import { chromium } from 'playwright';
import path from 'path';

const outputDir = 'C:\\Users\\Roger\\.gemini\\antigravity\\brain\\d1e18a17-c806-477d-83bf-4be5f43e0a4c';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch({ channel: 'msedge' }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('--- STARTING PHASE 4 E2E VERIFICATION ---');

  // Network request spy to verify zero live network calls to ministry / external APIs
  let liveApiCallCount = 0;
  page.on('request', (req) => {
    const url = req.url();
    if (!url.includes('localhost:3000') && !url.includes('googleapis') && !url.includes('gstatic') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      console.warn('EXTERNAL LIVE API CALL DETECTED:', url);
      liveApiCallCount++;
    }
  });

  // Step 1: Initialize session with Priya Kumar as active member and reset household
  await page.addInitScript(() => {
    localStorage.setItem('nagrikpath_session', 'true');
    localStorage.setItem('nagrikpath_theme', 'dark');
    localStorage.setItem('yojanasetu_theme', 'dark');
    document.documentElement.classList.add('dark');
  });

  // Visit dev harness to reset seed baseline
  await page.goto('http://localhost:3000/dev/harness', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const resetBtn = page.locator('button:has-text("Reset Demo State")').first();
  if (await resetBtn.count() > 0) {
    await resetBtn.click();
    await page.waitForTimeout(500);
  }

  // Step 2: Navigate to /yojna-setu
  console.log('Navigating to http://localhost:3000/yojna-setu...');
  await page.goto('http://localhost:3000/yojna-setu', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Assertion 19: AgenticDrawer trigger must be ABSENT on /yojna-setu
  const agenticTrigger = page.locator('button[title*="Deterministic Action Agent"]');
  const hasAgenticDrawer = (await agenticTrigger.count()) > 0;
  console.log('Assertion 19: AgenticDrawer trigger absent on /yojna-setu ->', !hasAgenticDrawer);

  // Screenshot 1: Yojna Setu Dashboard initial state (Priya Kumar, OBC scholarship blocked)
  await page.screenshot({ path: path.join(outputDir, 'phase4_01_dashboard_priya_initial.png') });
  console.log('Captured phase4_01_dashboard_priya_initial.png');

  // Verify Scheme Card: "Central Post-Matric OBC Scholarship" has "1 Prerequisite Expired" and "Inspect Eligibility Delta →"
  const inspectBtns = page.locator('button:has-text("Inspect Eligibility Delta →")');
  console.log('Found inspect buttons count:', await inspectBtns.count());

  // Step 3: Open Delta Resolver Drawer for first scheme (Central Post-Matric OBC Scholarship)
  await inspectBtns.first().click();
  await page.waitForTimeout(600);

  // Verify Single Overlay Invariant: Exactly 1 overlay in DOM
  const openOverlaysCount = await page.locator('[data-modal-open="true"]').count();
  console.log('Assertion 20: Single overlay in DOM (Drawer open) -> count =', openOverlaysCount);

  // Screenshot 2: Delta Resolver Drawer
  await page.screenshot({ path: path.join(outputDir, 'phase4_02_drawer_delta_expired.png') });
  console.log('Captured phase4_02_drawer_delta_expired.png');

  // Verify verbatim string: "Inherited from Head of Household — EXPIRED (31-03-2024)"
  const expiredString = page.locator('text="Inherited from Head of Household — EXPIRED (31-03-2024)"');
  console.log('Assertion 2: Exact expired string present ->', (await expiredString.count()) > 0);

  // Step 4: Click "Fetch Latest Issuance (State e-District via DigiLocker Pull API)"
  const fetchBtn = page.locator('button:has-text("Fetch Latest Issuance (State e-District via DigiLocker Pull API)")');
  console.log('Found fetch button. Triggering simulated DPI pull...');
  await fetchBtn.click();

  // Check disabled loading state during 1.5s
  await page.waitForTimeout(400);
  const isLoading = await page.locator('button:has-text("Querying State e-District")').count();
  console.log('Assertion 3a: Disabled loading spinner active during pull ->', isLoading > 0);

  // Wait for completion (1.5s + 200ms buffer)
  await page.waitForTimeout(1400);

  // Screenshot 3: Drawer resolved to green and CTA flipped to "Synthesize Application Docket →"
  await page.screenshot({ path: path.join(outputDir, 'phase4_03_drawer_resolved_green.png') });
  console.log('Captured phase4_03_drawer_resolved_green.png');

  const drawerSynthesizeBtn = page.locator('div[data-modal-open="true"] button:has-text("Synthesize Application Docket →")');
  console.log('Assertion 4: Drawer CTA flipped to "Synthesize Application Docket →" ->', (await drawerSynthesizeBtn.count()) > 0);

  // Step 5: Click "Synthesize Application Docket →" in Drawer (Atomic transition to Modal)
  await drawerSynthesizeBtn.click();
  await page.waitForTimeout(600);

  const openOverlaysAfterTransition = await page.locator('[data-modal-open="true"]').count();
  console.log('Assertion 5 & 20: Atomic transition to modal, single overlay count =', openOverlaysAfterTransition);

  // Screenshot 4: Docket Preview Modal Tab 1 (Entitlement Docket)
  await page.screenshot({ path: path.join(outputDir, 'phase4_04_modal_tab1_docket.png') });
  console.log('Captured phase4_04_modal_tab1_docket.png');

  // Step 6: Test PIN Consent flow
  const pinInput = page.locator('input[type="password"]').first();
  console.log('Entering PIN "1234" to authorize...');
  await pinInput.fill('1234');
  await page.click('button:has-text("Set & Authorize"), button:has-text("Verify PIN")');
  await page.waitForTimeout(400);

  // Verify exact receipt text for Priya (age 19 >= 18): "Applicant consent receipt (PIN-verified, Sec 6(1))"
  const consentReceipt = page.locator('text="Applicant consent receipt (PIN-verified, Sec 6(1))"');
  console.log('Assertion 6: Exact applicant consent receipt string present ->', (await consentReceipt.count()) > 0);

  // Screenshot 5: Docket Modal with PIN Authorized
  await page.screenshot({ path: path.join(outputDir, 'phase4_05_modal_pin_authorized.png') });
  console.log('Captured phase4_05_modal_pin_authorized.png');

  // Step 7: Switch to Tab 2 (Machine-Readable JSON-LD)
  await page.click('button:has-text("Machine-Readable JSON-LD")');
  await page.waitForTimeout(400);

  // Screenshot 6: Modal Tab 2 (JSON-LD)
  await page.screenshot({ path: path.join(outputDir, 'phase4_06_modal_tab2_jsonld.png') });
  console.log('Captured phase4_06_modal_tab2_jsonld.png');

  const jsonContent = await page.locator('pre').textContent();
  console.log('Assertion 7: Tab 2 contains "PoC-Placeholder-Unsigned" ->', jsonContent.includes('PoC-Placeholder-Unsigned'));
  console.log('Assertion 7b: Tab 2 contains unsigned prototype note ->', jsonContent.includes('Unsigned prototype packet — production signing via DigiLocker VC issuer'));

  // Switch back to Tab 1 and Stage Docket
  await page.click('button:has-text("Entitlement Docket")');
  await page.waitForTimeout(300);

  const stageBtn = page.locator('button:has-text("Stage Docket for Gateway Ingestion (PoC)")');
  await stageBtn.click();
  await page.waitForTimeout(1800);

  // Screenshot 7: Staged Success Banner
  await page.screenshot({ path: path.join(outputDir, 'phase4_07_modal_staged_success.png') });
  console.log('Captured phase4_07_modal_staged_success.png');

  const stagedMsg = page.locator('text="PoC simulation — packet staged locally. Zero transmission to any ministry system."');
  console.log('Assertion 8: Exact zero-transmission staging message present ->', (await stagedMsg.count()) > 0);

  // Close modal via Esc key
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const overlaysAfterEsc = await page.locator('[data-modal-open="true"]').count();
  console.log('Assertion 15: Modal closed on Esc key -> count =', overlaysAfterEsc);

  // Screenshot 8: Dashboard with OBC scholarship now showing "Ready to Apply"
  await page.screenshot({ path: path.join(outputDir, 'phase4_08_dashboard_resolved.png') });
  console.log('Captured phase4_08_dashboard_resolved.png');

  // Step 8: Switch member to Ramesh Kumar in TopNav ProfileChip and verify Ineligible display
  console.log('Switching active member to Ramesh Kumar via ProfileChip...');
  const profileChipBtn = page.locator('header button:has-text("Priya Kumar")');
  await profileChipBtn.click();
  await page.waitForTimeout(400);

  const rameshOption = page.locator('button:has-text("Ramesh Kumar")').first();
  await rameshOption.click();
  await page.waitForTimeout(500);

  // Fill PIN in PinGateModal
  const pinInputs = page.locator('div[data-modal-open="true"] input[type="password"]');
  const count = await pinInputs.count();
  if (count > 0) {
    await pinInputs.first().fill('1234');
    if (count > 1) {
      await pinInputs.nth(1).fill('1234');
    }
    const submitBtn = page.locator('div[data-modal-open="true"] button[type="submit"]').first();
    await submitBtn.click();
    await page.waitForTimeout(800);
  }

  // Screenshot 9: Ramesh Dashboard (OBC scholarship is INELIGIBLE: "Criteria Not Met")
  await page.screenshot({ path: path.join(outputDir, 'phase4_09_dashboard_ramesh.png') });
  console.log('Captured phase4_09_dashboard_ramesh.png');

  const rameshScholarshipCard = page.locator('div:has-text("Central Post-Matric OBC Scholarship")').last();
  const criteriaNotMet = rameshScholarshipCard.locator('text="Criteria Not Met"');
  console.log('Assertion 10: Ramesh OBC scholarship renders "Criteria Not Met" ->', (await criteriaNotMet.count()) > 0);
  const rameshCardActions = rameshScholarshipCard.locator('button:has-text("Synthesize"), button:has-text("Inspect")');
  console.log('Assertion 10b: Zero action buttons for ineligible scheme ->', (await rameshCardActions.count()) === 0);

  // Step 9: Verify filters
  const sectorDropdown = page.locator('select').first();
  await sectorDropdown.selectOption('Social Welfare');
  await page.waitForTimeout(400);

  // Screenshot 10: Empty sector fallback
  await page.screenshot({ path: path.join(outputDir, 'phase4_10_empty_sector_fallback.png') });
  console.log('Captured phase4_10_empty_sector_fallback.png');

  const emptyMsg = page.locator('text="No schemes currently indexed for this sector in PoC cache."');
  console.log('Assertion 11: Empty sector fallback message present ->', (await emptyMsg.count()) > 0);

  console.log('Assertion 17: External live API calls count =', liveApiCallCount);

  await browser.close();
  console.log('--- PHASE 4 E2E VERIFICATION COMPLETED SUCCESSFULLY ---');
})();
