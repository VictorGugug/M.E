import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"
import type { AppId } from "../../types";

const panelHeader: React.CSSProperties = {
  background: "linear-gradient(90deg,#7BA2D9 0%,#6D95D6 50%,#5B85CE 100%)",
  color: "#FFF",
  fontSize: 11,
  fontWeight: "bold",
  padding: "4px 10px",
  textShadow: "1px 1px 1px rgba(0,0,0,0.3)",
};

const panelBody: React.CSSProperties = {
  background: "linear-gradient(180deg,#D6E5F7 0%,#C3D9F2 100%)",
  padding: "6px 10px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const link: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11,
  color: "#215DC6",
  cursor: "pointer",
  textDecoration: "none",
};

const linkHover = (e: React.MouseEvent, on: boolean) => {
  const el = e.currentTarget as HTMLElement;
  el.style.textDecoration = on ? "underline" : "none";
};

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: "4px 4px 0 0", overflow: "hidden", border: "1px solid #B0C4E0", marginBottom: 10 }}>
      <div style={panelHeader}>{title}</div>
      <div style={panelBody}>{children}</div>
    </div>
  );
}

function GroupHeader({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #C9C7B4", margin: "8px 0 10px", paddingBottom: 2 }}>
      <span style={{ fontSize: 12, color: "#215DC6", fontWeight: "bold" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#C9C7B4,transparent)" }} />
    </div>
  );
}

function DriveItem({ icon, label, sub, onOpen, wide }: { icon: string; label: string; sub?: string; onOpen?: () => void; wide?: boolean }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, width: wide ? 200 : 150, padding: 4, cursor: "default", borderRadius: 2 }}
      onClick={onOpen}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#E8F0FB"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <img src={assetUrl(`assets/icons/${icon}`)} alt="" style={{ width: 40, height: 40, flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
        <span style={{ fontSize: 11, color: "#000" }}>{label}</span>
        {sub && <span style={{ fontSize: 10, color: "#666" }}>{sub}</span>}
      </div>
    </div>
  );
}

export default function MyComputer(_: { id: string }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [selected, setSelected] = useState<string | null>(null);

  const open = (id: AppId) => openWindow(id);

  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", userSelect: "none", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ width: 185, flexShrink: 0, background: "linear-gradient(180deg,#7BA2D9 0%,#6D95D6 100%)", padding: 8, overflowY: "auto" }}>
          <SidebarSection title="System Tasks">
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("system-properties")}>
              <img src={assetUrl("assets/icons/UserAccounts.png")} width={16} height={16} alt="" />View system information
            </a>
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("settings")}>
              <img src={assetUrl("assets/icons/ChangeorRemovePrograms.png")} width={16} height={16} alt="" />Add or remove programs
            </a>
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("display-properties")}>
              <img src={assetUrl("assets/icons/ControlPanel.png")} width={16} height={16} alt="" />Change a setting
            </a>
          </SidebarSection>
          <SidebarSection title="Other Places">
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("network-places")}>
              <img src={assetUrl("assets/icons/MyNetworkPlaces.png")} width={16} height={16} alt="" />My Network Places
            </a>
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("my-documents")}>
              <img src={assetUrl("assets/icons/MyDocuments.png")} width={16} height={16} alt="" />My Documents
            </a>
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("my-pictures")}>
              <img src={assetUrl("assets/icons/MyPictures.png")} width={16} height={16} alt="" />My Pictures
            </a>
            <a style={link} onMouseEnter={(e) => linkHover(e, true)} onMouseLeave={(e) => linkHover(e, false)} onClick={() => open("my-music")}>
              <img src={assetUrl("assets/icons/MyMusic.png")} width={16} height={16} alt="" />My Music
            </a>
          </SidebarSection>
          <SidebarSection title="Details">
            <div style={{ fontSize: 11, fontWeight: "bold", color: "#000" }}>My Computer</div>
            <div style={{ fontSize: 11, color: "#333" }}>System Folder</div>
          </SidebarSection>
        </div>
        <div style={{ flex: 1, padding: "8px 12px", overflowY: "auto", background: "#FFF" }}>
          <GroupHeader title="Files Stored on This Computer" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <DriveItem icon="FolderOpened.png" label="XP User's Documents" onOpen={() => open("my-documents")} />
            <DriveItem icon="SharedFolder.png" label="Shared Documents" />
          </div>
          <GroupHeader title="Hard Disk Drives" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <DriveItem icon="LocalDisk.png" label="Local Disk (C:)" sub="38.2 GB free of 76.2 GB" onOpen={() => setSelected("c")} />
            <DriveItem icon="LocalDisk.png" label="Local Disk (D:)" sub="8.3 GB free of 52.8 GB" onOpen={() => setSelected("d")} />
          </div>
          <GroupHeader title="Devices with Removable Storage" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <DriveItem icon="FloppyDisk.png" label="3 Floppy (A:)" />
            <DriveItem icon="CD-ROM.png" label="CD Drive (E:)" />
            <DriveItem icon="DVD-ROM.png" label="DVD Drive (F:)" />
          </div>
          {selected && (
            <div style={{ marginTop: 14, padding: 8, background: "#ECE9D8", border: "1px solid #ACA899", borderRadius: 3, fontSize: 11 }}>
              <b>{selected === "c" ? "Local Disk (C:)" : "Local Disk (D:)"}</b>
              <div style={{ marginTop: 4, color: "#333" }}>
                {selected === "c" ? "38.2 GB free of 76.2 GB" : "8.3 GB free of 52.8 GB"} - NTFS
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
