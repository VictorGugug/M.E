import { expect, type Locator, type Page } from 'playwright/test';

/**
 * Universal DOM selector dictionary for ZarXP opaque-box interactions.
 * All selectors operate strictly on user-visible attributes and roles.
 */
export const XP_SELECTORS = {
  desktop: {
    root: '.desktop',
    icon: (label: string) => `button.desktop-icon:has-text("${label}")`,
    contextMenu: '.desktop-context-menu',
    screensaverCanvas: '.desktop canvas, div[style*="background: rgb(0, 0, 0)"]',
  },
  taskbar: {
    root: '.xp-taskbar',
    startBtn: 'button.xp-start-btn',
    taskBtn: (title: string) => `button.xp-task-btn:has-text("${title}")`,
    taskBtnActive: 'button.xp-task-btn.xp-task-btn-active',
    quickLaunch: (label: string) => `button.xp-ql-btn[aria-label="${label}"], button.xp-ql-btn[title="${label}"]`,
    trayClock: '.xp-tray-clock',
    volumeIcon: '.xp-tray img[alt*="Volume"], .xp-tray-icon[title*="Volume"]',
  },
  startMenu: {
    root: '.xp-startmenu',
    item: (name: string) => `.xp-startmenu button:has-text("${name}"), .xp-startmenu li:has-text("${name}")`,
    allPrograms: '.sm-programs button, .xp-startmenu button:has-text("All Programs"), .xp-startmenu button:has-text("Todos los programas")',
    turnOff: '.sm-bottom button:has-text("Turn Off"), .sm-bottom button:has-text("Apagar"), .sm-bottom button:has(img[src*="recovery"])',
    logOff: '.sm-bottom button:has-text("Log Off"), .sm-bottom button:has-text("Cerrar"), .sm-bottom button:has(img[src*="logoff"])',
  },
  window: {
    dialog: (title: string) => `div.xp-win[role="dialog"]:has(.xp-titlebar span.label:has-text("${title}"))`,
    anyDialog: 'div.xp-win[role="dialog"]',
    activeDialog: 'div.xp-win.active[role="dialog"]',
    titlebar: '.xp-titlebar',
    titleLabel: '.xp-win-title span.label',
    btnMinimize: 'button[aria-label="Minimize"], button[aria-label="Minimizar"]',
    btnMaximize: 'button[aria-label="Maximize"], button[aria-label="Maximizar"]',
    btnRestore: 'button[aria-label="Restore"], button[aria-label="Restaurar"]',
    btnClose: 'button[aria-label="Close"], button[aria-label="Cerrar"]',
    body: '.window-body',
    statusBar: '.window-statusbar',
  },
  runDialog: {
    input: 'input#run-open',
    okBtn: '.xp-dialog-footer button:has-text("OK")',
    cancelBtn: '.xp-dialog-footer button:has-text("Cancel"), .xp-dialog-footer button:has-text("Cancelar")',
    errorAlert: '#run-error[role="alert"]',
  },
  shutdownDialog: {
    root: 'div.xp-win[role="dialog"]:has(button:has-text("Turn Off")), div.xp-win[role="dialog"]:has(button:has-text("Apagar")), div.xp-win[role="dialog"]:has(img[src*="Power.png"])',
    title: '.xp-dialog-surface div[style*="linear-gradient"] span, .xp-dialog-surface span:has-text("Turn off computer"), .xp-dialog-surface span:has-text("Apagar el equipo")',
    standByBtn: '.xp-dialog-body button:has(img[src*="Standby"]), .xp-dialog-body button[aria-label="Stand by"], .xp-dialog-body button[aria-label="En espera"], .xp-dialog-body button:has-text("Stand by"), .xp-dialog-body button:has-text("En espera")',
    turnOffBtn: '.xp-dialog-body button:has(img[src*="Power"]), .xp-dialog-body button[aria-label="Turn Off"], .xp-dialog-body button[aria-label="Apagar"], .xp-dialog-body button:has-text("Turn Off"), .xp-dialog-body button:has-text("Apagar")',
    restartBtn: '.xp-dialog-body button:has(img[src*="Restart"]), .xp-dialog-body button[aria-label="Restart"], .xp-dialog-body button[aria-label="Reiniciar"], .xp-dialog-body button:has-text("Restart"), .xp-dialog-body button:has-text("Reiniciar")',
    cancelBtn: '.xp-dialog-footer button:has-text("Cancel"), .xp-dialog-footer button:has-text("Cancelar"), .xp-dialog-footer button',
  },
};

