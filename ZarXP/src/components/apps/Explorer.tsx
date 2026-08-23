import { useState } from "react";

interface TreeNode {
  name: string;
  icon: string;
  children?: TreeNode[];
  files?: { name: string; icon: string; type: string; size: string }[];
}

const treeData: TreeNode[] = [
  {
    name: "Desktop", icon: "Desktop.png",
    files: [
      { name: "My Documents", icon: "FolderClosed.png", type: "File Folder", size: "" },
      { name: "My Computer", icon: "MyComputer.png", type: "File Folder", size: "" },
      { name: "Recycle Bin", icon: "RecycleBinempty.png", type: "File Folder", size: "" },
      { name: "Internet Explorer", icon: "InternetExplorer6.png", type: "Shortcut", size: "1 KB" },
      { name: "Work Notes.txt", icon: "TXT.png", type: "Text Document", size: "2 KB" },
    ],
    children: [],
  },
  {
    name: "My Computer", icon: "MyComputer.png",
    children: [
      { name: "Local Disk (C:)", icon: "LocalDisk.png", children: [], files: [
        { name: "Documents and Settings", icon: "FolderClosed.png", type: "File Folder", size: "" },
        { name: "Program Files", icon: "FolderClosed.png", type: "File Folder", size: "" },
        { name: "Windows", icon: "FolderClosed.png", type: "File Folder", size: "" },
        { name: "AUTOEXEC.BAT", icon: "BAT.png", type: "MS-DOS Batch File", size: "1 KB" },
        { name: "boot.ini", icon: "SettingsAlert.png", type: "Configuration Settings", size: "1 KB" },
      ] },
      { name: "Local Disk (D:)", icon: "LocalDisk.png", children: [], files: [
        { name: "Backups", icon: "FolderClosed.png", type: "File Folder", size: "" },
        { name: "Software", icon: "FolderClosed.png", type: "File Folder", size: "" },
      ] },
    ],
    files: [
      { name: "Local Disk (C:)", icon: "LocalDisk.png", type: "Local Disk", size: "38.2 GB" },
      { name: "Local Disk (D:)", icon: "LocalDisk.png", type: "Local Disk", size: "52.8 GB" },
    ],
  },
  {
    name: "Control Panel", icon: "ControlPanel.png",
    files: [
      { name: "System", icon: "SystemProperties.png", type: "System Properties", size: "" },
      { name: "Display", icon: "DisplayProperties.png", type: "Display Properties", size: "" },
      { name: "Date and Time", icon: "DateandTime.png", type: "Date and Time Properties", size: "" },
    ],
    children: [],
  },
];

export default function Explorer(_: { id: string }) {
  const [selected, setSelected] = useState<TreeNode>(treeData[0]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Desktop"]));

  const toggleExpand = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const renderTree = (nodes: TreeNode[], depth: number = 0): React.ReactNode[] => {
    return nodes.flatMap((node) => {
      const isExpanded = expanded.has(node.name);
      const isSelected = selected.name === node.name;
      const hasChildren = node.children && node.children.length > 0;
      return [
        <div key={node.name} style={{ paddingLeft: depth * 14, display: "flex", alignItems: "center", cursor: "pointer", background: isSelected ? "#000080" : "transparent", color: isSelected ? "#FFF" : "#000", fontSize: 11, fontFamily: "Tahoma, sans-serif" }} onClick={() => { setSelected(node); }}>
          {hasChildren ? (
            <span onClick={(e) => { e.stopPropagation(); toggleExpand(node.name); }} style={{ width: 12, fontSize: 9, cursor: "pointer" }}>{isExpanded ? "▾" : "▸"}</span>
          ) : <span style={{ width: 12 }} />}
          <img src={`/assets/icons/${node.icon}`} alt="" style={{ width: 16, height: 16, marginRight: 3 }} />
          <span>{node.name}</span>
        </div>,
        ...(isExpanded && hasChildren ? renderTree(node.children!, depth + 1) : []),
      ];
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px 4px", background: "#ECE9D8", borderBottom: "1px solid #ACA899" }}>
        <span style={{ fontSize: 10, color: "#555" }}>Address</span>
        <input style={{ flex: 1, border: "1px inset #ACA899", padding: "1px 3px", fontSize: 11, fontFamily: "Tahoma, sans-serif" }} value={selected.name} readOnly />
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ width: 180, background: "#FFF", borderRight: "1px solid #808080", overflow: "auto", padding: "2px 0" }}>
          {renderTree(treeData)}
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <div style={{ padding: "2px 4px", background: "#D4D0C8", borderBottom: "1px solid #808080", fontSize: 10, color: "#000" }}>{selected.name}</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ECE9D8" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Size</th>
              </tr>
            </thead>
            <tbody>
              {(selected.files || []).map((f) => (
                <tr key={f.name}>
                  <td style={tdStyle}><img src={`/assets/icons/${f.icon}`} alt="" style={{ width: 16, height: 16, marginRight: 4, verticalAlign: "middle" }} />{f.name}</td>
                  <td style={tdStyle}>{f.type}</td>
                  <td style={tdStyle}>{f.size || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { borderBottom: "1px solid #808080", padding: "2px 4px", textAlign: "left", fontSize: 11, fontWeight: "bold" };
const tdStyle: React.CSSProperties = { padding: "2px 4px", fontSize: 11, borderBottom: "1px solid #D4D0C8" };
