import type { AppId } from "../types";

const RUN_COMMANDS: Record<string, AppId> = {
  cmd: "terminal",
  control: "control-panel",
  "control.exe": "control-panel",
  "cmd.exe": "terminal",
  explorer: "explorer",
  "explorer.exe": "explorer",
  mspaint: "paint",
  "mspaint.exe": "paint",
  notepad: "notepad",
  "notepad.exe": "notepad",
  paint: "paint",
  "paint.exe": "paint",
  wordpad: "wordpad",
  "wordpad.exe": "wordpad",
};

export type FileNodeKind = "folder" | "file";

export interface VirtualFileNode {
  id: string;
  parentId: string;
  name: string;
  kind: FileNodeKind;
  content?: string;
  deletedAt?: number;
  originalParentId?: string;
}

export type FileSystemState = Record<string, VirtualFileNode>;

const TEXT_EXTENSIONS = new Set(["txt", "log", "ini", "cfg", "xml", "json", "csv"]);

export function isTextFile(node: VirtualFileNode): boolean {
  if (node.kind !== "file") return false;
  const extension = node.name.split(".").pop()?.toLowerCase() ?? "";
  return TEXT_EXTENSIONS.has(extension);
}

export function getFileAppId(node: VirtualFileNode): AppId {
  if (node.kind === "folder") return "explorer";
  return isTextFile(node) ? "notepad" : "file-viewer";
}

export function normalizeRunCommand(value: string): AppId | null {
  const command = value.trim().toLowerCase();
  if (!command) return null;

  const fileName = command.split(/[\\/]/).pop() ?? command;
  return RUN_COMMANDS[fileName] ?? null;
}

export function findNodeByPath(fileSystem: FileSystemState, value: string): VirtualFileNode | null {
  const raw = value.trim();
  const unquoted = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'")) ? raw.slice(1, -1) : raw;
  const normalized = unquoted.replace(/\//g, "\\").replace(/^[a-z]:\\?/i, "");
  if (!normalized) return fileSystem.root ?? null;
  if (fileSystem.root?.deletedAt !== undefined) return null;

  let current = fileSystem.root;
  for (const segment of normalized.split("\\").filter(Boolean)) {
    const child = Object.values(fileSystem).find((node) => node.parentId === current.id && node.deletedAt === undefined && node.name.toLowerCase() === segment.toLowerCase());
    if (!child) return null;
    current = child;
  }
  return current;
}

export function isValidFileSystemState(value: unknown): value is FileSystemState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return false;

  const nodes = new Map<string, VirtualFileNode>();
  for (const [key, entry] of entries) {
    if (!entry || typeof entry !== "object") return false;
    const node = entry as Partial<VirtualFileNode>;
    if (node.id !== key || typeof node.id !== "string" || typeof node.parentId !== "string" || typeof node.name !== "string" || node.name.trim() === "" || (node.kind !== "folder" && node.kind !== "file")) return false;
    if (node.deletedAt !== undefined && (typeof node.deletedAt !== "number" || !Number.isFinite(node.deletedAt))) return false;
    if (node.content !== undefined && typeof node.content !== "string") return false;
    if (node.originalParentId !== undefined && typeof node.originalParentId !== "string") return false;
    nodes.set(key, node as VirtualFileNode);
  }

  const root = nodes.get("root");
  if (!root || root.kind !== "folder" || root.parentId !== "" || root.deletedAt !== undefined) return false;
  const recycleBin = nodes.get("recycle-bin");
  if (!recycleBin || recycleBin.kind !== "folder" || recycleBin.deletedAt !== undefined || (recycleBin.parentId !== "root" && recycleBin.parentId !== "system")) return false;
  for (const node of nodes.values()) {
    if (node.id === "root") continue;
    const visited = new Set<string>();
    let current = node;
    while (current.id !== "root") {
      if (visited.has(current.id)) return false;
      visited.add(current.id);
      const parent = current.parentId === "system" && current.id === "recycle-bin" ? nodes.get("root") : nodes.get(current.parentId);
      if (!parent || parent.kind !== "folder") return false;
      if (current.deletedAt === undefined && parent.id !== "root" && parent.deletedAt !== undefined) return false;
      current = parent;
    }
  }
  return true;
}

