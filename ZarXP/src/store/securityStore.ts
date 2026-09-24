import { create } from "zustand";

const KEY = "zarxp-security-settings";

function reportStorageError(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`ZarXP security: ${operation}: ${message}`);
}

export interface SecuritySettings {
  firewall: boolean;
  automaticUpdates: boolean;
  antivirus: boolean;
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  firewall: true,
  automaticUpdates: true,
  antivirus: false,
};

function isSecuritySettings(value: unknown): value is Partial<SecuritySettings> {
  return Boolean(value && typeof value === "object");
}

export function loadSecuritySettings(): SecuritySettings {
  if (typeof localStorage === "undefined") return { ...DEFAULT_SECURITY_SETTINGS };

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SECURITY_SETTINGS };
    const parsed: unknown = JSON.parse(raw);
    if (!isSecuritySettings(parsed)) return { ...DEFAULT_SECURITY_SETTINGS };
    return { ...DEFAULT_SECURITY_SETTINGS, ...parsed };
  } catch (error) {
    reportStorageError("load", error);
    return { ...DEFAULT_SECURITY_SETTINGS };
  }
}

function saveSecuritySettings(settings: SecuritySettings): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch (error) {
    reportStorageError("save", error);
  }
}

interface SecurityStore {
  settings: SecuritySettings;
  setFirewall: (enabled: boolean) => void;
  setAutomaticUpdates: (enabled: boolean) => void;
  setAntivirus: (enabled: boolean) => void;
}

export const useSecurityStore = create<SecurityStore>((set, get) => {
  const update = (next: Partial<SecuritySettings>) => {
    const settings = { ...get().settings, ...next };
    set({ settings });
    saveSecuritySettings(settings);
  };

  return {
    settings: loadSecuritySettings(),
    setFirewall: (firewall) => update({ firewall }),
    setAutomaticUpdates: (automaticUpdates) => update({ automaticUpdates }),
    setAntivirus: (antivirus) => update({ antivirus }),
  };
});