/**
 * Page object representing the Windows XP desktop and shell for opaque-box testing.
 */
export class XPPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators

  get desktop(): Locator {
    return this.page.locator(XP_SELECTORS.desktop.root);
  }

  get taskbar(): Locator {
    return this.page.locator(XP_SELECTORS.taskbar.root);
  }

  get startButton(): Locator {
    return this.page.locator(XP_SELECTORS.taskbar.startBtn);
  }

  get startMenu(): Locator {
    return this.page.locator(XP_SELECTORS.startMenu.root);
  }

  get windows(): Locator {
    return this.page.locator(XP_SELECTORS.window.anyDialog);
  }

  get activeWindow(): Locator {
    return this.page.locator(XP_SELECTORS.window.activeDialog);
  }

  get runDialogInput(): Locator {
    return this.page.locator(XP_SELECTORS.runDialog.input);
  }

  get runDialogOkButton(): Locator {
    return this.page.locator(XP_SELECTORS.runDialog.okBtn);
  }

  get runDialogCancelButton(): Locator {
    return this.page.locator(XP_SELECTORS.runDialog.cancelBtn);
  }

  get runDialogError(): Locator {
    return this.page.locator(XP_SELECTORS.runDialog.errorAlert);
  }

  get shutdownDialog(): Locator {
    return this.page.locator(XP_SELECTORS.shutdownDialog.root);
  }

  get shutdownDialogTitle(): Locator {
    return this.shutdownDialog.locator(XP_SELECTORS.shutdownDialog.title);
  }

  get shutdownStandByButton(): Locator {
    return this.shutdownDialog.locator(XP_SELECTORS.shutdownDialog.standByBtn);
  }

  get shutdownTurnOffButton(): Locator {
    return this.shutdownDialog.locator(XP_SELECTORS.shutdownDialog.turnOffBtn);
  }

  get shutdownRestartButton(): Locator {
    return this.shutdownDialog.locator(XP_SELECTORS.shutdownDialog.restartBtn);
  }

  get shutdownCancelButton(): Locator {
    return this.shutdownDialog.locator(XP_SELECTORS.shutdownDialog.cancelBtn);
  }

  getDesktopIcon(label: string): Locator {
    return this.page.locator(XP_SELECTORS.desktop.icon(label));
  }

  getWindow(title: string): Locator {
    return this.page.locator(XP_SELECTORS.window.dialog(title));
  }

  getTaskbarButton(title: string): Locator {
    return this.page.locator(XP_SELECTORS.taskbar.taskBtn(title));
  }

  getStartMenuItem(name: string): Locator {
    return this.page.locator(XP_SELECTORS.startMenu.item(name));
  }

  // Opaque Actions

  /**
   * Navigate directly to the desktop bypass step and await full shell hydration.
   */
  async gotoDesktop(): Promise<void> {
    await this.page.goto('/?step=desktop');
    await expect(this.desktop).toBeVisible({ timeout: 15000 });
    await expect(this.taskbar).toBeVisible({ timeout: 10000 });
    await expect(this.startButton).toBeVisible({ timeout: 5000 });
  }

  /**
   * Open the Start Menu if not already visible.
   */
  async openStartMenu(): Promise<void> {
    const isVisible = await this.startMenu.isVisible();
    if (!isVisible) {
      await this.startButton.click();
      await expect(this.startMenu).toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Close the Start Menu if visible.
   */
  async closeStartMenu(): Promise<void> {
    const isVisible = await this.startMenu.isVisible();
    if (isVisible) {
      // Click desktop background to dismiss
      await this.desktop.click({ position: { x: 500, y: 300 } });
      await expect(this.startMenu).toBeHidden({ timeout: 5000 });
    }
  }

  /**
   * Toggle the Start Menu state via the Start button.
   */
  async toggleStartMenu(): Promise<void> {
    await this.startButton.click();
  }

  /**
   * Open the Shutdown Dialog via the Start Menu Turn Off button.
   */
  async openShutdownDialog(): Promise<Locator> {
    await this.openStartMenu();
    const turnOffBtn = this.page.locator(XP_SELECTORS.startMenu.turnOff);
    await expect(turnOffBtn.first()).toBeVisible({ timeout: 5000 });
    await turnOffBtn.first().click();
    await expect(this.shutdownDialog).toBeVisible({ timeout: 5000 });
    return this.shutdownDialog;
  }

  /**
   * Double-click a desktop icon to launch an application.
   */
  async launchAppFromDesktop(iconLabel: string, expectedWindowTitle?: string): Promise<Locator> {
    const icon = this.getDesktopIcon(iconLabel);
    await expect(icon).toBeVisible({ timeout: 5000 });
    await icon.dblclick();

    if (expectedWindowTitle) {
      const win = this.getWindow(expectedWindowTitle);
      await expect(win).toBeVisible({ timeout: 10000 });
      return win;
    }
    return this.activeWindow;
  }

  /**
   * Launch an application from the Start Menu.
   */
  async launchAppFromStartMenu(itemName: string, expectedWindowTitle?: string): Promise<Locator> {
    await this.openStartMenu();
    const item = this.getStartMenuItem(itemName);
    await expect(item.first()).toBeVisible({ timeout: 5000 });
    await item.first().click();

    if (expectedWindowTitle) {
      const win = this.getWindow(expectedWindowTitle);
      await expect(win).toBeVisible({ timeout: 10000 });
      return win;
    }
    return this.activeWindow;
  }

  /**
   * Open the Run Dialog and execute a command.
   */
  async executeRunCommand(command: string, expectedWindowTitle?: string): Promise<Locator | null> {
    await this.openStartMenu();
    const runItem = this.getStartMenuItem('Run...');
    if (await runItem.first().isVisible()) {
      await runItem.first().click();
    } else {
      // Fallback: Click any Run entry
      await this.page.locator('.xp-startmenu button:has-text("Run")').first().click();
    }

    await expect(this.runDialogInput).toBeVisible({ timeout: 5000 });
    await this.runDialogInput.fill(command);
    await this.runDialogOkButton.click();

    if (expectedWindowTitle) {
      const win = this.getWindow(expectedWindowTitle);
      await expect(win).toBeVisible({ timeout: 10000 });
      return win;
    }
    return null;
  }

  /**
   * Minimize a window by title.
   */
  async minimizeWindow(title: string): Promise<void> {
    const win = this.getWindow(title);
    await expect(win).toBeVisible({ timeout: 5000 });
    const minBtn = win.locator(XP_SELECTORS.window.btnMinimize);
    await minBtn.click();
    await expect(win).toBeHidden({ timeout: 5000 });
  }

  /**
   * Maximize a window by title.
   */
  async maximizeWindow(title: string): Promise<void> {
    const win = this.getWindow(title);
    await expect(win).toBeVisible({ timeout: 5000 });
    const maxBtn = win.locator(XP_SELECTORS.window.btnMaximize);
    await maxBtn.click();
  }

  /**
   * Restore a maximized window by title.
   */
  async restoreWindow(title: string): Promise<void> {
    const win = this.getWindow(title);
    await expect(win).toBeVisible({ timeout: 5000 });
    const restoreBtn = win.locator(XP_SELECTORS.window.btnRestore);
    await restoreBtn.click();
  }

  /**
   * Close a window by title.
   */
  async closeWindow(title: string): Promise<void> {
    const win = this.getWindow(title);
    await expect(win).toBeVisible({ timeout: 5000 });
    const closeBtn = win.locator(XP_SELECTORS.window.btnClose);
    await closeBtn.click();
    await expect(win).toBeHidden({ timeout: 5000 });
  }

  /**
   * Focus a window by clicking its taskbar button.
   */
  async focusViaTaskbar(title: string): Promise<void> {
    const taskBtn = this.getTaskbarButton(title);
    await expect(taskBtn).toBeVisible({ timeout: 5000 });
    await taskBtn.click();
  }

  /**
   * Drag a window by its titlebar.
   */
  async dragWindow(title: string, deltaX: number, deltaY: number): Promise<void> {
    const win = this.getWindow(title);
    await expect(win).toBeVisible({ timeout: 5000 });
    const titlebar = win.locator(XP_SELECTORS.window.titlebar);
    const box = await titlebar.boundingBox();
    if (!box) throw new Error(`Could not find bounding box for titlebar of window: ${title}`);

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + deltaX, startY + deltaY, { steps: 5 });
    await this.page.mouse.up();
  }

  /**
   * Get the tray clock text.
   */
  async getTrayClockText(): Promise<string> {
    const clock = this.page.locator(XP_SELECTORS.taskbar.trayClock);
    await expect(clock).toBeVisible({ timeout: 5000 });
    return (await clock.textContent()) ?? '';
  }
}
