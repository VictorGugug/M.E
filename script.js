/* ============================================================
   Windows XP Personal - Script principal
   Gestiona login, escritorio, ventanas, menu Inicio, sonidos,
   teclado, drag/resize, doble-click, apagar, configuracion.
   ============================================================ */
(function () {
  "use strict";

  // ===== Configuracion persistida =========================================

  const STORAGE_KEY = "xp-personal-config-v3";
  const DEFAULT_AVATAR = "./XP ALL/Windows XP Icon Pack/Windows XP High Resolution Icon Pack/Windows XP Icons/User Accounts.png";
  const defaults = {
    displayName: "Zar",
    accountCreated: true,
    accountName: "Zar",
    accountPassword: "",
    profileSubtitle: "Administrador del equipo",
    profileBio: "Perfil personal de Zar en Windows XP.",
    profileAvatar: DEFAULT_AVATAR,
    mouseVolume: 25,
    keyboardVolume: 10,
    keyboardEnabled: true,
    systemSoundsEnabled: true,
    startLabel: "start",
    quickLaunch: true,
    clockFormat: "24",
    iconSize: 32,
    doubleClickToOpen: true,
    bootTypewriterSpeed: 1,
    desktopGridLock: true,
    hiddenDesktopIcons: {},
    themeMode: "dark",
    fullBootEnabled: true,
    bootTypewriter: true,
    biosText: {
      motherboard: "GIGABYTE B650 EAGLE AX ACPI BIOS Revision F31",
      cpu: "AMD Ryzen 9 7900X 12-Core Processor",
      memoryMb: 32768,
      ramFrequency: "DDR5 6000MT/s CL30 Dual Channel",
      storage: "ADATA Legend 860 1.5TB PCIe SSD",
      gpu: "NVIDIA GeForce RTX 5060",
      cooling: "MSI MAG Coreliquid A360",
      power: "Cooler Master G800 800W 80+ Gold",
      peripherals: "Redragon King M724 Mouse, Redragon Dragonborn K630 Keyboard",
      monitor: "Acteck SP240",
    },
    biosComponents: {
      header: true,
      motherboard: true,
      cpu: true,
      gpu: true,
      ram: true,
      storage: true,
      cooling: true,
      power: true,
      peripherals: true,
      monitor: true,
      dmi: true,
    },
    iconPositions: null,
    lastSession: null,
    adminAuth: false,
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
  config.biosComponents = { ...defaults.biosComponents, ...(config.biosComponents || {}) };
  config.biosText = { ...defaults.biosText, ...(config.biosText || {}) };
  config.hiddenDesktopIcons = { ...defaults.hiddenDesktopIcons, ...(config.hiddenDesktopIcons || {}) };
  if (!config.accountName || config.accountName === "Vick" || config.accountName === "Invitado") config.accountName = "Zar";
  if (!config.displayName || config.displayName === "Vick" || config.displayName === "Invitado") config.displayName = "Zar";
  if (!config.profileAvatar) config.profileAvatar = DEFAULT_AVATAR;
  if (config.startLabel === "inicio") config.startLabel = "start";
  if (!config.themeMode || config.themeMode === "normal") config.themeMode = "dark";

  // ===== Audio ============================================================

  const AUDIO_BASE = {
    click: "click.mp3",
    logon: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Logon Sound.wav",
    logoff: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Logoff Sound.wav",
    startup: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Startup.wav",
    shutdown: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Shutdown.wav",
    error: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Error.wav",
    ding: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Ding.wav",
    minimize: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Minimize.wav",
    restore: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Restore.wav",
    notify: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Notify.wav",
    menu: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Menu Command.wav",
    balloon: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Balloon.wav",
    recycle: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Recycle.wav",
    criticalStop: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Critical Stop.wav",
    exclamation: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Exclamation.wav",
    default: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Default.wav",
    navigationStart: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows Navigation Start.wav",
    popupBlocked: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Pop-up Blocked.wav",
    informationBar: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Information Bar.wav",
    hardwareInsert: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Hardware Insert.wav",
    hardwareRemove: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Hardware Remove.wav",
    printComplete: "XP ALL/all-windows-sounds/(2001) Windows XP/Windows XP Print complete.wav",
    start: "XP ALL/all-windows-sounds/(2001) Windows XP/start.wav",
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
    bootScreen: $("boot-screen"),
    bootBios: $("boot-bios"),
    bootBiosContent: $("boot-bios-content"),
    bootXp: $("boot-xp"),
    bootMemoryCount: $("boot-memory-count"),
    bootStartOption: $("boot-start-option"),

    loginScreen: $("login-screen"),
    loginEmptyPanel: $("login-empty-panel"),
    accountCreateForm: $("account-create-form"),
    createDisplayName: $("create-display-name"),
    createPassword: $("create-password"),
    loginForm: $("login-form"),
    username: $("username"),
    password: $("password"),
    loginStatus: $("login-status"),
    loginUserCaption: $("login-user-caption"),
    loginAvatar: $("login-avatar"),
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
    unsavedSettingsDialog: $("unsaved-settings-dialog"),
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
    profileSubtitle: $("profile-subtitle"),
    profileBio: $("profile-bio"),
    profileAvatarImages: document.querySelectorAll("[data-profile-avatar]"),
    configDisplayName: $("config-display-name"),
    configProfileSubtitle: $("config-profile-subtitle"),
    configProfileBio: $("config-profile-bio"),
    configProfileAvatar: $("config-profile-avatar"),
    configProfileAvatarFile: $("config-profile-avatar-file"),
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
    configDesktopGridLock: $("config-desktop-grid-lock"),
    configThemeMode: $("config-theme-mode"),
    configFullBootEnabled: $("config-full-boot-enabled"),
    configBootTypewriter: $("config-boot-typewriter"),
    configBootTypewriterSpeed: $("config-boot-typewriter-speed"),
    configMusicFolder: $("config-music-folder"),
    configImportFile: $("config-import-file"),
    localMusicConfigStatus: $("local-music-config-status"),

    browserAddress: $("browser-address-input"),
    browserPageTitle: $("browser-page-title"),
    browserPageCopy: $("browser-page-copy"),
    browserHomePage: $("browser-home-page"),
    browserSearchInput: $("browser-search-input"),
    browserFrame: $("browser-frame"),

    searchInput: $("search-input"),
    searchResults: $("search-results"),

    calcDisplay: $("calc-display"),
    calcButtons: $("calc-buttons"),

    paintFrame: $("paint-frame"),
    notepadTextarea: $("notepad-textarea"),
    wordpadArea: document.querySelector(".wordpad-area"),
    cmdScreen: $("cmd-screen"),
    cmdOutput: $("cmd-output"),
    cmdForm: $("cmd-form"),
    cmdInput: $("cmd-input"),
    pongCanvas: $("pong-canvas"),
    pongScore: $("pong-score"),

    wmpStatus: $("wmp-status"),
    wmpCover: $("wmp-cover"),
    wmpTrackTitle: $("wmp-track-title"),
    wmpTrackArtist: $("wmp-track-artist"),
    wmpTrackProgress: $("wmp-track-progress"),
    wmpArtistsList: $("wmp-artists-list"),
    wmpLibraryTitle: $("wmp-library-title"),
    wmpLibrary: $("wmp-library"),
    localMusicAudio: $("local-music-audio"),
    localLyrics: $("local-lyrics"),
    nowPlayingWidget: $("now-playing-widget"),
    nowPlayingCover: $("now-playing-cover"),
    nowPlayingTitle: $("now-playing-title"),
    nowPlayingArtist: $("now-playing-artist"),
    nowPlayingProgress: $("now-playing-progress"),
    cmdMusicStatus: $("cmd-music-status"),
  };

  // ===== Estado ===========================================================

  const windowState = new Map(); // windowId -> { element, minimized, maximized, lastRect, zIndex }
  const taskbarButtons = new Map();
  let zIndexCursor = 100;
  const ICON_GRID = { left: 10, top: 10, col: 96, row: 82 };
  const APP_STORAGE_KEYS = {
    notepad: "xp-personal-notepad-v1",
    wordpad: "xp-personal-wordpad-v1",
  };
  let settingsDraft = null;
  let settingsDirty = false;

  // ===== Utilidades =======================================================

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((el) => {
      el.classList.toggle("screen--active", el.id === name);
      el.hidden = el.id !== name;
    });
  }

  function updateDisplayName(name) {
    const clean = (name || "").trim() || "Zar";
    config.displayName = clean;
    if (config.accountCreated) config.accountName = clean;
    if (dom.startUserName) dom.startUserName.textContent = clean;
    if (dom.loginUserCaption) dom.loginUserCaption.textContent = clean;
    if (dom.profileName) dom.profileName.textContent = clean;
    if (dom.configDisplayName) dom.configDisplayName.value = clean;
    if (dom.configUserDisplay) dom.configUserDisplay.textContent = clean;
    saveConfig();
  }

  function applyProfileDetails() {
    const avatar = config.profileAvatar || DEFAULT_AVATAR;
    document.querySelectorAll("[data-profile-avatar]").forEach((img) => {
      img.src = avatar;
    });
    if (dom.profileSubtitle) dom.profileSubtitle.textContent = config.profileSubtitle || defaults.profileSubtitle;
    if (dom.profileBio) dom.profileBio.textContent = config.profileBio || defaults.profileBio;
    if (dom.configProfileSubtitle) dom.configProfileSubtitle.value = config.profileSubtitle || defaults.profileSubtitle;
    if (dom.configProfileBio) dom.configProfileBio.value = config.profileBio || defaults.profileBio;
  }

  // ===== Boot =============================================================

  let bootTimers = [];
  let bootFinished = false;
  let bootMenuTouched = false;

  function clearBootTimers() {
    bootTimers.forEach((timer) => clearTimeout(timer));
    bootTimers = [];
  }

  function setBootPhase(phase) {
    if (!dom.bootScreen) return;
    dom.bootScreen.dataset.bootPhase = phase;
    if (dom.bootBios) dom.bootBios.hidden = phase !== "bios";
    if (dom.bootXp) dom.bootXp.hidden = phase !== "xp";
  }

  function applyBiosComponentVisibility() {
    document.querySelectorAll("[data-bios-component]").forEach((el) => {
      const component = el.dataset.biosComponent;
      el.hidden = config.biosComponents[component] === false;
    });
  }

  function updateBootBiosText() {
    const bios = { ...defaults.biosText, ...(config.biosText || {}) };
    const setLine = (name, text) => {
      const el = document.querySelector(`[data-bios-line="${name}"]`);
      if (el) el.textContent = text;
    };
    setLine("motherboard", bios.motherboard);
    setLine("cpu", `Main Processor : ${bios.cpu}`);
    setLine("ramFrequency", `Memory Frequency : ${bios.ramFrequency}`);
    setLine("storage", `NVMe Device 0 : ${bios.storage}`);
    setLine("gpu", `Display Adapter : ${bios.gpu}`);
    setLine("cooling", `Cooling System : ${bios.cooling}`);
    setLine("power", `Power Supply   : ${bios.power}`);
    setLine("peripherals", `USB Devices : ${bios.peripherals}`);
    setLine("monitor", `Monitor     : ${bios.monitor}`);
  }

  function applyBootTypingDelays() {
    if (!dom.bootBiosContent) return;
    const speed = Math.max(0.4, Number(config.bootTypewriterSpeed || 1));
    const items = Array.from(dom.bootBiosContent.querySelectorAll("p, .boot-menu"))
      .filter((el) => !el.hidden);
    items.forEach((el, index) => {
      el.style.setProperty("--boot-type-delay", `${Math.min(index * (0.08 / speed), 2.6)}s`);
    });
    dom.bootBiosContent.style.setProperty("--boot-type-speed", String(speed));
    dom.bootScreen.classList.toggle("boot-screen--typing", Boolean(config.bootTypewriter));
  }

  function finishBoot() {
    if (bootFinished) return;
    bootFinished = true;
    clearBootTimers();
    if (dom.bootScreen) dom.bootScreen.classList.remove("boot-screen--skip", "boot-screen--awaiting-input");
    if (dom.bootXp) {
      dom.bootXp.classList.add("boot-xp--fadeout");
    }
    renderLoginState();
    bootTimers.push(setTimeout(() => showScreen("login-screen"), 180));
    if (config.accountCreated && dom.password) dom.password.focus();
    if (!config.accountCreated && dom.createDisplayName) dom.createDisplayName.focus();
  }

  function startBootSequence() {
    bootFinished = false;
    bootMenuTouched = false;
    clearBootTimers();
    updateBootBiosText();
    applyBiosComponentVisibility();
    applyBootTypingDelays();
    if (dom.bootScreen) dom.bootScreen.classList.remove("boot-screen--skip", "boot-screen--awaiting-input");
    showScreen("boot-screen");

    const totalMemory = Math.max(1024, Number(config.biosText?.memoryMb || defaults.biosText.memoryMb));
    if (!config.fullBootEnabled) {
      if (dom.bootMemoryCount) dom.bootMemoryCount.textContent = totalMemory.toLocaleString();
      if (dom.bootScreen) dom.bootScreen.classList.add("boot-screen--skip");
      setBootPhase("xp");
      bootTimers.push(setTimeout(() => finishBoot(), 1350));
      return;
    }

    setBootPhase("bios");
    setBootMenuSelection("normal");

    const startTime = performance.now();
    function stepMemory(now) {
      if (bootFinished || !dom.bootMemoryCount) return;
      const progress = Math.min((now - startTime) / 1500, 1);
      dom.bootMemoryCount.textContent = Math.floor(progress * totalMemory).toLocaleString();
      if (progress < 1) requestAnimationFrame(stepMemory);
      else dom.bootMemoryCount.textContent = totalMemory.toLocaleString();
    }
    requestAnimationFrame(stepMemory);

    bootTimers.push(setTimeout(() => {
      if (dom.bootScreen) dom.bootScreen.classList.add("boot-screen--awaiting-input");
    }, config.bootTypewriter ? 3400 : 2600));
  }

  function getBootOptions() {
    return Array.from(document.querySelectorAll("[data-boot-option]"));
  }

  function setBootMenuSelection(option) {
    const options = getBootOptions();
    if (!options.length) return;
    const selected = options.some((btn) => btn.dataset.bootOption === option) ? option : "normal";
    options.forEach((btn) => {
      btn.classList.toggle("is-selected", btn.dataset.bootOption === selected);
      btn.setAttribute("aria-pressed", String(btn.dataset.bootOption === selected));
    });
  }

  function moveBootMenuSelection(delta) {
    const options = getBootOptions();
    if (!options.length) return;
    const current = Math.max(0, options.findIndex((btn) => btn.classList.contains("is-selected")));
    const next = (current + delta + options.length) % options.length;
    bootMenuTouched = true;
    setBootMenuSelection(options[next].dataset.bootOption);
  }

  function continueFromBootMenu() {
    if (bootFinished || !dom.bootScreen || dom.bootScreen.hidden) return;
    if (!bootMenuTouched) {
      if (dom.bootScreen) dom.bootScreen.classList.add("boot-screen--must-select");
      playSystemSound("ding");
      return;
    }
    if (dom.bootScreen) dom.bootScreen.classList.remove("boot-screen--must-select");
    const selected = document.querySelector("[data-boot-option].is-selected");
    if (!selected) return;
    const option = selected.dataset.bootOption;
    if (option === "bios") {
      config.fullBootEnabled = true;
      saveConfig();
    } else if (option === "peripherals") {
      showPeripheralsModal();
      return;
    }
    playSystemSound("start");
    setBootPhase("xp");
    clearBootTimers();
    bootTimers.push(setTimeout(() => finishBoot(), 2600));
  }

  function showPeripheralsModal() {
    const modal = document.getElementById("bios-peripherals-modal");
    if (!modal) return;
    const mouseSelect = document.getElementById("peripheral-mouse");
    const keyboardSelect = document.getElementById("peripheral-keyboard");
    const monitorSelect = document.getElementById("peripheral-monitor");
    if (mouseSelect) mouseSelect.value = config.biosText?.peripherals?.split(",")[0]?.trim() || "Redragon King M724";
    if (keyboardSelect) keyboardSelect.value = config.biosText?.peripherals?.split(",")[1]?.trim() || "Redragon Dragonborn K630";
    if (monitorSelect) monitorSelect.value = config.biosText?.monitor || "Acteck SP240";
    modal.hidden = false;
  }

  function hidePeripheralsModal() {
    const modal = document.getElementById("bios-peripherals-modal");
    if (modal) modal.hidden = true;
  }

  function applyPeripheralsSettings() {
    const mouse = document.getElementById("peripheral-mouse")?.value || "Redragon King M724";
    const keyboard = document.getElementById("peripheral-keyboard")?.value || "Redragon Dragonborn K630";
    const monitor = document.getElementById("peripheral-monitor")?.value || "Acteck SP240";
    config.biosText = config.biosText || {};
    config.biosText.peripherals = `${mouse}, ${keyboard}`;
    config.biosText.monitor = monitor;
    saveConfig();
    updateBootBiosText();
    hidePeripheralsModal();
    playSystemSound("start");
  }

  function setupBootPeripherals() {
    const applyBtn = document.getElementById("bios-peripherals-apply");
    const cancelBtn = document.getElementById("bios-peripherals-cancel");
    if (applyBtn) applyBtn.addEventListener("click", applyPeripheralsSettings);
    if (cancelBtn) cancelBtn.addEventListener("click", hidePeripheralsModal);
  }

  function setupBoot() {
    getBootOptions().forEach((btn) => {
      btn.addEventListener("click", () => {
        bootMenuTouched = true;
        setBootMenuSelection(btn.dataset.bootOption);
        const option = btn.dataset.bootOption;
        if (option === "peripherals") {
          showPeripheralsModal();
        } else {
          continueFromBootMenu();
        }
      });
    });
    window.addEventListener("keydown", (e) => {
      if (bootFinished || !dom.bootScreen || dom.bootScreen.hidden) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveBootMenuSelection(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveBootMenuSelection(-1);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const selected = document.querySelector("[data-boot-option].is-selected");
        if (selected && selected.dataset.bootOption === "peripherals") {
          showPeripheralsModal();
        } else {
          continueFromBootMenu();
        }
      }
    });
    setupBootPeripherals();
    startBootSequence();
  }

  // ===== Login ============================================================

  let isAdminAuthenticated = false;

  function toggleProfileVisibility(visible) {
    isAdminAuthenticated = visible;
    config.adminAuth = visible;
    saveConfig();
    document.querySelectorAll(".profile-restricted").forEach((el) => {
      el.classList.toggle("visible", visible);
    });
    document.querySelectorAll(".profile-window").forEach((el) => {
      el.classList.toggle("unlocked", visible);
    });
  }

  function renderLoginState() {
    const hasAccount = Boolean(config.accountCreated);
    if (dom.loginEmptyPanel) dom.loginEmptyPanel.hidden = hasAccount;
    if (dom.userTile) dom.userTile.hidden = !hasAccount;
    if (dom.loginForm) dom.loginForm.hidden = !hasAccount;
    if (dom.loginUserCaption) dom.loginUserCaption.textContent = config.accountName || "Zar";
    if (dom.loginStatus) {
      dom.loginStatus.textContent = hasAccount
        ? "Haz clic en tu nombre de usuario para iniciar sesión."
        : "Crea tu cuenta para continuar.";
    }
    if (dom.password) dom.password.value = "";
    if (dom.createDisplayName && !hasAccount) dom.createDisplayName.value = config.accountName || "Zar";
  }

  function createAccount() {
    const requestedName = dom.createDisplayName ? dom.createDisplayName.value.trim() : "";
    const accountName = requestedName || "Zar";
    config.accountCreated = true;
    config.accountName = accountName;
    config.accountPassword = dom.createPassword ? dom.createPassword.value : "";
    config.adminAuth = true;
    updateDisplayName(accountName);
    renderLoginState();
    playSystemSound("ding");
    if (dom.loginStatus) dom.loginStatus.textContent = "Cuenta creada. Haz clic en tu usuario para iniciar sesión.";
    if (dom.password) dom.password.focus();
  }

  function setupMediaPlayer() {
    setupMediaPlayerControls();
    setupLocalMusicPlayer();
    window.mediaPlayer = {
      refresh: setupLocalMusicPlayer,
      pause: toggleLocalPlayback,
      resume: toggleLocalPlayback,
      next: () => playLocalSong(localMusicState.currentIndex + 1, true),
      previous: () => playLocalSong(localMusicState.currentIndex - 1, true),
      play: (index) => playLocalSong(Number(index || 0), true),
    };
  }

  const wmpState = {
    view: "local",
  };

  const localMusicState = {
    songs: [],
    currentIndex: 0,
    lyrics: [],
    lyricsVisible: true,
    loaded: false,
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function localMusicUrl(src) {
    return `NHB/${String(src || "").split("/").map(encodeURIComponent).join("/")}`;
  }

  function lrcUrlForSong(song) {
    const src = String(song?.src || "");
    return src.replace(/\.[^/.]+$/, ".lrc");
  }

  function isDefaultLocalCover(src) {
    return /(^|\/)favicon1\.png(?:$|\?)/i.test(String(src || ""));
  }

  function songCover(song) {
    if (!song) return "./XP ALL/Windows XP Icon Pack/Windows XP High Resolution Icon Pack/Windows XP Icons/Audio CD.png";
    if (song.easterEgg) return localMusicUrl(song.easterEgg);
    return song.image || "./XP ALL/Windows XP Icon Pack/Windows XP High Resolution Icon Pack/Windows XP Icons/Audio CD.png";
  }

  function parseLrc(text) {
    return String(text || "")
      .split(/\r?\n/)
      .flatMap((line) => {
        const tags = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
        const lyric = line.replace(/\[[^\]]+\]/g, "").trim();
        return tags.map((tag) => ({
          time: Number(tag[1]) * 60 + Number(tag[2]) + Number(`0.${(tag[3] || "0").padEnd(3, "0")}`),
          text: lyric || " ",
        }));
      })
      .sort((a, b) => a.time - b.time);
  }

  function decodeId3Text(bytes, encoding = 0) {
    const data = bytes[bytes.length - 1] === 0 ? bytes.slice(0, -1) : bytes;
    try {
      if (encoding === 1 || encoding === 2) return new TextDecoder("utf-16").decode(data).replace(/\0/g, "").trim();
      if (encoding === 3) return new TextDecoder("utf-8").decode(data).replace(/\0/g, "").trim();
      return new TextDecoder("iso-8859-1").decode(data).replace(/\0/g, "").trim();
    } catch (_) {
      return "";
    }
  }

  function synchsafeSize(bytes, offset) {
    return ((bytes[offset] & 0x7f) << 21) | ((bytes[offset + 1] & 0x7f) << 14) | ((bytes[offset + 2] & 0x7f) << 7) | (bytes[offset + 3] & 0x7f);
  }

  async function readMp3Metadata(song) {
    try {
      const response = await fetch(song.src, { headers: { Range: "bytes=0-524287" }, cache: "force-cache" });
      if (!response.ok && response.status !== 206) return song;
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return song;
      const version = bytes[3];
      const tagEnd = Math.min(bytes.length, 10 + synchsafeSize(bytes, 6));
      let offset = 10;
      const meta = {};
      while (offset + 10 <= tagEnd) {
        const id = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
        if (!/^[A-Z0-9]{4}$/.test(id)) break;
        const size = version >= 4 ? synchsafeSize(bytes, offset + 4) : ((bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | (bytes[offset + 6] << 8) | bytes[offset + 7]);
        if (!size || offset + 10 + size > bytes.length) break;
        const frame = bytes.slice(offset + 10, offset + 10 + size);
        if (["TIT2", "TPE1", "TALB", "TDRC", "TYER"].includes(id)) {
          const value = decodeId3Text(frame.slice(1), frame[0]);
          if (id === "TIT2" && value) meta.title = value;
          if (id === "TPE1" && value) meta.artist = value;
          if (id === "TALB" && value) meta.album = value;
          if ((id === "TDRC" || id === "TYER") && value) meta.year = value.slice(0, 4);
        }
        if (id === "APIC" && !meta.image) {
          const encoding = frame[0];
          let pos = 1;
          while (pos < frame.length && frame[pos] !== 0) pos += 1;
          const mime = new TextDecoder("iso-8859-1").decode(frame.slice(1, pos)) || "image/jpeg";
          pos += 2;
          const descTerminator = encoding === 0 || encoding === 3 ? [0] : [0, 0];
          while (pos < frame.length - descTerminator.length && !descTerminator.every((b, i) => frame[pos + i] === b)) pos += 1;
          pos += descTerminator.length;
          if (pos < frame.length) meta.image = URL.createObjectURL(new Blob([frame.slice(pos)], { type: mime }));
        }
        offset += 10 + size;
      }
      return { ...song, ...meta };
    } catch (_) {
      return song;
    }
  }

  async function enrichLocalMetadata(songs) {
    return Promise.all(songs.map((song) => readMp3Metadata(song)));
  }

  async function setupLocalMusicPlayer() {
    if (!dom.localMusicAudio) return;
    dom.localMusicAudio.volume = 0.75;
    if (!dom.localMusicAudio.dataset.ready) {
      dom.localMusicAudio.dataset.ready = "true";
      dom.localMusicAudio.addEventListener("timeupdate", () => {
        updateLocalProgress();
        renderLocalLyrics(dom.localMusicAudio.currentTime);
      });
      dom.localMusicAudio.addEventListener("loadedmetadata", updateLocalProgress);
      dom.localMusicAudio.addEventListener("play", () => updateLocalStatus("Reproduciendo."));
      dom.localMusicAudio.addEventListener("pause", () => updateLocalStatus("Pausado."));
      dom.localMusicAudio.addEventListener("ended", () => playLocalSong(localMusicState.currentIndex + 1, true));
    }
    try {
      const response = await fetch("NHB/songs.json", { cache: "force-cache" });
      if (!response.ok) throw new Error("No songs.json");
      updateLocalStatus("Leyendo biblioteca local...");
      const baseSongs = (await response.json()).map((song) => ({
        ...song,
        src: localMusicUrl(song.src),
        image: localMusicUrl(song.easterEgg || song.image || "mus/favicon1.png"),
      }));
      localMusicState.songs = baseSongs;
      localMusicState.loaded = true;
      setWmpView("local");
      if (localMusicState.songs.length) playLocalSong(localMusicState.currentIndex, false);
      renderWmpArtists();
      updateLocalStatus(`${localMusicState.songs.length} canciones locales listas.`);
      renderWmpLibrary();
      enrichLocalMetadata(baseSongs).then((enriched) => {
        localMusicState.songs = enriched.map((song, index) => ({
          ...song,
          title: baseSongs[index]?.title || song.title,
          artist: baseSongs[index]?.artist || song.artist,
          album: baseSongs[index]?.album || song.album,
          year: baseSongs[index]?.year || song.year,
          image: song.image && !isDefaultLocalCover(baseSongs[index]?.image) ? baseSongs[index].image : song.image,
          easterEgg: baseSongs[index]?.easterEgg || song.easterEgg,
          theme: baseSongs[index]?.theme || song.theme,
        }));
        renderWmpArtists();
        renderWmpLibrary();
      }).catch(() => {});
    } catch (_) {
      localMusicState.loaded = true;
      localMusicState.songs = [];
      updateLocalStatus("No se pudo cargar NHB/songs.json.");
    }
  }

  function updateLocalStatus(message) {
    if (dom.wmpStatus) dom.wmpStatus.textContent = message;
    if (dom.localMusicConfigStatus) dom.localMusicConfigStatus.textContent = message;
    if (dom.cmdMusicStatus) dom.cmdMusicStatus.textContent = `Música local: ${message}`;
  }

  async function loadLocalLyrics(song) {
    localMusicState.lyrics = [];
    if (!song) return;
    try {
      const response = await fetch(lrcUrlForSong(song), { cache: "force-cache" });
      if (!response.ok) throw new Error("No lyrics");
      localMusicState.lyrics = parseLrc(await response.text());
    } catch (_) {
      localMusicState.lyrics = [];
    }
    renderLocalLyrics(dom.localMusicAudio?.currentTime || 0, true);
  }

  function renderLocalLyrics(currentTime = 0, force = false) {
    if (!dom.localLyrics) return;
    dom.localLyrics.hidden = !localMusicState.lyricsVisible;
    if (!localMusicState.lyricsVisible) return;
    if (!localMusicState.lyrics.length) {
      dom.localLyrics.innerHTML = "<p>Sin letra sincronizada.</p>";
      return;
    }
    let active = 0;
    localMusicState.lyrics.forEach((line, index) => {
      if (line.time <= currentTime) active = index;
    });
    if (!force && dom.localLyrics.dataset.active === String(active)) return;
    dom.localLyrics.dataset.active = String(active);
    dom.localLyrics.innerHTML = localMusicState.lyrics
      .map((line, index) => `<button type="button" class="lyric-line${index === active ? " is-active" : ""}" data-lyric-time="${line.time}">${escapeHtml(line.text)}</button>`)
      .join("");
    const activeLine = dom.localLyrics.querySelector(".lyric-line.is-active");
    if (activeLine) activeLine.scrollIntoView({ block: "center", behavior: force ? "auto" : "smooth" });
  }

  function updateLocalProgress() {
    const audio = dom.localMusicAudio;
    if (!audio || !audio.duration) return;
    const progress = Math.round((audio.currentTime / audio.duration) * 100);
    [dom.wmpTrackProgress, dom.nowPlayingProgress].forEach((input) => {
    if (input) {
        input.value = String(progress);
        input.dataset.duration = String(audio.duration * 1000);
        input.dataset.local = "true";
      }
    });
  }

  async function playLocalSong(index = localMusicState.currentIndex, autoPlay = true) {
    if (!dom.localMusicAudio || !localMusicState.songs.length) return;
    if (index < 0) index = localMusicState.songs.length - 1;
    if (index >= localMusicState.songs.length) index = 0;
    localMusicState.currentIndex = index;
    const song = localMusicState.songs[index];
    dom.localMusicAudio.src = song.src;
    updateNowPlaying({
      item: {
        name: song.title || "Canción local",
        artists: [{ name: song.artist || "Artista desconocido" }],
        album: { name: song.album || "", images: [{ url: songCover(song) }] },
        duration_ms: Number(dom.localMusicAudio.duration || 0) * 1000,
      },
      progress_ms: 0,
      is_playing: autoPlay,
      local: true,
    });
    await loadLocalLyrics(song);
    renderWmpArtists();
    renderWmpLibrary();
    if (autoPlay) dom.localMusicAudio.play().catch(() => updateLocalStatus("Pulsa Play otra vez para activar audio."));
  }

  function toggleLocalPlayback() {
    if (!dom.localMusicAudio) return;
    if (!dom.localMusicAudio.src) {
      playLocalSong(localMusicState.currentIndex, true);
      return;
    }
    if (dom.localMusicAudio.paused) dom.localMusicAudio.play().catch(() => {});
    else dom.localMusicAudio.pause();
  }

  function renderLocalMusicLibrary() {
    if (!dom.wmpLibrary || !dom.wmpLibraryTitle) return;
    dom.wmpLibraryTitle.textContent = "Canciones locales";
    if (!localMusicState.loaded) {
      dom.wmpLibrary.innerHTML = "<div class=\"wmp-empty\">Cargando canciones de NHB...</div>";
      return;
    }
    dom.wmpLibrary.innerHTML = localMusicState.songs.length
      ? localMusicState.songs.map((song, index) => localSongButton(song, index)).join("")
      : "<div class=\"wmp-empty\">No se pudo cargar NHB/songs.json.</div>";
  }

  function localSongButton(song, index) {
    return `
      <button class="wmp-card local-song-card${index === localMusicState.currentIndex ? " is-active" : ""}" type="button" data-local-song="${index}">
        <img src="${escapeHtml(songCover(song))}" alt="">
        <span>
          <strong>${escapeHtml(song.title)}</strong>
          <small>${escapeHtml(song.artist || "Artista desconocido")}</small>
          <small>${escapeHtml(song.album || "Álbum desconocido")}${song.year ? ` · ${escapeHtml(song.year)}` : ""}</small>
        </span>
      </button>`;
  }

  function setWmpView(view) {
    wmpState.view = view;
    document.querySelectorAll("[data-wmp-view]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.wmpView === view);
    });
    renderWmpLibrary();
  }

  function renderWmpEmptyState() {
    updateNowPlaying(null);
    updateLocalStatus("Biblioteca local.");
    if (dom.wmpArtistsList) dom.wmpArtistsList.innerHTML = "<p>Cargando artistas locales...</p>";
    renderLocalMusicLibrary();
  }

  function updateNowPlaying(playback) {
    const track = playback && playback.item;
    const image = track?.album?.images?.[0]?.url || "./XP ALL/Windows XP Icon Pack/Windows XP High Resolution Icon Pack/Windows XP Icons/Audio CD.png";
    const title = track?.name || "Nada reproduciéndose";
    const artist = track?.artists?.map((a) => a.name).join(", ") || "Canciones locales desde NHB";
    const duration = Number(track?.duration_ms || 0);
    const progress = duration ? Math.round((Number(playback?.progress_ms || 0) / duration) * 100) : 0;

    if (dom.wmpCover) dom.wmpCover.src = image;
    if (dom.wmpTrackTitle) dom.wmpTrackTitle.textContent = title;
    if (dom.wmpTrackArtist) dom.wmpTrackArtist.textContent = artist;
    if (dom.wmpTrackProgress) {
      dom.wmpTrackProgress.value = String(progress);
      dom.wmpTrackProgress.dataset.duration = String(duration);
      dom.wmpTrackProgress.dataset.local = playback?.local ? "true" : "false";
    }
    if (dom.nowPlayingWidget) dom.nowPlayingWidget.classList.toggle("is-empty", !track);
    if (dom.nowPlayingCover) dom.nowPlayingCover.src = image;
    if (dom.nowPlayingTitle) dom.nowPlayingTitle.textContent = title;
    if (dom.nowPlayingArtist) dom.nowPlayingArtist.textContent = artist;
    if (dom.nowPlayingProgress) {
      dom.nowPlayingProgress.value = String(progress);
      dom.nowPlayingProgress.dataset.duration = String(duration);
      dom.nowPlayingProgress.dataset.local = playback?.local ? "true" : "false";
    }
  }

  function renderWmpArtists() {
    if (!dom.wmpArtistsList) return;
    const artists = [...new Set(localMusicState.songs.map((song) => song.artist).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    if (!artists.length) {
      dom.wmpArtistsList.innerHTML = "<p>No hay artistas locales.</p>";
      return;
    }
    dom.wmpArtistsList.innerHTML = artists
      .map((artist) => `<button type="button" data-local-filter-artist="${escapeHtml(artist)}">${escapeHtml(artist)}</button>`)
      .join("");
  }

  function renderWmpLibrary() {
    if (!dom.wmpLibrary || !dom.wmpLibraryTitle) return;
    const view = wmpState.view;
    if (view === "artists") {
      dom.wmpLibraryTitle.textContent = "Artistas";
      const artists = [...new Set(localMusicState.songs.map((song) => song.artist).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      dom.wmpLibrary.innerHTML = artists.length
        ? artists.map((artist) => `<button class="wmp-card wmp-card--list" type="button" data-local-filter-artist="${escapeHtml(artist)}"><span><strong>${escapeHtml(artist)}</strong><small>${localMusicState.songs.filter((song) => song.artist === artist).length} canciones</small></span></button>`).join("")
        : "<div class=\"wmp-empty\">No hay artistas para mostrar.</div>";
      return;
    }
    if (view === "local") {
      renderLocalMusicLibrary();
      return;
    }
    if (view === "albums") {
      dom.wmpLibraryTitle.textContent = "Álbumes";
      const albums = [...new Set(localMusicState.songs.map((song) => song.album).filter(Boolean))].sort((a, b) => a.localeCompare(b));
      dom.wmpLibrary.innerHTML = albums.length
        ? albums.map((album) => `<button class="wmp-card wmp-card--list" type="button" data-local-filter-album="${escapeHtml(album)}"><span><strong>${escapeHtml(album)}</strong><small>${localMusicState.songs.filter((song) => song.album === album).length} canciones</small></span></button>`).join("")
        : "<div class=\"wmp-empty\">No hay álbumes para mostrar.</div>";
      return;
    }
    if (view === "now") {
      dom.wmpLibraryTitle.textContent = "Reproducción actual";
      const item = localMusicState.songs[localMusicState.currentIndex];
      dom.wmpLibrary.innerHTML = item
        ? `<div class="wmp-now-detail"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.artist || "")}</p><p>${escapeHtml(item.album || "")}</p><p>${escapeHtml(item.year || "")}</p></div>`
        : "<div class=\"wmp-empty\">No hay reproducción activa.</div>";
      return;
    }
    renderLocalMusicLibrary();
  }

  function setupMediaPlayerControls() {
    document.addEventListener("click", (e) => {
      const viewButton = e.target.closest("[data-wmp-view]");
      if (viewButton) setWmpView(viewButton.dataset.wmpView);

      const localSong = e.target.closest("[data-local-song]");
      if (localSong) playLocalSong(Number(localSong.dataset.localSong || 0), true);

      const localAction = e.target.closest("[data-local-action]");
      if (localAction) {
        const action = localAction.dataset.localAction;
        if (action === "play") toggleLocalPlayback();
        if (action === "previous") playLocalSong(localMusicState.currentIndex - 1, true);
        if (action === "next") playLocalSong(localMusicState.currentIndex + 1, true);
        if (action === "refresh") setupLocalMusicPlayer();
        if (action === "lyrics") {
          localMusicState.lyricsVisible = !localMusicState.lyricsVisible;
          renderLocalLyrics(dom.localMusicAudio?.currentTime || 0, true);
        }
      }

      const artistFilter = e.target.closest("[data-local-filter-artist]");
      if (artistFilter && dom.wmpLibrary) {
        const artist = artistFilter.dataset.localFilterArtist;
        dom.wmpLibraryTitle.textContent = artist;
        dom.wmpLibrary.innerHTML = localMusicState.songs
          .map((song, index) => ({ song, index }))
          .filter((entry) => entry.song.artist === artist)
          .map((entry) => localSongButton(entry.song, entry.index))
          .join("");
      }

      const albumFilter = e.target.closest("[data-local-filter-album]");
      if (albumFilter && dom.wmpLibrary) {
        const album = albumFilter.dataset.localFilterAlbum;
        dom.wmpLibraryTitle.textContent = album;
        dom.wmpLibrary.innerHTML = localMusicState.songs
          .map((song, index) => ({ song, index }))
          .filter((entry) => entry.song.album === album)
          .map((entry) => localSongButton(entry.song, entry.index))
          .join("");
      }

      const lyricLine = e.target.closest("[data-lyric-time]");
      if (lyricLine && dom.localMusicAudio) {
        dom.localMusicAudio.currentTime = Number(lyricLine.dataset.lyricTime || 0);
        dom.localMusicAudio.play().catch(() => {});
      }
    });

    [dom.wmpTrackProgress, dom.nowPlayingProgress].forEach((input) => {
      if (input) input.addEventListener("change", () => {
        if (dom.localMusicAudio?.duration) {
          dom.localMusicAudio.currentTime = (Number(input.value || 0) / 100) * dom.localMusicAudio.duration;
        }
      });
    });
  }

  function setupLogin() {
    // Restaurar autenticación anterior si existe
    if (config.accountCreated && config.adminAuth) {
      isAdminAuthenticated = true;
      toggleProfileVisibility(true);
    } else {
      toggleProfileVisibility(false);
    }

    if (window.location.protocol === "file:" && dom.protocolNotice) {
      dom.protocolNotice.hidden = false;
    }
    if (config.accountCreated) {
      updateDisplayName(config.accountName || config.displayName || "Zar");
    }
    renderLoginState();
    if (dom.accountCreateForm) {
      dom.accountCreateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        createAccount();
      });
    }
    if (dom.userTile) {
      dom.userTile.addEventListener("click", () => {
        if (config.accountPassword) {
          if (dom.password) dom.password.focus();
        } else {
          doLogin();
        }
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
    const password = dom.password ? dom.password.value.trim() : "";

    if (!config.accountCreated) {
      createAccount();
      return;
    }

    if (config.accountPassword && password !== config.accountPassword) {
      playSystemSound("criticalStop");
      if (dom.loginStatus) dom.loginStatus.textContent = "La contraseña es incorrecta. Inténtalo de nuevo.";
      if (dom.password) {
        dom.password.select();
        dom.password.focus();
      }
      return;
    }

    toggleProfileVisibility(true);
    updateDisplayName(config.accountName || "Zar");
    playSystemSound("logon");
    showScreen("desktop-screen");
    if (config.desktopGridLock) snapAllDesktopIcons();
    playSystemSound("startup");
  }

  function doLogoff() {
    playSystemSound("logoff");
    closeAllWindows();
    closeStartMenu();
    toggleProfileVisibility(false);
    renderLoginState();
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
    fitWindowToViewport(element);
    bringToFront(id);
    updateTaskbar();
    if (wasHidden) {
      if (id === "control-panel") beginSettingsSession();
      const soundByWindow = {
        internet: "navigationStart",
        recycle: "recycle",
        printers: "printComplete",
        network: "hardwareInsert",
        "media-player": "start",
        music: "start",
        email: "notify",
        run: "default",
        search: "informationBar",
      };
      playSystemSound(soundByWindow[id] || "menu");
      const autofocus = element.querySelector("[data-autofocus]");
      if (autofocus) {
        setTimeout(() => autofocus.focus(), 10);
      }
    }
    if (options && options.tab) {
      switchSettingsTab(options.tab);
    }
  }

  function fitWindowToViewport(element) {
    if (!dom.windowLayer || element.classList.contains("is-maximized")) return;
    const layerRect = dom.windowLayer.getBoundingClientRect();
    if (!layerRect.width || !layerRect.height) return;

    const margin = 8;
    const maxWidth = Math.max(280, layerRect.width - margin * 2);
    const maxHeight = Math.max(180, layerRect.height - margin * 2);
    let rect = element.getBoundingClientRect();

    if (rect.width > maxWidth) element.style.width = maxWidth + "px";
    if (rect.height > maxHeight) element.style.height = maxHeight + "px";

    rect = element.getBoundingClientRect();
    const currentLeft = parseFloat(element.style.left) || 0;
    const currentTop = parseFloat(element.style.top) || 0;
    const maxLeft = Math.max(margin, layerRect.width - rect.width - margin);
    const maxTop = Math.max(margin, layerRect.height - rect.height - margin);

    element.style.left = Math.min(Math.max(margin, currentLeft), maxLeft) + "px";
    element.style.top = Math.min(Math.max(margin, currentTop), maxTop) + "px";
  }

  function closeWindow(id, options = {}) {
    const state = windowState.get(id);
    if (!state) return;
    if (id === "control-panel" && settingsDirty && !options.force) {
      showUnsavedSettingsDialog();
      return;
    }
    if ((id === "notepad" || id === "wordpad") && !options.force) {
      const textarea = id === "notepad" ? dom.notepadTextarea : dom.wordpadArea;
      const storageKey = id === "notepad" ? APP_STORAGE_KEYS.notepad : APP_STORAGE_KEYS.wordpad;
      if (textarea && localStorage.getItem(storageKey) !== textarea.value) {
        const confirmClose = confirm("El documento tiene cambios sin guardar. ¿Cerrar de todas formas?");
        if (!confirmClose) return;
      }
    }
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
    win.classList.add("is-dragging");

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
      win.classList.remove("is-dragging");
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
    const anyWindowOpen = Array.from(windowState.values()).some((state) => !state.element.hidden && !state.minimized);
    document.body.classList.toggle("has-open-window", anyWindowOpen);
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
    playSystemSound("exclamation");
  }

  function closeShutdownDialog() {
    if (!dom.shutdownDialog) return;
    dom.shutdownDialog.hidden = true;
  }

  function performShutdown(mode) {
    closeShutdownDialog();
    closeStartMenu();
    closeAllWindows();
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
        startBootSequence();
      }, 2400);
    } else if (mode === "standby") {
      setTimeout(() => {
        renderLoginState();
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
        if (openBtn.closest("[data-desktop-icon]") && config.doubleClickToOpen) return;
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
            icon.classList.add("is-dragging");
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
          icon.classList.remove("is-dragging");
          if (didMove && config.desktopGridLock) snapIconToGrid(icon);
          if (didMove) saveIconPositions();
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      icon.addEventListener("click", (e) => {
        if (didMove) { didMove = false; return; }
        selectIcon(icon);
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
    if (!config.iconPositions) {
      if (config.desktopGridLock) snapIconToGrid(icon);
      return;
    }
    const pos = config.iconPositions[icon.dataset.iconId];
    if (pos) {
      setIconPosition(icon, pos.left, pos.top);
    } else if (config.desktopGridLock) {
      snapIconToGrid(icon);
    }
  }

  function snapIconPoint(left, top, bounds, width, height) {
    const col = Math.max(0, Math.round((left - ICON_GRID.left) / ICON_GRID.col));
    const row = Math.max(0, Math.round((top - ICON_GRID.top) / ICON_GRID.row));
    const maxLeft = Math.max(0, bounds.width - width);
    const maxTop = Math.max(0, bounds.height - height);
    return {
      left: Math.min(maxLeft, ICON_GRID.left + col * ICON_GRID.col),
      top: Math.min(maxTop, ICON_GRID.top + row * ICON_GRID.row),
    };
  }

  function setIconPosition(icon, left, top) {
    let next = { left, top };
    if (config.desktopGridLock && dom.desktopIcons) {
      const bounds = dom.desktopIcons.getBoundingClientRect();
      if (bounds.width && bounds.height) {
        next = snapIconPoint(left, top, bounds, icon.offsetWidth, icon.offsetHeight);
      }
    }
    icon.style.left = next.left + "px";
    icon.style.top = next.top + "px";
  }

  function snapIconToGrid(icon) {
    setIconPosition(icon, parseInt(icon.style.left, 10) || 0, parseInt(icon.style.top, 10) || 0);
  }

  function snapAllDesktopIcons() {
    document.querySelectorAll("[data-desktop-icon]").forEach((icon) => snapIconToGrid(icon));
    saveIconPositions();
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
      { id: "my-computer", col: 0, row: 0 },
      { id: "documents", col: 0, row: 1 },
      { id: "network", col: 0, row: 2 },
      { id: "recycle", col: 0, row: 3 },
      { id: "internet", col: 0, row: 4 },
      { id: "music", col: 1, row: 0 },
      { id: "programs", col: 1, row: 1 },
      { id: "control-panel", col: 1, row: 2 },
    ];
    defaults.forEach((d) => {
      const icon = document.querySelector(`[data-icon-id="${d.id}"]`);
      if (icon) {
        setIconPosition(icon, ICON_GRID.left + d.col * ICON_GRID.col, ICON_GRID.top + d.row * ICON_GRID.row);
      }
    });
    saveIconPositions();
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
      const interactive = e.target.closest("button, a, [data-open-window], [data-selectable], input[type='checkbox'], input[type='radio'], .window-control, .session-action, .start-item, .start-link, .start-pinned, .folder-item, .desktop-icon, .taskbar-window, .tray-button, .quick-launch-button, .tray-clock, .settings-tab, .power-option, .sidebar-action, .wmp-nav, .wmp-card, .now-playing-widget button, .user-tile, .login-arrow-btn, .login-help-btn, .login-power-btn");
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
      btn.textContent = `${item.checked ? "✓ " : ""}${item.label}${item.items ? "  ›" : ""}`;
      btn.disabled = !!item.disabled;
      btn.addEventListener("click", () => {
        if (item.items) {
          const rect = btn.getBoundingClientRect();
          showContextMenu(rect.right - 2, rect.top, item.items);
          return;
        }
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
          { label: "Crear acceso directo", action: () => playSystemSound("ding") },
          { separator: true },
          { label: "Ocultar este icono", action: () => toggleDesktopIconVisibility(icon.dataset.iconId) },
          { label: "Propiedades", action: () => openWindow("control-panel", { tab: "desktop" }) },
        ]);
        return;
      }
      if (e.target.closest("#desktop") && !e.target.closest(".xp-window") && !e.target.closest(".taskbar") && !e.target.closest(".start-menu")) {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, [
          { label: "Actualizar", action: () => playSystemSound("ding") },
          { label: "Organizar iconos", action: resetIconPositions },
          { label: "Mostrar iconos", items: desktopIconMenuItems() },
          { separator: true },
          { label: "Nuevo", items: [
            { label: "Documento de texto", action: () => openWindow("notepad") },
            { label: "Imagen de mapa de bits", action: () => openWindow("paint") },
            { label: "Carpeta", action: () => openWindow("documents") },
          ] },
          { separator: true },
          { label: "Propiedades", action: () => openWindow("control-panel", { tab: "desktop" }) },
        ]);
        return;
      }
      const startBtn = e.target.closest("#start-button");
      if (startBtn) {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, [
          { label: "Abrir", action: () => toggleStartMenu() },
          { label: "Propiedades", action: () => openWindow("control-panel", { tab: "taskbar" }) },
          { separator: true },
          { label: "Configurar iconos del escritorio", action: () => openWindow("control-panel", { tab: "desktop" }) },
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

  function cloneSettingsConfig() {
    return {
      displayName: config.accountCreated ? config.accountName : config.displayName,
      profileSubtitle: config.profileSubtitle || defaults.profileSubtitle,
      profileBio: config.profileBio || defaults.profileBio,
      profileAvatar: config.profileAvatar || DEFAULT_AVATAR,
      mouseVolume: config.mouseVolume,
      keyboardVolume: config.keyboardVolume,
      keyboardEnabled: config.keyboardEnabled,
      systemSoundsEnabled: config.systemSoundsEnabled,
      startLabel: "start",
      quickLaunch: config.quickLaunch,
      clockFormat: config.clockFormat,
      iconSize: config.iconSize,
      doubleClickToOpen: config.doubleClickToOpen,
      desktopGridLock: config.desktopGridLock,
      hiddenDesktopIcons: { ...(config.hiddenDesktopIcons || {}) },
      themeMode: config.themeMode,
      fullBootEnabled: config.fullBootEnabled,
      bootTypewriter: config.bootTypewriter,
      bootTypewriterSpeed: config.bootTypewriterSpeed,
      biosComponents: { ...(config.biosComponents || {}) },
      biosText: { ...(config.biosText || {}) },
    };
  }

  function getSettingsDraft() {
    if (!settingsDraft) settingsDraft = cloneSettingsConfig();
    return settingsDraft;
  }

  function markSettingsDirty() {
    settingsDirty = true;
    const panel = windowState.get("control-panel")?.element;
    if (panel) panel.classList.add("has-unsaved-settings");
  }

  function readSettingsFormIntoDraft() {
    const draft = getSettingsDraft();
    if (dom.configDisplayName) draft.displayName = dom.configDisplayName.value.trim() || "Zar";
    if (dom.configProfileSubtitle) draft.profileSubtitle = dom.configProfileSubtitle.value.trim() || defaults.profileSubtitle;
    if (dom.configProfileBio) draft.profileBio = dom.configProfileBio.value.trim() || defaults.profileBio;
    if (dom.configMouseVolume) draft.mouseVolume = parseInt(dom.configMouseVolume.value, 10);
    if (dom.configKeyboardVolume) draft.keyboardVolume = parseInt(dom.configKeyboardVolume.value, 10);
    if (dom.configKeyboardEnabled) draft.keyboardEnabled = dom.configKeyboardEnabled.checked;
    if (dom.configSystemSounds) draft.systemSoundsEnabled = dom.configSystemSounds.checked;
    if (dom.configStartLabel) draft.startLabel = dom.configStartLabel.value || "start";
    if (dom.configQuickLaunch) draft.quickLaunch = dom.configQuickLaunch.checked;
    if (dom.configClockFormat) draft.clockFormat = dom.configClockFormat.value;
    if (dom.configIconSize) draft.iconSize = parseInt(dom.configIconSize.value, 10);
    if (dom.configDoubleClick) draft.doubleClickToOpen = dom.configDoubleClick.checked;
    if (dom.configDesktopGridLock) draft.desktopGridLock = dom.configDesktopGridLock.checked;
    if (dom.configThemeMode) draft.themeMode = dom.configThemeMode.value;
    if (dom.configFullBootEnabled) draft.fullBootEnabled = dom.configFullBootEnabled.checked;
    if (dom.configBootTypewriter) draft.bootTypewriter = dom.configBootTypewriter.checked;
    if (dom.configBootTypewriterSpeed) draft.bootTypewriterSpeed = Number(dom.configBootTypewriterSpeed.value || 1);

    document.querySelectorAll("[data-bios-component-toggle]").forEach((input) => {
      draft.biosComponents[input.dataset.biosComponentToggle] = input.checked;
    });
    document.querySelectorAll("[data-bios-text]").forEach((input) => {
      const key = input.dataset.biosText;
      draft.biosText[key] = key === "memoryMb"
        ? Math.max(1024, parseInt(input.value, 10) || defaults.biosText.memoryMb)
        : input.value.trim();
    });
    document.querySelectorAll("[data-desktop-icon-toggle]").forEach((input) => {
      draft.hiddenDesktopIcons[input.dataset.desktopIconToggle] = !input.checked;
    });
  }

  function populateSettingsForm() {
    const draft = getSettingsDraft();
    if (dom.configDisplayName) dom.configDisplayName.value = draft.displayName;
    if (dom.configProfileSubtitle) dom.configProfileSubtitle.value = draft.profileSubtitle;
    if (dom.configProfileBio) dom.configProfileBio.value = draft.profileBio;
    if (dom.configMouseVolume) dom.configMouseVolume.value = draft.mouseVolume;
    if (dom.configKeyboardVolume) dom.configKeyboardVolume.value = draft.keyboardVolume;
    if (dom.configKeyboardEnabled) dom.configKeyboardEnabled.checked = draft.keyboardEnabled;
    if (dom.configSystemSounds) dom.configSystemSounds.checked = draft.systemSoundsEnabled;
    if (dom.configStartLabel) dom.configStartLabel.value = draft.startLabel || "start";
    if (dom.configQuickLaunch) dom.configQuickLaunch.checked = draft.quickLaunch;
    if (dom.configClockFormat) dom.configClockFormat.value = draft.clockFormat;
    if (dom.configIconSize) dom.configIconSize.value = draft.iconSize;
    if (dom.configDoubleClick) dom.configDoubleClick.checked = draft.doubleClickToOpen;
    if (dom.configDesktopGridLock) dom.configDesktopGridLock.checked = draft.desktopGridLock;
    if (dom.configThemeMode) dom.configThemeMode.value = draft.themeMode;
    if (dom.configFullBootEnabled) dom.configFullBootEnabled.checked = draft.fullBootEnabled;
    if (dom.configBootTypewriter) dom.configBootTypewriter.checked = draft.bootTypewriter;
    if (dom.configBootTypewriterSpeed) dom.configBootTypewriterSpeed.value = String(draft.bootTypewriterSpeed ?? 1);

    document.querySelectorAll("[data-bios-component-toggle]").forEach((input) => {
      input.checked = draft.biosComponents[input.dataset.biosComponentToggle] !== false;
    });
    document.querySelectorAll("[data-bios-text]").forEach((input) => {
      const key = input.dataset.biosText;
      input.value = draft.biosText[key] ?? defaults.biosText[key] ?? "";
    });
    document.querySelectorAll("[data-desktop-icon-toggle]").forEach((input) => {
      input.checked = draft.hiddenDesktopIcons[input.dataset.desktopIconToggle] !== true;
    });
  }

  function beginSettingsSession() {
    settingsDraft = cloneSettingsConfig();
    settingsDirty = false;
    const panel = windowState.get("control-panel")?.element;
    if (panel) panel.classList.remove("has-unsaved-settings");
    populateSettingsForm();
  }

  function applyDesktopIconVisibility() {
    document.querySelectorAll("[data-desktop-icon]").forEach((icon) => {
      icon.hidden = config.hiddenDesktopIcons?.[icon.dataset.iconId] === true;
    });
  }

  function toggleDesktopIconVisibility(iconId) {
    config.hiddenDesktopIcons = { ...(config.hiddenDesktopIcons || {}) };
    config.hiddenDesktopIcons[iconId] = config.hiddenDesktopIcons[iconId] !== true;
    saveConfig();
    applyDesktopIconVisibility();
    beginSettingsSession();
  }

  function desktopIconMenuItems() {
    const labels = {
      "my-computer": "Mi PC",
      documents: "Mis documentos",
      network: "Mis sitios de red",
      recycle: "Papelera",
      internet: "Internet Explorer",
      music: "Windows Media Player",
      programs: "Programas",
      "control-panel": "Panel de control",
    };
    return Object.entries(labels).map(([id, label]) => ({
      label,
      checked: config.hiddenDesktopIcons?.[id] !== true,
      action: () => toggleDesktopIconVisibility(id),
    }));
  }

  function applySettingsDraft() {
    readSettingsFormIntoDraft();
    const draft = getSettingsDraft();
    config.mouseVolume = draft.mouseVolume;
    config.keyboardVolume = draft.keyboardVolume;
    config.keyboardEnabled = draft.keyboardEnabled;
    config.systemSoundsEnabled = draft.systemSoundsEnabled;
    config.startLabel = draft.startLabel || "start";
    config.profileSubtitle = draft.profileSubtitle || defaults.profileSubtitle;
    config.profileBio = draft.profileBio || defaults.profileBio;
    config.profileAvatar = draft.profileAvatar || config.profileAvatar || DEFAULT_AVATAR;
    config.quickLaunch = draft.quickLaunch;
    config.clockFormat = draft.clockFormat;
    config.iconSize = draft.iconSize;
    config.doubleClickToOpen = draft.doubleClickToOpen;
    config.desktopGridLock = draft.desktopGridLock;
    config.hiddenDesktopIcons = { ...draft.hiddenDesktopIcons };
    config.themeMode = draft.themeMode;
    config.fullBootEnabled = draft.fullBootEnabled;
    config.bootTypewriter = draft.bootTypewriter;
    config.bootTypewriterSpeed = Number(draft.bootTypewriterSpeed || 1);
    config.biosComponents = { ...draft.biosComponents };
    config.biosText = { ...draft.biosText };

    updateDisplayName(draft.displayName);
    applyProfileDetails();
    applyThemeMode();
    updateBootBiosText();
    applyBiosComponentVisibility();
    applyBootTypingDelays();
    applyDesktopIconVisibility();
    tickClock();
    if (dom.startButtonLabel) dom.startButtonLabel.textContent = config.startLabel;
    if (dom.quickLaunch) dom.quickLaunch.style.display = config.quickLaunch ? "" : "none";
    document.documentElement.style.setProperty("--desktop-icon-size", config.iconSize + "px");
    if (config.desktopGridLock) snapAllDesktopIcons();
    saveConfig();
    settingsDirty = false;
    const panel = windowState.get("control-panel")?.element;
    if (panel) panel.classList.remove("has-unsaved-settings");
    updateLocalStatus("Configuración local guardada.");
    playSystemSound("ding");
  }

  function discardSettingsDraft() {
    settingsDraft = cloneSettingsConfig();
    settingsDirty = false;
    const panel = windowState.get("control-panel")?.element;
    if (panel) panel.classList.remove("has-unsaved-settings");
    populateSettingsForm();
  }

  function showUnsavedSettingsDialog() {
    if (!dom.unsavedSettingsDialog) return;
    dom.unsavedSettingsDialog.hidden = false;
    playSystemSound("exclamation");
  }

  function hideUnsavedSettingsDialog() {
    if (dom.unsavedSettingsDialog) dom.unsavedSettingsDialog.hidden = true;
  }

  function exportLocalData() {
    readSettingsFormIntoDraft();
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      config: { ...config, ...getSettingsDraft() },
      apps: {
        notepad: localStorage.getItem(APP_STORAGE_KEYS.notepad) || "",
        wordpad: localStorage.getItem(APP_STORAGE_KEYS.wordpad) || "",
      },
    };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "xp-personal-datos.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importLocalData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        if (payload.config) {
          Object.assign(config, defaults, config, payload.config);
          config.biosComponents = { ...defaults.biosComponents, ...(payload.config.biosComponents || {}) };
          config.biosText = { ...defaults.biosText, ...(payload.config.biosText || {}) };
          config.hiddenDesktopIcons = { ...(payload.config.hiddenDesktopIcons || {}) };
        }
        if (payload.apps?.notepad != null) localStorage.setItem(APP_STORAGE_KEYS.notepad, String(payload.apps.notepad));
        if (payload.apps?.wordpad != null) localStorage.setItem(APP_STORAGE_KEYS.wordpad, String(payload.apps.wordpad));
        saveConfig();
        applyInitialConfig();
        loadAppDocuments();
        beginSettingsSession();
        playSystemSound("ding");
      } catch (_) {
        playSystemSound("criticalStop");
      }
    };
    reader.readAsText(file);
  }

  function clearLocalData() {
    if (!window.confirm("¿Borrar configuración, notas y documentos guardados localmente?")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(APP_STORAGE_KEYS.notepad);
    localStorage.removeItem(APP_STORAGE_KEYS.wordpad);
    location.reload();
  }

  function setupSettings() {
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchSettingsTab(tab.dataset.settingsTab));
    });

    beginSettingsSession();
    document.querySelectorAll(".settings-panel input, .settings-panel select, .settings-panel textarea").forEach((input) => {
      input.addEventListener("input", () => {
        readSettingsFormIntoDraft();
        markSettingsDirty();
      });
      input.addEventListener("change", () => {
        readSettingsFormIntoDraft();
        markSettingsDirty();
      });
    });

    document.querySelectorAll("[data-config-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.configAction;
        if (action === "apply") {
          applySettingsDraft();
        } else if (action === "cancel") {
          discardSettingsDraft();
          closeWindow("control-panel", { force: true });
        } else if (action === "defaults") {
          settingsDraft = cloneSettingsConfig();
          settingsDraft = { ...settingsDraft, ...defaults, biosComponents: { ...defaults.biosComponents }, biosText: { ...defaults.biosText }, hiddenDesktopIcons: {} };
          settingsDraft.startLabel = "start";
          settingsDraft.displayName = "Zar";
          settingsDraft.profileSubtitle = defaults.profileSubtitle;
          settingsDraft.profileBio = defaults.profileBio;
          settingsDraft.profileAvatar = DEFAULT_AVATAR;
          populateSettingsForm();
          markSettingsDirty();
        } else if (action === "reset-icons") {
          resetIconPositions();
        } else if (action === "export") {
          exportLocalData();
        } else if (action === "import") {
          if (dom.configImportFile) dom.configImportFile.click();
        } else if (action === "clear-local") {
          clearLocalData();
        }
      });
    });

    if (dom.configImportFile) {
      dom.configImportFile.addEventListener("change", () => {
        importLocalData(dom.configImportFile.files?.[0]);
        dom.configImportFile.value = "";
      });
    }
    if (dom.configProfileAvatar) {
      dom.configProfileAvatar.addEventListener("click", () => {
        if (dom.configProfileAvatarFile) dom.configProfileAvatarFile.click();
      });
    }
    if (dom.configProfileAvatarFile) {
      dom.configProfileAvatarFile.addEventListener("change", () => {
        const file = dom.configProfileAvatarFile.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          const draft = getSettingsDraft();
          draft.profileAvatar = String(reader.result || DEFAULT_AVATAR);
          config.profileAvatar = draft.profileAvatar;
          saveConfig();
          applyProfileDetails();
          markSettingsDirty();
        };
        reader.readAsDataURL(file);
      });
    }

    document.querySelectorAll("[data-unsaved-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.unsavedAction;
        if (action === "save") {
          applySettingsDraft();
          hideUnsavedSettingsDialog();
          closeWindow("control-panel", { force: true });
        } else if (action === "discard") {
          discardSettingsDraft();
          hideUnsavedSettingsDialog();
          closeWindow("control-panel", { force: true });
        } else {
          hideUnsavedSettingsDialog();
        }
      });
    });
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
      "gustos": "pictures",
      "mis gustos": "pictures",
      "murder drones": "pictures",
      "fnaf": "pictures",
      "the amazing digital circus": "pictures",
      "lost in space": "pictures",
      "perdidos en el espacio": "pictures",
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
      "wordpad": "wordpad",
      "cmd": "cmd",
      "command": "cmd",
      "pinball": "pinball",
      "movie maker": "movie-maker",
      "moviemaker": "movie-maker",
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
        playSystemSound("criticalStop");
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
      { id: "pictures", label: "Mis gustos", text: "gustos murder drones fnaf amazing digital circus lost in space perdidos espacio" },
      { id: "music", label: "Mi música", text: "musica canciones local artistas albumes" },
      { id: "my-computer", label: "Mi PC", text: "pc equipo sistema" },
      { id: "internet", label: "Internet Explorer", text: "internet navegador web" },
      { id: "control-panel", label: "Panel de control", text: "configuracion ajustes sonido" },
      { id: "media-player", label: "Windows Media Player", text: "musica local reproductor wmp" },
      { id: "wordpad", label: "WordPad", text: "texto documento escribir" },
      { id: "cmd", label: "Símbolo del sistema", text: "cmd terminal consola" },
      { id: "pinball", label: "Pinball", text: "juego space cadet" },
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
          loadBrowserUrl(url);
        } else if (action === "external") {
          window.open(normalizeBrowserUrl(url), "_blank", "noopener,noreferrer");
        } else if (action === "home") {
          dom.browserAddress.value = "http://127.0.0.1:3000/";
          if (dom.browserFrame) {
            dom.browserFrame.hidden = true;
            dom.browserFrame.removeAttribute("src");
          }
          if (dom.browserHomePage) dom.browserHomePage.hidden = false;
          dom.browserPageTitle.textContent = "Inicio";
          dom.browserPageCopy.textContent = "Página principal.";
        } else if (action === "back") {
          try { dom.browserFrame.contentWindow.history.back(); } catch (_) {}
        } else if (action === "forward") {
          try { dom.browserFrame.contentWindow.history.forward(); } catch (_) {}
        }
        playSystemSound(action === "go" || action === "refresh" ? "navigationStart" : "ding");
      });
    });
    document.querySelectorAll("[data-browser-url]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (dom.browserAddress) dom.browserAddress.value = btn.dataset.browserUrl;
        loadBrowserUrl(btn.dataset.browserUrl);
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
    if (dom.browserSearchInput) {
      dom.browserSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          loadBrowserUrl(dom.browserSearchInput.value);
        }
      });
    }
  }

  function normalizeBrowserUrl(raw) {
    const value = (raw || "").trim();
    if (!value) return "http://127.0.0.1:3000/";
    if (/^[a-z]+:\/\//i.test(value)) return value;
    if (value.includes(".") || value.startsWith("localhost")) return `https://${value}`;
    return `https://www.startpage.com/sp/search?q=${encodeURIComponent(value)}`;
  }

  function youtubeEmbedUrl(url) {
    try {
      const parsed = new URL(url);
      let id = "";
      if (parsed.hostname.includes("youtu.be")) id = parsed.pathname.slice(1);
      if (parsed.hostname.includes("youtube.com")) {
        id = parsed.searchParams.get("v") || "";
        if (!id && parsed.pathname.startsWith("/shorts/")) id = parsed.pathname.split("/")[2] || "";
        if (!id && parsed.pathname.startsWith("/embed/")) id = parsed.pathname.split("/")[2] || "";
      }
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=0&rel=0` : "";
    } catch (_) {
      return "";
    }
  }

  function loadBrowserUrl(raw) {
    if (!dom.browserFrame || !dom.browserAddress) return;
    const normalized = normalizeBrowserUrl(raw);
    const embed = youtubeEmbedUrl(normalized);
    dom.browserAddress.value = normalized;
    dom.browserFrame.src = embed || normalized;
    dom.browserFrame.hidden = false;
    if (dom.browserHomePage) dom.browserHomePage.hidden = true;
    if (dom.browserPageTitle) dom.browserPageTitle.textContent = embed ? "Vista embebida" : "Visitando...";
    if (dom.browserPageCopy) dom.browserPageCopy.textContent = normalized;
  }

  // ===== Documentos locales ==============================================

  function loadAppDocuments() {
    if (dom.notepadTextarea) {
      dom.notepadTextarea.value = localStorage.getItem(APP_STORAGE_KEYS.notepad) || "Escribe aquí tus notas personales...\n";
    }
    if (dom.wordpadArea) {
      dom.wordpadArea.value = localStorage.getItem(APP_STORAGE_KEYS.wordpad) || "Documento rápido para escribir ideas de la página, letras, listas o notas largas.";
    }
  }

  function setupAppDocuments() {
    loadAppDocuments();
    if (dom.notepadTextarea) {
      dom.notepadTextarea.addEventListener("input", () => {
        localStorage.setItem(APP_STORAGE_KEYS.notepad, dom.notepadTextarea.value);
      });
    }
    if (dom.wordpadArea) {
      dom.wordpadArea.addEventListener("input", () => {
        localStorage.setItem(APP_STORAGE_KEYS.wordpad, dom.wordpadArea.value);
      });
    }
    document.querySelectorAll("[data-wordpad-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!dom.wordpadArea) return;
        const start = dom.wordpadArea.selectionStart;
        const end = dom.wordpadArea.selectionEnd;
        const selected = dom.wordpadArea.value.slice(start, end) || "texto";
        const marks = {
          bold: ["**", "**"],
          italic: ["_", "_"],
          underline: ["<u>", "</u>"],
        }[btn.dataset.wordpadAction] || ["", ""];
        const replacement = `${marks[0]}${selected}${marks[1]}`;
        dom.wordpadArea.setRangeText(replacement, start, end, "select");
        localStorage.setItem(APP_STORAGE_KEYS.wordpad, dom.wordpadArea.value);
        dom.wordpadArea.focus();
      });
    });
  }

  // ===== Terminal =========================================================

  function appendCmdLine(html) {
    if (!dom.cmdOutput) return;
    const line = document.createElement("div");
    line.className = "cmd-line";
    line.innerHTML = html;
    dom.cmdOutput.appendChild(line);
    if (dom.cmdScreen) dom.cmdScreen.scrollTop = dom.cmdScreen.scrollHeight;
  }

  function runCmdCommand(raw) {
    const command = raw.trim();
    if (!command) return;
    appendCmdLine(`<span>C:\\Zar\\ME&gt; ${escapeHtml(command)}</span>`);
    const [name, ...args] = command.split(/\s+/);
    const lower = name.toLowerCase();
    const rest = args.join(" ");
    const runAliases = {
      perfil: "profile",
      paint: "paint",
      notepad: "notepad",
      bloc: "notepad",
      wordpad: "wordpad",
      calc: "calculator",
      calculadora: "calculator",
      wmp: "media-player",
      iexplore: "internet",
      internet: "internet",
      control: "control-panel",
      pong: "pinball",
      pinball: "pinball",
    };
    if (lower === "cls" || lower === "clear") {
      dom.cmdOutput.innerHTML = "";
      return;
    }
    if (lower === "help" || lower === "ayuda") {
      appendCmdLine("Comandos: dir, cd, echo, start, win32.run, music.status, theme dark, theme luna, export, cls.");
      return;
    }
    if (lower === "dir") {
      appendCmdLine("04/30/2026  12:00    &lt;DIR&gt; apps<br>04/30/2026  12:00    &lt;DIR&gt; perfil<br>04/30/2026  12:00         config.json<br>04/30/2026  12:00         music.local");
      return;
    }
    if (lower === "cd") {
      appendCmdLine("La ubicación simulada se mantiene en C:\\Zar\\ME.");
      return;
    }
    if (lower === "echo") {
      appendCmdLine(escapeHtml(rest));
      return;
    }
    if (lower === "music.status") {
      appendCmdLine(escapeHtml(dom.cmdMusicStatus?.textContent || "Música local: cargando"));
      return;
    }
    if (lower === "export") {
      exportLocalData();
      appendCmdLine("Exportando datos locales...");
      return;
    }
    if (lower === "theme") {
      const draft = getSettingsDraft();
      draft.themeMode = rest.toLowerCase() === "dark" ? "dark" : "normal";
      settingsDirty = true;
      applySettingsDraft();
      appendCmdLine(`Tema aplicado: ${draft.themeMode === "dark" ? "oscuro" : "Luna"}.`);
      return;
    }
    if (lower === "start") {
      const target = rest || "internet";
      if (/^https?:\/\//i.test(target) || target.includes(".")) {
        openWindow("internet");
        if (dom.browserAddress) dom.browserAddress.value = target;
        loadBrowserUrl(target);
      } else if (runAliases[target.toLowerCase()]) {
        openWindow(runAliases[target.toLowerCase()]);
      } else {
        appendCmdLine(`No se encontró ${escapeHtml(target)}.`);
      }
      return;
    }
    if (lower === "win32.run") {
      const target = runAliases[rest.toLowerCase()];
      if (target) {
        openWindow(target);
        appendCmdLine(`Abriendo ${escapeHtml(rest)}...`);
      } else {
        appendCmdLine("Uso: win32.run perfil|paint|wmp|pong|control");
      }
      return;
    }
    appendCmdLine(`'${escapeHtml(name)}' no se reconoce como comando interno o externo.`);
  }

  function setupTerminal() {
    if (!dom.cmdForm || !dom.cmdInput) return;
    dom.cmdForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runCmdCommand(dom.cmdInput.value);
      dom.cmdInput.value = "";
    });
    if (dom.cmdScreen) dom.cmdScreen.addEventListener("click", () => dom.cmdInput.focus());
  }

  // ===== Pong XP ==========================================================

  function setupPong() {
    if (!dom.pongCanvas) return;
    const ctx = dom.pongCanvas.getContext("2d");
    const state = { running: false, player: 118, cpu: 118, ballX: 260, ballY: 150, vx: 3.2, vy: 2.1, playerScore: 0, cpuScore: 0, lastFrame: 0, rally: 0 };
    const paddleH = 64;
    const resetBall = (direction = 1) => {
      state.ballX = dom.pongCanvas.width / 2;
      state.ballY = dom.pongCanvas.height / 2;
      state.vx = 3.2 * direction;
      state.vy = (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.random() * 1.4);
      state.rally = 0;
    };
    const draw = () => {
      ctx.fillStyle = "#05070B";
      ctx.fillRect(0, 0, dom.pongCanvas.width, dom.pongCanvas.height);
      ctx.strokeStyle = "#3A72D8";
      ctx.setLineDash([6, 7]);
      ctx.beginPath();
      ctx.moveTo(dom.pongCanvas.width / 2, 0);
      ctx.lineTo(dom.pongCanvas.width / 2, dom.pongCanvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#E8F2FF";
      ctx.fillRect(18, state.player, 9, paddleH);
      ctx.fillRect(dom.pongCanvas.width - 27, state.cpu, 9, paddleH);
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 7, 0, Math.PI * 2);
      ctx.fill();
      if (dom.pongScore) dom.pongScore.textContent = `Jugador ${state.playerScore} : ${state.cpuScore} CPU`;
    };
    const step = (time) => {
      if (!state.running) {
        draw();
        return;
      }
      const delta = Math.min(32, time - (state.lastFrame || time));
      state.lastFrame = time;
      const speed = delta / 16.67;
      state.ballX += state.vx * speed;
      state.ballY += state.vy * speed;
      if (state.ballY < 8 || state.ballY > dom.pongCanvas.height - 8) state.vy *= -1;
      state.cpu += Math.sign(state.ballY - (state.cpu + paddleH / 2)) * 2.2 * speed;
      state.cpu = Math.max(0, Math.min(dom.pongCanvas.height - paddleH, state.cpu));
      if (state.ballX < 34 && state.ballY > state.player && state.ballY < state.player + paddleH) {
        state.rally += 1;
        state.vx = Math.min(9.5, Math.abs(state.vx) + 0.28 + state.rally * 0.025);
        state.vy += Math.sign(state.vy || 1) * 0.08;
        playSystemSound("menu");
      }
      if (state.ballX > dom.pongCanvas.width - 34 && state.ballY > state.cpu && state.ballY < state.cpu + paddleH) {
        state.rally += 1;
        state.vx = -Math.min(9.5, Math.abs(state.vx) + 0.28 + state.rally * 0.025);
        state.vy += Math.sign(state.vy || 1) * 0.08;
      }
      if (state.ballX < -10) {
        state.cpuScore += 1;
        resetBall(1);
      }
      if (state.ballX > dom.pongCanvas.width + 10) {
        state.playerScore += 1;
        resetBall(-1);
      }
      draw();
      requestAnimationFrame(step);
    };
    dom.pongCanvas.addEventListener("mousemove", (e) => {
      const rect = dom.pongCanvas.getBoundingClientRect();
      state.player = Math.max(0, Math.min(dom.pongCanvas.height - paddleH, (e.clientY - rect.top) * (dom.pongCanvas.height / rect.height) - paddleH / 2));
    });
    window.addEventListener("keydown", (e) => {
      if (windowState.get("pinball")?.element.hidden) return;
      if (e.key === "ArrowUp") state.player = Math.max(0, state.player - 14);
      if (e.key === "ArrowDown") state.player = Math.min(dom.pongCanvas.height - paddleH, state.player + 14);
    });
    document.querySelectorAll("[data-pong-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.running = btn.dataset.pongAction === "start";
        state.lastFrame = 0;
        requestAnimationFrame(step);
      });
    });
    draw();
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

  function applyThemeMode() {
    document.documentElement.dataset.theme = config.themeMode === "dark" ? "dark" : "normal";
  }

  function applyInitialConfig() {
    applyThemeMode();
    updateBootBiosText();
    applyDesktopIconVisibility();
    if (dom.startButtonLabel) dom.startButtonLabel.textContent = config.startLabel;
    if (dom.quickLaunch) dom.quickLaunch.style.display = config.quickLaunch ? "" : "none";
    document.documentElement.style.setProperty("--desktop-icon-size", config.iconSize + "px");
    updateDisplayName(config.accountCreated ? config.accountName : config.displayName);
    applyProfileDetails();
  }

  function start() {
    applyInitialConfig();
    setupLogin();
    setupMediaPlayer();
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
    setupAppDocuments();
    setupTerminal();
    setupPong();
    setupCalculator();
    setupPaint();
    setupBoot();

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
