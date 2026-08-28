import { useState, useRef, useEffect, useCallback } from "react";

const PROMPT = "C:\\Documents and Settings\\XP User>";

const DIR_ENTRIES = [
  { name: "Desktop", type: "<DIR>" },
  { name: "My Documents", type: "<DIR>" },
  { name: "My Music", type: "<DIR>" },
  { name: "My Pictures", type: "<DIR>" },
  { name: "My Videos", type: "<DIR>" },
  { name: "Favorites", type: "<DIR>" },
  { name: "boot.ini", type: "FILE", size: "211" },
  { name: "ntldr", type: "FILE", size: "295,672" },
  { name: "pagefile.sys", type: "FILE", size: "402,653,184" },
  { name: "AUTOEXEC.BAT", type: "FILE", size: "0" },
  { name: "CONFIG.SYS", type: "FILE", size: "0" },
  { name: "IO.SYS", type: "FILE", size: "0" },
];

const HISTORY: string[] = [];

function processCmd(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  HISTORY.push(trimmed);
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  switch (cmd) {
    case "help":
      return [
        "Para obtener informacion sobre un comando especifico, escriba HELP nombre-de-comando",
        "",
        "CALL      Llama a un programa por lotes desde otro.",
        "CD        Cambia el directorio actual.",
        "CLS       Borra la pantalla.",
        "COLOR     Establece los colores de primer y segundo plano.",
        "COPY      Copia uno o mas archivos a otro lugar.",
        "DATE      Muestra o establece la fecha.",
        "DEL       Elimina uno o mas archivos.",
        "DIR       Muestra una lista de archivos y subdirectorios.",
        "ECHO      Muestra mensajes o activa/desactiva el eco de comandos.",
        "EXIT      Sale del interprete de comandos CMD.EXE.",
        "IPCONFIG  Muestra la configuracion de IP de Windows.",
        "MKDIR     Crea un directorio.",
        "NET       Proporciona comandos de red.",
        "PING      Envia solicitudes de eco ICMP a un host de red.",
        "SET       Muestra, establece o elimina variables de entorno.",
        "SYSTEMINFO Muestra la informacion de la configuracion del sistema.",
        "TIME      Muestra o establece la hora del sistema.",
        "TREE      Muestra graficamente la estructura de carpetas.",
        "TYPE      Muestra el contenido de un archivo de texto.",
        "VER       Muestra la version de Windows.",
        "XCOPY     Copia archivos y arboles de directorios.",
      ];

    case "dir": {
      const files = DIR_ENTRIES.filter((e) => e.type === "FILE");
      const dirs = DIR_ENTRIES.filter((e) => e.type === "<DIR>");
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      return [
        ` Volume in drive C has no label.`,
        ` Volume Serial Number is A123-B456`,
        ``,
        ` Directory of C:\\Documents and Settings\\XP User`,
        ``,
        ...dirs.map((d) => `${dateStr}  ${timeStr}    <DIR>          ${d.name}`),
        ...files.map((f) => `${dateStr}  ${timeStr}           ${(f.size || "0").padStart(14)} ${f.name}`),
        `               ${files.length} File(s)    402,948,067 bytes`,
        `               ${dirs.length} Dir(s)  18,543,214,592 bytes free`,
      ];
    }

    case "cls":
      return ["__CLS__"];

    case "echo":
      return [args ? args : "ECHO is on."];

    case "ver":
      return ["", "Microsoft Windows XP [Version 5.1.2600]", ""];

    case "date":
      return [`La fecha actual es: ${new Date().toLocaleDateString("es-MX", { weekday: "short", month: "2-digit", day: "2-digit", year: "numeric" })}`];

    case "time":
      return [`La hora actual es: ${new Date().toLocaleTimeString()}`];

    case "cd":
      if (!args || args === ".") return [`C:\\Documents and Settings\\XP User`];
      if (args === "..") return [`C:\\Documents and Settings`];
      return [`El sistema no puede encontrar la ruta especificada.`];

    case "mkdir":
    case "md":
      if (!args) return [`La sintaxis del comando no es correcta.`];
      return [`Directorio '${args}' creado.`];

    case "ipconfig": {
      return [
        "Configuracion IP de Windows",
        "",
        "Adaptador Ethernet Conexion de area local:",
        "",
        `   Sufijo DNS especifico para la conexion. :`,
        `   Direccion IP. . . . . . . . . . . . . : 192.168.1.${Math.floor(Math.random() * 50) + 100}`,
        `   Mascara de subred . . . . . . . . . . : 255.255.255.0`,
        `   Puerta de enlace predeterminada. . . . : 192.168.1.1`,
        "",
        "Adaptador de bucle invertido de software de Microsoft Loopback:",
        "",
        `   Direccion IP. . . . . . . . . . . . . : 127.0.0.1`,
        `   Mascara de subred . . . . . . . . . . : 255.0.0.0`,
      ];
    }

    case "ping": {
      const host = args || "localhost";
      return [
        ``,
        `Haciendo ping a ${host} [127.0.0.1] con 32 bytes de datos:`,
        `Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128`,
        `Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128`,
        `Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128`,
        `Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128`,
        ``,
        `Estadisticas de ping para 127.0.0.1:`,
        `    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos),`,
        `Tiempos aproximados de ida y vuelta en mili-segundos:`,
        `    Minimo = 0ms, Maximo = 0ms, Media = 0ms`,
      ];
    }

    case "systeminfo":
      return [
        "",
        "Nombre de host:                         ZARXP-PC",
        "Nombre del sistema operativo:            Microsoft Windows XP Professional",
        "Version del sistema operativo:           5.1.2600 Service Pack 3 Compilacion 2600",
        "Fabricante del sistema operativo:        Microsoft Corporation",
        "Tipo del sistema operativo:              Standalone Workstation",
        "Propietario registrado:                  XP User",
        "Organizacion registrada:                 N/A",
        "Id. del producto:                        55274-640-0234567-23614",
        "Fecha de instalacion original:           01/01/2001, 12:00:00",
        `Tiempo de arranque del sistema:          ${new Date(Date.now() - 3600000).toLocaleString()}`,
        "Fabricante del sistema:                  ZarXP Corp",
        "Modelo del sistema:                      Virtual XP Machine",
        "Tipo de sistema:                         X86-based PC",
        "Procesador(es):                          1 procesadores instalados.",
        "                                         [01]: x86 Family 6 Model 23 Stepping 10",
        "                                               GenuineIntel ~2400 Mhz",
        `Zona horaria:                            (GMT-06:00) Guadalajara, Ciudad de Mexico`,
        "Memoria fisica total:                    512 MB",
        "Memoria fisica disponible:               142 MB",
        "Memoria virtual: tamano maximo:          2.048 MB",
        "Memoria virtual: disponible:             1.864 MB",
      ];

    case "tree":
      return [
        "Listado de la estructura de carpetas para la ruta C:\\Documents and Settings\\XP User",
        `C:.`,
        `+---Desktop`,
        `+---Favorites`,
        `|   +---Links`,
        `+---My Documents`,
        `|   +---My Music`,
        `|   +---My Pictures`,
        `|   +---My Videos`,
        `+---Start Menu`,
        `    +---Programs`,
        `        +---Accessories`,
        `        +---Games`,
        `        +---Startup`,
      ];

    case "set":
      return [
        "ALLUSERSPROFILE=C:\\Documents and Settings\\All Users",
        "APPDATA=C:\\Documents and Settings\\XP User\\Application Data",
        "COMPUTERNAME=ZARXP-PC",
        "COMSPEC=C:\\WINDOWS\\system32\\cmd.exe",
        "HOMEDRIVE=C:",
        "HOMEPATH=\\Documents and Settings\\XP User",
        "NUMBER_OF_PROCESSORS=1",
        "OS=Windows_NT",
        "PATH=C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem",
        "PROCESSOR_ARCHITECTURE=x86",
        "PROCESSOR_IDENTIFIER=x86 Family 6 Model 23 Stepping 10, GenuineIntel",
        "SYSTEMDRIVE=C:",
        "SYSTEMROOT=C:\\WINDOWS",
        "TEMP=C:\\DOCUME~1\\XPUSER~1\\LOCALS~1\\Temp",
        "TMP=C:\\DOCUME~1\\XPUSER~1\\LOCALS~1\\Temp",
        "USERNAME=XP User",
        "USERPROFILE=C:\\Documents and Settings\\XP User",
        "WINDIR=C:\\WINDOWS",
      ];

    case "type":
      if (!args) return ["Se necesita especificar un nombre de archivo."];
      if (args.toLowerCase() === "boot.ini") {
        return [
          "[boot loader]",
          "timeout=30",
          "default=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS",
          "[operating systems]",
          'multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS="Microsoft Windows XP Professional" /noexecute=optin /fastdetect',
        ];
      }
      return [`El sistema no puede encontrar el archivo especificado.`];

    case "color": {
      return [`Color de consola cambiado a: ${args || "07"}`];
    }

    case "exit":
      return ["Cerrando sesion..."];

    case "net":
      if (args.toLowerCase() === "user") {
        return [
          "Cuentas de usuario de \\\\ZARXP-PC",
          "",
          "-------------------------------------------------------------------------------",
          "Administrador                     XP User",
          "El comando se ha completado correctamente.",
        ];
      }
      return [`NET ${args} - comando no reconocido. Prueba: net user`];

    default:
      return [`'${cmd}' no se reconoce como un comando interno o externo,`, `programa o archivo por lotes ejecutable.`];
  }
}

