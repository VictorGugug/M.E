import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialFileSystem,
  getChildren,
  getNodePath,
  resolveAddressPath,
  type FileSystemState,
} from "../src/store/fileSystem.ts";
import { useWindowStore } from "../src/store/windowStore.ts";

test("Milestone 3: Subfolder Hierarchy under My Documents", () => {
  const fs = createInitialFileSystem();

  // 1. pictures, music, and videos have parentId === "documents"
  assert.equal(fs.pictures.parentId, "documents");
  assert.equal(fs.music.parentId, "documents");
  assert.equal(fs.videos.parentId, "documents");

  // 2. getChildren on documents contains pictures, music, and videos
  const docChildren = getChildren(fs, "documents");
  const docChildNames = docChildren.map((n) => n.name);
  assert.ok(docChildNames.includes("My Pictures"));
  assert.ok(docChildNames.includes("My Music"));
  assert.ok(docChildNames.includes("My Videos"));

  // 3. getNodePath returns authentic canonical Windows XP paths
  assert.equal(getNodePath(fs, "root"), "C:\\");
  assert.equal(getNodePath(fs, "documents"), "C:\\My Documents");
  assert.equal(getNodePath(fs, "pictures"), "C:\\My Documents\\My Pictures");
  assert.equal(getNodePath(fs, "music"), "C:\\My Documents\\My Music");
  assert.equal(getNodePath(fs, "videos"), "C:\\My Documents\\My Videos");
  assert.equal(getNodePath(fs, "readme"), "C:\\My Documents\\Readme.txt");

  // 4. Root contains only Desktop, My Documents, Recycle Bin
  const rootChildren = getChildren(fs, "root");
  assert.deepEqual(rootChildren.map((n) => n.name), ["Desktop", "My Documents", "Recycle Bin"]);
});

test("Milestone 3: resolveAddressPath with Canonical System Aliases", () => {
  const fs = createInitialFileSystem();

  // My Computer & Drives
  assert.deepEqual(resolveAddressPath(fs, "My Computer"), {
    kind: "folder",
    targetId: "root",
    displayPath: "My Computer",
  });
  assert.deepEqual(resolveAddressPath(fs, "computer"), {
    kind: "folder",
    targetId: "root",
    displayPath: "My Computer",
  });
  assert.deepEqual(resolveAddressPath(fs, "C:\\"), {
    kind: "folder",
    targetId: "root",
    displayPath: "C:\\",
  });
  assert.deepEqual(resolveAddressPath(fs, "c:"), {
    kind: "folder",
    targetId: "root",
    displayPath: "C:\\",
  });

  // My Documents
  const resDocs = resolveAddressPath(fs, "My Documents");
  assert.equal(resDocs.kind, "folder");
  assert.equal(resDocs.targetId, "documents");
  assert.equal(resDocs.displayPath, "C:\\My Documents");

  assert.equal(resolveAddressPath(fs, "documents").targetId, "documents");
  assert.equal(resolveAddressPath(fs, "C:\\My Documents").targetId, "documents");

  // My Pictures, My Music, My Videos
  const resPictures = resolveAddressPath(fs, "My Pictures");
  assert.equal(resPictures.kind, "folder");
  assert.equal(resPictures.targetId, "pictures");
  assert.equal(resPictures.displayPath, "C:\\My Documents\\My Pictures");

  const resMusic = resolveAddressPath(fs, "My Music");
  assert.equal(resMusic.kind, "folder");
  assert.equal(resMusic.targetId, "music");
  assert.equal(resMusic.displayPath, "C:\\My Documents\\My Music");

  const resVideos = resolveAddressPath(fs, "My Videos");
  assert.equal(resVideos.kind, "folder");
  assert.equal(resVideos.targetId, "videos");
  assert.equal(resVideos.displayPath, "C:\\My Documents\\My Videos");

  // Recycle Bin
  const resRecycle = resolveAddressPath(fs, "Recycle Bin");
  assert.equal(resRecycle.kind, "folder");
  assert.equal(resRecycle.targetId, "recycle-bin");

  // System Applications via Address Bar
  assert.deepEqual(resolveAddressPath(fs, "Control Panel"), {
    kind: "app",
    appId: "control-panel",
  });
  assert.deepEqual(resolveAddressPath(fs, "control"), {
    kind: "app",
    appId: "control-panel",
  });
  assert.deepEqual(resolveAddressPath(fs, "My Network Places"), {
    kind: "app",
    appId: "network-places",
  });
  assert.deepEqual(resolveAddressPath(fs, "Set Program Access and Defaults"), {
    kind: "app",
    appId: "set-program-access",
  });
});

test("Milestone 3: resolveAddressPath with Relative Children, Absolute Paths and Run Aliases", () => {
  const fs = createInitialFileSystem();

  // Relative file lookup in currentFolderId = "documents"
  const relFile = resolveAddressPath(fs, "Readme.txt", "documents");
  assert.equal(relFile.kind, "file");
  assert.equal(relFile.targetId, "readme");
  assert.equal(relFile.appId, "notepad");

  // Relative folder lookup in currentFolderId = "documents"
  const relFolder = resolveAddressPath(fs, "My Pictures", "documents");
  assert.equal(relFolder.kind, "folder");
  assert.equal(relFolder.targetId, "pictures");

  // Absolute Windows Path
  const absFile = resolveAddressPath(fs, "C:\\My Documents\\Readme.txt");
  assert.equal(absFile.kind, "file");
  assert.equal(absFile.targetId, "readme");
  assert.equal(absFile.appId, "notepad");

  const absFolder = resolveAddressPath(fs, "C:\\My Documents\\My Music");
  assert.equal(absFolder.kind, "folder");
  assert.equal(absFolder.targetId, "music");

  // Run command alias resolution via address bar
  assert.deepEqual(resolveAddressPath(fs, "calc"), { kind: "app", appId: "calculator" });
  assert.deepEqual(resolveAddressPath(fs, "notepad"), { kind: "app", appId: "notepad" });
  assert.deepEqual(resolveAddressPath(fs, "cmd"), { kind: "app", appId: "terminal" });

  // Parameter order flexibility: (input, fileSystem, currentFolderId)
  const inverted = resolveAddressPath("My Music" as unknown as FileSystemState, fs as unknown as string);
  assert.equal(inverted.kind, "folder");
  assert.equal(inverted.targetId, "music");
});

