import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";
import type { AppId } from "../../types";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

const IC = assetUrl("assets/icons");
const OL = assetUrl("assets/xpui");

interface CategoryDef { titleKey: "appearanceAndThemes" | "networkAndInternet" | "userAccountsCat" | "dateTimeRegional" | "soundsSpeechAudio" | "performanceMaintenance" | "securityCenterCat" | "administrativeTools"; descKey: "appearanceAndThemesDesc" | "networkAndInternetDesc" | "userAccountsDesc" | "dateTimeRegionalDesc" | "soundsSpeechAudioDesc" | "performanceMaintenanceDesc" | "securityCenterDesc" | "administrativeToolsDesc"; icon: string; app: AppId; }
interface ClassicDef { titleKey: "dateAndTime" | "displayClassic" | "networkConnectionsClassic" | "regionalOptions" | "securityCenterClassic" | "soundsAudioClassic" | "systemClassic" | "taskManager" | "userAccountsCat"; descKey: "dateAndTimeDesc" | "displayClassicDesc" | "networkConnectionsClassicDesc" | "regionalOptions" | "securityCenterClassicDesc" | "soundsAudioClassicDesc" | "systemClassicDesc" | "taskManager" | "userAccountsDesc"; icon: string; app: AppId; }

const CATEGORY_DEFS: CategoryDef[] = [
  { titleKey: "appearanceAndThemes", descKey: "appearanceAndThemesDesc", icon: `${IC}/DisplayProperties.png`, app: "display-properties" },
  { titleKey: "networkAndInternet", descKey: "networkAndInternetDesc", icon: `${IC}/MicrosoftWindowsNetwork.png`, app: "network-places" },
  { titleKey: "userAccountsCat", descKey: "userAccountsDesc", icon: `${IC}/UserAccounts.png`, app: "user-accounts" },
  { titleKey: "dateTimeRegional", descKey: "dateTimeRegionalDesc", icon: `${IC}/RegionalSettings.png`, app: "regional-options" },
  { titleKey: "soundsSpeechAudio", descKey: "soundsSpeechAudioDesc", icon: `${IC}/Volume.png`, app: "volume" },
  { titleKey: "performanceMaintenance", descKey: "performanceMaintenanceDesc", icon: `${IC}/SystemProperties.png`, app: "system-properties" },
  { titleKey: "securityCenterCat", descKey: "securityCenterDesc", icon: `${IC}/SecurityCenter.png`, app: "security-center" },
  { titleKey: "administrativeTools", descKey: "administrativeToolsDesc", icon: `${IC}/CommandPrompt.png`, app: "terminal" },
];
const CLASSIC_DEFS: ClassicDef[] = [
  { titleKey: "dateAndTime", descKey: "dateAndTimeDesc", icon: `${IC}/DateandTime.png`, app: "date-time" },
  { titleKey: "displayClassic", descKey: "displayClassicDesc", icon: `${IC}/DisplayProperties.png`, app: "display-properties" },
  { titleKey: "networkConnectionsClassic", descKey: "networkConnectionsClassicDesc", icon: `${IC}/MicrosoftWindowsNetwork.png`, app: "network-places" },
  { titleKey: "regionalOptions", descKey: "regionalOptions", icon: `${IC}/RegionalSettings.png`, app: "regional-options" },
  { titleKey: "securityCenterClassic", descKey: "securityCenterClassicDesc", icon: `${IC}/SecurityCenter.png`, app: "security-center" },
  { titleKey: "soundsAudioClassic", descKey: "soundsAudioClassicDesc", icon: `${IC}/Volume.png`, app: "volume" },
  { titleKey: "systemClassic", descKey: "systemClassicDesc", icon: `${IC}/SystemProperties.png`, app: "system-properties" },
  { titleKey: "taskManager", descKey: "taskManager", icon: `${IC}/TaskManager.png`, app: "task-manager" },
  { titleKey: "userAccountsCat", descKey: "userAccountsDesc", icon: `${IC}/UserAccounts.png`, app: "user-accounts" },
];

