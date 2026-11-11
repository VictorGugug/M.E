import { test, expect } from './fixtures/base.fixture';

test.describe('ZarXP Shell Smoke Suite', () => {
  test('should render desktop surface and taskbar with start button', async ({ xpPage }) => {
    // 1. Verify desktop surface is visible
    await expect(xpPage.desktop).toBeVisible();

    // 2. Verify taskbar is anchored and visible
    await expect(xpPage.taskbar).toBeVisible();

    // 3. Verify Start button is present and accessible
    await expect(xpPage.startButton).toBeVisible();

    // 4. Verify desktop icons are present
    const iconCount = await xpPage.desktop.locator('button.desktop-icon').count();
    expect(iconCount).toBeGreaterThan(0);
  });

  test('should toggle start menu open and closed', async ({ xpPage }) => {
    // 1. Initial state: Start menu is closed
    await expect(xpPage.startMenu).toBeHidden();

    // 2. Open Start Menu via Start button click
    await xpPage.openStartMenu();
    await expect(xpPage.startMenu).toBeVisible();

    // 3. Close Start Menu via desktop click
    await xpPage.closeStartMenu();
    await expect(xpPage.startMenu).toBeHidden();

    // 4. Toggle open again via toggleStartMenu
    await xpPage.toggleStartMenu();
    await expect(xpPage.startMenu).toBeVisible();

    // 5. Toggle closed via toggleStartMenu
    await xpPage.toggleStartMenu();
    await expect(xpPage.startMenu).toBeHidden();
  });
});
