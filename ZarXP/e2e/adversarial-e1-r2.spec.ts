import { test, expect } from './fixtures/base.fixture';
import { XP_SELECTORS } from './helpers/xp-page';

test.describe('Adversarial Verification Suite (Milestone E1 Iteration 2)', () => {

  test('Issue 1: FakeAudioContext.createMediaElementSource() conforms to Web Audio API and runs MediaPlayer without errors', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // 1. Direct browser-context unit check on FakeAudioContext and createMediaElementSource
    const audioVerification = await page.evaluate(() => {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return { ok: false, error: 'AudioContext is missing from window' };

      const ctx = new AudioCtx();
      if (typeof ctx.createMediaElementSource !== 'function') {
        return { ok: false, error: 'createMediaElementSource is not a function' };
      }

      const fakeAudio = document.createElement('audio');
      let sourceNode: any;
      try {
        sourceNode = ctx.createMediaElementSource(fakeAudio);
      } catch (err: any) {
        return { ok: false, error: `createMediaElementSource threw: ${err.message}` };
      }

      if (!sourceNode) return { ok: false, error: 'sourceNode is undefined' };
      if (sourceNode.mediaElement !== fakeAudio) return { ok: false, error: 'mediaElement mismatch' };
      if (sourceNode.numberOfInputs !== 0) return { ok: false, error: 'numberOfInputs != 0' };
      if (sourceNode.numberOfOutputs !== 1) return { ok: false, error: 'numberOfOutputs != 1' };
      if (typeof sourceNode.connect !== 'function') return { ok: false, error: 'connect is not a function' };
      if (typeof sourceNode.disconnect !== 'function') return { ok: false, error: 'disconnect is not a function' };

      const analyser = ctx.createAnalyser();
      const connectedDestination = sourceNode.connect(analyser);
      analyser.connect(ctx.destination);

      const freqArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqArray);

      sourceNode.disconnect();

      return { ok: true, connectedDestinationType: typeof connectedDestination };
    });

    expect(audioVerification.ok).toBe(true);

    // 2. Integration check: Launch MediaPlayer and trigger playback pipeline
    await xpPage.executeRunCommand('wmplayer');
    const mpWindow = xpPage.getWindow('Windows Media Player');
    await expect(mpWindow).toBeVisible({ timeout: 10000 });

    // Press play button
    const playBtn = mpWindow.locator('button[title*="Play"], button[aria-label*="Play"], .xp-button:has-text("Play")').first();
    if (await playBtn.isVisible()) {
      await playBtn.click();
    }

    // Wait a brief period to allow audio context and visualizer loops to cycle
    await page.waitForTimeout(500);

    // Ensure zero page errors or unhandled exceptions occurred
    expect(pageErrors).toHaveLength(0);

    // Close MediaPlayer window
    const closeBtn = mpWindow.locator('button[aria-label="Close"], button[aria-label="Cerrar"]');
    await closeBtn.click();
    await expect(mpWindow).toBeHidden({ timeout: 5000 });
  });

  test('Issue 2 (English): Start Menu & Shutdown Dialog selectors resolve uniquely (count=1) without strict mode collision', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Force English locale
    await page.evaluate(() => {
      localStorage.setItem('zarxp-lang', 'en');
    });
    await xpPage.gotoDesktop();

    // 1. Start Menu Locators
    await xpPage.openStartMenu();
    await expect(xpPage.startMenu).toBeVisible();

    const allProgramsLoc = xpPage.startMenu.locator(XP_SELECTORS.startMenu.allPrograms);
    expect(await allProgramsLoc.count()).toBe(1);
    await expect(allProgramsLoc).toBeVisible();

    const turnOffMenuLoc = xpPage.startMenu.locator(XP_SELECTORS.startMenu.turnOff);
    expect(await turnOffMenuLoc.count()).toBe(1);
    await expect(turnOffMenuLoc).toBeVisible();

    const logOffMenuLoc = xpPage.startMenu.locator(XP_SELECTORS.startMenu.logOff);
    expect(await logOffMenuLoc.count()).toBe(1);
    await expect(logOffMenuLoc).toBeVisible();

    // 2. Open Shutdown Dialog via xpPage helper
    const dialog = await xpPage.openShutdownDialog();
    await expect(dialog).toBeVisible();

    // 3. Strict mode single element resolution checks on all shutdown locators
    await expect(xpPage.shutdownDialog).toBeVisible();
    expect(await xpPage.shutdownDialog.count()).toBe(1);

    await expect(xpPage.shutdownDialogTitle).toBeVisible();
    expect(await xpPage.shutdownDialogTitle.count()).toBe(1);
    const titleText = await xpPage.shutdownDialogTitle.textContent();
    expect(titleText).toContain('Turn off computer');

    await expect(xpPage.shutdownStandByButton).toBeVisible();
    expect(await xpPage.shutdownStandByButton.count()).toBe(1);

    await expect(xpPage.shutdownTurnOffButton).toBeVisible();
    expect(await xpPage.shutdownTurnOffButton.count()).toBe(1);

    await expect(xpPage.shutdownRestartButton).toBeVisible();
    expect(await xpPage.shutdownRestartButton.count()).toBe(1);

    await expect(xpPage.shutdownCancelButton).toBeVisible();
    expect(await xpPage.shutdownCancelButton.count()).toBe(1);

    // Test clicking Cancel strictly closes the dialog
    await xpPage.shutdownCancelButton.click();
    await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

    expect(pageErrors).toHaveLength(0);
  });

  test('Issue 2 (Spanish): Start Menu & Shutdown Dialog selectors resolve uniquely (count=1) without strict mode collision', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // Force Spanish locale
    await page.evaluate(() => {
      localStorage.setItem('zarxp-lang', 'es');
    });
    await xpPage.gotoDesktop();

    // 1. Start Menu Locators
    await xpPage.openStartMenu();
    await expect(xpPage.startMenu).toBeVisible();

    const allProgramsLoc = xpPage.startMenu.locator(XP_SELECTORS.startMenu.allPrograms);
    expect(await allProgramsLoc.count()).toBe(1);
    await expect(allProgramsLoc).toBeVisible();

    const turnOffMenuLoc = xpPage.startMenu.locator(XP_SELECTORS.startMenu.turnOff);
    expect(await turnOffMenuLoc.count()).toBe(1);
    await expect(turnOffMenuLoc).toBeVisible();

    const logOffMenuLoc = xpPage.startMenu.locator(XP_SELECTORS.startMenu.logOff);
    expect(await logOffMenuLoc.count()).toBe(1);
    await expect(logOffMenuLoc).toBeVisible();

    // 2. Open Shutdown Dialog via xpPage helper
    const dialog = await xpPage.openShutdownDialog();
    await expect(dialog).toBeVisible();

    // 3. Strict mode single element resolution checks on all shutdown locators
    await expect(xpPage.shutdownDialog).toBeVisible();
    expect(await xpPage.shutdownDialog.count()).toBe(1);

    await expect(xpPage.shutdownDialogTitle).toBeVisible();
    expect(await xpPage.shutdownDialogTitle.count()).toBe(1);
    const titleText = await xpPage.shutdownDialogTitle.textContent();
    expect(titleText).toContain('Apagar el equipo');

    await expect(xpPage.shutdownStandByButton).toBeVisible();
    expect(await xpPage.shutdownStandByButton.count()).toBe(1);

    await expect(xpPage.shutdownTurnOffButton).toBeVisible();
    expect(await xpPage.shutdownTurnOffButton.count()).toBe(1);

    await expect(xpPage.shutdownRestartButton).toBeVisible();
    expect(await xpPage.shutdownRestartButton.count()).toBe(1);

    await expect(xpPage.shutdownCancelButton).toBeVisible();
    expect(await xpPage.shutdownCancelButton.count()).toBe(1);

    // Test clicking Cancel strictly closes the dialog
    await xpPage.shutdownCancelButton.click();
    await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

    expect(pageErrors).toHaveLength(0);
  });

});

  test('Issue 1 Edge Cases: FakeAudioContext chaining, multiple sources, and disconnect robustness', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/?step=desktop');

    const result = await page.evaluate(() => {
      const AudioCtx = window.AudioContext;
      const ctx = new AudioCtx();

      // Test 1: createMediaElementSource without args
      const src1 = ctx.createMediaElementSource();
      if (!src1) return { ok: false, error: 'src1 is null' };

      // Test 2: multiple sources created on same ctx
      const audio2 = document.createElement('audio');
      const src2 = ctx.createMediaElementSource(audio2);

      // Test 3: complex chaining: source -> analyser -> gain -> destination
      const analyser = ctx.createAnalyser();
      const gain = ctx.createGain();

      src1.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);

      // Test 4: disconnect without args
      src1.disconnect();
      analyser.disconnect();
      gain.disconnect();

      // Test 5: verify audio context state methods
      return {
        ok: true,
        state: ctx.state,
        sampleRate: ctx.sampleRate,
        src2MediaElement: src2.mediaElement === audio2,
      };
    });

    expect(result.ok).toBe(true);
    expect(result.src2MediaElement).toBe(true);
    expect(pageErrors).toHaveLength(0);
  });

  test('Issue 2 Edge Cases: Selectors resolve uniquely (count=1) during multi-window clutter and taskbar saturation', async ({ xpPage, page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await xpPage.gotoDesktop();

    // Open multiple clutter windows
    await xpPage.executeRunCommand('notepad');
    await xpPage.executeRunCommand('calc');
    await xpPage.executeRunCommand('wmplayer');

    // Wait for all three to appear
    await expect(xpPage.getWindow('Notepad')).toBeVisible();
    await expect(xpPage.getWindow('Calculator')).toBeVisible();
    await expect(xpPage.getWindow('Windows Media Player')).toBeVisible();

    // Open Start Menu amidst active windows
    await xpPage.openStartMenu();
    await expect(xpPage.startMenu).toBeVisible();

    // Verify Start Menu selectors are unaffected by window taskbar buttons or titles
    const allPrograms = xpPage.startMenu.locator(XP_SELECTORS.startMenu.allPrograms);
    expect(await allPrograms.count()).toBe(1);

    const turnOff = xpPage.startMenu.locator(XP_SELECTORS.startMenu.turnOff);
    expect(await turnOff.count()).toBe(1);

    // Open Shutdown Dialog on top of 3 open windows
    await xpPage.openShutdownDialog();

    await expect(xpPage.shutdownDialogTitle).toBeVisible();
    expect(await xpPage.shutdownDialog.count()).toBe(1);
    expect(await xpPage.shutdownDialogTitle.count()).toBe(1);
    expect(await xpPage.shutdownStandByButton.count()).toBe(1);
    expect(await xpPage.shutdownTurnOffButton.count()).toBe(1);
    expect(await xpPage.shutdownRestartButton.count()).toBe(1);
    expect(await xpPage.shutdownCancelButton.count()).toBe(1);

    // Cancel closes shutdown dialog cleanly
    await xpPage.shutdownCancelButton.click();
    await expect(xpPage.shutdownDialog).toBeHidden({ timeout: 5000 });

    // The other 3 windows should still be present
    expect(await xpPage.windows.count()).toBe(3);

    expect(pageErrors).toHaveLength(0);
  });