export default function Terminal(_: { id: string }) {
  const [lines, setLines] = useState<string[]>([
    "Microsoft Windows XP [Version 5.1.2600]",
    "(C) Copyright 1985-2001 Microsoft Corp.",
    "",
    PROMPT,
  ]);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState(true);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView(); }, [lines]);

  const submit = useCallback(() => {
    const cmd = input;
    const output = processCmd(cmd);
    if (output[0] === "__CLS__") {
      setLines([PROMPT]);
    } else {
      setLines((l) => [...l.slice(0, -1), `${PROMPT}${cmd}`, ...output, PROMPT]);
    }
    setInput("");
    setHistIdx(-1);
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, HISTORY.length - 1);
      if (HISTORY.length > 0) {
        const val = HISTORY[HISTORY.length - 1 - newIdx] || "";
        setInput(val);
        setHistIdx(newIdx);
        setLines((l) => [...l.slice(0, -1), `${PROMPT}${val}`]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      const val = newIdx >= 0 ? (HISTORY[HISTORY.length - 1 - newIdx] || "") : "";
      setInput(val);
      setHistIdx(newIdx);
      setLines((l) => [...l.slice(0, -1), `${PROMPT}${val}`]);
    } else if (e.key === "Backspace") {
      const next = input.slice(0, -1);
      setInput(next);
      setLines((l) => [...l.slice(0, -1), `${PROMPT}${next}`]);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
      const next = input + e.key;
      setInput(next);
      setLines((l) => [...l.slice(0, -1), `${PROMPT}${next}`]);
    }
  }, [input, histIdx, submit]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ width: "100%", height: "100%", background: "#000", color: "#C0C0C0", fontFamily: "Consolas,'Courier New',monospace", fontSize: 13, padding: "4px 6px", overflow: "auto", whiteSpace: "pre", cursor: "text", outline: "none", boxSizing: "border-box" }}
    >
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        return (
          <div key={i}>
            {isLast ? (
              <>
                {line}
                <span style={{ opacity: cursor ? 1 : 0, background: "#C0C0C0", color: "#000" }}> </span>
              </>
            ) : line}
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
