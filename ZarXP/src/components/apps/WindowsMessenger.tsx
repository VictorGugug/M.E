import { useState, useRef, useEffect, useCallback } from "react";
import { assetUrl } from "../../utils/assets";
import { useUserStore } from "../../store/userStore";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";
import { playSound } from "../../utils/sound";

const OL = assetUrl("assets/xpui");

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "busy" | "away" | "offline";
  quote: string;
}

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export default function WindowsMessenger({ id }: { id: string }) {
  const { userName, userPicture } = useUserStore();
  const t = useLangStore((state) => state.t);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [signedIn, setSignedIn] = useState(true);
  const [chatWith, setChatWith] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    zelly: [
      { sender: "Zelly", text: t("msgrWelcome"), time: "12:00 PM" }
    ]
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shaking, setShaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    { id: "zelly", name: "Zelly", avatar: "snowflake.png", status: "online", quote: t("msgrQuoteZelly") },
    { id: "bill", name: "Bill Gates", avatar: "chess.png", status: "online", quote: t("msgrQuoteBill") },
    { id: "rover", name: "Rover", avatar: "dog.png", status: "online", quote: t("msgrQuoteRover") },
    { id: "admin", name: "Administrator", avatar: "car.png", status: "busy", quote: t("msgrQuoteAdmin") },
    { id: "guest", name: "Guest User", avatar: "duck.png", status: "offline", quote: t("msgrQuoteGuest") },
  ];

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
      const pools: Record<string, string[]> = {
        zelly: [t("msgrReplyZelly1"), t("msgrReplyZelly2"), t("msgrReplyZelly3"), t("msgrReplyZelly4"), t("msgrReplyZelly5"), t("msgrReplyZelly6")],
        bill: [t("msgrReplyBill1"), t("msgrReplyBill2"), t("msgrReplyBill3"), t("msgrReplyBill4")],
        rover: [t("msgrReplyRover1"), t("msgrReplyRover2"), t("msgrReplyRover3")],
        admin: [t("msgrReplyAdmin1"), t("msgrReplyAdmin2")],
      };
      const pool = pools[contactId] || [t("msgrReplyDefault")];
      const reply = pool[Math.floor(Math.random() * pool.length)];
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), { sender: chatWith.name, text: reply, time: getTimeString() }]
      }));
      playSound("Windows XP Ding.wav", 0.4);
    }, 1500);
  }, [input, chatWith, userName, t]);

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
        { sender: "", text: t("msgrNudgeSent"), time: getTimeString(), isSystem: true }
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
          { sender: "", text: `${chatWith.name} ${t("msgrNudgeReceived")}`, time: getTimeString(), isSystem: true }
        ]
      }));
    }, 2000);
  }, [chatWith, t]);

  if (!signedIn) {
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#5AA0E8 0%,#2E71C8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Tahoma, sans-serif" }}>
        <img src={`${OL}/icon/messenger.png`} alt="" style={{ width: 64, height: 64 }} />
        <div style={{ color: "#FFF", fontSize: 16, fontWeight: "bold", marginTop: 12 }}>{t("messenger")}</div>
        <div style={{ color: "#D8E8FC", fontSize: 12, marginTop: 4 }}>{t("signInPrompt")}</div>
        <button
          onClick={() => setSignedIn(true)}
          style={{ marginTop: 20, padding: "5px 22px", fontSize: 12, fontWeight: "bold", background: "linear-gradient(180deg,#FFF,#ECE9D8)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer" }}
        >
          {t("signIn")}
        </button>
      </div>
    );
  }

  return (
    <div
      className="xp-app-surface" style={{ transform: shaking ? "translate(3px, 2px)" : "none", transition: "transform 0.05s" }}
    >
      <MenuBar menus={[
        { label: `&${t("file")}`, entries: [
          cmd(t("signOut"), () => setSignedIn(false)),
          sep,
          cmd(t("closeWindow"), () => closeWindow(id)),
        ] },
        { label: `&${t("edit")}`, entries: [
          cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep, cmd(t("selectAll")),
        ] },
        { label: `&${t("actions")}`, entries: [
          cmd(t("sendNudge"), sendNudge, { disabled: !chatWith }),
          sep,
          cmd(t("invite")),
          cmd(t("sendFile")),
          sep,
          cmd(t("startVideo")),
        ] },
        { label: `&${t("tools")}`, entries: [
          cmd(t("addContact")),
          sep,
          cmd(t("options")),
        ] },
        { label: `&${t("help")}`, entries: [
          cmd(t("helpTopics")),
          sep,
          cmd(t("aboutMessenger")),
        ] },
      ]} />

      <div className="xp-messenger-header">
        <img src={assetUrl(`assets/xpui/user/${userPicture}`)} alt="" style={{ width: 28, height: 28, borderRadius: 3, border: "1px solid #FFF" }} />
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontWeight: "bold", fontSize: 12 }}>{userName}</div>
          <div style={{ fontSize: 10, color: "#D8E8FC" }}>{t("onlineWindowsXp")}</div>
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
            <button onClick={sendNudge} title={t("sendNudge")} className="xp-button" style={{ minWidth: 52, height: 21, padding: "1px 7px" }}>
              {t("nudge")}
            </button>
            <button onClick={() => setChatWith(null)} className="xp-button" style={{ minWidth: 52, height: 21, padding: "1px 7px" }}>
              {t("back")}
            </button>
          </div>

          <div style={{ flex: 1, padding: 8, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, fontSize: 11 }}>
            {(messages[chatWith.id] || []).map((m, idx) => (
              <div key={idx} style={m.isSystem ? { color: "#C00000", fontWeight: "bold", fontStyle: "italic", textAlign: "center", margin: "4px 0" } : {}}>
                {!m.isSystem && (
                  <div style={{ color: m.sender === userName ? "#0000CC" : "#C00000", fontWeight: "bold", fontSize: 11 }}>
                    {m.sender} {t("msgrSays")} ({m.time}):
                  </div>
                )}
                <div style={{ color: "#000", paddingLeft: m.isSystem ? 0 : 8, fontSize: 12 }}>{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div style={{ color: "#777", fontStyle: "italic", fontSize: 10, paddingLeft: 8 }}>
                {chatWith.name} {t("isTyping")}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: 6, background: "#ECE9D8", borderTop: "1px solid #D4D0C8", display: "flex", gap: 4 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder={t("typeMessage")}
              className="xp-input" style={{ flex: 1, fontSize: 12 }}
            />
            <button onClick={send} className="xp-button" style={{ fontWeight: "bold" }}>
              {t("send")}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFF", overflowY: "auto" }}>
          <div style={{ padding: "4px 8px", background: "#ECE9D8", borderBottom: "1px solid #D4D0C8", fontWeight: "bold", fontSize: 11 }}>
            {t("contacts")} ({contacts.filter((c) => c.status !== "offline").length} {t("onlineLabel")})
          </div>
          {contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => setChatWith(c)}
              onDoubleClick={() => setChatWith(c)}
              className="xp-contact-row"
            >
              <img src={assetUrl(`assets/xpui/user/${c.avatar}`)} alt="" style={{ width: 28, height: 28, borderRadius: 3, border: "1px solid #B0C4DE" }} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="xp-status-dot" style={{ background: c.status === "online" ? "#2EB42E" : c.status === "busy" ? "#D50F25" : c.status === "away" ? "#E8A020" : "#AAA" }} />
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
