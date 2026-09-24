import { strict as assert } from "node:assert";
import { test } from "node:test";
import { findNodeByPath, getFileAppId, isTextFile, isValidFileSystemState, normalizeRunCommand, createInitialFileSystem, deleteNode, emptyTrash, getChildren, getNodePath, getTrashItems, restoreNode, searchByCategory, searchNodes } from "../src/store/fileSystem.ts";
import { loadFileSystem } from "../src/store/fileSystemStore.ts";
import { DEFAULT_SETTINGS, loadSettings, normalizeSettings } from "../src/store/settingsStore.ts";
import { DEFAULT_SECURITY_SETTINGS, loadSecuritySettings } from "../src/store/securityStore.ts";

test("normalizes Run commands and Windows application aliases", () => {
  assert.equal(normalizeRunCommand(" notepad.exe "), "notepad");
  assert.equal(normalizeRunCommand("C:\\Windows\\System32\\mspaint.exe"), "paint");
  assert.equal(normalizeRunCommand("control.exe"), "control-panel");
  assert.equal(normalizeRunCommand("cmd.exe"), "terminal");
  assert.equal(normalizeRunCommand("explorer.exe"), "explorer");
  assert.equal(normalizeRunCommand("unknown.exe"), null);
});

test("creates a navigable virtual file system", () => {
  const fileSystem = createInitialFileSystem();

  assert.deepEqual(getChildren(fileSystem, "root").map((node) => node.name), [
    "Desktop",
    "My Documents",
    "My Music",
    "My Pictures",
    "My Videos",
    "Recycle Bin",
  ]);
  assert.equal(getChildren(fileSystem, "documents").some((node) => node.name === "Readme.txt"), true);
  assert.equal(getChildren(fileSystem, "documents").length, 7);
  assert.equal(getNodePath(fileSystem, "readme"), "C:\\My Documents\\Readme.txt");
});

test("resolves Run paths to virtual files and folders", () => {
  const fileSystem = createInitialFileSystem();

  assert.equal(findNodeByPath(fileSystem, "C:\\My Documents\\Readme.txt")?.id, "readme");
  assert.equal(findNodeByPath(fileSystem, "c:/my documents")?.id, "documents");
  assert.equal(findNodeByPath(fileSystem, '"C:\\My Documents\\Readme.txt"')?.id, "readme");
  assert.equal(findNodeByPath(fileSystem, "C:\\missing.txt"), null);
});

test("routes virtual files to safe editors", () => {
  const fileSystem = createInitialFileSystem();

  assert.equal(isTextFile(fileSystem.readme), true);
  assert.equal(getFileAppId(fileSystem.readme), "notepad");
  assert.equal(getFileAppId(fileSystem["school-report"]), "file-viewer");
  assert.equal(getFileAppId(fileSystem["family-photo"]), "file-viewer");
  assert.equal(getFileAppId(fileSystem["budget-spreadsheet"]), "file-viewer");
});
test("rejects malformed and cyclic persisted file systems", () => {
  const fileSystem = createInitialFileSystem();

  assert.equal(isValidFileSystemState(fileSystem), true);
  assert.equal(isValidFileSystemState({ ...fileSystem, "recycle-bin": { ...fileSystem["recycle-bin"], parentId: "system" } }), true);
  assert.equal(isValidFileSystemState({ ...fileSystem, readme: { ...fileSystem.readme, content: 42 } }), false);
  assert.equal(isValidFileSystemState({ ...fileSystem, root: { ...fileSystem.root, kind: "file" } }), false);
  assert.equal(isValidFileSystemState({ ...fileSystem, root: { ...fileSystem.root, deletedAt: 1 } }), false);
  assert.equal(isValidFileSystemState(Object.fromEntries(Object.entries(fileSystem).filter(([id]) => id !== "recycle-bin"))), false);
  assert.equal(isValidFileSystemState({ ...fileSystem, readme: { ...fileSystem.readme, parentId: "family-photo" } }), false);
  const activeUnderDeleted = { ...fileSystem, documents: { ...fileSystem.documents, deletedAt: 1 }, readme: { ...fileSystem.readme, deletedAt: undefined } };
  assert.equal(isValidFileSystemState(activeUnderDeleted), false);
  assert.equal(isValidFileSystemState({ ...fileSystem, documents: { ...fileSystem.documents, parentId: "missing" } }), false);
  assert.equal(isValidFileSystemState({ ...fileSystem, documents: { ...fileSystem.documents, parentId: "readme" }, readme: { ...fileSystem.readme, parentId: "documents" } }), false);
});

test("moves deleted files to the Recycle Bin and restores them", () => {
  const fileSystem = createInitialFileSystem();
  const deleted = deleteNode(fileSystem, "readme", 1234);

  assert.deepEqual(getTrashItems(deleted).map((node) => node.id), ["readme"]);
  const restored = restoreNode(deleted, "readme");

  assert.equal(getChildren(restored, "documents").some((node) => node.id === "readme"), true);
  assert.deepEqual(getTrashItems(restored), []);
});

test("empties only deleted nodes from the Recycle Bin", () => {
  const fileSystem = deleteNode(createInitialFileSystem(), "readme", 1234);
  const emptied = emptyTrash(fileSystem);

  assert.deepEqual(getTrashItems(emptied), []);
  assert.equal(getChildren(emptied, "documents").some((node) => node.id === "readme"), false);
  assert.equal(deleteNode(emptied, "recycle-bin")["recycle-bin"].deletedAt, undefined);
});

test("loads the initial file system when IndexedDB is unavailable", async () => {
  const fileSystem = await loadFileSystem();

  assert.deepEqual(getChildren(fileSystem, "root").map((node) => node.name), [
    "Desktop",
    "My Documents",
    "My Music",
    "My Pictures",
    "My Videos",
    "Recycle Bin",
  ]);
});

test("searches active files and folders by name", () => {
  const fileSystem = createInitialFileSystem();

  assert.deepEqual(searchNodes(fileSystem, "readme").map((node) => node.id), ["readme"]);
  assert.deepEqual(searchNodes(fileSystem, "missing"), []);
});

test("keeps remote search categories separate from local files", () => {
  const fileSystem = createInitialFileSystem();

  assert.deepEqual(searchByCategory(fileSystem, "documents", "readme").map((node) => node.id), ["readme"]);
  assert.deepEqual(searchByCategory(fileSystem, "computers", "readme"), []);
  assert.deepEqual(searchByCategory(fileSystem, "internet", "readme"), []);
});
test("normalizes invalid display setting values", () => {
  assert.equal(normalizeSettings({ screenSaverMinutes: null }).screenSaverMinutes, 10);
  assert.equal(normalizeSettings({ screenSaverMinutes: false }).screenSaverMinutes, 10);
  assert.equal(normalizeSettings({ screenSaverMinutes: "90" }).screenSaverMinutes, 60);
});
test("uses safe desktop defaults when browser storage is unavailable", () => {
  assert.deepEqual(loadSettings(), DEFAULT_SETTINGS);
  assert.deepEqual(loadSecuritySettings(), DEFAULT_SECURITY_SETTINGS);
});
