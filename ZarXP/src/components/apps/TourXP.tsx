import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const TOPICS: { id: string; label: string; icon: string; title: string; body: string[] }[] = [
  {
    id: "welcome",
    label: "Welcome to Windows XP",
    icon: "assets/xpui/icon/tour.png",
    title: "Welcome to Windows XP",
    body: [
      "Windows XP brings together the best of two worlds: the power and reliability of the Windows NT code base with the ease of use of the Windows 9x series.",
      "From the moment you turn on your computer, Windows XP is designed to be the easiest Windows yet. Clear visual cues help you find your way around, and the redesigned Start menu puts the programs you use most right at your fingertips.",
      "Use the links on the left to explore what you can do with your computer.",
    ],
  },
  {
    id: "desktop",
    label: "Browsing your computer",
    icon: "assets/xpui/icon/computer.png",
    title: "Browsing your computer",
    body: [
      "The Start menu gives you one place to start your programs, open your documents and find help.",
      "Double-click My Computer to see your disk drives, cameras and printers. The blue task pane on the left offers common shortcuts for the folder you are viewing.",
      "The Recycle Bin holds deleted files until you empty it, so nothing is ever gone by accident.",
    ],
  },
  {
    id: "music",
    label: "Playing music and video",
    icon: "assets/xpui/icon/player.png",
    title: "Playing music and video",
    body: [
      "Windows Media Player lets you play, copy and organize your music and video in one place.",
      "You can copy tracks from your favorite CDs to your computer, build playlists and tune in to Internet radio stations.",
    ],
  },
  {
    id: "internet",
    label: "Exploring the Internet",
    icon: "assets/xpui/icon/internet.png",
    title: "Exploring the Internet",
    body: [
      "Internet Explorer 6 makes browsing the web faster and safer, with pop-up control and privacy features built in.",
      "Type an address into the Address bar and press Enter, or use the Search button to find anything on the web.",
    ],
  },
  {
    id: "games",
    label: "Playing games",
    icon: "assets/xpui/icon/solitaire.png",
    title: "Playing games",
    body: [
      "Windows XP includes updated classics such as Solitaire, Minesweeper, FreeCell and Pinball.",
      "Open the Start menu, point to All Programs and choose Games to take a break.",
    ],
  },
];

export default function TourXP(_: { id: string }) {
  const [topic, setTopic] = useState(TOPICS[0]);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFF", fontFamily: "Tahoma, sans-serif", overflow: "hidden" }}>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ width: 170, flexShrink: 0, background: "linear-gradient(180deg,#7BA2D9 0%,#6D95D6 100%)", padding: 8 }}>
          <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "4px 4px 0 0" }}>
            <div style={{ padding: "4px 8px", color: "#215DC6", fontWeight: "bold", fontSize: 11, background: "linear-gradient(to right,#FFF 0%,#FFF 50%,rgba(255,255,255,0) 100%)" }}>Tour topics</div>
            {TOPICS.map((t) => (
              <a
                key={t.id}
                onClick={() => setTopic(t)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", fontSize: 11, color: topic.id === t.id ? "#000" : "#215DC6", cursor: "pointer", background: topic.id === t.id ? "#D6E5F7" : "transparent" }}
                onMouseEnter={(e) => { if (topic.id !== t.id) e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
              >
                <img src={assetUrl(t.icon)} alt="" style={{ width: 16, height: 16 }} />
                {t.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto", background: "#FFF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={assetUrl(topic.icon)} alt="" style={{ width: 32, height: 32 }} />
            <span style={{ fontSize: 17, color: "#0A246A", fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold" }}>{topic.title}</span>
          </div>
          <div style={{ borderTop: "2px solid #F7963C", marginTop: 8, marginBottom: 12 }} />
          {topic.body.map((p, i) => (
            <p key={i} style={{ fontSize: 12, lineHeight: 1.6, color: "#000", marginBottom: 10 }}>{p}</p>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid #DADAD8", padding: "3px 8px", background: "#ECE9D8", fontSize: 11, color: "#444", flexShrink: 0 }}>Tour Windows XP</div>
    </div>
  );
}
