import { useEffect, useRef, useState, type ReactNode } from "react";
import { labelChars, type MenuDef, type MenuEntry } from "./menuModel";

function Label({ label, underline }: { label: string; underline: boolean }) {
  const { before, key, after } = labelChars(label);
  if (!key) return <>{label}</>;
  return <>{before}{underline ? <u>{key}</u> : key}{after}</>;
}

function firstEnabled(entries: MenuEntry[], from = 0, step = 1): number {
  for (let i = from; i >= 0 && i < entries.length; i += step) {
    if (!entries[i].separator && !entries[i].disabled) return i;
  }
  return -1;
}

export default function MenuBar({ menus, trailing }: { menus: MenuDef[]; trailing?: ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  const [active, setActive] = useState(-1);
  const [underline, setUnderline] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Alt") setUnderline(true);
      if (event.key === "Escape") setOpen(null);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt") setUnderline(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const showUnderline = underline || open !== null;

  const openAt = (index: number) => {
    setOpen(index);
    setActive(firstEnabled(menus[index].entries));
  };

  const runEntry = (entry: MenuEntry) => {
    if (entry.separator || entry.disabled || !entry.action) return;
    setOpen(null);
    entry.action();
  };

  const onTopKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") { event.preventDefault(); openAt((index + 1) % menus.length); return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); openAt((index - 1 + menus.length) % menus.length); return; }
    if (event.key === "ArrowDown") { event.preventDefault(); openAt(index); return; }
    if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
      const target = menus.findIndex((menu) => labelChars(menu.label).key.toLowerCase() === event.key.toLowerCase());
      if (target >= 0) { event.preventDefault(); openAt(target); }
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent, index: number) => {
    const entries = menus[index].entries;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(firstEnabled(entries, active + 1 < entries.length ? active + 1 : 0)); return; }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive(firstEnabled(entries, active - 1 >= 0 ? active - 1 : entries.length - 1, -1)); return; }
    if (event.key === "ArrowRight") { event.preventDefault(); openAt((index + 1) % menus.length); return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); openAt((index - 1 + menus.length) % menus.length); return; }
    if (event.key === "Enter" && active >= 0) { event.preventDefault(); runEntry(entries[active]); }
  };

  return (
    <div className="xp-menu-bar" ref={rootRef}>
      {menus.map((menu, index) => (
        <div
          className="xp-menu-topwrap"
          key={menu.label}
          onKeyDown={(event) => (open === index ? onMenuKeyDown(event, index) : onTopKeyDown(event, index))}
        >
          <button
            className={open === index ? "xp-menu-top open" : "xp-menu-top"}
            onClick={() => (open === index ? setOpen(null) : openAt(index))}
            onMouseEnter={() => { if (open !== null && open !== index) openAt(index); }}
            type="button"
          >
            <Label label={menu.label} underline={showUnderline} />
          </button>
          {open === index && (
            <ul className="xp-menu-dropdown" role="menu">
              {menu.entries.map((entry, entryIndex) =>
                entry.separator ? (
                  <li className="xp-menu-sep" key={`sep-${entryIndex}`} role="separator" />
                ) : (
                  <li
                    key={entry.label}
                    role="menuitem"
                    aria-disabled={entry.disabled}
                    className={["xp-menu-entry", entry.disabled && "disabled", active === entryIndex && !entry.disabled && "hot"].filter(Boolean).join(" ")}
                    onMouseEnter={() => { if (!entry.disabled) setActive(entryIndex); }}
                    onClick={() => runEntry(entry)}
                  >
                    {entry.checked && <span className="xp-menu-check">&#10003;</span>}
                    <span>{entry.label}</span>
                    {entry.shortcut && <span className="xp-menu-shortcut">{entry.shortcut}</span>}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ))}
      {trailing && <div className="xp-menu-trailing">{trailing}</div>}
    </div>
  );
}
