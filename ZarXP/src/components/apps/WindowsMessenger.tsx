import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const OL = assetUrl("assets/xpui");

const CONTACTS: { name: string; status: "online" | "busy" | "offline" }[] = [
  { name: "XP User", status: "online" },
  { name: "Zelly", status: "online" },
  { name: "Guest", status: "busy" },
  { name: "Administrator", status: "offline" },
];

export default function WindowsMessenger(_: { id: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [chatWith, setChatWith] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string[]>>({});
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim() || !chatWith) return;
    setMessages((m) => ({ ...m, [chatWith]: [...(m[chatWith] || []), "XP User: " + input.trim()] }));
    setInput("");
    setTimeout(() => {
      setMessages((m) => ({ ...m, [chatWith]: [...(m[chatWith] || []), chatWith + ": Talk to you later!"] }));
    }, 800);
  };

  if (!signedIn) {
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#5AA0E8 0%,#2E71C8 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: 20, fontFamily: "Tahoma, sans-serif" }}>
        <img src={`${OL}/icon/messenger.png`} alt="" style={{ width: 48, height: 48, marginTop: 16 }} />
        <div style={{ color: "#FFF", fontSize: 15, fontWeight: "bold", marginTop: 10, textShadow: "1px 1px 2px rgba(0,0,0,0.4)" }}>Windows Messenger</div>
        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, marginTop: 4, textAlign: "center" }}>Sign in to see who is online</div>
        <button
          onClick={() => setSignedIn(true)}
          style={{ marginTop: 18, padding: "4px 18px", fontSize: 11, fontFamily: "Tahoma, sans-serif", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#ECE9D8", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", fontSize: 11, overflow: "hidden" }}>
      <div style={{ padding: "6px 8px", background: "linear-gradient(180deg,#5AA0E8,#2E71C8)", color: "#FFF", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <img src={`${OL}/user/ball.png`} alt="" style={{ width: 24, height: 24, border: "1px solid #FFF" }} />
        <span style={{ fontWeight: "bold" }}>XP User</span>
        <span style={{ marginLeft: "auto", opacity: 0.9 }}>Online</span>
      </div>
      {chatWith ? (
        <>
          <div style={{ flex: 1, background: "#FFF", border: "1px solid #ACA899", margin: 4, padding: 6, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {(messages[chatWith] || []).length === 0 && <span style={{ color: "#888" }}>Start the conversation with {chatWith}</span>}
            {(messages[chatWith] || []).map((m, i) => <div key={i}>{m}</div>)}
          </div>
          <div style={{ display: "flex", gap: 4, padding: "0 4px 4px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              style={{ flex: 1, border: "1px solid #ACA899", fontSize: 11, padding: "3px 5px", outline: "none" }}
              placeholder="Type a message..."
            />
            <button onClick={send} style={{ padding: "3px 12px", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Send</button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, background: "#FFF", border: "1px solid #ACA899", margin: 4, overflowY: "auto" }}>
          <div style={{ padding: "3px 6px", fontWeight: "bold", borderBottom: "1px solid #D4D0C8", background: "#ECE9D8" }}>Contacts ({CONTACTS.filter((c) => c.status !== "offline").length}/{CONTACTS.length})</div>
          {CONTACTS.map((c) => (
            <div
              key={c.name}
              onClick={() => c.status !== "offline" && setChatWith(c.name)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", cursor: c.status === "offline" ? "default" : "pointer", color: c.status === "offline" ? "#999" : "#000" }}
              onMouseEnter={(e) => { if (c.status !== "offline") e.currentTarget.style.background = "#C1D2EE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.status === "online" ? "#3BA63B" : c.status === "busy" ? "#C43A3A" : "#AAA", flexShrink: 0 }} />
              {c.name} {c.status === "busy" && "(Busy)"}
            </div>
          ))}
        </div>
      )}
      {chatWith && (
        <div style={{ padding: "2px 8px 4px", flexShrink: 0 }}>
          <span style={{ color: "#215DC6", textDecoration: "underline" }} onClick={() => setChatWith(null)}>Back to contacts</span>
        </div>
      )}
    </div>
  );
}
