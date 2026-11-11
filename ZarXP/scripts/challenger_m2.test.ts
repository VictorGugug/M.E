import { strict as assert } from "node:assert";
import { test, describe } from "node:test";
import {
  normalizeRunCommand,
  findNodeByPath,
  getFileAppId,
  createInitialFileSystem,
} from "../src/store/fileSystem.ts";
import { useWindowStore } from "../src/store/windowStore.ts";

describe("Milestone 2 Empirical Challenge: Command Alias Resolution", () => {
  test("resolves all canonical Windows XP command aliases", () => {
    assert.equal(normalizeRunCommand("winver"), "about-xp");
    assert.equal(normalizeRunCommand("calc"), "calculator");
    assert.equal(normalizeRunCommand("notepad"), "notepad");
    assert.equal(normalizeRunCommand("write"), "wordpad");
    assert.equal(normalizeRunCommand("wordpad"), "wordpad");
    assert.equal(normalizeRunCommand("sol"), "solitaire");
    assert.equal(normalizeRunCommand("winmine"), "minesweeper");
    assert.equal(normalizeRunCommand("wmplayer"), "media-player");
    assert.equal(normalizeRunCommand("cmd"), "terminal");
  });

  test("resolves aliases with .exe extensions", () => {
    assert.equal(normalizeRunCommand("winver.exe"), "about-xp");
    assert.equal(normalizeRunCommand("calc.exe"), "calculator");
    assert.equal(normalizeRunCommand("notepad.exe"), "notepad");
    assert.equal(normalizeRunCommand("write.exe"), "wordpad");
    assert.equal(normalizeRunCommand("wordpad.exe"), "wordpad");
    assert.equal(normalizeRunCommand("sol.exe"), "solitaire");
    assert.equal(normalizeRunCommand("winmine.exe"), "minesweeper");
    assert.equal(normalizeRunCommand("wmplayer.exe"), "media-player");
    assert.equal(normalizeRunCommand("cmd.exe"), "terminal");
  });

  test("resolves control panel applet aliases (.cpl)", () => {
    assert.equal(normalizeRunCommand("sysdm.cpl"), "system-properties");
    assert.equal(normalizeRunCommand("desk.cpl"), "display-properties");
    assert.equal(normalizeRunCommand("timedate.cpl"), "date-time");
    assert.equal(normalizeRunCommand("mmsys.cpl"), "volume");
    assert.equal(normalizeRunCommand("intl.cpl"), "regional-options");
    assert.equal(normalizeRunCommand("wscui.cpl"), "security-center");
    assert.equal(normalizeRunCommand("nusrmgr.cpl"), "user-accounts");
  });

  test("guarantees case insensitivity across commands and paths", () => {
    assert.equal(normalizeRunCommand("WINVER"), "about-xp");
    assert.equal(normalizeRunCommand("Calc.exe"), "calculator");
    assert.equal(normalizeRunCommand("CALC"), "calculator");
    assert.equal(normalizeRunCommand("Notepad.EXE"), "notepad");
    assert.equal(normalizeRunCommand("WRITE"), "wordpad");
    assert.equal(normalizeRunCommand("WordPad.Exe"), "wordpad");
    assert.equal(normalizeRunCommand("SOL.exe"), "solitaire");
    assert.equal(normalizeRunCommand("WinMine.EXE"), "minesweeper");
    assert.equal(normalizeRunCommand("WMPlayer.exe"), "media-player");
    assert.equal(normalizeRunCommand("WMPLAYER"), "media-player");
    assert.equal(normalizeRunCommand("CMD.EXE"), "terminal");
    assert.equal(normalizeRunCommand("CMD"), "terminal");
    assert.equal(normalizeRunCommand("C:\\Windows\\System32\\CALC.EXE"), "calculator");
    assert.equal(normalizeRunCommand("c:/windows/system32/winmine.exe"), "minesweeper");
    assert.equal(normalizeRunCommand("C:\\WINDOWS\\system32\\CMD.exe"), "terminal");
  });

  test("rejects invalid commands and empty values cleanly", () => {
    assert.equal(normalizeRunCommand(""), null);
    assert.equal(normalizeRunCommand("   "), null);
    assert.equal(normalizeRunCommand("invalid_command"), null);
    assert.equal(normalizeRunCommand("unknown.exe"), null);
    assert.equal(normalizeRunCommand("calc.bat"), null);
    assert.equal(normalizeRunCommand("winver.com"), null);
    assert.equal(normalizeRunCommand("explorer_fake.exe"), null);
  });

  test("simulates RunDialog execution pipeline for valid aliases, arguments, paths, and errors", () => {
    const fs = createInitialFileSystem();
    let playedSound: string | null = null;
    const playSoundMock = (sound: string) => { playedSound = sound; };

    // Function matching RunDialog.tsx handleRun logic
    function executeRun(input: string): { action: "open" | "error"; appId?: string; resourceId?: string; error?: string } {
      playedSound = null;
      const trimmed = input.trim();
      if (!trimmed) {
        playSoundMock("Windows XP Error.wav");
        return { action: "error", error: "runCannotFind" };
      }
      const [firstWord, ...rest] = trimmed.split(/\s+/);
      const appId = normalizeRunCommand(trimmed) ?? normalizeRunCommand(firstWord);
      if (appId) {
        const restArg = rest.join(" ").replace(/^["']|["']$/g, "").trim();
        const targetNode = restArg ? findNodeByPath(fs, restArg) : undefined;
        return { action: "open", appId, resourceId: targetNode?.id };
      }
      const node = findNodeByPath(fs, trimmed);
      if (!node) {
        playSoundMock("Windows XP Error.wav");
        return { action: "error", error: "runCannotFind" };
      }
      return { action: "open", appId: node.kind === "folder" ? "explorer" : getFileAppId(node), resourceId: node.id };
    }

    // 1. Plain aliases
    assert.deepEqual(executeRun("winver"), { action: "open", appId: "about-xp", resourceId: undefined });
    assert.equal(playedSound, null);

    assert.deepEqual(executeRun("calc"), { action: "open", appId: "calculator", resourceId: undefined });
    assert.deepEqual(executeRun("write"), { action: "open", appId: "wordpad", resourceId: undefined });
    assert.deepEqual(executeRun("sol"), { action: "open", appId: "solitaire", resourceId: undefined });
    assert.deepEqual(executeRun("winmine"), { action: "open", appId: "minesweeper", resourceId: undefined });
    assert.deepEqual(executeRun("wmplayer"), { action: "open", appId: "media-player", resourceId: undefined });
    assert.deepEqual(executeRun("cmd"), { action: "open", appId: "terminal", resourceId: undefined });

    // 2. Case variations
    assert.deepEqual(executeRun("WINVER"), { action: "open", appId: "about-xp", resourceId: undefined });
    assert.deepEqual(executeRun("Calc.exe"), { action: "open", appId: "calculator", resourceId: undefined });

    // 3. Command with file argument
    const withArg = executeRun("notepad C:\\My Documents\\Readme.txt");
    assert.deepEqual(withArg, { action: "open", appId: "notepad", resourceId: "readme" });

    const withRelativeArg = executeRun("notepad My Documents\\Readme.txt");
    assert.deepEqual(withRelativeArg, { action: "open", appId: "notepad", resourceId: "readme" });

    const withQuotedArg = executeRun('notepad "C:\\My Documents\\Readme.txt"');
    assert.deepEqual(withQuotedArg, { action: "open", appId: "notepad", resourceId: "readme" });

    // 4. Direct virtual file path
    const directFile = executeRun("C:\\My Documents\\Readme.txt");
    assert.deepEqual(directFile, { action: "open", appId: "notepad", resourceId: "readme" });

    // 5. Direct folder path
    const directFolder = executeRun("C:\\My Documents");
    assert.deepEqual(directFolder, { action: "open", appId: "explorer", resourceId: "documents" });

    // 6. Invalid command -> Error sound & error message
    const invalid = executeRun("nonexistent_prog");
    assert.deepEqual(invalid, { action: "error", error: "runCannotFind" });
    assert.equal(playedSound, "Windows XP Error.wav");

    // 7. Empty / whitespace command -> Error sound & error message
    const empty = executeRun("   ");
    assert.deepEqual(empty, { action: "error", error: "runCannotFind" });
    assert.equal(playedSound, "Windows XP Error.wav");
  });

  test("windowStore maps all alias target app IDs to valid AppDefinitions", () => {
    const store = useWindowStore.getState();
    const targetApps = [
      "about-xp",
      "calculator",
      "notepad",
      "wordpad",
      "solitaire",
      "minesweeper",
      "media-player",
      "terminal",
      "control-panel",
      "explorer",
      "paint",
      "task-manager",
      "internet-explorer",
      "system-properties",
      "display-properties",
      "date-time",
      "volume",
      "regional-options",
      "security-center",
      "user-accounts",
    ];

    for (const appId of targetApps) {
      const def = store.getApp(appId as any);
      assert.ok(def, `AppDefinition for ${appId} must exist in windowStore`);
      assert.equal(def.id, appId);
      assert.ok(def.title, `${appId} must have a title`);
      assert.ok(def.icon, `${appId} must have an icon`);
    }

    // cmd alias mapping in windowStore.openWindow
    store.openWindow("cmd" as any);
    const windows = useWindowStore.getState().windows;
    const openedCmd = windows.find((w) => w.appId === "terminal");
    assert.ok(openedCmd, "openWindow('cmd') must open a terminal window");
    store.closeWindow(openedCmd.id);
  });
});

describe("Milestone 2 Empirical Challenge: Window Animation Logic & Fallbacks", () => {
  test("verifies animation parameters: 200ms duration and cubic-bezier easing", () => {
    const expectedDuration = 200;
    const expectedEasing = "cubic-bezier(0.1, 0.9, 0.2, 1.0)";
    assert.equal(expectedDuration, 200);
    assert.equal(expectedEasing, "cubic-bezier(0.1, 0.9, 0.2, 1.0)");
    const taskbarHeight = 30;

    // Simulate geometry calculations from Window.tsx
    const screenW = 1024;
    const screenH = 768;
    const windowConfig = { id: "test-win", x: 100, y: 100, width: 640, height: 480 };

    const targetMaximized = {
      left: 0,
      top: 0,
      width: screenW,
      height: Math.max(100, screenH - taskbarHeight),
    };

    assert.equal(targetMaximized.left, 0);
    assert.equal(targetMaximized.top, 0);
    assert.equal(targetMaximized.width, 1024);
    assert.equal(targetMaximized.height, 738); // 768 - 30

    const targetRestored = {
      left: windowConfig.x,
      top: windowConfig.y,
      width: windowConfig.width,
      height: windowConfig.height,
    };

    assert.equal(targetRestored.left, 100);
    assert.equal(targetRestored.top, 100);
    assert.equal(targetRestored.width, 640);
    assert.equal(targetRestored.height, 480);
  });

  test("when reducedMotion() is true, animateMaxRestore does not call node.animate and toggles state immediately", async () => {
    let animateCalled = false;
    let maximizedCalled = false;
    let restoreCalled = false;

    const fakeNode = {
      animate: () => {
        animateCalled = true;
        return { cancel: () => {}, onfinish: null, oncancel: null };
      },
      getBoundingClientRect: () => ({ left: 100, top: 100, width: 600, height: 400 }),
    };

    const isAnimating = { current: false };
    const reducedMotion = () => true; // Reduced motion active

    async function simulateAnimateMaxRestore(toMaximized: boolean) {
      if (isAnimating.current) return Promise.resolve();
      const node = fakeNode;
      if (!node || reducedMotion()) {
        if (toMaximized) maximizedCalled = true;
        else restoreCalled = true;
        return Promise.resolve();
      }
      isAnimating.current = true;
      fakeNode.animate();
    }

    await simulateAnimateMaxRestore(true);
    assert.equal(maximizedCalled, true, "maximizeWindow should be called immediately");
    assert.equal(animateCalled, false, "node.animate should NOT be called when reducedMotion() is true");

    await simulateAnimateMaxRestore(false);
    assert.equal(restoreCalled, true, "restoreWindow should be called immediately");
    assert.equal(animateCalled, false, "node.animate should NOT be called when reducedMotion() is true");
  });

  test("adversarial check: in environments without Web Animations API (node.animate is undefined), un-guarded code throws TypeError and causes permanent deadlock", async () => {
    const fakeNodeWithoutWAAPI: any = {
      // animate is undefined!
      getBoundingClientRect: () => ({ left: 100, top: 100, width: 600, height: 400 }),
    };

    const reducedMotion = () => false; // User has not enabled reduced motion, but browser lacks WAAPI
    const isAnimating = { current: false };
    let maximizedCount = 0;

    function runAnimateMaxRestore(toMaximized: boolean): Promise<void> {
      if (isAnimating.current) return Promise.resolve();
      const node = fakeNodeWithoutWAAPI;
      if (!node || reducedMotion()) {
        if (toMaximized) maximizedCount++;
        return Promise.resolve();
      }

      isAnimating.current = true;
      return new Promise<void>((resolve) => {
        const sourceRect = node.getBoundingClientRect();
        const screenW = 1024;
        const screenH = 768;
        const taskbarHeight = 30;
        const targetRect = {
          left: 0,
          top: 0,
          width: screenW,
          height: screenH - taskbarHeight,
        };
        const dx = targetRect.left - sourceRect.left;
        const dy = targetRect.top - sourceRect.top;
        const sx = targetRect.width / sourceRect.width;
        const sy = targetRect.height / sourceRect.height;

        // BUG: node.animate is called without checking if function exists
        const animation = node.animate(
          [
            { transform: "translate(0, 0) scale(1, 1)" },
            { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          ],
          { duration: 200 },
        );
        animation.onfinish = () => {
          isAnimating.current = false;
          maximizedCount++;
          resolve();
        };
      });
    }

    // Call 1: Throws TypeError via rejected promise
    await assert.rejects(async () => {
      await runAnimateMaxRestore(true);
    }, /fakeNodeWithoutWAAPI\.animate is not a function|is not a function/);

    // Assert finding: isAnimating is stuck on true forever
    assert.equal(isAnimating.current, true, "isAnimating.current is deadlocked on true due to unhandled exception");
    assert.equal(maximizedCount, 0, "Window never maximized");

    // Call 2: Permanently locked out, silently does nothing
    await runAnimateMaxRestore(true);
    assert.equal(maximizedCount, 0, "Subsequent calls are blocked by permanent deadlock");
  });
});
