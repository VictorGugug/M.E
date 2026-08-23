export default function MyDocuments(_: { id: string }) {
  const items = [
    { name: "My Music", type: "File Folder", icon: "FolderClosed.png", date: "5/12/2006 3:14 PM" },
    { name: "My Pictures", type: "File Folder", icon: "FolderClosed.png", date: "5/12/2006 3:14 PM" },
    { name: "My Videos", type: "File Folder", icon: "FolderClosed.png", date: "5/12/2006 3:14 PM" },
    { name: "School Report.doc", type: "Microsoft Word Document", icon: "DOC.png", date: "6/20/2006 10:32 AM" },
    { name: "Budget Spreadsheet.xls", type: "Microsoft Excel Worksheet", icon: "GenericDocument.png", date: "6/18/2006 4:15 PM" },
    { name: "Notes.txt", type: "Text Document", icon: "TXT.png", date: "6/25/2006 9:00 AM" },
    { name: "Family Photo.jpg", type: "JPEG Image", icon: "JPG.png", date: "6/10/2006 2:45 PM" },
    { name: "Resume.doc", type: "Microsoft Word Document", icon: "DOC.png", date: "6/22/2006 11:20 AM" },
    { name: "Screenshot.png", type: "PNG Image", icon: "Bitmap.png", date: "6/28/2006 8:05 PM" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ padding: "4px 8px", background: "#ECE9D8", borderBottom: "1px solid #ACA899", display: "flex", alignItems: "center", gap: 4, fontWeight: "bold" }}>
        <img src="/assets/icons/FolderOpened.png" alt="" style={{ width: 16, height: 16 }} />
        <span>My Documents</span>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#ECE9D8" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Date Modified</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td style={tdStyle}><img src={`/assets/icons/${item.icon}`} alt="" style={{ width: 16, height: 16, marginRight: 4, verticalAlign: "middle" }} />{item.name}</td>
                <td style={tdStyle}>{item.type}</td>
                <td style={tdStyle}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderTop: "1px solid #ACA899", padding: "3px 8px", background: "#ECE9D8", fontSize: 10, color: "#666" }}>{items.length} object(s)</div>
    </div>
  );
}

const thStyle: React.CSSProperties = { borderBottom: "1px solid #808080", padding: "2px 4px", textAlign: "left", fontSize: 11, fontWeight: "bold" };
const tdStyle: React.CSSProperties = { padding: "2px 4px", fontSize: 11, borderBottom: "1px solid #D4D0C8" };