test("Milestone 3: resolveAddressPath Error Handling for Invalid Inputs", () => {
  const fs = createInitialFileSystem();

  // Empty string
  const errEmpty = resolveAddressPath(fs, "");
  assert.equal(errEmpty.kind, "error");
  assert.ok(errEmpty.error);

  // Whitespace only
  const errWhitespace = resolveAddressPath(fs, "    ");
  assert.equal(errWhitespace.kind, "error");
  assert.ok(errWhitespace.error);

  // Non-existent path
  const errNonExistent = resolveAddressPath(fs, "C:\\Windows\\System32\\NonExistentFolder");
  assert.equal(errNonExistent.kind, "error");
  assert.ok(errNonExistent.error?.includes("NonExistentFolder"));

  // Completely unknown string
  const errGibberish = resolveAddressPath(fs, "completely_random_unknown_token");
  assert.equal(errGibberish.kind, "error");
  assert.ok(errGibberish.error);
});

test("Milestone 3: Explorer Navigation Stack Transitions Simulation", () => {
  const fs = createInitialFileSystem();

  // Simulate Explorer navigation state machine (identical to MyDocuments and MyComputer)
  let currentFolderId = "documents";
  let backStack: string[] = [];
  let forwardStack: string[] = [];

  const navigateTo = (target: string) => {
    if (!fs[target] || target === currentFolderId) return;
    backStack = [...backStack, currentFolderId];
    forwardStack = [];
    currentFolderId = target;
  };

  const goBack = () => {
    if (backStack.length === 0) return;
    const prev = backStack[backStack.length - 1];
    backStack = backStack.slice(0, -1);
    forwardStack = [currentFolderId, ...forwardStack];
    currentFolderId = prev;
  };

  const goForward = () => {
    if (forwardStack.length === 0) return;
    const next = forwardStack[0];
    forwardStack = forwardStack.slice(1);
    backStack = [...backStack, currentFolderId];
    currentFolderId = next;
  };

  const goUp = () => {
    const parentId = fs[currentFolderId]?.parentId;
    if (parentId && fs[parentId]) {
      navigateTo(parentId);
    }
  };

  // Initial state
  assert.equal(currentFolderId, "documents");
  assert.equal(backStack.length, 0);
  assert.equal(forwardStack.length, 0);

  // Step 1: Navigate to pictures
  navigateTo("pictures");
  assert.equal(currentFolderId, "pictures");
  assert.deepEqual(backStack, ["documents"]);
  assert.deepEqual(forwardStack, []);

  // Step 2: Navigate to music (from pictures)
  navigateTo("music");
  assert.equal(currentFolderId, "music");
  assert.deepEqual(backStack, ["documents", "pictures"]);
  assert.deepEqual(forwardStack, []);

  // Step 3: Go back -> should return to pictures
  goBack();
  assert.equal(currentFolderId, "pictures");
  assert.deepEqual(backStack, ["documents"]);
  assert.deepEqual(forwardStack, ["music"]);

  // Step 4: Go back -> should return to documents
  goBack();
  assert.equal(currentFolderId, "documents");
  assert.deepEqual(backStack, []);
  assert.deepEqual(forwardStack, ["pictures", "music"]);

  // Step 5: Go forward -> should return to pictures
  goForward();
  assert.equal(currentFolderId, "pictures");
  assert.deepEqual(backStack, ["documents"]);
  assert.deepEqual(forwardStack, ["music"]);

  // Step 6: Go Up from pictures -> should navigate to parent documents
  goUp();
  assert.equal(currentFolderId, "documents");
  assert.deepEqual(backStack, ["documents", "pictures"]);
  assert.deepEqual(forwardStack, []);

  // Step 7: Go Up from documents -> should navigate to root (My Computer)
  goUp();
  assert.equal(currentFolderId, "root");
  assert.equal(fs[currentFolderId].parentId, "");
});

test("Milestone 3: App Definitions and Window Store Wiring", () => {
  const getApp = useWindowStore.getState().getApp;

  // Network Places app definition
  const netApp = getApp("network-places");
  assert.ok(netApp);
  assert.equal(netApp.id, "network-places");
  assert.equal(netApp.title, "My Network Places");
  assert.equal(netApp.icon, "MyNetworkPlaces.png");
  assert.equal(netApp.defaultWidth, 680);
  assert.equal(netApp.defaultHeight, 460);

  // Set Program Access app definition
  const spadApp = getApp("set-program-access");
  assert.ok(spadApp);
  assert.equal(spadApp.id, "set-program-access");
  assert.equal(spadApp.title, "Set Program Access and Defaults");
  assert.equal(spadApp.icon, "DefaultProgramsSP1Version.png");
  assert.equal(spadApp.defaultWidth, 520);
  assert.equal(spadApp.defaultHeight, 440);
  assert.equal(spadApp.resizable, false);

  // Legacy settings alias points to Set Program Access
  const settingsApp = getApp("settings");
  assert.ok(settingsApp);
  assert.equal(settingsApp.title, "Set Program Access and Defaults");
});
