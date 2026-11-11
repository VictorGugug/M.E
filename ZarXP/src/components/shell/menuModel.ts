export interface MenuEntry {
  label: string;
  action?: () => void;
  disabled?: boolean;
  checked?: boolean;
  separator?: boolean;
  shortcut?: string;
}

export interface MenuDef {
  label: string;
  entries: MenuEntry[];
}

export const sep: MenuEntry = { label: "", separator: true };

export function cmd(label: string, action?: () => void, extra: Partial<MenuEntry> = {}): MenuEntry {
  return { label, action, disabled: !action, ...extra };
}

export function labelChars(label: string): { before: string; key: string; after: string } {
  const index = label.indexOf("&");
  if (index < 0) return { before: label, key: "", after: "" };
  return { before: label.slice(0, index), key: label[index + 1], after: label.slice(index + 2) };
}
