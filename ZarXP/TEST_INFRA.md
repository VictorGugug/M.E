# ZarXP End-to-End Test Infrastructure Specification

- **Document Version**: 1.0.0
- **Target Application**: ZarXP (Windows XP Luna Desktop Web Recreation)
- **Root Location**: `D:\CODIGOS ANT\M.E\ZarXP\TEST_INFRA.md`
- **Specification Authority**: Milestone E1 (E2E Test Infrastructure & Specification)
- **Compliance Standards**: Devkit-TTD Rule 27 (Real Test Standard), Rule 19 (Tests & Builds Determinism), Rule 20 (File Placement Pattern)

---

## 1. Executive Summary & Testing Philosophy

### 1.1 Purpose and Scope
This document specifies the automated End-to-End (E2E) testing infrastructure for the **ZarXP** web recreation of Windows XP SP1. The testing harness verifies functional fidelity, edge-case resilience, multi-app concurrency, and realistic user workflow completion across the entire system.

### 1.2 Opaque-Box Testing Mandate
All automated test cases in this suite adhere strictly to the **opaque-box (black-box) testing paradigm**:
- Tests interact with ZarXP solely through user-observable channels: mouse pointer clicks, double clicks, drag-and-drop operations, keyboard input, and DOM state inspection.
- **Strict Store Decoupling**: Tests are completely decoupled from internal React component internals, hooks, and Zustand store singletons (`useWindowStore`, `useFileSystemStore`, `useSoundStore`, `useLangStore`).
- **Refactor Immunity**: Any internal store redesign (e.g. migrating from Zustand to Redux or React Context) will leave all tests passing without modification, provided external UI behavior remains faithful to Windows XP.

### 1.3 Rule 27 Real Test Standard Compliance
Per Devkit Rule 27 ("A test that cannot fail is not a test"):
- **Assert Observable Effects**: Every test case verifies state transitions via genuine DOM manifestations (e.g., window geometry changes, dialog rendering, `.xp-win.active` class application, form feedback text, 7-segment digital counter changes).
- **Independent Observer**: Assertions inspect the DOM tree independently of the triggering action.
- **No Facade or Tautological Tests**: Hardcoded pass strings, tautological assertions (`expect(true).toBe(true)`), and mock facades are strictly prohibited and flagged as critical integrity violations.

---

## 2. Test Architecture & Runner Setup

### 2.1 Test Runner & Execution Stack
- **Runner**: Playwright Test (`playwright/test` v1.62.1).
- **Browser Binary**: Headless Chromium (version 151.0.7922.34, pre-installed in `%LOCALAPPDATA%\ms-playwright\chromium-1234`).
- **Platform**: Windows PowerShell (`pwsh`) on Node.js v24.17.0.
- **Zero Additional Dependencies**: The test infrastructure utilizes pre-installed packages in `node_modules` without introducing new package dependencies.

### 2.2 Dev Server Orchestration
The test harness integrates directly with the Vite development server via Playwright's built-in `webServer` configuration:
- **Server Command**: `npm run dev -- --port 5173`
- **Server URL**: `http://localhost:5173/?step=desktop`
- **Reusability**: `reuseExistingServer: !process.env.CI` (reuses a running local server during iterative authoring while automatically launching and terminating instances in CI/automated runs).
- **Timeout**: 30,000 ms readiness wait.

### 2.3 Direct Desktop Boot Bypass
ZarXP's application router (`src/App.tsx`) natively parses the `?step=desktop` URL search parameter. Setting `baseURL: 'http://localhost:5173/?step=desktop'` allows tests to navigate directly to an active desktop session, bypassing the initial boot animation and login screens for sub-second test execution while preserving authentic shell state.

### 2.4 Browser Environment & Audio Stubs
In headless browser execution, unhandled Web Audio API calls or audio hardware absences can cause promise rejections. The test harness base fixture automatically injects mock shims prior to application script evaluation:
- Stubs `window.AudioContext` and `window.webkitAudioContext` (`createGain`, `createAnalyser`, `createOscillator`, `decodeAudioData`).
- Stubs `HTMLMediaElement.prototype.play`, `pause`, and `load` to prevent unhandled playback rejection.
- Enforces clean state isolation by clearing `localStorage` and `sessionStorage` between test runs.

