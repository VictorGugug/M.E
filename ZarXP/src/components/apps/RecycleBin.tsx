const deletedItems = [
  { name: "Old Resume.doc", original: "C:\\My Documents\\", date: "6/15/2006 2:30 PM" },
  { name: "Backup Notes.txt", original: "C:\\My Documents\\", date: "6/14/2006 11:15 AM" },
  { name: "Temp Image.png", original: "C:\\My Pictures\\", date: "6/12/2006 4:45 PM" },
  { name: "Setup.exe", original: "C:\\Downloads\\", date: "6/10/2006 9:20 AM" },
  { name: "readme.txt", original: "C:\\", date: "6/8/2006 6:00 PM" },
  { name: "Project Draft.doc", original: "C:\\My Documents\\Work\\", date: "6/5/2006 3:10 PM" },
  { name: "Wallpaper.bmp", original: "C:\\Windows\\Web\\Wallpaper\\", date: "6/1/2006 10:30 AM" },
];

export default function RecycleBin(_: { id: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", userSelect: "none" }}>
      <div style={{ width: 140, background: "#D4D0C8", borderRight: "1px solid #808080", padding: 4, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ padding: "8px 4px", textAlign: "center" }}>
          <img src="/assets/icons/RecycleBinempty.png" alt="" style={{ width: 36, height: 36 }} />
          <div style={{ fontWeight: "bold", marginTop: 4 }}>Recycle Bin</div>
        </div>
        <button style={btnStyle}>Empty Recycle Bin</button>
        <button style={btnStyle}>Restore</button>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ECE9D8" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Original Location</th>
              <th style={thStyle}>Date Deleted</th>
            </tr>
          </thead>
          <tbody>
            {deletedItems.map((item) => (
              <tr key={item.name + item.date}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.original}</td>
                <td style={tdStyle}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = { background: "#ECE9D8", border: "1px solid #ACA899", borderRadius: 2, padding: "2px 8px", cursor: "pointer", fontSize: 11, fontFamily: "Tahoma, sans-serif", width: "100%" };
const thStyle: React.CSSProperties = { borderBottom: "1px solid #808080", padding: "2px 4px", textAlign: "left", fontSize: 11, fontWeight: "bold" };
const tdStyle: React.CSSProperties = { padding: "2px 4px", fontSize: 11, borderBottom: "1px solid #D4D0C8" };
