import { useState, useRef, useEffect, useCallback } from "react";
import { assetUrl } from "../../utils/assets";
import { useUserStore } from "../../store/userStore";
import { playSound } from "../../utils/sound";

const OL = assetUrl("assets/xpui");

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "busy" | "away" | "offline";
  quote: string;
}

const CONTACTS: Contact[] = [
  { id: "zelly", name: "Zelly", avatar: "snowflake.png", status: "online", quote: "Exploring Windows XP!" },
  { id: "bill", name: "Bill Gates", avatar: "chess.png", status: "online", quote: "Where do you want to go today?" },
  { id: "rover", name: "Rover", avatar: "dog.png", status: "online", quote: "Ready to search your files!" },
  { id: "admin", name: "Administrator", avatar: "car.png", status: "busy", quote: "Running system updates..." },
  { id: "guest", name: "Guest User", avatar: "duck.png", status: "offline", quote: "Be right back" },
];

const BOT_REPLIES: Record<string, string[]> = {
  zelly: [
    "Hey! How is your ZarXP desktop looking today?",
    "I love the classic Luna blue theme, it brings back memories!",
    "Did you try changing your account picture in User Accounts?",
    "Have you checked out the retro pages on Internet Explorer?",
    "Everything is running super smooth!",
    "Talk to you in a bit!"
  ],
  bill: [
    "Welcome to the new era of personal computing!",
    "Windows XP combines the reliability of NT with the consumer ease of 98.",
    "Great work on this system.",
    "Remember: 640K ought to be enough for anybody. Just kidding!",
  ],
  rover: [
    "Woof! What would you like me to find for you in My Computer?",
    "Bark! I can search for pictures, music, or documents!",
    "Woof woof! Wagging tail!",
  ],
  admin: [
    "System security is optimal. No unauthorized modifications detected.",
    "Services are operating within normal parameters.",
  ],
};

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export default function WindowsMessenger(_: { id: string }) {
  const { userName, userPicture } = useUserStore();
  const [signedIn, setSignedIn] = useState(true);
  const [chatWith, setChatWith] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    zelly: [
      { sender: "Zelly", text: "Hi! Welcome to Windows Messenger!", time: "12:00 PM" }
    ]
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shaking, setShaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatWith, isTyping]);

  const getTimeString = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const send = useCallback(() => {
    if (!input.trim() || !chatWith) return;
    const text = input.trim();
    const contactId = chatWith.id;
    const time = getTimeString();

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), { sender: userName, text, time }]
    }));
    setInput("");
    playSound("Windows XP Menu Command.wav", 0.3);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const pool = BOT_REPLIES[contactId] || ["Received! Have a great day!"];
      const reply = pool[Math.floor(Math.random() * pool.length)];
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), { sender: chatWith.name, text: reply, time: getTimeString() }]
      }));
      playSound("Windows XP Ding.wav", 0.4);
    }, 1500);
  }, [input, chatWith, userName]);

  const sendNudge = useCallback(() => {
    if (!chatWith) return;
    const contactId = chatWith.id;
    setShaking(true);
    playSound("Windows XP Ding.wav", 0.5);
    setTimeout(() => setShaking(false), 500);

    setMessages((prev) => ({
      ...prev,
      [contactId]: [
        ...(prev[contactId] || []),
        { sender: "", text: "You have just sent a Nudge!", time: getTimeString(), isSystem: true }
      ]
    }));

    setTimeout(() => {
      setShaking(true);
      playSound("Windows XP Ding.wav", 0.5);
      setTimeout(() => setShaking(false), 500);
      setMessages((prev) => ({
        ...prev,
        [contactId]: [
          ...(prev[contactId] || []),
          { sender: "", text: `${chatWith.name} has just sent you a Nudge!`, time: getTimeString(), isSystem: true }
        ]
      }));
    }, 2000);
  }, [chatWith]);

  if (!signedIn) {
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#5AA0E8 0%,#2E71C8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Tahoma, sans-serif" }}>
        <img src={`${OL}/icon/messenger.png`} alt="" style={{ width: 64, height: 64 }} />
        <div style={{ color: "#FFF", fontSize: 16, fontWeight: "bold", marginTop: 12 }}>Windows Messenger</div>
        <div style={{ color: "#D8E8FC", fontSize: 12, marginTop: 4 }}>Sign in to connect with your contacts</div>
        <button
          onClick={() => setSignedIn(true)}
          style={{ marginTop: 20, padding: "5px 22px", fontSize: 12, fontWeight: "bold", background: "linear-gradient(180deg,#FFF,#ECE9D8)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer" }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%", height: "100%", background: "#ECE9D8", display: "flex", flexDirection: "column",
        fontFamily: "Tahoma, sans-serif", fontSize: 11, overflow: "hidden",
        transform: shaking ? "translate(3px, 2px)" : "none",
        transition: "transform 0.05s"
      }}
    >
      <div style={{ padding: "6px 8px", background: "linear-gradient(180deg,#5AA0E8 0%,#2E71C8 100%)", color: "#FFF", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <img src={assetUrl(`assets/xpui/user/${userPicture}`)} alt="" style={{ width: 28, height: 28, borderRadius: 3, border: "1px solid #FFF" }} />
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontWeight: "bold", fontSize: 12 }}>{userName}</div>
          <div style={{ fontSize: 10, color: "#D8E8FC" }}>Online - Windows XP</div>
        </div>
      </div>

      {chatWith ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#FFF" }}>
          <div style={{ padding: "4px 8px", background: "#ECE9D8", borderBottom: "1px solid #D4D0C8", display: "flex", alignItems: "center", gap: 8 }}>
            <img src={assetUrl(`assets/xpui/user/${chatWith.avatar}`)} alt="" style={{ width: 24, height: 24, borderRadius: 3, border: "1px solid #999" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{chatWith.name}</div>
              <div style={{ fontSize: 10, color: "#555" }}>&lt;{chatWith.quote}&gt;</div>
            </div>
            <button onClick={sendNudge} title="Send a Nudge!" style={{ padding: "2px 8px", fontSize: 11, background: "linear-gradient(180deg,#FFF,#E4E2D0)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer" }}>
              Nudge
            </button>
            <button onClick={() => setChatWith(null)} style={{ padding: "2px 8px", fontSize: 11, background: "linear-gradient(180deg,#FFF,#E4E2D0)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer" }}>
              Back
            </button>
          </div>

          <div style={{ flex: 1, padding: 8, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
            {(messages[chatWith.id] || []).map((m, idx) => (
              <div key={idx} style={m.isSystem ? { color: "#C00000", fontWeight: "bold", fontStyle: "italic", textAlign: "center", margin: "4px 0" } : {}}>
                {!m.isSystem && (
                  <div style={{ color: m.sender === userName ? "#0000CC" : "#C00000", fontWeight: "bold", fontSize: 11 }}>
                    {m.sender} says ({m.time}):
                  </div>
                )}
                <div style={{ color: "#000", paddingLeft: m.isSystem ? 0 : 8, fontSize: 12 }}>{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div style={{ color: "#777", fontStyle: "italic", fontSize: 10, paddingLeft: 8 }}>
                {chatWith.name} is typing a message...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: 6, background: "#ECE9D8", borderTop: "1px solid #D4D0C8", display: "flex", gap: 4 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Type a message..."
              style={{ flex: 1, border: "1px solid #7F9DB9", fontSize: 12, padding: "3px 6px", outline: "none" }}
            />
            <button onClick={send} style={{ padding: "3px 14px", background: "linear-gradient(180deg,#FFF,#E4E2D0)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer", fontWeight: "bold" }}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFF", overflowY: "auto" }}>
          <div style={{ padding: "4px 8px", background: "#ECE9D8", borderBottom: "1px solid #D4D0C8", fontWeight: "bold", fontSize: 11 }}>
            Contacts ({CONTACTS.filter((c) => c.status !== "offline").length} online)
          </div>
          {CONTACTS.map((c) => (
            <div
              key={c.id}
              onClick={() => setChatWith(c)}
              onDoubleClick={() => setChatWith(c)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", cursor: "pointer", borderBottom: "1px solid #F0F0F0", userSelect: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF4FC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <img src={assetUrl(`assets/xpui/user/${c.avatar}`)} alt="" style={{ width: 28, height: 28, borderRadius: 3, border: "1px solid #B0C4DE" }} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: c.status === "online" ? "#2EB42E" : c.status === "busy" ? "#D50F25" : c.status === "away" ? "#E8A020" : "#AAA"
                  }} />
                  <span style={{ fontWeight: "bold", color: "#000" }}>{c.name}</span>
                </div>
                <div style={{ fontSize: 10, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.quote}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