---

## 3. Tier 1–4 Test Organization & Coverage Matrix

The test suite is structured across 4 distinct hierarchical tiers to ensure complete coverage across all 11 core features.

### 3.1 Feature Inventory (11 Core Features)
1. **F01: Window Chrome & Animations** (Maximize, restore, minimize transitions, Web Animations API, titlebar drag).
2. **F02: Run Dialog Aliases & Error Sound** (Command aliases `winver`, `calc`, `notepad`, `write`, `wordpad`, `sol`, `winmine`, `wmplayer`, and error alert).
3. **F03: AboutXP Dialog Fidelity** (XP Pro logo, version 5.1 build 2600.xpsp1, licensed user details, physical memory).
4. **F04: Shutdown Dialog Polish** (Luna gradient, Stand by, Turn Off, Restart buttons, `turnOffComputer` title localization).
5. **F05: Screensaver Canvas** (Interactive 3D Windows XP Logo bounce animation, idle activation, mouse/keyboard dismissal).
6. **F06: Explorer Navigation Stack** (Directory history stack, Back/Forward/Up/Go buttons, address bar sync, folder double-click).
7. **F07: Network Places & Program Access** (Dedicated NetworkPlaces and SetProgramAccess views, Start menu integration).
8. **F08: Minesweeper XP Fidelity** (5-state yellow face button, 7-segment digital LEDs, first-click safety, timer, flagging).
9. **F09: Solitaire Klondike Rules** (Empty column King move fix, Draw 1 vs Draw 3, scoring/timer, auto-foundation double click, cascade).
10. **F10: WordPad Rich-Text Engine** (`contenteditable` container, Bold/Italic/Underline, Font Family/Size, Alignment, Bullet Lists, selection sync).
11. **F11: MediaPlayer Full Fidelity** (Complete menus, shortcuts, 5 visualizer modes, continuous drag seeking, volume slider, playlist drawer, 3-pane status bar).

---

### 3.2 Tier 1: Feature Coverage (>=55 Tests)
Validates primary happy-path functional requirements under standard user workflows (>=5 tests per feature).

