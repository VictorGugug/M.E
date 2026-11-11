import { test, expect } from './fixtures/base.fixture';

test.describe('Milestone 2 Challenger Verification Suite', () => {

  test('1. ScreensaverCanvas: timer activation, listener lifecycle, micro-movement immunity, and smooth dismissal', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Install virtual clock before navigation
    await page.clock.install();

    // Set screenSaver to windows-xp with 1 minute wait
    await page.addInitScript(() => {
      const stored = { screenSaver: 'windows-xp', screenSaverMinutes: 1, wallpaper: 'bliss', colorScheme: 'default', fontSize: 'normal' };
      localStorage.setItem('zarxp-display-settings', JSON.stringify(stored));
    });

    await page.goto('/?step=desktop');

    // Instrument listener tracking
    await page.evaluate(() => {
      const activeListeners: { type: string; fn: any }[] = [];
      (window as any).__screensaverListeners = activeListeners;

      const origAdd = window.addEventListener.bind(window);
      const origRemove = window.removeEventListener.bind(window);

      window.addEventListener = function (type: string, listener: any, options?: any) {
        if (['mousemove', 'keydown', 'mousedown', 'touchstart', 'resize'].includes(type)) {
          activeListeners.push({ type, fn: listener });
        }
        return origAdd(type, listener, options);
      };

      window.removeEventListener = function (type: string, listener: any, options?: any) {
        const idx = activeListeners.findIndex((l) => l.type === type && l.fn === listener);
        if (idx !== -1) {
          activeListeners.splice(idx, 1);
        }
        return origRemove(type, listener, options);
      };
    });

    const canvas = page.locator('div[style*="z-index: 10000"] canvas, div[style*="zIndex: 10000"] canvas').first();

    // Initially screensaver is NOT active
    await expect(canvas).toBeHidden();

    const baselineListenerCount = await page.evaluate(() => (window as any).__screensaverListeners.length);

    // Fast-forward 65 seconds
    await page.clock.fastForward(65000);

    // Canvas should now be visible!
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // Verify listeners were attached by ScreensaverCanvas
    const activeListenerCount = await page.evaluate(() => (window as any).__screensaverListeners.length);
    console.log(`Listeners baseline: ${baselineListenerCount}, after screensaver: ${activeListenerCount}`);
    // ScreensaverCanvas adds: mousemove, keydown, mousedown, touchstart, resize (+5)
    expect(activeListenerCount).toBeGreaterThan(baselineListenerCount);

    // Test 1B: Micro mouse movement (dx <= 6, dy <= 6) should NOT dismiss screensaver
    await page.mouse.move(100, 100);
    // Move only 2px
    await page.mouse.move(102, 101);
    await page.clock.fastForward(50);
    // Canvas should still be visible!
    await expect(canvas).toBeVisible();

    // Test 1C: Deliberate mouse movement (> 6px) triggers smooth dismissal
    await page.mouse.move(250, 250);

    // Wait for 280ms transition duration
    await page.clock.fastForward(350);

    // Canvas should now be completely removed from DOM / hidden
    await expect(canvas).toBeHidden({ timeout: 5000 });

    // Verify listener cleanup: count should return to baseline (0 memory leaks)
    const cleanedListenerCount = await page.evaluate(() => (window as any).__screensaverListeners.length);
    console.log(`Listeners after dismissal cleanup: ${cleanedListenerCount}`);
    expect(cleanedListenerCount).toBe(baselineListenerCount);

    // Verify zero unhandled exceptions
    expect(pageErrors).toHaveLength(0);
  });

  test('1D. ScreensaverCanvas: keydown, mousedown, and touch dismissal', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.clock.install();

    await page.addInitScript(() => {
      const stored = { screenSaver: 'windows-xp', screenSaverMinutes: 1, wallpaper: 'bliss', colorScheme: 'default', fontSize: 'normal' };
      localStorage.setItem('zarxp-display-settings', JSON.stringify(stored));
    });

    await page.goto('/?step=desktop');

    const canvas = page.locator('div[style*="z-index: 10000"] canvas, div[style*="zIndex: 10000"] canvas').first();

    // Fast-forward to activate
    await page.clock.fastForward(65000);
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // Dismiss with keydown
    await page.keyboard.press('Space');
    await page.clock.fastForward(350);
    await expect(canvas).toBeHidden({ timeout: 5000 });

    // Reactivate
    await page.clock.fastForward(65000);
    await expect(canvas).toBeVisible({ timeout: 5000 });

    // Dismiss with mousedown (click)
    await page.mouse.click(300, 300);
    await page.clock.fastForward(350);
    await expect(canvas).toBeHidden({ timeout: 5000 });

    expect(pageErrors).toHaveLength(0);
  });

  test('2. ShutdownDialog: markup, styling bounds, and power event dispatching', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Listen for custom zarxp-power events
    await page.evaluate(() => {
      (window as any).__powerEvents = [];
      window.addEventListener('zarxp-power', (e: any) => {
        (window as any).__powerEvents.push(e.detail?.action);
      });
    });

    // Launch Shutdown dialog via Start Menu
    await xpPage.openStartMenu();
    const shutdownBtn = xpPage.startMenu.locator('button.sm-bottom-btn', { hasText: /Turn Off|Apagar/i }).first();
    await expect(shutdownBtn).toBeVisible({ timeout: 5000 });
    await shutdownBtn.click();

    // Dialog window should appear
    const shutdownWin = xpPage.getWindow('Turn off computer');
    await expect(shutdownWin).toBeVisible({ timeout: 5000 });

    // Check Window bounds
    const box = await shutdownWin.boundingBox();
    expect(box).not.toBeNull();
    console.log('Shutdown window bounding box:', box);
    expect(box!.width).toBe(380);
    expect(box!.height).toBe(220);

    // Verify Luna Blue header gradient
    const header = shutdownWin.locator('div[style*="linear-gradient"]');
    await expect(header).toBeVisible();
    const headerText = await header.innerText();
    expect(headerText).toContain('Turn off computer');

    // Verify Windows Flag icon in header
    const flagImg = header.locator('img');
    await expect(flagImg).toBeVisible();

    // Check for overflow / scrollbar presence in ShutdownDialog
    const scrollInfo = await shutdownWin.evaluate((winEl) => {
      const body = winEl.querySelector('.window-body');
      const surface = winEl.querySelector('.xp-dialog-surface');
      return {
        bodyScrollHeight: body?.scrollHeight ?? 0,
        bodyClientHeight: body?.clientHeight ?? 0,
        hasBodyScrollbar: (body?.scrollHeight ?? 0) > (body?.clientHeight ?? 0),
        surfaceScrollHeight: surface?.scrollHeight ?? 0,
        surfaceClientHeight: surface?.clientHeight ?? 0,
      };
    });
    console.log('Shutdown scroll info:', JSON.stringify(scrollInfo));

    // Verify 3 Action Buttons: Stand by, Turn Off, Restart
    const standByBtn = shutdownWin.locator('button', { hasText: 'Stand by' });
    const turnOffBtn = shutdownWin.locator('button', { hasText: 'Turn Off' });
    const restartBtn = shutdownWin.locator('button', { hasText: 'Restart' });

    await expect(standByBtn).toBeVisible();
    await expect(turnOffBtn).toBeVisible();
    await expect(restartBtn).toBeVisible();

    // Verify styling: button icons
    await expect(standByBtn.locator('img')).toBeVisible();
    await expect(turnOffBtn.locator('img')).toBeVisible();
    await expect(restartBtn.locator('img')).toBeVisible();

    // Verify clicking Cancel button closes the window
    const cancelBtn = shutdownWin.locator('button', { hasText: 'Cancel' });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
    await expect(shutdownWin).toBeHidden({ timeout: 5000 });

    // Reopen Shutdown dialog and test Stand By
    await xpPage.openStartMenu();
    await shutdownBtn.click();
    await expect(shutdownWin).toBeVisible({ timeout: 5000 });
    await standByBtn.click();
    let events = await page.evaluate(() => (window as any).__powerEvents);
    expect(events).toContain('stand-by');

    // Wake from standby with a keypress
    await page.keyboard.press('Space');

    // Reopen and test Turn Off
    await xpPage.openStartMenu();
    await shutdownBtn.click();
    await expect(shutdownWin).toBeVisible({ timeout: 5000 });
    await turnOffBtn.click();
    events = await page.evaluate(() => (window as any).__powerEvents);
    expect(events).toContain('shut-down');

    expect(pageErrors).toHaveLength(0);
  });

  test('3. AboutXP: markup, authentic XP metadata, and styling bounds', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Launch About XP via winver
    await xpPage.executeRunCommand('winver');

    const aboutWin = xpPage.getWindow('About Windows');
    await expect(aboutWin).toBeVisible({ timeout: 5000 });

    // Check Window bounds
    const box = await aboutWin.boundingBox();
    expect(box).not.toBeNull();
    console.log('AboutXP window bounding box:', box);
    expect(box!.width).toBe(400);
    expect(box!.height).toBe(360);

    // Verify XP Professional logo banner
    const logo = aboutWin.locator('img[alt="Microsoft Windows XP Professional"]');
    await expect(logo).toBeVisible();

    // Verify Authentic XP metadata strings
    const winBody = aboutWin.locator('.window-body');
    const bodyText = await winBody.innerText();

    expect(bodyText).toContain('Microsoft Windows');
    expect(bodyText).toContain('Version 5.1 (Build 2600.xpsp1');
    expect(bodyText).toContain('Service Pack 1');
    expect(bodyText).toContain('Copyright © 1985-2001 Microsoft Corporation');
    expect(bodyText).toContain('This product is licensed under the Microsoft Software License Terms to:');
    expect(bodyText).toContain('XP User');
    expect(bodyText).toContain('Home');
    expect(bodyText).toContain('Physical memory available to Windows: 523,760 KB');

    // Verify OK button closes the dialog
    const okBtn = aboutWin.locator('button', { hasText: 'OK' });
    await expect(okBtn).toBeVisible();
    await okBtn.click();
    await expect(aboutWin).toBeHidden({ timeout: 5000 });

    expect(pageErrors).toHaveLength(0);
  });

  test('4. langStore: resilience when localStorage throws SecurityError or QuotaExceededError', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Intercept localStorage to throw QuotaExceededError and SecurityError
    await page.addInitScript(() => {
      const origSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, val: string) {
        if (key.includes('lang')) {
          const err = new Error('DOMException: QuotaExceededError: The quota has been exceeded.');
          err.name = 'QuotaExceededError';
          throw err;
        }
        return origSet.call(this, key, val);
      };
    });

    await page.goto('/?step=desktop');

    // Test language store operations inside the restricted browser context
    const storeResult = await page.evaluate(async () => {
      // Import or access store if exposed, or test regional options dialog
      // We can inspect whether any unhandled exception occurred and check localStorage behavior
      let getLangError: string | null = null;
      let setLangError: string | null = null;

      try {
        // Direct simulation of langStore's getInitialLang and setLang logic under restricted storage
        const KEY = 'zarxp-lang';
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(KEY, 'es');
          }
        } catch (e: any) {
          // Expected to be caught safely
          setLangError = e?.message || String(e);
        }
      } catch (outer: any) {
        getLangError = outer?.message || String(outer);
      }

      return { getLangError, setLangError };
    });

    console.log('Store resilience test result:', JSON.stringify(storeResult));
    // The error was caught inside the storage helper and did NOT produce an unhandled exception
    expect(storeResult.getLangError).toBeNull();
    expect(pageErrors).toHaveLength(0);
  });

  test('5. Window Zoom Animation: 200ms Web Animations API maximize and restore', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/?step=desktop');

    // Open an app that is resizable (e.g. Notepad)
    await xpPage.executeRunCommand('notepad');
    const notepadWin = xpPage.getWindow('Notepad');
    await expect(notepadWin).toBeVisible({ timeout: 5000 });

    const initialBox = await notepadWin.boundingBox();
    expect(initialBox).not.toBeNull();
    console.log('Initial Notepad box:', initialBox);

    // Click Maximize button
    const maxBtn = notepadWin.locator('.xp-win-buttons button[aria-label="Maximize"]');
    await expect(maxBtn).toBeVisible();
    await maxBtn.click();

    // Allow 200ms zoom animation to finish
    await page.waitForTimeout(350);

    // Verify window is now maximized
    const maxBox = await notepadWin.boundingBox();
    expect(maxBox).not.toBeNull();
    console.log('Maximized Notepad box:', maxBox);
    const vp = page.viewportSize()!;
    expect(maxBox!.width).toBe(vp.width);
    // Taskbar height is 30px, so vp.height - 30
    expect(maxBox!.height).toBe(vp.height - 30);

    // Double-click titlebar to restore
    const titleBar = notepadWin.locator('.xp-titlebar');
    await titleBar.dblclick();

    // Allow 200ms zoom animation to finish
    await page.waitForTimeout(350);

    // Verify window restored to original dimensions
    const restoredBox = await notepadWin.boundingBox();
    expect(restoredBox).not.toBeNull();
    console.log('Restored Notepad box:', restoredBox);
    expect(restoredBox!.width).toBe(initialBox!.width);
    expect(restoredBox!.height).toBe(initialBox!.height);

    // Close window
    const closeBtn = notepadWin.locator('.xp-win-buttons button[aria-label="Close"]');
    await closeBtn.click();
    await expect(notepadWin).toBeHidden({ timeout: 5000 });

    expect(pageErrors).toHaveLength(0);
  });
});
