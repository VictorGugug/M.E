import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const IC = assetUrl("assets/icons");
const OL = assetUrl("assets/xpui");

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: `${IC}/OEInbox.png`, count: 2 },
  { id: "outbox", label: "Outbox", icon: `${OL}/icon/outlook.png`, count: 0 },
  { id: "sent", label: "Sent Items", icon: `${IC}/OESend.png`, count: 0 },
  { id: "deleted", label: "Deleted Items", icon: `${IC}/Delete.png`, count: 0 },
  { id: "drafts", label: "Drafts", icon: `${IC}/OENewsPost.png`, count: 0 },
];

const MESSAGES: { from: string; subject: string; date: string; body: string[] }[] = [
  {
    from: "Microsoft Outlook Express Team",
    subject: "Welcome to Outlook Express 6",
    date: "8:30 AM",
    body: [
      "Thank you for choosing Outlook Express.",
      "Outlook Express puts the world of online communication at your fingertips. You can send and receive e-mail, join newsgroups and keep your address book up to date.",
      "To get started, click the Create Mail button on the toolbar.",
    ],
  },
  {
    from: "Windows Tour",
    subject: "Take a tour of Windows XP",
    date: "8:15 AM",
    body: [
      "Discover what you can do with Windows XP.",
      "From playing music to exploring the Internet, the tour shows you the highlights of the operating system in a few short steps.",
      "Open the Start menu and choose Tour Windows XP any time.",
    ],
  },
];

function ToolBtn({ img, label, onClick }: { img: string; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, padding: "3px 8px", background: "none", border: "1px solid transparent", borderRadius: 3, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}
      onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #D8D2BD"; e.currentTarget.style.background = "linear-gradient(#F9F9F5,#F1F1EA)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "none"; }}
    >
      <img src={img} alt="" style={{ width: 22, height: 22 }} />
      <span>{label}</span>
    </button>
  );
}

export default function OutlookExpress(_: { id: string }) {
  const [folder, setFolder] = useState("inbox");
  const [selected, setSelected] = useState(0);
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  const msg = MESSAGES[selected];

  const send = () => {
    if (!to.trim()) return;
    setSent((s) => [...s, `To: ${to} - ${subject || "(no subject)"}`]);
    setComposing(false);
    setTo(""); setSubject(""); setBody("");
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ECE9D8", fontFamily: "Tahoma, sans-serif", fontSize: 11, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px 4px", borderBottom: "1px solid #DADAD8", flexShrink: 0, background: "linear-gradient(to right,#F2F4F2,#EEEACE)" }}>
        <ToolBtn img={`${IC}/OECreateMail.png`} label="Create Mail" onClick={() => setComposing(true)} />
        <ToolBtn img={`${IC}/OEReply.png`} label="Reply" />
        <ToolBtn img={`${IC}/OEForward.png`} label="Forward" />
        <ToolBtn img={`${IC}/PrintersandFaxes.png`} label="Print" onClick={() => window.print()} />
        <div style={{ width: 1, height: 30, background: "#D5D4CB", margin: "0 4px" }} />
        <ToolBtn img={`${IC}/Delete.png`} label="Delete" />
        <ToolBtn img={`${IC}/OESendandReceive.png`} label="Send/Recv" />
      </div>
      {composing ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 6, gap: 4, background: "#FFF", margin: 4, border: "1px solid #ACA899" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 50 }}>To:</span>
            <input value={to} onChange={(e) => setTo(e.target.value)} style={{ flex: 1, border: "1px solid #ACA899", fontSize: 11, padding: "2px 4px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 50 }}>Subject:</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ flex: 1, border: "1px solid #ACA899", fontSize: 11, padding: "2px 4px" }} />
          </div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} style={{ flex: 1, border: "1px solid #ACA899", resize: "none", fontSize: 12, fontFamily: "Tahoma, sans-serif", padding: 4, outline: "none" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button onClick={send} style={{ minWidth: 70, padding: "3px 10px", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Send</button>
            <button onClick={() => setComposing(false)} style={{ minWidth: 70, padding: "3px 10px", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Discard</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", minHeight: 0, margin: 4, gap: 0 }}>
          <div style={{ width: 150, flexShrink: 0, background: "#FFF", border: "1px solid #ACA899", overflowY: "auto" }}>
            {FOLDERS.map((f) => (
              <div
                key={f.id}
                onClick={() => setFolder(f.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", background: folder === f.id ? "#C1D2EE" : "transparent", fontWeight: f.count ? "bold" : "normal" }}
              >
                <img src={f.icon} alt="" style={{ width: 16, height: 16 }} />
                <span>{f.label}</span>
                {f.count > 0 && <span style={{ marginLeft: "auto" }}>({f.count})</span>}
              </div>
            ))}
            {sent.length > 0 && (
              <div style={{ borderTop: "1px solid #D4D0C8", padding: "4px 8px", color: "#555" }}>
                {sent.map((s, i) => <div key={i} style={{ padding: "1px 0" }}>{s}</div>)}
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ height: 90, overflowY: "auto", background: "#FFF", border: "1px solid #ACA899", borderBottom: "none" }}>
              <div style={{ display: "flex", fontWeight: "bold", borderBottom: "1px solid #D4D0C8", background: "#ECE9D8" }}>
                <span style={{ width: "40%", padding: "2px 6px" }}>From</span>
                <span style={{ width: "40%", padding: "2px 6px" }}>Subject</span>
                <span style={{ width: "20%", padding: "2px 6px" }}>Received</span>
              </div>
              {MESSAGES.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{ display: "flex", background: selected === i ? "#C1D2EE" : "transparent", fontWeight: selected === i ? "normal" : "bold" }}
                >
                  <span style={{ width: "40%", padding: "2px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.from}</span>
                  <span style={{ width: "40%", padding: "2px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.subject}</span>
                  <span style={{ width: "20%", padding: "2px 6px" }}>{m.date}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, background: "#FFF", border: "1px solid #ACA899", padding: 10, overflowY: "auto" }}>
              <div style={{ borderBottom: "1px solid #D4D0C8", paddingBottom: 6, marginBottom: 8 }}>
                <div><b>From:</b> {msg.from}</div>
                <div><b>Subject:</b> {msg.subject}</div>
              </div>
              {msg.body.map((p, i) => <p key={i} style={{ marginBottom: 8, fontSize: 12 }}>{p}</p>)}
            </div>
          </div>
        </div>
      )}
      <div style={{ borderTop: "1px solid #DADAD8", padding: "2px 6px", flexShrink: 0, display: "flex", gap: 10 }}>
        <span>{folder === "inbox" ? `${MESSAGES.length} message(s), ${MESSAGES.length} unread` : FOLDERS.find((f) => f.id === folder)?.label}</span>
        <span style={{ marginLeft: "auto" }}>Working Online</span>
      </div>
    </div>
  );
}