export default function ControlPanel({ id }: { id: string }) {
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [classicView, setClassicView] = useState(false);
  const t = useLangStore((state) => state.t);
  const items = classicView ? CLASSIC_DEFS : CATEGORY_DEFS;

  return <div className="xp-app-surface"><div className="xp-explorer-head"><MenuBar trailing={<img src={`${OL}/logo/flag.png`} alt="" style={{ width: 18, height: 18 }} />} menus={[{ label: `&${t("file")}`, entries: [cmd(t("createShortcut")), cmd(t("rename")), cmd(t("properties")), sep, cmd(t("closeWindow"), () => closeWindow(id))] }, { label: `&${t("edit")}`, entries: [cmd(t("undo")), cmd(t("redo")), sep, cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep, cmd(t("selectAll"))] }, { label: `&${t("view")}`, entries: [cmd(t("toolbars")), cmd(t("statusBar")), sep, cmd(t("classicView"), () => setClassicView((value) => !value), { checked: classicView }), sep, cmd(t("refresh"))] }, { label: `&${t("favorites")}`, entries: [cmd(t("addToFavorites")), cmd(t("organizeFavorites"))] }, { label: `&${t("tools")}`, entries: [cmd(t("mapNetworkDrive")), cmd(t("disconnectNetworkDrive")), sep, cmd(t("folderOptions"))] }, { label: `&${t("help")}`, entries: [cmd(t("helpAndSupportCenter"), () => openWindow("system-properties")), sep, cmd(t("aboutWindows"))] }]} /><div className="xp-toolbar"><button className="xp-toolbar-button" disabled><img src={`${OL}/interface/explorer/back.png`} alt="" style={{ height: 22 }} />{t("back")}</button><button className="xp-toolbar-button" disabled><img src={`${OL}/interface/explorer/forward.png`} alt="" style={{ height: 22 }} /></button><button className="xp-toolbar-button" onClick={() => openWindow("search")}><img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />{t("search")}</button><button className="xp-toolbar-button" onClick={() => openWindow("explorer")}><img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />{t("folders")}</button><div className="xp-toolbar-separator" /><button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />{t("views")}</button></div><div className="xp-address"><span className="addr-label">{t("address")}</span><div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minHeight: 22 }}><img src={`${IC}/ControlPanel.png`} alt="" style={{ width: 14, height: 14 }} />{t("controlPanel")}</div><button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} />{t("go")}</button></div></div><div className="xp-explorer-middle"><div className="xp-side-panel"><div className="xp-task-pane"><div className="xp-task-pane-title">{t("controlPanel")}</div><div className="xp-task-pane-body"><button className="xp-task-link" onClick={() => setClassicView((value) => !value)}>{classicView ? t("switchToCategory") : t("switchToClassic")}</button></div></div><div className="xp-task-pane"><div className="xp-task-pane-title">{t("seeAlso")}</div><div className="xp-task-pane-body"><button className="xp-task-link" onClick={() => openWindow("system-properties")}><img src={`${IC}/SystemProperties.png`} alt="" />{t("systemInformation")}</button><button className="xp-task-link" onClick={() => openWindow("user-accounts")}><img src={`${IC}/UserAccounts.png`} alt="" />{t("userAccountsCat")}</button><button className="xp-task-link" onClick={() => openWindow("regional-options")}><img src={`${IC}/RegionalSettings.png`} alt="" />{t("regionalOptions")}</button></div></div></div><div className="xp-control-panel-body"><h1 className="xp-control-panel-title">{classicView ? t("classicView") : t("pickCategory")}</h1><div className="xp-control-grid">{items.map((item) => <button key={item.titleKey} className="xp-control-item" onClick={() => openWindow(item.app)}><img src={item.icon} alt="" /><span>{t(item.titleKey)}</span></button>)}</div></div></div></div>;
}
