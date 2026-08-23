export default function MyComputer(_: { id: string }) {
  const drives = [
    { label: "Local Disk (C:)", icon: "LocalDisk.png", size: "38.2 GB", free: "12.5 GB" },
    { label: "Local Disk (D:)", icon: "LocalDisk.png", size: "52.8 GB", free: "8.3 GB" },
    { label: "CD Drive (E:)", icon: "CD-ROM.png", size: "", free: "" },
    { label: "Network Drive (Z:)", icon: "NetworkDrive.png", size: "120 GB", free: "45 GB" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ padding: "4px 8px", background: "#ECE9D8", borderBottom: "1px solid #ACA899", display: "flex", alignItems: "center", gap: 4 }}>
        <img src="/assets/icons/MyComputer.png" alt="" style={{ width: 16, height: 16 }} />
        <span style={{ fontWeight: "bold" }}>My Computer</span>
      </div>
      <div style={{ padding: "4px 8px", background: "#D4D0C8", borderBottom: "1px solid #808080", fontSize: 10, color: "#555" }}>Select an item to view its description.</div>
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 12, padding: 16, alignContent: "flex-start" }}>
        {drives.map((d) => (
          <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 80, cursor: "default" }}>
            <img src={`/assets/icons/${d.icon}`} alt="" style={{ width: 36, height: 36 }} />
            <span style={{ textAlign: "center", fontSize: 11, marginTop: 4 }}>{d.label}</span>
            {d.size && <span style={{ fontSize: 9, color: "#666" }}>{d.size}</span>}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #ACA899", padding: "3px 8px", background: "#ECE9D8", fontSize: 10, color: "#666" }}>
        {drives.filter((d) => d.size).length} object(s)
      </div>
    </div>
  );
}