| Feature Spec | Path | Test Target (>=5 Cases) |
|---|---|---|
| F01: Window Chrome | `e2e/tier1-features/f01-window-chrome.spec.ts` | 1. Double-click titlebar maximizes window.<br>2. Double-click restores window.<br>3. Minimize button hides window to taskbar.<br>4. Close button unmounts window.<br>5. Titlebar drag repositions window coordinates. |
| F02: Run Dialog | `e2e/tier1-features/f02-run-dialog.spec.ts` | 1. Open via Start -> Run.<br>2. Run `notepad` opens Notepad.<br>3. Run `calc` opens Calculator.<br>4. Run `winver` opens AboutXP.<br>5. Run `wordpad` opens WordPad. |
| F03: AboutXP | `e2e/tier1-features/f03-about-xp.spec.ts` | 1. Launch AboutXP.<br>2. Windows XP Professional logo visible.<br>3. Version 5.1 Build 2600.xpsp1 string visible.<br>4. Licensed user profile rendered.<br>5. Physical memory stats displayed. |
| F04: Shutdown Dialog | `e2e/tier1-features/f04-shutdown-dialog.spec.ts` | 1. Launch via Start -> Turn Off Computer.<br>2. Header displays "Turn off computer".<br>3. Stand by button styled in Luna theme.<br>4. Turn Off button with red power icon.<br>5. Restart button with green restart icon. |
| F05: Screensaver | `e2e/tier1-features/f05-screensaver.spec.ts` | 1. Screensaver canvas element exists.<br>2. Screensaver activates upon idle.<br>3. XP Logo bounces with non-zero motion.<br>4. Mouse movement dismisses screensaver.<br>5. Keyboard press dismisses screensaver. |
| F06: Explorer Navigation | `e2e/tier1-features/f06-explorer-navigation.spec.ts` | 1. Folder double-click navigates into directory.<br>2. Address bar reflects current path.<br>3. Back button navigates to parent directory.<br>4. Forward button returns to subfolder.<br>5. Up button ascends directory tree. |
| F07: Network & Programs | `e2e/tier1-features/f07-network-and-programs.spec.ts` | 1. Double-click My Network Places desktop icon.<br>2. Network Places displays Entire Network shortcuts.<br>3. Start Menu -> Set Program Access opens dialog.<br>4. Custom / Microsoft / Non-Microsoft radio choices present.<br>5. Closing dialog restores desktop focus. |
| F08: Minesweeper | `e2e/tier1-features/f08-minesweeper.spec.ts` | 1. 81 unrevealed cells on launch.<br>2. Smiling face `:-)` button initial state.<br>3. First cell click safety repositioning.<br>4. Right-click toggles flag and decrements counter.<br>5. Elapsed timer increments after start. |
| F09: Solitaire | `e2e/tier1-features/f09-solitaire.spec.ts` | 1. 7 tableau piles render with cards.<br>2. Clicking stock deals cards to waste.<br>3. Valid descending alternate-color card moves.<br>4. Double-click Ace auto-moves to foundation.<br>5. King moves into empty column. |
| F10: WordPad | `e2e/tier1-features/f10-wordpad.spec.ts` | 1. Document surface is `contenteditable="true"`.<br>2. Typing populates document text.<br>3. Selecting text and clicking Bold wraps in bold styling.<br>4. Changing Font Size dropdown updates styles.<br>5. Left/Center/Right alignment updates text flow. |
| F11: Media Player | `e2e/tier1-features/f11-media-player.spec.ts` | 1. Initial Stopped status in 3-pane status bar.<br>2. Play button transitions state to Playing.<br>3. View -> Visualizations switches visualizer modes.<br>4. Volume slider drag adjusts playback gain.<br>5. Playlist button toggles drawer visibility. |

**Subtotal Tier 1**: 11 feature files × 5 tests = **55 tests**.

---

### 3.3 Tier 2: Boundary & Corner Cases (>=55 Tests)
Exercises edge cases, input extremes, error states, and negative boundaries (>=5 tests per feature).

