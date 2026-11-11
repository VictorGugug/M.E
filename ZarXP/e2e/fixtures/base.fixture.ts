import { test as base, expect, type Page } from 'playwright/test';
import { XPPage } from '../helpers/xp-page';

export interface ZarXPTestFixtures {
  xpPage: XPPage;
  desktopPage: Page;
}

/**
 * Extended Playwright test fixture providing:
 * 1. Headless audio stubs (Web Audio API & HTMLMediaElement) to prevent audio exceptions.
 * 2. Automatic direct navigation to ZarXP desktop bypass (?step=desktop).
 * 3. Pre-instantiated opaque-box XPPage helper.
 * 4. Post-test storage cleanup for deterministic isolation (Devkit Rule 27).
 */
export const test = base.extend<ZarXPTestFixtures>({
  page: async ({ page }, provide) => {
    // 1. Stub Audio APIs in headless Chromium before scripts run
    await page.addInitScript(() => {
      const FakeAudioContext = class {
        state = 'running';
        sampleRate = 44100;
        currentTime = 0;
        destination = {};
        createGain() {
          return {
            connect() {},
            disconnect() {},
            gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {} },
          };
        }
        createAnalyser() {
          return {
            connect() {},
            disconnect() {},
            getByteFrequencyData(arr: Uint8Array) { arr.fill(0); },
            getByteTimeDomainData(arr: Uint8Array) { arr.fill(128); },
            frequencyBinCount: 64,
            fftSize: 128,
          };
        }
        createOscillator() {
          return {
            connect() {},
            disconnect() {},
            start() {},
            stop() {},
            frequency: { value: 440, setValueAtTime() {} },
          };
        }
        createMediaElementSource(mediaElement?: HTMLMediaElement) {
          return {
            connect(destinationNode?: any) {
              return destinationNode;
            },
            disconnect() {},
            mediaElement,
            context: this,
            numberOfInputs: 0,
            numberOfOutputs: 1,
          };
        }
        decodeAudioData(_data: ArrayBuffer, successCallback?: (buf: any) => void) {
          const fakeBuffer = { duration: 10, numberOfChannels: 2, sampleRate: 44100 };
          if (successCallback) successCallback(fakeBuffer);
          return Promise.resolve(fakeBuffer);
        }
        close() { return Promise.resolve(); }
        resume() { return Promise.resolve(); }
        suspend() { return Promise.resolve(); }
      };

      // Assign to window AudioContext and webkitAudioContext
      (window as any).AudioContext = FakeAudioContext;
      (window as any).webkitAudioContext = FakeAudioContext;

      // Stub HTMLMediaElement playback
      window.HTMLMediaElement.prototype.play = async () => {};
      window.HTMLMediaElement.prototype.pause = () => {};
      window.HTMLMediaElement.prototype.load = () => {};
    });

    await provide(page);

    // Teardown: clear storage
    try {
      await page.evaluate(() => {
        try { localStorage.clear(); } catch {}
        try { sessionStorage.clear(); } catch {}
      });
    } catch {
      // Ignore if page is already closed
    }
  },

  desktopPage: async ({ page }, provide) => {
    const xp = new XPPage(page);
    await xp.gotoDesktop();
    await provide(page);
  },

  xpPage: async ({ page }, provide) => {
    const xp = new XPPage(page);
    await xp.gotoDesktop();
    await provide(xp);
  },
});

export { expect };
