/* ============================================================
   Windows XP Personal - Script principal
   Gestiona login, escritorio, ventanas, menu Inicio, sonidos,
   teclado, drag/resize, doble-click, apagar, configuracion.
   ============================================================ */
(function () {
  "use strict";

  // ===== Configuracion persistida =========================================

  const STORAGE_KEY = "xp-personal-config-v2";
  const defaults = {
    displayName: "Invitado",
    mouseVolume: 25,
    keyboardVolume: 10,
    keyboardEnabled: true,
    systemSoundsEnabled: true,
    startLabel: "inicio",
    quickLaunch: true,
    clockFormat: "24",
    iconSize: 32,
    doubleClickToOpen: true,
    iconPositions: null,
    lastSession: null,
  };

  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaults };
      return { ...defaults, ...JSON.parse(raw) };
    } catch (_) {
      return { ...defaults };
    }
  }

  function saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (_) {
      /* noop */
    }
  }

  const config = loadConfig();

  // ===== Audio ============================================================

  const AUDIO_BASE = {
    click: "click.mp3",
    logon: "xpsounds2/Windows XP Logon Sound.mp3",
    logoff: "xpsounds2/Windows XP Logoff Sound.mp3",
    startup: "xpsounds2/Windows XP Startup.mp3",
    shutdown: "xpsounds2/Windows XP Shutdown.mp3",
    error: "xpsounds2/Windows XP Error.mp3",
    ding: "xpsounds2/Windows XP Ding.mp3",
    minimize: "xpsounds2/Windows XP Minimize.mp3",
    restore: "xpsounds2/Windows XP Restore.mp3",
    notify: "xpsounds2/Windows XP Notify.mp3",
    menu: "xpsounds2/Windows XP Menu Command.mp3",
    balloon: "xpsounds2/Windows XP Balloon.mp3",
    recycle: "xpsounds2/Windows XP Recycle.mp3",
  };

  const KEYBOARD_SAMPLES = [
    "Razer Green (Blackwidow Elite) - Akira/key1.wav",
    "Razer Green (Blackwidow Elite) - Akira/key2.wav",
    "Razer Green (Blackwidow Elite) - Akira/key3.wav",
    "Razer Green (Blackwidow Elite) - Akira/key4.wav",
    "Razer Green (Blackwidow Elite) - Akira/key5.wav",
    "Razer Green (Blackwidow Elite) - Akira/key6.wav",
  ];
  const SPACE_SAMPLES = [
    "Razer Green (Blackwidow Elite) - Akira/space1.wav",
    "Razer Green (Blackwidow Elite) - Akira/space2.wav",
  ];
  const SPECIAL_KEY_SAMPLES = {
    Enter: "Razer Green (Blackwidow Elite) - Akira/ent.wav",
    Backspace: "Razer Green (Blackwidow Elite) - Akira/back.wav",
    Shift: "Razer Green (Blackwidow Elite) - Akira/shift.wav",
    Control: "Razer Green (Blackwidow Elite) - Akira/ctrl.wav",
    Alt: "Razer Green (Blackwidow Elite) - Akira/alt.wav",
    CapsLock: "Razer Green (Blackwidow Elite) - Akira/caps.wav",
  };

  const audioCache = new Map();

  function playSample(src, volume) {
    if (!src) return;
    let pool = audioCache.get(src);
    if (!pool) {
      pool = [];
      audioCache.set(src, pool);
    }
    const free = pool.find((a) => a.paused || a.ended);
    const audio = free || new Audio(src);
    if (!free) {
      audio.preload = "auto";
      pool.push(audio);
    }
    try {
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (_) {
      /* ignore */
    }
  }

  function playSystemSound(name) {
    if (!config.systemSoundsEnabled) return;
    const src = AUDIO_BASE[name];
    if (!src) return;
    playSample(src, 0.5);
  }

  function playClickSound() {
    playSample(AUDIO_BASE.click, Math.max(0, Math.min(1, config.mouseVolume / 100)));
  }

  function playKeyboardSound(key) {
    if (!config.keyboardEnabled) return;
    let src;
    if (SPECIAL_KEY_SAMPLES[key]) {
      src = SPECIAL_KEY_SAMPLES[key];
    } else if (key === " " || key === "Spacebar") {
      src = SPACE_SAMPLES[Math.floor(Math.random() * SPACE_SAMPLES.length)];
    } else {
      src = KEYBOARD_SAMPLES[Math.floor(Math.random() * KEYBOARD_SAMPLES.length)];
    }
    playSample(src, Math.max(0, Math.min(1, config.keyboardVolume / 100)));
  }

  // ===== Referencias =======================================================

  const $ = (id) => document.getElementById(id);
  const dom = {
    loginScreen: $("login-screen"),
    loginForm: $("login-form"),
    username: $("username"),
    password: $("password"),
    loginStatus: $("login-status"),
    loginUserCaption: $("login-user-caption"),
    loginHelpButton: $("login-help-button"),
    loginPowerButton: $("login-power-button"),
    userTile: $("user-tile"),
    protocolNotice: $("protocol-notice"),

    desktopScreen: $("desktop-screen"),
    desktop: $("desktop"),
    desktopIcons: $("desktop-icons"),
    windowLayer: $("window-layer"),

    startButton: $("start-button"),
    startButtonLabel: $("start-button-label"),
    startMenu: $("start-menu"),
    startUserName: $("start-user-name"),
    taskbarWindows: $("taskbar-windows"),
    taskbarClock: $("taskbar-clock"),
    quickLaunch: $("quick-launch"),

    shutdownDialog: $("shutdown-dialog"),
    shutdownButton: $("shutdown-button"),
    logoffButton: $("logoff-button"),
    powerScreen: $("power-screen"),
    powerMessage: $("power-message"),
    powerHint: $("power-hint"),

    contextMenu: $("context-menu"),

    runInput: $("run-input"),
    runAccept: $("run-accept-button"),
    runCancel: $("run-cancel-button"),
    runBrowse: $("run-browse-button"),

    profileName: $("profile-display-name"),
    configDisplayName: $("config-display-name"),
    configUserDisplay: $("config-user-display"),
    configMouseVolume: $("config-mouse-volume"),
    configKeyboardVolume: $("config-keyboard-volume"),
    configKeyboardEnabled: $("config-keyboard-enabled"),
    configSystemSounds: $("config-system-sounds-enabled"),
    configStartLabel: $("config-start-label"),
    configQuickLaunch: $("config-quick-launch"),
    configClockFormat: $("config-clock-format"),
    configIconSize: $("config-icon-size"),
    configDoubleClick: $("config-double-click"),

    browserAddress: $("browser-address-input"),
    browserPageTitle: $("browser-page-title"),
    browserPageCopy: $("browser-page-copy"),

    searchInput: $("search-input"),
    searchResults: $("search-results"),

    calcDisplay: $("calc-display"),
    calcButtons: $("calc-buttons"),

    paintCanvas: $("paint-canvas"),
  };

  // ===== Estado ===========================================================

  const windowState = new Map(); // windowId -> { element, minimized, maximized, lastRect, zIndex }
  const taskbarButtons = new Map();
  let zIndexCursor = 100;

  // ===== Utilidades =======================================================

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((el) => {
      el.classList.toggle("screen--active", el.id === name);
      el.hidden = el.id !== name;
    });
  }

  function updateDisplayName(name) {
    const clean = (name || "").trim() || "Invitado";
    config.displayName = clean;
    if (dom.startUserName) dom.startUserName.textContent = clean;
    if (dom.loginUserCaption) dom.loginUserCaption.textContent = clean;
    if (dom.profileName) dom.profileName.textContent = clean;
    if (dom.configDisplayName) dom.configDisplayName.value = clean;
    if (dom.configUserDisplay) dom.configUserDisplay.textContent = clean;
    saveConfig();
  }

  // ===== Login ============================================================

  function setupLogin() {
    if (window.location.protocol === "file:" && dom.protocolNotice) {
      dom.protocolNotice.hidden = false;
    }
    if (dom.username) {
      dom.username.value = config.displayName || "Invitado";
      dom.username.addEventListener("input", () => {
        if (dom.loginUserCaption) dom.loginUserCaption.textContent = dom.username.value || "Invitado";
      });
    }
    if (dom.userTile) {
      dom.userTile.addEventListener("click", () => {
        if (dom.password) dom.password.focus();
      });
    }
    if (dom.loginHelpButton) {
      dom.loginHelpButton.addEventListener("click", () => {
        if (dom.loginStatus) {
          dom.loginStatus.textContent = "Escribe tu nombre (o déjalo así) y pulsa la flecha verde para entrar.";
        }
        playSystemSound("ding");
      });
    }
    if (dom.loginPowerButton) {
      dom.loginPowerButton.addEventListener("click", () => openShutdownDialog());
    }
    if (dom.loginForm) {
      dom.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        doLogin();
      });
    }
  }

  function doLogin() {
    const name = dom.username ? dom.username.value.trim() : "";
    updateDisplayName(name);
    playSystemSound("logon");
    showScreen("desktop-screen");
    playSystemSound("startup");
  }

  function doLogoff() {
    playSystemSound("logoff");
    closeAllWindows();
    closeStartMenu();
    showScreen("login-screen");
  }

  // ===== Ventanas =========================================================

  function initWindows() {
    document.querySelectorAll(".xp-window").forEach((win) => {
      const id = win.dataset.windowId;
      if (!id) return;
      const state = {
        element: win,
        minimized: false,
        maximized: false,
        lastRect: null,
        zIndex: 100,
      };
      windowState.set(id, state);

      // Controles
      win.querySelectorAll("[data-window-action]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = btn.dataset.windowAction;
          if (action === "close") closeWindow(id);
          else if (action === "minimize") minimizeWindow(id);
          else if (action === "maximize") toggleMaximize(id);
        });
      });

      // Foco al clicar
      win.addEventListener("mousedown", () => bringToFront(id));

      // Drag por barra de título
      const handle = win.querySelector("[data-drag-handle]");
      if (handle) {
        handle.addEventListener("mousedown", (e) => {
          if (e.target.closest(".window-controls")) return;
          startDrag(win, e);
        });
        handle.addEventListener("dblclick", (e) => {
          if (e.target.closest(".window-controls")) return;
          toggleMaximize(id);
        });
      }

      // Añadir manija de redimensionar
      if (!win.querySelector(".window-resizer")) {
        const resizer = document.createElement("button");
        resizer.className = "window-resizer";
        resizer.type = "button";
        resizer.setAttribute("aria-label", "Redimensionar");
        resizer.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          startResize(win, e);
        });
        win.appendChild(resizer);
      }
    });
  }

  function openWindow(id, options) {
    const state = windowState.get(id);
    if (!state) return;
    const { element } = state;
    const wasHidden = element.hidden;
    element.hidden = false;
    state.minimized = false;
    bringToFront(id);
    updateTaskbar();
    if (wasHidden) {
      playSystemSound("menu");
      const autofocus = element.querySelector("[data-autofocus]");
      if (autofocus) {
        setTimeout(() => autofocus.focus(), 10);
      }
    }
    if (options && options.tab) {
      switchSettingsTab(options.tab);
    }
  }

  function closeWindow(id) {
    const state = windowState.get(id);
    if (!state) return;
    state.element.hidden = true;
    state.minimized = false;
    state.maximized = false;
    state.element.classList.remove("is-maximized", "is-active");
    updateTaskbar();
    playSystemSound("ding");
  }

  function minimizeWindow(id) {
    const state = windowState.get(id);
    if (!state) return;
    state.minimized = true;
    state.element.hidden = true;
    state.element.classList.remove("is-active");
    updateTaskbar();
    playSystemSound("minimize");
  }

  function toggleMaximize(id) {
    const state = windowState.get(id);
    if (!state) return;
    state.maximized = !state.maximized;
    state.element.classList.toggle("is-maximized", state.maximized);
    playSystemSound("restore");
  }

  function bringToFront(id) {
    const state = windowState.get(id);
    if (!state) return;
    zIndexCursor += 1;
    state.element.style.zIndex = String(zIndexCursor);
    windowState.forEach((s, otherId) => {
      s.element.classList.toggle("is-active", otherId === id);
    });
  }

  function closeAllWindows() {
    windowState.forEach((_, id) => {
      const st = windowState.get(id);
      if (st && !st.element.hidden) closeWindow(id);
    });
  }

  function showDesktop() {
    windowState.forEach((state, id) => {
      if (!state.element.hidden) minimizeWindow(id);
    });
  }

  // ===== Drag =============================================================

  function startDrag(win, startEvent) {
    const state = windowState.get(win.dataset.windowId);
    if (!state || state.maximized) return;
    const rect = win.getBoundingClientRect();
    const layerRect = dom.windowLayer.getBoundingClientRect();
    const offsetX = startEvent.clientX - rect.left;
    const offsetY = startEvent.clientY - rect.top;
    bringToFront(win.dataset.windowId);

    function onMove(ev) {
      let newLeft = ev.clientX - layerRect.left - offsetX;
      let newTop = ev.clientY - layerRect.top - offsetY;
      newLeft = Math.max(-rect.width + 60, Math.min(layerRect.width - 60, newLeft));
      newTop = Math.max(0, Math.min(layerRect.height - 28, newTop));
      win.style.left = newLeft + "px";
      win.style.top = newTop + "px";
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    startEvent.preventDefault();
  }

  function startResize(win, startEvent) {
    const state = windowState.get(win.dataset.windowId);
    if (!state || state.maximized) return;
    const rect = win.getBoundingClientRect();
    const startX = startEvent.clientX;
    const startY = startEvent.clientY;
    const startW = rect.width;
    const startH = rect.height;

    function onMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const w = Math.max(240, startW + dx);
      const h = Math.max(140, startH + dy);
      win.style.width = w + "px";
      win.style.height = h + "px";
    }
    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  // ===== Barra de tareas ==================================================

  function updateTaskbar() {
    if (!dom.taskbarWindows) return;
    const active = new Set();
    windowState.forEach((state, id) => {
      const visible = !state.element.hidden || state.minimized;
      if (!visible) {
        const btn = taskbarButtons.get(id);
        if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        taskbarButtons.delete(id);
        return;
      }
      active.add(id);
      let btn = taskbarButtons.get(id);
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "taskbar-window";
        btn.dataset.windowId = id;
        const img = state.element.querySelector(".window-title img");
        const title = state.element.dataset.windowTitle || id;
        btn.innerHTML =
          (img ? `<img src="${img.getAttribute("src")}" alt="">` : "") +
          `<span>${title}</span>`;
        btn.addEventListener("click", () => {
          const st = windowState.get(id);
          if (!st) return;
          if (st.minimized || st.element.hidden) {
            openWindow(id);
          } else if (st.element.classList.contains("is-active")) {
            minimizeWindow(id);
          } else {
            bringToFront(id);
          }
        });
        dom.taskbarWindows.appendChild(btn);
        taskbarButtons.set(id, btn);
      }
      btn.classList.toggle("is-active", !state.minimized && !state.element.hidden && state.element.classList.contains("is-active"));
    });
    taskbarButtons.forEach((btn, id) => {
      if (!active.has(id) && btn.parentNode) {
        btn.parentNode.removeChild(btn);
        taskbarButtons.delete(id);
      }
    });
  }

  // ===== Menu Inicio ======================================================

  function openStartMenu() {
    if (!dom.startMenu) return;
    dom.startMenu.hidden = false;
    dom.startButton.setAttribute("aria-expanded", "true");
    playSystemSound("menu");
  }

  function closeStartMenu() {
    if (!dom.startMenu) return;
    dom.startMenu.hidden = true;
    if (dom.startButton) dom.startButton.setAttribute("aria-expanded", "false");
  }

  function toggleStartMenu() {
    if (dom.startMenu.hidden) openStartMenu(); else closeStartMenu();
  }

  function setupStartMenu() {
    if (!dom.startButton) return;
    dom.startButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });
    document.addEventListener("click", (e) => {
      if (!dom.startMenu || dom.startMenu.hidden) return;
      if (e.target.closest("#start-menu") || e.target.closest("#start-button")) return;
      closeStartMenu();
    });
    if (dom.logoffButton) {
      dom.logoffButton.addEventListener("click", () => {
        closeStartMenu();
        doLogoff();
      });
    }
    if (dom.shutdownButton) {
      dom.shutdownButton.addEventListener("click", () => {
        closeStartMenu();
        openShutdownDialog();
      });
    }
  }

  // ===== Apagar ===========================================================

  function openShutdownDialog() {
    if (!dom.shutdownDialog) return;
    dom.shutdownDialog.hidden = false;
    playSystemSound("notify");
  }

  function closeShutdownDialog() {
    if (!dom.shutdownDialog) return;
    dom.shutdownDialog.hidden = true;
  }

  function performShutdown(mode) {
    closeShutdownDialog();
    playSystemSound("shutdown");
    if (dom.powerMessage) {
      if (mode === "restart") dom.powerMessage.textContent = "Windows se está reiniciando...";
      else if (mode === "standby") dom.powerMessage.textContent = "Entrando en modo de espera...";
      else dom.powerMessage.textContent = "Windows se está apagando...";
    }
    if (dom.powerHint) dom.powerHint.textContent = mode === "restart" ? "El sistema volverá en unos segundos." : "Ahora puede apagar el equipo con seguridad.";
    showScreen("power-screen");

    if (mode === "restart") {
      setTimeout(() => {
        showScreen("login-screen");
      }, 2400);
    } else if (mode === "standby") {
      setTimeout(() => {
        showScreen("login-screen");
      }, 2400);
    }
  }

  function setupShutdown() {
    if (!dom.shutdownDialog) return;
    dom.shutdownDialog.addEventListener("click", (e) => {
      if (e.target === dom.shutdownDialog) closeShutdownDialog();
    });
    dom.shutdownDialog.querySelectorAll("[data-dialog-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.dialogAction;
        if (action === "cancel") closeShutdownDialog();
        else performShutdown(action);
      });
    });
  }

  // ===== Apertura por delegacion ==========================================

  function setupOpenHandlers() {
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-window]");
      if (openBtn) {
        const id = openBtn.dataset.openWindow;
        const tab = openBtn.dataset.openTab;
        if (id) {
          openWindow(id, tab ? { tab } : null);
          closeStartMenu();
        }
      }
      const taskAction = e.target.closest("[data-taskbar-action]");
      if (taskAction) {
        const act = taskAction.dataset.taskbarAction;
        if (act === "show-desktop") showDesktop();
        else if (act === "open-window") openWindow(taskAction.dataset.windowId);
        else if (act === "toggle-tray") playSystemSound("ding");
      }
    });
  }

  // ===== Iconos del escritorio ============================================

  function setupDesktopIcons() {
    const icons = Array.from(document.querySelectorAll("[data-desktop-icon]"));

    icons.forEach((icon) => {
      restoreIconPosition(icon);
      let dragStart = null;
      let didMove = false;
      let clickTimer = null;

      icon.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        dragStart = { x: e.clientX, y: e.clientY, left: parseInt(icon.style.left, 10) || 0, top: parseInt(icon.style.top, 10) || 0 };
        didMove = false;
        const onMove = (ev) => {
          const dx = ev.clientX - dragStart.x;
          const dy = ev.clientY - dragStart.y;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didMove = true;
          if (didMove) {
            const iconsRect = dom.desktopIcons.getBoundingClientRect();
            const w = icon.offsetWidth;
            const h = icon.offsetHeight;
            let newLeft = Math.max(0, Math.min(iconsRect.width - w, dragStart.left + dx));
            let newTop = Math.max(0, Math.min(iconsRect.height - h, dragStart.top + dy));
            icon.style.left = newLeft + "px";
            icon.style.top = newTop + "px";
          }
        };
        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          if (didMove) saveIconPositions();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      icon.addEventListener("click", (e) => {
        if (didMove) { didMove = false; return; }
        selectIcon(icon);
        if (!config.doubleClickToOpen) return;
      });

      icon.addEventListener("dblclick", () => {
        const target = icon.dataset.openWindow;
        if (target) openWindow(target);
      });
    });

    // Click vacío: deseleccionar
    dom.desktop.addEventListener("mousedown", (e) => {
      if (e.target === dom.desktop || e.target === dom.desktopIcons) {
        icons.forEach((ic) => ic.classList.remove("is-selected"));
      }
    });
  }

  function selectIcon(icon) {
    document.querySelectorAll(".desktop-icon.is-selected").forEach((el) => {
      if (el !== icon) el.classList.remove("is-selected");
    });
    icon.classList.add("is-selected");
  }

  function restoreIconPosition(icon) {
    if (!config.iconPositions) return;
    const pos = config.iconPositions[icon.dataset.iconId];
    if (pos) {
      icon.style.left = pos.left + "px";
      icon.style.top = pos.top + "px";
    }
  }

  function saveIconPositions() {
    const out = {};
    document.querySelectorAll("[data-desktop-icon]").forEach((icon) => {
      out[icon.dataset.iconId] = {
        left: parseInt(icon.style.left, 10) || 0,
        top: parseInt(icon.style.top, 10) || 0,
      };
    });
    config.iconPositions = out;
    saveConfig();
  }

  function resetIconPositions() {
    config.iconPositions = null;
    saveConfig();
    const defaults = [
      { id: "my-computer", top: 10 },
      { id: "documents", top: 92 },
      { id: "network", top: 174 },
      { id: "recycle", top: 256 },
      { id: "internet", top: 338 },
    ];
    defaults.forEach((d) => {
      const icon = document.querySelector(`[data-icon-id="${d.id}"]`);
      if (icon) {
        icon.style.left = "10px";
        icon.style.top = d.top + "px";
      }
    });
  }

  // ===== Reloj ============================================================

  function tickClock() {
    if (!dom.taskbarClock) return;
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, "0");
    if (config.clockFormat === "12") {
      const suffix = h >= 12 ? " PM" : " AM";
      h = ((h + 11) % 12) + 1;
      dom.taskbarClock.textContent = `${h}:${m}${suffix}`;
    } else {
      dom.taskbarClock.textContent = `${String(h).padStart(2, "0")}:${m}`;
    }
    dom.taskbarClock.title = now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  // ===== Teclado / Mouse ==================================================

  function setupInputSounds() {
    // Tipeo en inputs / textareas
    document.addEventListener("keydown", (e) => {
      const target = e.target;
      const isEditable = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (!isEditable) {
        // Atajos globales
        if (e.key === "Escape") {
          if (dom.startMenu && !dom.startMenu.hidden) closeStartMenu();
          hideContextMenu();
          return;
        }
        return;
      }
      if (e.key === "Escape") return;
      playKeyboardSound(e.key);
    }, true);

    // Clicks: solo reproducir en elementos interactivos
    document.addEventListener("mousedown", (e) => {
      const interactive = e.target.closest("button, a, [data-open-window], [data-selectable], input[type='checkbox'], input[type='radio'], .window-control, .session-action, .start-item, .start-link, .start-pinned, .folder-item, .desktop-icon, .taskbar-window, .tray-button, .quick-launch-button, .tray-clock, .settings-tab, .power-option, .sidebar-action, .user-tile, .login-arrow-btn, .login-help-btn, .login-power-btn");
      if (!interactive) return;
      if (interactive.disabled) return;
      playClickSound();
    }, true);
  }

  // ===== Context menu =====================================================

  function showContextMenu(x, y, items) {
    if (!dom.contextMenu) return;
    dom.contextMenu.innerHTML = "";
    items.forEach((item) => {
      if (item.separator) {
        const sep = document.createElement("div");
        sep.className = "context-menu-separator";
        dom.contextMenu.appendChild(sep);
        return;
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "context-menu-item";
      btn.textContent = item.label;
      btn.disabled = !!item.disabled;
      btn.addEventListener("click", () => {
        hideContextMenu();
        if (item.action) item.action();
      });
      dom.contextMenu.appendChild(btn);
    });
    dom.contextMenu.hidden = false;
    const rect = dom.contextMenu.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 4;
    const maxY = window.innerHeight - rect.height - 4;
    dom.contextMenu.style.left = Math.max(0, Math.min(x, maxX)) + "px";
    dom.contextMenu.style.top = Math.max(0, Math.min(y, maxY)) + "px";
  }

  function hideContextMenu() {
    if (dom.contextMenu) dom.contextMenu.hidden = true;
  }

  function setupContextMenus() {
    document.addEventListener("contextmenu", (e) => {
      const icon = e.target.closest("[data-desktop-icon]");
      if (icon) {
        e.preventDefault();
        selectIcon(icon);
        showContextMenu(e.clientX, e.clientY, [
          { label: "Abrir", action: () => openWindow(icon.dataset.openWindow) },
          { label: "Crear acceso directo", disabled: true },
          { separator: true },
          { label: "Propiedades", action: () => openWindow("control-panel") },
        ]);
        return;
      }
      if (e.target.closest("#desktop") && !e.target.closest(".xp-window") && !e.target.closest(".taskbar") && !e.target.closest(".start-menu")) {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, [
          { label: "Actualizar", action: () => playSystemSound("ding") },
          { label: "Organizar iconos", action: resetIconPositions },
          { separator: true },
          { label: "Nuevo", disabled: true },
          { separator: true },
          { label: "Propiedades", action: () => openWindow("control-panel") },
        ]);
        return;
      }
      const taskBtn = e.target.closest(".taskbar-window");
      if (taskBtn) {
        e.preventDefault();
        const id = taskBtn.dataset.windowId;
        showContextMenu(e.clientX, e.clientY, [
          { label: "Restaurar", action: () => openWindow(id) },
          { label: "Minimizar", action: () => minimizeWindow(id) },
          { label: "Maximizar", action: () => toggleMaximize(id) },
          { separator: true },
          { label: "Cerrar", action: () => closeWindow(id) },
        ]);
        return;
      }
    });
    document.addEventListener("click", hideContextMenu);
    document.addEventListener("scroll", hideContextMenu, true);
  }

  // ===== Configuración (Panel de control) ================================

  function setupSettings() {
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchSettingsTab(tab.dataset.settingsTab));
    });

    if (dom.configDisplayName) {
      dom.configDisplayName.value = config.displayName;
    }
    if (dom.configMouseVolume) {
      dom.configMouseVolume.value = config.mouseVolume;
      dom.configMouseVolume.addEventListener("input", () => {
        config.mouseVolume = parseInt(dom.configMouseVolume.value, 10);
        saveConfig();
      });
    }
    if (dom.configKeyboardVolume) {
      dom.configKeyboardVolume.value = config.keyboardVolume;
      dom.configKeyboardVolume.addEventListener("input", () => {
        config.keyboardVolume = parseInt(dom.configKeyboardVolume.value, 10);
        saveConfig();
      });
    }
    if (dom.configKeyboardEnabled) {
      dom.configKeyboardEnabled.checked = config.keyboardEnabled;
      dom.configKeyboardEnabled.addEventListener("change", () => {
        config.keyboardEnabled = dom.configKeyboardEnabled.checked;
        saveConfig();
      });
    }
    if (dom.configSystemSounds) {
      dom.configSystemSounds.checked = config.systemSoundsEnabled;
      dom.configSystemSounds.addEventListener("change", () => {
        config.systemSoundsEnabled = dom.configSystemSounds.checked;
        saveConfig();
      });
    }
    if (dom.configStartLabel) {
      dom.configStartLabel.value = config.startLabel;
      dom.configStartLabel.addEventListener("change", () => {
        config.startLabel = dom.configStartLabel.value;
        dom.startButtonLabel.textContent = config.startLabel;
        saveConfig();
      });
    }
    if (dom.configQuickLaunch) {
      dom.configQuickLaunch.checked = config.quickLaunch;
      dom.configQuickLaunch.addEventListener("change", () => {
        config.quickLaunch = dom.configQuickLaunch.checked;
        dom.quickLaunch.style.display = config.quickLaunch ? "" : "none";
        saveConfig();
      });
    }
    if (dom.configClockFormat) {
      dom.configClockFormat.value = config.clockFormat;
      dom.configClockFormat.addEventListener("change", () => {
        config.clockFormat = dom.configClockFormat.value;
        tickClock();
        saveConfig();
      });
    }
    if (dom.configIconSize) {
      dom.configIconSize.value = config.iconSize;
      dom.configIconSize.addEventListener("input", () => {
        config.iconSize = parseInt(dom.configIconSize.value, 10);
        document.documentElement.style.setProperty("--desktop-icon-size", config.iconSize + "px");
        saveConfig();
      });
    }
    if (dom.configDoubleClick) {
      dom.configDoubleClick.checked = config.doubleClickToOpen;
      dom.configDoubleClick.addEventListener("change", () => {
        config.doubleClickToOpen = dom.configDoubleClick.checked;
        saveConfig();
      });
    }

    document.querySelectorAll("[data-config-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.configAction;
        if (action === "apply") {
          if (dom.configDisplayName) updateDisplayName(dom.configDisplayName.value);
          saveConfig();
          playSystemSound("ding");
        } else if (action === "cancel") {
          closeWindow("control-panel");
        } else if (action === "defaults") {
          Object.assign(config, defaults);
          saveConfig();
          location.reload();
        } else if (action === "reset-icons") {
          resetIconPositions();
        }
      });
    });

    if (dom.configDisplayName) {
      dom.configDisplayName.addEventListener("input", () => {
        updateDisplayName(dom.configDisplayName.value);
      });
    }
  }

  function switchSettingsTab(tabName) {
    document.querySelectorAll(".settings-tab").forEach((t) => {
      t.classList.toggle("is-active", t.dataset.settingsTab === tabName);
    });
    document.querySelectorAll(".settings-panel").forEach((p) => {
      const match = p.dataset.settingsPanel === tabName;
      p.classList.toggle("is-active", match);
      p.hidden = !match;
    });
  }

  // ===== Ejecutar =========================================================

  function setupRun() {
    const RUN_MAP = {
      "perfil": "profile",
      "mi perfil": "profile",
      "nacimiento": "birth",
      "cumpleanos": "birth",
      "personalidad": "personality",
      "documentos": "documents",
      "mis documentos": "documents",
      "imagenes": "pictures",
      "mis imagenes": "pictures",
      "mis imágenes": "pictures",
      "fotos": "pictures",
      "musica": "music",
      "música": "music",
      "mi musica": "music",
      "mi música": "music",
      "red": "network",
      "papelera": "recycle",
      "internet": "internet",
      "iexplore": "internet",
      "bloc": "notepad",
      "notepad": "notepad",
      "calc": "calculator",
      "calculadora": "calculator",
      "paint": "paint",
      "mstsc": "messenger",
      "msmsgs": "messenger",
      "wmplayer": "media-player",
      "control": "control-panel",
      "control panel": "control-panel",
      "panel": "control-panel",
      "printers": "printers",
      "impresoras": "printers",
      "ayuda": "help-support",
      "help": "help-support",
      "buscar": "search",
      "search": "search",
      "ejecutar": "run",
      "run": "run",
      "mi pc": "my-computer",
      "mipc": "my-computer",
      "computer": "my-computer",
    };

    function handleRun() {
      const value = dom.runInput ? dom.runInput.value.trim().toLowerCase() : "";
      if (!value) return;
      const mapped = RUN_MAP[value];
      if (mapped) {
        closeWindow("run");
        openWindow(mapped);
      } else if (windowState.has(value)) {
        closeWindow("run");
        openWindow(value);
      } else {
        playSystemSound("error");
        if (dom.runInput) dom.runInput.select();
      }
    }

    if (dom.runAccept) dom.runAccept.addEventListener("click", handleRun);
    if (dom.runCancel) dom.runCancel.addEventListener("click", () => closeWindow("run"));
    if (dom.runBrowse) dom.runBrowse.addEventListener("click", () => openWindow("my-computer"));
    if (dom.runInput) {
      dom.runInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); handleRun(); }
      });
    }
  }

  // ===== Buscar ==========================================================

  function setupSearch() {
    if (!dom.searchInput) return;
    const targets = [
      { id: "profile", label: "Mi perfil", text: "perfil presentacion autobiografia" },
      { id: "birth", label: "Nacimiento", text: "nacimiento fecha lugar cumpleanos" },
      { id: "personality", label: "Personalidad", text: "personalidad rasgos caracter" },
      { id: "pictures", label: "Mis imágenes", text: "imagenes fotos galeria" },
      { id: "music", label: "Mi música", text: "musica canciones" },
      { id: "my-computer", label: "Mi PC", text: "pc equipo sistema" },
      { id: "internet", label: "Internet Explorer", text: "internet navegador web" },
      { id: "control-panel", label: "Panel de control", text: "configuracion ajustes sonido" },
    ];
    dom.searchInput.addEventListener("input", () => {
      const q = dom.searchInput.value.trim().toLowerCase();
      dom.searchResults.innerHTML = "";
      const filter = q ? targets.filter((t) => t.label.toLowerCase().includes(q) || t.text.includes(q)) : targets;
      filter.forEach((t) => {
        const row = document.createElement("div");
        const btn = document.createElement("button");
        btn.className = "sidebar-action";
        btn.type = "button";
        btn.textContent = `» ${t.label}`;
        btn.addEventListener("click", () => openWindow(t.id));
        row.appendChild(btn);
        dom.searchResults.appendChild(row);
      });
    });
  }

  // ===== Navegador interno ================================================

  function setupBrowser() {
    document.querySelectorAll("[data-browser-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.browserAction;
        if (!dom.browserAddress) return;
        const url = dom.browserAddress.value.trim();
        if (action === "go" || action === "refresh") {
          dom.browserPageTitle.textContent = "Visitando...";
          dom.browserPageCopy.textContent = `Simulación: cargando ${url || "una URL"}.`;
          setTimeout(() => {
            dom.browserPageTitle.textContent = "Explorador personal XP";
            dom.browserPageCopy.textContent = url || "Introduce una dirección para navegar.";
          }, 600);
        } else if (action === "home") {
          dom.browserAddress.value = "http://127.0.0.1:3000/";
          dom.browserPageTitle.textContent = "Inicio";
          dom.browserPageCopy.textContent = "Página principal de tu sitio.";
        }
        playSystemSound("ding");
      });
    });
    if (dom.browserAddress) {
      dom.browserAddress.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const btn = document.querySelector("[data-browser-action='go']");
          if (btn) btn.click();
        }
      });
    }
  }

  // ===== Calculadora simple ===============================================

  function setupCalculator() {
    if (!dom.calcDisplay || !dom.calcButtons) return;
    let expr = "";
    const set = (v) => {
      expr = v;
      dom.calcDisplay.value = expr || "0";
    };
    dom.calcButtons.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-calc-key]");
      if (!btn) return;
      const key = btn.dataset.calcKey;
      if (key === "C") { set(""); return; }
      if (key === "back") { set(expr.slice(0, -1)); return; }
      if (key === "=") {
        try {
          const safe = expr.replace(/[^0-9+\-*/().%]/g, "");
          if (!safe) return;
          // eslint-disable-next-line no-new-func
          const result = Function(`"use strict"; return (${safe})`)();
          set(String(Number.isFinite(result) ? result : "Error"));
        } catch (_) {
          set("Error");
        }
        return;
      }
      set(expr + key);
    });
  }

  // ===== Paint (pinceladas sencillas) =====================================

  function setupPaint() {
    if (!dom.paintCanvas) return;
    const ctx = dom.paintCanvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, dom.paintCanvas.width, dom.paintCanvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    let drawing = false;
    function pos(e) {
      const r = dom.paintCanvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) * (dom.paintCanvas.width / r.width),
        y: (e.clientY - r.top) * (dom.paintCanvas.height / r.height),
      };
    }
    dom.paintCanvas.addEventListener("mousedown", (e) => {
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    });
    dom.paintCanvas.addEventListener("mousemove", (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
    document.addEventListener("mouseup", () => { drawing = false; });
  }

  // ===== Arranque =========================================================

  function applyInitialConfig() {
    if (dom.startButtonLabel) dom.startButtonLabel.textContent = config.startLabel;
    if (dom.quickLaunch) dom.quickLaunch.style.display = config.quickLaunch ? "" : "none";
    document.documentElement.style.setProperty("--desktop-icon-size", config.iconSize + "px");
    updateDisplayName(config.displayName);
  }

  function start() {
    applyInitialConfig();
    setupLogin();
    initWindows();
    setupStartMenu();
    setupShutdown();
    setupOpenHandlers();
    setupDesktopIcons();
    setupInputSounds();
    setupContextMenus();
    setupSettings();
    setupRun();
    setupSearch();
    setupBrowser();
    setupCalculator();
    setupPaint();

    tickClock();
    setInterval(tickClock, 1000 * 15);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideContextMenu();
        if (dom.startMenu && !dom.startMenu.hidden) closeStartMenu();
        if (dom.shutdownDialog && !dom.shutdownDialog.hidden) closeShutdownDialog();
      }
      if ((e.key === "d" || e.key === "D") && e.metaKey) {
        e.preventDefault();
        showDesktop();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