| Feature Spec | Path | Test Target (>=5 Cases) |
|---|---|---|
| F01: Window Chrome | `e2e/tier2-boundary/b01-window-chrome.spec.ts` | 1. Drag beyond desktop viewport bounds clamps grab handle.<br>2. Rapid double-clicks maintain stable state.<br>3. 10 open windows cascade zIndex properly.<br>4. Non-resizable dialog ignores double-click maximize.<br>5. Resizing honors minWidth and minHeight constraints. |
| F02: Run Dialog | `e2e/tier2-boundary/b02-run-dialog.spec.ts` | 1. Empty or whitespace command triggers error alert.<br>2. Nonexistent command displays "Windows cannot find..." alert.<br>3. Command with mixed case and padding (`  NoTePaD.eXe  `) resolves.<br>4. Illegal filename characters handled safely.<br>5. Escape key dismisses Run dialog without execution. |
| F03: AboutXP | `e2e/tier2-boundary/b03-about-xp.spec.ts` | 1. Dialog resizable=false constraint enforced.<br>2. OK button or Enter key dismisses dialog.<br>3. Title matches localized string ("About Windows").<br>4. Opening multiple instances focuses existing window.<br>5. Zero or high memory values format safely. |
| F04: Shutdown Dialog | `e2e/tier2-boundary/b04-shutdown-dialog.spec.ts` | 1. Cancel button restores desktop session.<br>2. Stand by darkens overlay and wakes on keypress.<br>3. Title localization matches `turnOffComputer` exactly.<br>4. Outside click or Escape dismisses modal.<br>5. Button hover highlights apply Luna drop-shadow. |
| F05: Screensaver | `e2e/tier2-boundary/b05-screensaver.spec.ts` | 1. Disabled screensaver never triggers overlay.<br>2. Pointerdown / touchstart dismisses screensaver.<br>3. Window resize while screensaver is active adapts canvas.<br>4. Sub-pixel mouse jitter does not falsely dismiss.<br>5. Screensaver does not block shutdown modal. |
| F06: Explorer Navigation | `e2e/tier2-boundary/b06-explorer-navigation.spec.ts` | 1. Back button disabled on empty history stack.<br>2. Forward button disabled at history head.<br>3. Invalid address bar path shows error feedback.<br>4. Empty folder renders empty state placeholder.<br>5. Root directory disables Up button. |
| F07: Network & Programs | `e2e/tier2-boundary/b07-network-and-programs.spec.ts` | 1. Empty workgroup shows discovery status.<br>2. Non-functional shortcut displays dialog gracefully.<br>3. Program Access radio choices persist on reopen.<br>4. Address bar displays valid shell URI or label.<br>5. Concurrent Explorer views do not clobber state. |
| F08: Minesweeper | `e2e/tier2-boundary/b08-minesweeper.spec.ts` | 1. Right-clicking revealed cell is ignored.<br>2. Mine counter clamps at 000 when all flags used.<br>3. Mine detonation triggers dead face `X-(` and halts timer.<br>4. Mouse-down triggers shocked face `:-o`; mouse-leave reverts.<br>5. Face reset clears board and resets timer to 000. |
| F09: Solitaire | `e2e/tier2-boundary/b09-solitaire.spec.ts` | 1. Dragging non-King into empty column rejected.<br>2. Invalid foundation placement rejected.<br>3. Exhausted stock recycles waste cleanly.<br>4. Toggling Draw 1 to Draw 3 updates deal batch.<br>5. Dragging card outside window bounds snaps back. |
| F10: WordPad | `e2e/tier2-boundary/b10-wordpad.spec.ts` | 1. Pasting large plain-text block preserves markup.<br>2. Empty selection formatting applies to next character.<br>3. Bold + Italic + Underline formats stack cleanly.<br>4. Bullet list on empty line executes safely.<br>5. Text content survives minimize and restore. |
| F11: Media Player | `e2e/tier2-boundary/b11-media-player.spec.ts` | 1. Play with empty playlist displays warning.<br>2. Seeking to 0% or 100% boundary clamps cleanly.<br>3. Setting volume to 0 reflects mute status.<br>4. Audio track with missing metadata falls back to filename.<br>5. Rapid play/pause clicks maintain state machine integrity. |

**Subtotal Tier 2**: 11 feature files × 5 tests = **55 tests**.

---

### 3.4 Tier 3: Pairwise & Cross-Feature Interactions (>=11 Tests)
Validates multitasking, window layering, clipboard interoperability, and concurrent application execution.

