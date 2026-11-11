import { useState } from "react";
import { assetUrl } from "../../utils/assets";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";
import { playSound, XP_SOUNDS } from "../../utils/sound";

const IC = assetUrl("assets/icons");
const OL = assetUrl("assets/xpui");

function ToolBtn({ img, label, onClick }: { img: string; label: string; onClick?: () => void }) {
  return <button className="xp-toolbar-button" onClick={onClick} disabled={!onClick} style={{ flexDirection: "column", gap: 1 }}><img src={img} alt="" style={{ width: 22, height: 22 }} /><span>{label}</span></button>;
}

export default function OutlookExpress({ id }: { id: string }) {
  const t = useLangStore((state) => state.t);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [folder, setFolder] = useState("inbox");
  const [selected, setSelected] = useState(0);
  const [composing, setComposing] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const messages = [
    { from: t("oeMsg1From"), subject: t("oeMsg1Subject"), date: "8:30 AM", body: [t("oeMsg1Body1"), t("oeMsg1Body2"), t("oeMsg1Body3")] },
    { from: t("oeMsg2From"), subject: t("oeMsg2Subject"), date: "8:15 AM", body: [t("oeMsg2Body1"), t("oeMsg2Body2"), t("oeMsg2Body3")] },
  ];
  const folders = [
    { id: "inbox", label: t("inbox"), icon: `${IC}/OEInbox.png`, count: messages.length },
    { id: "outbox", label: t("outbox"), icon: `${OL}/icon/outlook.png`, count: 0 },
    { id: "sent", label: t("sentItems"), icon: `${IC}/OESend.png`, count: 0 },
    { id: "deleted", label: t("deletedItemsFolder"), icon: `${IC}/Delete.png`, count: 0 },
    { id: "drafts", label: t("drafts"), icon: `${IC}/OENewsPost.png`, count: 0 },
  ];
  const message = messages[selected];
  const send = () => {
    if (!to.trim()) return;
    setSent((items) => [...items, `To: ${to} - ${subject || t("noSubject")}`]);
    setComposing(false);
    setTo("");
    setSubject("");
    setBody("");
    playSound(XP_SOUNDS.notify);
  };
  const sendReceive = () => playSound(XP_SOUNDS.notify);

  return (
    <div className="xp-app-surface">
      <MenuBar menus={[
        { label: `&${t("file")}`, entries: [
          cmd(t("newMessage"), () => setComposing(true)),
          cmd(t("openDots")),
          cmd(t("saveAs")),
          sep,
          cmd(t("print"), () => window.print()),
          sep,
          cmd(t("exit"), () => closeWindow(id)),
        ] },
        { label: `&${t("edit")}`, entries: [
          cmd(t("undo")), cmd(t("redo")), sep,
          cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep,
          cmd(t("selectAll")),
        ] },
        { label: `&${t("view")}`, entries: [
          cmd(t("toolbars")),
          cmd(t("statusBar"), undefined, { checked: true }),
          sep,
          cmd(t("columns")),
        ] },
        { label: `&${t("tools")}`, entries: [
          cmd(t("addressBook")),
          sep,
          cmd(t("sendRecv"), sendReceive),
          sep,
          cmd(t("options")),
        ] },
        { label: `&${t("message")}`, entries: [
          cmd(t("newMessage"), () => setComposing(true)),
          cmd(t("reply")),
          cmd(t("replyAll")),
          cmd(t("forward")),
          cmd(t("delete")),
          sep,
          cmd(t("properties")),
        ] },
        { label: `&${t("help")}`, entries: [
          cmd(t("helpTopics")),
          sep,
          cmd(t("aboutOutlookExpress")),
        ] },
      ]} />
      <div className="xp-toolbar">
        <ToolBtn img={`${IC}/OECreateMail.png`} label={t("createMail")} onClick={() => setComposing(true)} />
        <ToolBtn img={`${IC}/OEReply.png`} label={t("reply")} />
        <ToolBtn img={`${IC}/OEForward.png`} label={t("forward")} />
        <ToolBtn img={`${IC}/PrintersandFaxes.png`} label={t("print")} onClick={() => window.print()} />
        <div className="xp-toolbar-separator" />
        <ToolBtn img={`${IC}/Delete.png`} label={t("delete")} />
        <ToolBtn img={`${IC}/OESendandReceive.png`} label={t("sendRecv")} onClick={sendReceive} />
      </div>
      {composing ? (
        <div className="xp-dialog-body" style={{ margin: 6, border: "1px solid #ACA899", background: "#FFF" }}>
          <div className="xp-form-row"><label className="xp-form-label" htmlFor="oe-to">{t("toLabel")}</label><input id="oe-to" className="xp-input" style={{ flex: 1 }} value={to} onChange={(event) => setTo(event.target.value)} /></div>
          <div className="xp-form-row"><label className="xp-form-label" htmlFor="oe-subject">{t("subjectLabel")}</label><input id="oe-subject" className="xp-input" style={{ flex: 1 }} value={subject} onChange={(event) => setSubject(event.target.value)} /></div>
          <textarea className="xp-input" value={body} onChange={(event) => setBody(event.target.value)} spellCheck={false} style={{ flex: 1, marginTop: 8, resize: "none" }} />
          <div className="xp-dialog-footer" style={{ margin: "8px -12px -12px" }}>
            <button className="xp-button" onClick={send}>{t("send")}</button>
            <button className="xp-button" onClick={() => setComposing(false)}>{t("discard")}</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", minHeight: 0, margin: 4, gap: 0 }}>
          <div className="xp-tree" style={{ width: 155 }}>
            {folders.map((item) => (
              <button key={item.id} className={`xp-tree-item ${folder === item.id ? "selected" : ""}`} onClick={() => setFolder(item.id)}>
                <img src={item.icon} alt="" />
                <span>{item.label}</span>
                {item.count > 0 && <span>({item.count})</span>}
              </button>
            ))}
            {sent.map((item, index) => <div className="xp-small" key={`${item}-${index}`} style={{ padding: "4px 8px" }}>{item}</div>)}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ height: 92, overflowY: "auto", background: "#FFF", border: "1px solid #ACA899", borderBottom: "none" }}>
              <table className="xp-data-table">
                <thead>
                  <tr><th style={{ width: "40%" }}>{t("fromHeader")}</th><th style={{ width: "40%" }}>{t("subjectHeader")}</th><th>{t("receivedHeader")}</th></tr>
                </thead>
                <tbody>
                  {messages.map((item, index) => (
                    <tr key={item.subject} className={selected === index ? "selected" : ""} onClick={() => setSelected(index)}>
                      <td>{item.from}</td><td>{item.subject}</td><td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="xp-content-panel" style={{ padding: 10 }}>
              <div style={{ borderBottom: "1px solid #D4D0C8", paddingBottom: 6, marginBottom: 8 }}>
                <div><strong>{t("fromHeader")}:</strong> {message.from}</div>
                <div><strong>{t("subjectHeader")}:</strong> {message.subject}</div>
              </div>
              {message.body.map((paragraph) => <p key={paragraph} style={{ marginBottom: 8, fontSize: 12 }}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      )}
      <div className="xp-status-strip">
        <span>{folder === "inbox" ? `${messages.length} ${t("oeMessages")}, ${messages.length} ${t("oeUnread")}` : folders.find((item) => item.id === folder)?.label}</span>
        <span>{t("workingOnline")}</span>
      </div>
    </div>
  );
}
