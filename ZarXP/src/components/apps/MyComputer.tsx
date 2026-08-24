import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"
import type { AppId } from "../../types";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

function MenuList({ label, items }: { label: string; items: { label: string; disabled?: boolean; sep?: boolean; onClick?: () => void }[] }) {
  return (
    <div className="list">
      <button className="button">{label}</button>
      <ul className="dropdown">
        {items.map((it, i) =>
          it.sep ? (
            <li key={i} className="separator" />
          ) : (
            <li key={i} className={it.disabled ? "disabled" : ""} onClick={it.onClick}>{it.label}</li>
          )
        )}
      </ul>
    </div>
  );
}

function Pane({ title, links }: { title: string; links: { label: string; icon: string; onClick?: () => void }[] }) {
  return (
    <div className="xp-pane">
      <div className="pane-title">{title}</div>
      <div className="pane-links">
        {links.map((l) => (
          <a key={l.label} onClick={l.onClick}>
            <img src={l.icon} alt="" />
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Tile({ icon, label, sub, onClick }: { icon: string; label: string; sub?: string; onClick?: () => void }) {
  return (
    <button className="xp-tile" onClick={onClick}>
      <img src={icon} alt="" />
      <span className="tile-text">
        <span className="tile-label">{label}</span>
        {sub && <span className="tile-sub">{sub}</span>}
      </span>
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="xp-group-header">
        <span>{title}</span>
        <div className="line" />
      </div>
      {children}
    </>
  );
}

export default function MyComputer(_: { id: string }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const open = (id: AppId) => openWindow(id);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFF", fontFamily: "Tahoma, sans-serif", overflow: "hidden" }}>
      <div className="xp-explorer-head">
        <div className="xp-menubar">
          <MenuList label="File" items={[{ label: "Create Shortcut", disabled: true }, { label: "Delete", disabled: true }, { label: "Rename", disabled: true }, { label: "Properties", disabled: true }, { label: "", sep: true }, { label: "Close", onClick: () => {} }]} />
          <MenuList label="Edit" items={[{ label: "Undo", disabled: true }, { label: "Redo", disabled: true }, { label: "", sep: true }, { label: "Cut", disabled: true }, { label: "Copy", disabled: true }, { label: "Paste", disabled: true }, { label: "", sep: true }, { label: "Select All", disabled: true }]} />
          <MenuList label="View" items={[{ label: "Toolbars", disabled: true }, { label: "Status Bar", disabled: true }, { label: "", sep: true }, { label: "Tiles" }, { label: "Icons" }, { label: "List" }, { label: "Details" }, { label: "", sep: true }, { label: "Refresh", disabled: true }]} />
          <MenuList label="Favorites" items={[{ label: "Add to Favorites...", disabled: true }, { label: "Organize Favorites...", disabled: true }]} />
          <MenuList label="Tools" items={[{ label: "Map Network Drive...", disabled: true }, { label: "Disconnect Network Drive...", disabled: true }, { label: "", sep: true }, { label: "Folder Options...", disabled: true }]} />
          <MenuList label="Help" items={[{ label: "Help and Support Center", onClick: () => open("system-properties") }, { label: "", sep: true }, { label: "About Windows", disabled: true }]} />
          <div style={{ marginLeft: "auto", background: "#FFF", height: 22, padding: "0 10px", display: "flex", alignItems: "center" }}>
            <img src={`${OL}/logo/flag.png`} alt="" style={{ height: 16 }} />
          </div>
        </div>
        <div className="xp-toolbar">
          <button className="button disabled"><img src={`${OL}/interface/explorer/back.png`} alt="" style={{ height: 22 }} />&nbsp;Back</button>
          <button className="button disabled"><img src={`${OL}/interface/explorer/forward.png`} alt="" style={{ height: 22 }} /></button>
          <button className="button disabled" title="Up"><img src={`${OL}/interface/explorer/up.png`} alt="" style={{ height: 22 }} /></button>
          <div className="separator" />
          <button className="button" onClick={() => open("search")}><img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />&nbsp;Search</button>
          <button className="button" onClick={() => open("explorer")}><img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />&nbsp;Folders</button>
          <div className="separator" />
          <button className="button" title="Views"><img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />&#9662;</button>
        </div>
        <div className="xp-address">
          <span className="addr-label">Address</span>
          <input readOnly value="My Computer" />
          <button className="go" onClick={() => {}}><img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} /> Go</button>
        </div>
      </div>
      <div className="xp-explorer-middle">
        <div className="xp-explorer-side">
          <div className="xp-explorer-blue">
            <Pane
              title="System Tasks"
              links={[
                { label: "View system information", icon: `${IC}/UserAccounts.png`, onClick: () => open("system-properties") },
                { label: "Add or remove programs", icon: `${IC}/ChangeorRemovePrograms.png`, onClick: () => open("settings") },
                { label: "Change a setting", icon: `${IC}/ControlPanel.png`, onClick: () => open("display-properties") },
              ]}
            />
            <Pane
              title="Other Places"
              links={[
                { label: "My Network Places", icon: `${IC}/MyNetworkPlaces.png`, onClick: () => open("network-places") },
                { label: "My Documents", icon: `${OL}/icon/folder/documents.png`, onClick: () => open("my-documents") },
                { label: "My Pictures", icon: `${OL}/icon/folder/pictures.png`, onClick: () => open("my-pictures") },
                { label: "My Music", icon: `${OL}/icon/folder/music.png`, onClick: () => open("my-music") },
                { label: "My Computer", icon: `${OL}/icon/computer.png` },
              ]}
            />
            <Pane title="Details" links={[]} />
            <div style={{ background: "rgba(255,255,255,0.7)", borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: "2px 10px 8px", marginTop: -14, fontSize: 11 }}>
              <div style={{ fontWeight: "bold" }}>My Computer</div>
              <div>System Folder</div>
            </div>
            <img src={assetUrl("assets/xpui/search/rover.png")} alt="" style={{ width: 84, alignSelf: "flex-end", marginTop: "auto", marginRight: 4, filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.25))" }} />
          </div>
        </div>
        <div className="xp-explorer-body">
          <Group title="Files Stored on This Computer">
            <Tile icon={`${OL}/icon/folder/documents.png`} label="XP User's Documents" onClick={() => open("my-documents")} />
            <Tile icon={`${OL}/icon/folder/open.png`} label="Shared Documents" />
          </Group>
          <Group title="Hard Disk Drives">
            <Tile icon={`${IC}/LocalDisk.png`} label="Local Disk (C:)" sub="38.2 GB free of 76.2 GB" />
            <Tile icon={`${IC}/LocalDisk.png`} label="Local Disk (D:)" sub="8.3 GB free of 52.8 GB" />
          </Group>
          <Group title="Devices with Removable Storage">
            <Tile icon={`${IC}/FloppyDisk.png`} label="3 Floppy (A:)" />
            <Tile icon={`${IC}/CD-ROM.png`} label="CD Drive (D:)" />
            <Tile icon={`${IC}/DVD-ROM.png`} label="DVD Drive (E:)" />
          </Group>
        </div>
      </div>
    </div>
  );
}