| Spec Path | Features Under Test | Interaction Under Test |
|---|---|---|
| `e2e/tier3-pairwise/p01-multitasking-audio-games.spec.ts` | F11 (Media Player) + F08 (Minesweeper) | Media Player audio playback continues uninterrupted while Minesweeper triggers sound effects. |
| `e2e/tier3-pairwise/p02-window-layering-focus.spec.ts` | F01 (Window) + F06 (Explorer) + F10 (WordPad) | Clicking inactive background window elevates zIndex, updates active titlebar, and unfocuses previous active window. |
| `e2e/tier3-pairwise/p03-taskbar-minimize-all-run.spec.ts` | F01 (Taskbar) + F02 (Run Dialog) | Quick Launch "Show Desktop" minimizes all open windows; launching via Run un-minimizes or layers on top. |
| `e2e/tier3-pairwise/p04-explorer-file-association-wordpad.spec.ts` | F06 (Explorer) + F10 (WordPad) | Double-clicking a text file in My Documents opens it inside WordPad with content populated. |
| `e2e/tier3-pairwise/p05-screensaver-audio-playback.spec.ts` | F05 (Screensaver) + F11 (Media Player) | Idle timeout activates screensaver while Media Player continues background playback. |
| `e2e/tier3-pairwise/p06-run-dialog-games-launch.spec.ts` | F02 (Run) + F09 (Solitaire) + F08 (Minesweeper) | Executing `sol` and `winmine` simultaneously runs both games independently without interference. |
| `e2e/tier3-pairwise/p07-media-playlist-multitrack-seeking.spec.ts` | F11 (Media Player) + F06 (Explorer) | Adding files from Explorer to Media Player playlist drawer updates track count in 3-pane status bar. |
| `e2e/tier3-pairwise/p08-wordpad-clipboard-interactions.spec.ts` | F10 (WordPad) + F03 (AboutXP) | Copying build number text from AboutXP and pasting into WordPad contenteditable area. |
| `e2e/tier3-pairwise/p09-explorer-history-deep-traversal.spec.ts` | F06 (Explorer) + F07 (Network Places) | Navigating between My Documents, My Computer, and Network Places maintains a unified navigation history. |
| `e2e/tier3-pairwise/p10-shutdown-dialog-cancel-resume.spec.ts` | F04 (Shutdown) + F10 (WordPad) | Opening Shutdown Dialog with unsaved WordPad document and clicking Cancel preserves document state. |
| `e2e/tier3-pairwise/p11-startmenu-allprograms-cascade.spec.ts` | F01 (Start Menu) + F07 (Programs) + F08 (Games) | Hovering All Programs -> Games submenus cascades correctly without premature dismissal. |

**Subtotal Tier 3**: 11 specs × 1 test = **11 tests**.

---

### 3.5 Tier 4: Real-World Workload Scenarios (>=6 Tests)
Simulates complete multi-step realistic user sessions from start to finish.

| Spec Path | Scenario Name | Scenario Description |
|---|---|---|
| `e2e/tier4-scenarios/s01-office-productivity-workflow.spec.ts` | Office Productivity Session | User boots to desktop, launches WordPad, types formatted document with header and bullet lists, navigates My Documents, and checks file hierarchy. |
| `e2e/tier4-scenarios/s02-multimedia-entertainment-workflow.spec.ts` | Multimedia Entertainment Session | User opens Media Player via Quick Launch, loads playlist, starts playback, switches visualizer to Firestorm, adjusts volume, seeks track, and minimizes to taskbar. |
| `e2e/tier4-scenarios/s03-retro-gaming-session-workflow.spec.ts` | Classic XP Gaming Session | User opens Minesweeper, reveals cells, flags mines, verifies timer, minimizes, launches Solitaire, plays Klondike Draw 3, and cascades both games. |
| `e2e/tier4-scenarios/s04-system-administration-workflow.spec.ts` | System Administration & Audit | User opens Run Dialog, verifies build `2600.xpsp1` via `winver`, reviews Set Program Access defaults, inspects Display Properties, and closes dialogs. |
| `e2e/tier4-scenarios/s05-power-user-multitasking-workflow.spec.ts` | Power User Multitasking | User launches 5 concurrent applications (WordPad, Calculator, Media Player, Minesweeper, Explorer), switches active windows via taskbar, and clears screen with Show Desktop. |
| `e2e/tier4-scenarios/s06-full-session-boot-to-shutdown.spec.ts` | Full Boot-to-Shutdown Lifecycle | User logs in from XP welcome screen, organizes desktop windows, performs productivity tasks, opens Turn Off Computer dialog, and selects Turn Off. |

**Subtotal Tier 4**: 6 specs × 1 test = **6 tests**.

---

### 3.6 Complete Suite Totals

$$\text{Tier 1 (55)} + \text{Tier 2 (55)} + \text{Tier 3 (11)} + \text{Tier 4 (6)} = \mathbf{127\text{ automated test cases minimum}}$$

---

## 4. Test Harness Directory Layout & File Naming Conventions

All test code and configuration reside strictly within `D:\CODIGOS ANT\M.E\ZarXP\e2e/` and `playwright.config.ts`, completely isolated from production application source files (`src/`):

