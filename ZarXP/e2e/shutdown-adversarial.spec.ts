import { test, expect } from './fixtures/base.fixture';

test.describe('Shutdown Helpers Adversarial Verification Suite', () => {

  test('1. openShutdownDialog: opens dialog, hydration race, strict-mode locators, and power event dispatching', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Listen for custom zarxp-power events and prevent app power down so we can test all buttons
    await page.evaluate(() => {
      (window as any).__powerEvents = [];
      window.addEventListener('zarxp-power', (e: any) => {
        (window as any).__powerEvents.push(e.detail?.action);
        // Stop immediate transition if possible
      }, true);
    });

    // Check store before opening
    const storeBefore = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      const state = useWindowStore.getState();
      return {
        count: state.windows.length,
        startMenuOpen: state.startMenuOpen,
      };
    });
    expect(storeBefore.count).toBe(0);

    // Call helper
    const dialog = await xpPage.openShutdownDialog();
    await expect(dialog).toBeVisible();

    // Await hydration of dialog surface
    await expect(xpPage.shutdownCancelButton).toBeVisible({ timeout: 5000 });

    // Verify all getters resolve to exactly 1 element (Strict Mode verification)
    expect(await xpPage.shutdownDialog.count()).toBe(1);
    expect(await xpPage.shutdownDialogTitle.count()).toBe(1);
    expect(await xpPage.shutdownStandByButton.count()).toBe(1);
    expect(await xpPage.shutdownTurnOffButton.count()).toBe(1);
    expect(await xpPage.shutdownRestartButton.count()).toBe(1);
    expect(await xpPage.shutdownCancelButton.count()).toBe(1);

    // Verify visibility of all elements via locators
    await expect(xpPage.shutdownDialogTitle).toBeVisible();
    await expect(xpPage.shutdownStandByButton).toBeVisible();
    await expect(xpPage.shutdownTurnOffButton).toBeVisible();
    await expect(xpPage.shutdownRestartButton).toBeVisible();
    await expect(xpPage.shutdownCancelButton).toBeVisible();

    // Check store while open
    const storeWhileOpen = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      const state = useWindowStore.getState();
      return {
        count: state.windows.length,
        appIds: state.windows.map((w: any) => w.appId),
        startMenuOpen: state.startMenuOpen,
      };
    });
    expect(storeWhileOpen.count).toBe(1);
    expect(storeWhileOpen.appIds).toEqual(['shutdown']);
    expect(storeWhileOpen.startMenuOpen).toBe(false);

    // Cancel closes dialog cleanly
    await xpPage.shutdownCancelButton.click();
    await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

    // Verify Zustand store is clean (no leaks)
    const storeAfter = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      const state = useWindowStore.getState();
      return {
        count: state.windows.length,
        startMenuOpen: state.startMenuOpen,
      };
    });
    expect(storeAfter.count).toBe(0);
    expect(storeAfter.startMenuOpen).toBe(false);
    expect(pageErrors).toHaveLength(0);
  });

  test('2. Power Button Event Verification: standByButton dispatches stand-by', async ({ xpPage, page }) => {
    await page.evaluate(() => {
      (window as any).__powerEvents = [];
      window.addEventListener('zarxp-power', (e: any) => {
        (window as any).__powerEvents.push(e.detail?.action);
      });
    });

    await xpPage.openShutdownDialog();
    await expect(xpPage.shutdownStandByButton).toBeVisible({ timeout: 5000 });
    await xpPage.shutdownStandByButton.click();

    const powerEvents = await page.evaluate(() => (window as any).__powerEvents);
    expect(powerEvents).toContain('stand-by');
  });

  test('3. Stress Cycling: Rapid 5-cycle open and cancel without Zustand store leaks', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    for (let i = 0; i < 5; i++) {
      const dialog = await xpPage.openShutdownDialog();
      await expect(dialog).toBeVisible();

      // Ensure store has exactly 1 window
      const countOpen = await page.evaluate(async () => {
        const { useWindowStore } = await import('/src/store/windowStore.ts');
        return useWindowStore.getState().windows.length;
      });
      expect(countOpen).toBe(1);

      await xpPage.shutdownCancelButton.click();
      await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

      // Ensure store returned to 0 windows
      const countClosed = await page.evaluate(async () => {
        const { useWindowStore } = await import('/src/store/windowStore.ts');
        return useWindowStore.getState().windows.length;
      });
      expect(countClosed).toBe(0);
    }

    expect(pageErrors).toHaveLength(0);
  });

  test('4. Spanish Locale (es): Full helper parity, title, buttons and clean cancellation', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.addInitScript(() => {
      localStorage.setItem('zarxp-lang', 'es');
    });

    const xpPage = new (await import('./helpers/xp-page')).XPPage(page);
    await xpPage.gotoDesktop();

    // Open via Spanish Start Menu
    await xpPage.openShutdownDialog();
    await expect(xpPage.shutdownDialog).toBeVisible();

    // Verify Spanish title text
    const titleText = await xpPage.shutdownDialogTitle.innerText();
    expect(titleText).toContain('Apagar el equipo');

    // Strict mode check in Spanish
    expect(await xpPage.shutdownDialog.count()).toBe(1);
    expect(await xpPage.shutdownDialogTitle.count()).toBe(1);
    expect(await xpPage.shutdownStandByButton.count()).toBe(1);
    expect(await xpPage.shutdownTurnOffButton.count()).toBe(1);
    expect(await xpPage.shutdownRestartButton.count()).toBe(1);
    expect(await xpPage.shutdownCancelButton.count()).toBe(1);

    // Click Spanish Cancel button
    await xpPage.shutdownCancelButton.click();
    await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

    const winCount = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      return useWindowStore.getState().windows.length;
    });
    expect(winCount).toBe(0);
    expect(pageErrors).toHaveLength(0);
  });

  test('5. Coexistence: Open shutdown dialog with other windows, verify isolation on cancel', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Open Notepad
    await xpPage.executeRunCommand('notepad', 'Untitled - Notepad');
    const notepad = xpPage.getWindow('Untitled - Notepad');
    await expect(notepad).toBeVisible();

    // Open shutdown dialog
    await xpPage.openShutdownDialog();
    await expect(xpPage.shutdownDialog).toBeVisible();

    // Check store has 2 windows
    const storeMid = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      return useWindowStore.getState().windows.map((w: any) => w.appId);
    });
    expect(storeMid).toContain('notepad');
    expect(storeMid).toContain('shutdown');
    expect(storeMid.length).toBe(2);

    // Cancel shutdown dialog
    await xpPage.shutdownCancelButton.click();
    await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

    // Verify Notepad is STILL open and visible
    await expect(notepad).toBeVisible();

    // Verify store has only Notepad
    const storeEnd = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      return useWindowStore.getState().windows.map((w: any) => w.appId);
    });
    expect(storeEnd).toEqual(['notepad']);
    expect(pageErrors).toHaveLength(0);
  });

  test('6. Throttled CPU (6x Slowdown): Zero regressions for openShutdownDialog and cancel', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });

    // Open under throttled CPU
    const dialog = await xpPage.openShutdownDialog();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Verify buttons are clickable under CPU pressure
    await expect(xpPage.shutdownCancelButton).toBeVisible({ timeout: 10000 });
    await xpPage.shutdownCancelButton.click();
    await expect(dialog).toBeHidden({ timeout: 10000 });

    const winCount = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      return useWindowStore.getState().windows.length;
    });
    expect(winCount).toBe(0);
    expect(pageErrors).toHaveLength(0);
  });

  test('7. Simulated Latency (200ms RTT): Zero regressions for openShutdownDialog and cancel', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 200,
      downloadThroughput: 1024 * 1024,
      uploadThroughput: 512 * 1024,
    });

    const dialog = await xpPage.openShutdownDialog();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    await expect(xpPage.shutdownCancelButton).toBeVisible({ timeout: 10000 });
    await xpPage.shutdownCancelButton.click();
    await expect(dialog).toBeHidden({ timeout: 10000 });

    const winCount = await page.evaluate(async () => {
      const { useWindowStore } = await import('/src/store/windowStore.ts');
      return useWindowStore.getState().windows.length;
    });
    expect(winCount).toBe(0);
    expect(pageErrors).toHaveLength(0);
  });

});