export function createInitialFileSystem(): FileSystemState {
  return {
    root: { id: "root", parentId: "", name: "My Computer", kind: "folder" },
    desktop: { id: "desktop", parentId: "root", name: "Desktop", kind: "folder" },
    documents: { id: "documents", parentId: "root", name: "My Documents", kind: "folder" },
    music: { id: "music", parentId: "root", name: "My Music", kind: "folder" },
    pictures: { id: "pictures", parentId: "root", name: "My Pictures", kind: "folder" },
    videos: { id: "videos", parentId: "root", name: "My Videos", kind: "folder" },
    "recycle-bin": { id: "recycle-bin", parentId: "root", name: "Recycle Bin", kind: "folder" },
    readme: { id: "readme", parentId: "documents", name: "Readme.txt", kind: "file", content: "Welcome to Windows XP." },
    "school-report": { id: "school-report", parentId: "documents", name: "School Report.doc", kind: "file" },
    "budget-spreadsheet": { id: "budget-spreadsheet", parentId: "documents", name: "Budget Spreadsheet.xls", kind: "file" },
    notes: { id: "notes", parentId: "documents", name: "Notes.txt", kind: "file" },
    "family-photo": { id: "family-photo", parentId: "documents", name: "Family Photo.jpg", kind: "file" },
    resume: { id: "resume", parentId: "documents", name: "Resume.doc", kind: "file" },
    screenshot: { id: "screenshot", parentId: "documents", name: "Screenshot.png", kind: "file" },
  };
}

export function getChildren(fileSystem: FileSystemState, parentId: string): VirtualFileNode[] {
  return Object.values(fileSystem)
    .filter((node) => node.parentId === parentId && node.deletedAt === undefined)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function getNodePath(fileSystem: FileSystemState, id: string): string {
  const names: string[] = [];
  const visited = new Set<string>();
  let current = fileSystem[id];

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    if (current.id === "root") break;
    names.unshift(current.name);
    current = fileSystem[current.parentId];
  }

  return names.length ? `C:\\${names.join("\\")}` : "C:\\";
}

export function getTrashItems(fileSystem: FileSystemState): VirtualFileNode[] {
  return Object.values(fileSystem)
    .filter((node) => {
      const parent = fileSystem[node.parentId];
      return node.id !== "root" && node.id !== "recycle-bin" && node.deletedAt !== undefined && parent !== undefined && parent.deletedAt === undefined;
    })
    .sort((left, right) => (right.deletedAt ?? 0) - (left.deletedAt ?? 0));
}

export function searchByCategory(fileSystem: FileSystemState, category: string, query: string): VirtualFileNode[] {
  if (category === "computers" || category === "internet") return [];
  const parentId = category === "documents" ? "documents" : category === "pictures" ? "pictures" : category === "music" ? "music" : undefined;
  return searchNodes(fileSystem, query, parentId);
}

export function searchNodes(fileSystem: FileSystemState, query: string, parentId?: string): VirtualFileNode[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const allowedIds = parentId ? new Set([parentId, ...getDescendantIds(fileSystem, parentId)]) : null;
  return Object.values(fileSystem)
    .filter((node) => node.id !== "root" && node.deletedAt === undefined && node.name.toLowerCase().includes(normalizedQuery) && (!allowedIds || allowedIds.has(node.id)))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function getDescendantIds(fileSystem: FileSystemState, parentId: string): string[] {
  const descendants: string[] = [];
  const visited = new Set([parentId]);
  const pending = [parentId];
  while (pending.length > 0) {
    const currentId = pending.pop();
    if (!currentId) continue;
    for (const node of Object.values(fileSystem)) {
      if (node.parentId !== currentId || visited.has(node.id)) continue;
      visited.add(node.id);
      descendants.push(node.id);
      pending.push(node.id);
    }
  }
  return descendants;
}

export function deleteNode(fileSystem: FileSystemState, id: string, deletedAt = Date.now()): FileSystemState {
  const node = fileSystem[id];
  if (!node || id === "root" || id === "recycle-bin" || node.deletedAt !== undefined) return fileSystem;

  const next = { ...fileSystem };
  for (const nodeId of [id, ...getDescendantIds(fileSystem, id)]) {
    const current = fileSystem[nodeId];
    next[nodeId] = { ...current, deletedAt, originalParentId: current.parentId };
  }
  return next;
}

export function emptyTrash(fileSystem: FileSystemState): FileSystemState {
  const next = { ...fileSystem };
  for (const [id, node] of Object.entries(fileSystem)) {
    if (node.deletedAt !== undefined) delete next[id];
  }
  return next;
}

export function restoreNode(fileSystem: FileSystemState, id: string): FileSystemState {
  const node = fileSystem[id];
  if (!node || node.deletedAt === undefined) return fileSystem;

  const next = { ...fileSystem };
  for (const nodeId of [id, ...getDescendantIds(fileSystem, id)]) {
    const current = fileSystem[nodeId];
    if (!current.deletedAt) continue;
    const restored = { ...current };
    delete restored.deletedAt;
    delete restored.originalParentId;
    next[nodeId] = restored;
  }
  return next;
}