```
D:\CODIGOS ANT\M.E\ZarXP\
|-- e2e/
|   |-- fixtures/
|   |   \-- base.fixture.ts                 # Extended test fixture with audio stubs and auto-desktop boot
|   |-- helpers/
|   |   \-- xp-page.ts                      # Opaque-box XPPage page object and selector catalog
|   |-- tier1-features/
|   |   |-- f01-window-chrome.spec.ts
|   |   |-- f02-run-dialog.spec.ts
|   |   |-- f03-about-xp.spec.ts
|   |   |-- f04-shutdown-dialog.spec.ts
|   |   |-- f05-screensaver.spec.ts
|   |   |-- f06-explorer-navigation.spec.ts
|   |   |-- f07-network-and-programs.spec.ts
|   |   |-- f08-minesweeper.spec.ts
|   |   |-- f09-solitaire.spec.ts
|   |   |-- f10-wordpad.spec.ts
|   |   \-- f11-media-player.spec.ts
|   |-- tier2-boundary/
|   |   |-- b01-window-chrome.spec.ts
|   |   |-- b02-run-dialog.spec.ts
|   |   |-- b03-about-xp.spec.ts
|   |   |-- b04-shutdown-dialog.spec.ts
|   |   |-- b05-screensaver.spec.ts
|   |   |-- b06-explorer-navigation.spec.ts
|   |   |-- b07-network-and-programs.spec.ts
|   |   |-- b08-minesweeper.spec.ts
|   |   |-- b09-solitaire.spec.ts
|   |   |-- b10-wordpad.spec.ts
|   |   \-- b11-media-player.spec.ts
|   |-- tier3-pairwise/
|   |   |-- p01-multitasking-audio-games.spec.ts
|   |   |-- p02-window-layering-focus.spec.ts
|   |   |-- p03-taskbar-minimize-all-run.spec.ts
|   |   |-- p04-explorer-file-association-wordpad.spec.ts
|   |   |-- p05-screensaver-audio-playback.spec.ts
|   |   |-- p06-run-dialog-games-launch.spec.ts
|   |   |-- p07-media-playlist-multitrack-seeking.spec.ts
|   |   |-- p08-wordpad-clipboard-interactions.spec.ts
|   |   |-- p09-explorer-history-deep-traversal.spec.ts
|   |   |-- p10-shutdown-dialog-cancel-resume.spec.ts
|   |   \-- p11-startmenu-allprograms-cascade.spec.ts
|   |-- tier4-scenarios/
|   |   |-- s01-office-productivity-workflow.spec.ts
|   |   |-- s02-multimedia-entertainment-workflow.spec.ts
|   |   |-- s03-retro-gaming-session-workflow.spec.ts
|   |   |-- s04-system-administration-workflow.spec.ts
|   |   |-- s05-power-user-multitasking-workflow.spec.ts
|   |   \-- s06-full-session-boot-to-shutdown.spec.ts
|   \-- smoke.spec.ts                       # Baseline smoke test verifying shell boot and start menu
|-- playwright.config.ts                    # Root Playwright configuration
|-- package.json                            # Added test:e2e* scripts
|-- .gitignore                              # test-results/ and playwright-report/ excluded
\-- TEST_INFRA.md                           # This document
```

### File Naming Rules:
- **Tier 1**: `f<NN>-<feature-slug>.spec.ts` (e.g., `f01-window-chrome.spec.ts`)
- **Tier 2**: `b<NN>-<feature-slug>.spec.ts` (e.g., `b02-run-dialog.spec.ts`)
- **Tier 3**: `p<NN>-<interaction-slug>.spec.ts` (e.g., `p01-multitasking-audio-games.spec.ts`)
- **Tier 4**: `s<NN>-<scenario-slug>.spec.ts` (e.g., `s01-office-productivity-workflow.spec.ts`)

---

## 5. Opaque-Box Test Harness & Helper Library

