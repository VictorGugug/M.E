import { create } from "zustand";
import {
  createInitialFileSystem,
  deleteNode,
  emptyTrash as emptyTrashState,
  isValidFileSystemState,
  restoreNode,
  type FileSystemState,
} from "./fileSystem.ts";

const DATABASE_NAME = "zarxp";
const DATABASE_VERSION = 1;
const STORE_NAME = "file-system";
const STATE_KEY = "state";

function reportStorageError(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`ZarXP storage: ${operation}: ${message}`);
}

let databasePromise: Promise<IDBDatabase> | null = null;
let hydrationPromise: Promise<void> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is unavailable"));
  if (databasePromise) return databasePromise;

  const promise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const resolveOnce = (database: IDBDatabase) => {
      if (settled) { database.close(); return; }
      settled = true;
      clearTimeout(timeoutId);
      resolve(database);
    };
    const rejectOnce = (error: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      reject(error);
    };
    timeoutId = setTimeout(() => rejectOnce(new Error("IndexedDB open timed out")), 3000);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolveOnce(request.result);
    request.onerror = () => rejectOnce(request.error ?? new Error("Unable to open IndexedDB"));
    request.onblocked = () => rejectOnce(new Error("IndexedDB open blocked"));
  });
  databasePromise = promise.catch((error) => {
    databasePromise = null;
    throw error;
  });
  return databasePromise;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

export async function loadFileSystem(): Promise<FileSystemState> {
  const fallback = createInitialFileSystem();
  if (typeof indexedDB === "undefined") return fallback;

  try {
    const database = await openDatabase();
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(STATE_KEY);
    const stored = await requestResult<unknown>(request);
    if (!isValidFileSystemState(stored)) return fallback;
    const recycleBin = stored["recycle-bin"];
    if (recycleBin?.parentId === "system") return { ...stored, "recycle-bin": { ...recycleBin, parentId: "root" } };
    return stored;
  } catch (error) {
    reportStorageError("load", error);
    return fallback;
  }
}

async function saveFileSystem(fileSystem: FileSystemState): Promise<void> {
  if (typeof indexedDB === "undefined") return;

  try {
    const database = await openDatabase();
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(fileSystem, STATE_KEY);
    await requestResult(request);
  } catch (error) {
    reportStorageError("save", error);
  }
}

interface FileSystemStore {
  fileSystem: FileSystemState;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  deleteItem: (id: string) => void;
  restoreItem: (id: string) => void;
  emptyTrash: () => void;
  updateFile: (id: string, content: string) => void;
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => {
  const mutate = (operation: (fileSystem: FileSystemState) => FileSystemState) => {
    const apply = async () => {
      if (!get().hydrated) await get().hydrate();
      const fileSystem = operation(get().fileSystem);
      set({ fileSystem });
      await saveFileSystem(fileSystem);
    };
    void apply();
  };

  return {
    fileSystem: createInitialFileSystem(),
    hydrated: false,

    hydrate: () => {
      if (get().hydrated) return Promise.resolve();
      if (hydrationPromise) return hydrationPromise;
      hydrationPromise = loadFileSystem()
        .then((fileSystem) => set({ fileSystem, hydrated: true }))
        .finally(() => { hydrationPromise = null; });
      return hydrationPromise;
    },

    deleteItem: (id) => mutate((fileSystem) => deleteNode(fileSystem, id)),

    restoreItem: (id) => mutate((fileSystem) => restoreNode(fileSystem, id)),

    emptyTrash: () => mutate((fileSystem) => emptyTrashState(fileSystem)),

    updateFile: (id, content) => mutate((fileSystem) => {
      const node = fileSystem[id];
      if (!node || node.kind !== "file") return fileSystem;
      return { ...fileSystem, [id]: { ...node, content } };
    }),
  };
});
