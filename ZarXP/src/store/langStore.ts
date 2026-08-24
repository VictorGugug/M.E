import { create } from "zustand";

export type Lang = "en" | "es";

const KEY = "zarxp-lang";

const STRINGS = {
  en: {
    start: "start",
    internet: "Internet",
    email: "E-mail",
    tour: "Tour Windows XP",
    messenger: "Windows Messenger",
    mediaPlayer: "Windows Media Player",
    publicForum: "Public Forum",
    wordpad: "Wordpad",
    paint: "Paint",
    allPrograms: "All Programs",
    myDocuments: "My Documents",
    myPictures: "My Pictures",
    myMusic: "My Music",
    myVideos: "My Videos",
    myComputer: "My Computer",
    controlPanel: "Control Panel",
    setProgramAccess: "Set Program Access and Defaults",
    helpAndSupport: "Help And Support",
    search: "Search",
    run: "Run...",
    logOff: "Log Off",
    turnOff: "Turn Off Computer",
    myNetworkPlaces: "My Network Places",
    recycleBin: "Recycle Bin",
    internetExplorer: "Internet Explorer",
    balloonTourTitle: "Take a tour of Windows XP",
    balloonTourBody: "To learn about the fun features Windows XP has to offer, |click here|. To find this info later, click Help and Support on the Start menu.",
    balloonRemoveTitle: "Safely Remove Hardware",
    balloonRemoveBody: "No removable devices are connected.",
    volume: "Volume",
    mute: "Mute",
    shutDown: "Shut down",
    restart: "Restart",
    standBy: "Stand by",
    shutDownWindows: "Shut Down Windows",
    whatToDo: "What do you want the computer to do?",
    option: "Option:",
    shuttingDown: "Windows is shutting down...",
    welcome: "welcome",
    loadingPersonal: "Loading your personal settings...",
    toBegin: "To begin, click your user name",
    afterLogon: "After you log on, you can add or change accounts.",
    controlPanelUser: "Just go to Control Panel and click User Accounts.",
    turnOffComputer: "Turn off computer",
    regionalOptions: "Regional and Language Options",
  },
  es: {
    start: "inicio",
    internet: "Internet",
    email: "Correo",
    tour: "Tour de Windows XP",
    messenger: "Windows Messenger",
    mediaPlayer: "Reproductor de Windows Media",
    publicForum: "Foro publico",
    wordpad: "Wordpad",
    paint: "Paint",
    allPrograms: "Todos los programas",
    myDocuments: "Mis documentos",
    myPictures: "Mis imagenes",
    myMusic: "Mi musica",
    myVideos: "Mis videos",
    myComputer: "Mi PC",
    controlPanel: "Panel de control",
    setProgramAccess: "Establecer acceso a programas",
    helpAndSupport: "Ayuda y soporte tecnico",
    search: "Buscar",
    run: "Ejecutar...",
    logOff: "Cerrar sesion",
    turnOff: "Apagar el equipo",
    myNetworkPlaces: "Mis sitios de red",
    recycleBin: "Papelera de reciclaje",
    internetExplorer: "Internet Explorer",
    balloonTourTitle: "Haga un tour por Windows XP",
    balloonTourBody: "Para conocer las funciones mas divertidas de Windows XP, |haga clic aqui|. Para ver esta informacion mas tarde, haga clic en Ayuda y soporte tecnico del menu Inicio.",
    balloonRemoveTitle: "Quitar hardware de forma segura",
    balloonRemoveBody: "No hay dispositivos extraibles conectados.",
    volume: "Volumen",
    mute: "Silenciar",
    shutDown: "Apagar",
    restart: "Reiniciar",
    standBy: "En espera",
    shutDownWindows: "Apagar Windows",
    whatToDo: "Que desea hacer con el equipo?",
    option: "Opcion:",
    shuttingDown: "Windows se esta cerrando...",
    welcome: "bienvenido",
    loadingPersonal: "Cargando la configuracion personal...",
    toBegin: "Para empezar, haga clic en su nombre de usuario",
    afterLogon: "Despues de iniciar sesion puede agregar o cambiar cuentas.",
    controlPanelUser: "Vaya al Panel de control y haga clic en Cuentas de usuario.",
    turnOffComputer: "Apagar el equipo",
    regionalOptions: "Opciones regionales y de idioma",
  },
} as const;

export type StringKey = keyof typeof STRINGS.en;

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: StringKey) => string;
}

function initial(): Lang {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "en" || v === "es") return v;
  } catch {}
  return "en";
}

export const useLangStore = create<LangStore>((set, get) => ({
  lang: initial(),
  setLang: (lang) => {
    set({ lang });
    try { localStorage.setItem(KEY, lang); } catch {}
  },
  t: (key) => STRINGS[get().lang][key],
}));