### 5.1 Base Test Fixture (`e2e/fixtures/base.fixture.ts`)
Provides an isolated, clean browser context for each test:
- Injects headless audio stubs (`window.AudioContext`, `HTMLMediaElement.prototype.play`) prior to script evaluation.
- Directly navigates to `/?step=desktop` to boot immediately into the desktop environment.
- Awaits shell hydration (`.xp-taskbar`, `button.xp-start-btn`).
- Cleans up storage (`localStorage.clear()`, `sessionStorage.clear()`) on test teardown.

### 5.2 Universal DOM Selector Catalog (`XP_SELECTORS`)
Centralized in `e2e/helpers/xp-page.ts`:
- **Desktop**: `.desktop`, `button.desktop-icon:has-text(...)`, `.desktop-context-menu`.
- **Taskbar**: `.xp-taskbar`, `button.xp-start-btn`, `button.xp-task-btn:has-text(...)`, `.xp-tray-clock`.
- **Start Menu**: `.xp-startmenu`, `.xp-startmenu button:has-text(...)`, `.xp-start-all-progs`.
- **Window**: `div.xp-win[role="dialog"]:has(.xp-titlebar span.label:has-text(...))`, `.xp-win.active`, `button[aria-label="Minimize"]`, `button[aria-label="Maximize"]`, `button[aria-label="Close"]`.
- **Run Dialog**: `input#run-open`, `.xp-dialog-footer button:has-text("OK")`, `#run-error[role="alert"]`.

### 5.3 Anti-Pattern vs. Compliant Pattern Reference
To preserve refactor immunity and Devkit Rule 27 compliance:

| Action | Prohibited Anti-Pattern (Coupled to Internals) | Compliant Opaque-Box Pattern |
|---|---|---|
| Open Calculator | `useWindowStore.getState().openWindow('calculator')` | `await xpPage.launchAppFromDesktop('Calculator', 'Calculator')` |
| Close Active Window | `useWindowStore.getState().closeWindow(winId)` | `await xpPage.closeWindow('Calculator')` |
| Assert Window State | `expect(useWindowStore.getState().windows[0].state).toBe('maximized')` | `await expect(xpPage.getWindow('Calculator')).toHaveCSS('width', '1024px')` |
| Test Run Error | Call `fileSystem.ts` command validator function directly | Fill `input#run-open` with `badcmd`, click OK, assert `#run-error[role="alert"]` |

---

## 6. Determinism, Reliability & Quality Gates

### 6.1 Deterministic Single-Worker Execution
Because ZarXP simulates a single shared desktop screen in a browser viewport:
- `workers: 1` and `fullyParallel: false` are enforced in `playwright.config.ts`.
- Prevents cross-test window interleaving, focus stealing, or race conditions.

### 6.2 Linter & Build Cleanliness Gates
- **Production Build Gate**: `npm run build` runs `tsc -b && vite build`. Since `tsconfig.app.json` restricts compilation to `src/`, E2E test files in `e2e/` cannot break or bloat production builds.
- **Linter Gate**: `npm run lint` executes `oxlint --ignore-pattern public`. All files in `e2e/` must pass with **0 warnings and 0 errors**.
- **Exit Code 0**: All Playwright commands must return cleanly with exit code 0.

---

## 7. Execution Runbook & CLI Commands

### 7.1 Single Master Command (Run Entire Test Suite)
```powershell
npm run test:e2e
```

### 7.2 Tiered Execution Commands
```powershell
# Run Tier 1 Feature Coverage specs
npm run test:e2e:tier1

# Run Tier 2 Boundary & Corner Case specs
npm run test:e2e:tier2

# Run Tier 3 Pairwise Cross-Feature specs
npm run test:e2e:tier3

# Run Tier 4 Real-World Workload Scenarios
npm run test:e2e:tier4
```

### 7.3 Focused Test & Debugging Execution
```powershell
# Run single test file
npx playwright test e2e/smoke.spec.ts

# Run in headed browser mode
npx playwright test e2e/smoke.spec.ts --headed

# Run with Playwright trace viewer
npx playwright test --trace on
```
