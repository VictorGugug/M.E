# Windows XP Personal — Estructura del Proyecto

> Documento de referencia para que cualquier agente (humano o IA) pueda continuar el desarrollo sin perder contexto.
> Ubicación: `d:\A-TODO\CODIGOS\M.E`

---

## 1. Objetivo

Página web personal con el look y comportamiento **literal de Windows XP** (tema Luna). Todo lo visible debe ser interactuable (ventanas, iconos, menús, taskbar, start menu, login, apagado). Los contenidos personales (nacimiento, personalidad, gustos, etc.) viven dentro de ventanas del "escritorio".

---

## 2. Stack y arranque

- **Frontend:** HTML5 + CSS3 + JavaScript vanilla (ES2020). Sin frameworks.
- **Backend:** `server.js` (Node.js nativo, sirve estáticos en `http://127.0.0.1:3000`).
- **Persistencia:** `localStorage` (clave `xp-personal-config-v2`).
- **Arrancar:**
  ```
  node server.js
  ```
  Abrir `http://127.0.0.1:3000` (NO abrir `index.html` con `file://`: los sonidos fallan por CORS).

---

## 3. Árbol de archivos

```
M.E/
├── index.html                  # Estructura de todas las pantallas y ventanas
├── styles.css                  # Tema XP Luna completo
├── script.js                   # Toda la lógica (sonidos, ventanas, drag, etc.)
├── server.js                   # Servidor estático Node.js
├── package.json
├── ESTRUCTURA.md               # Este documento
├── XP.jpg                      # Fondo escritorio (bliss)
├── click.mp3  /  click.flac    # Click del mouse
├── xpsounds2/                  # ~40 sonidos oficiales XP (.mp3 y .wav)
├── Razer Green (Blackwidow Elite) - Akira/
│                               # Samples de teclado mecánico (key1-6, space1-2, ent, back, shift, ctrl, alt, caps...)
└── Windows XP Icon Pack/
    └── Windows XP High Resolution Icon Pack/
        └── Windows XP Icons/   # ~400 iconos .png HD originales XP
```

---

## 4. Arquitectura de pantallas (`index.html`)

Todo vive en un único HTML con pantallas conmutadas por `hidden` + clase `screen--active`:

| ID | Propósito |
|----|-----------|
| `#login-screen`       | Welcome Screen de XP (avatar, password, botón power) |
| `#desktop-screen`     | Escritorio + iconos + ventanas + taskbar + start menu |
| `#power-screen`       | Pantalla negra de "Es seguro apagar el equipo" |
| `#shutdown-dialog`    | Diálogo modal de apagado (En espera / Apagar / Reiniciar) |
| `#context-menu`       | Menú contextual flotante (se rellena dinámicamente) |

### Ventanas registradas (`[data-window-id]`)

Todas viven dentro de `#desktop-screen` y comienzan con `hidden`:

| windowId          | Título                       | Estado |
|-------------------|------------------------------|--------|
| `my-computer`     | Mi PC                        | Implementada (iconos de unidades, sin navegación) |
| `documents`       | Mis documentos               | Implementada (carpetas estáticas) |
| `profile`         | Acerca de mí                 | **Placeholder — falta contenido real** |
| `birth`           | Mi nacimiento                | **Placeholder — falta contenido real** |
| `personality`     | Mi personalidad              | **Placeholder — falta contenido real** |
| `pictures`        | Mis imágenes                 | **Vacía — falta galería** |
| `music`           | Mi música                    | **Vacía — falta reproductor con canciones** |
| `network`         | Mis sitios de red            | Placeholder |
| `recycle`         | Papelera de reciclaje        | Placeholder (vacía) |
| `internet`        | Internet Explorer            | Simulador con barra de direcciones |
| `email`           | Outlook Express              | Placeholder |
| `programs`        | Todos los programas          | Placeholder |
| `notepad`         | Bloc de notas                | Funcional (`<textarea>` + guardado local) |
| `paint`           | Paint                        | Funcional (canvas 2D, colores, pincel) |
| `calculator`      | Calculadora                  | Funcional (estándar, con parsing seguro) |
| `media-player`    | Windows Media Player         | Placeholder UI |
| `messenger`       | MSN Messenger                | Placeholder UI |
| `control-panel`   | Panel de control             | Funcional (6 tabs con settings reales) |
| `help-support`    | Ayuda y soporte              | Placeholder |
| `search`          | Buscar archivos              | Funcional (filtra secciones del sitio) |
| `run`             | Ejecutar                     | Funcional (mapa de comandos) |
| `printers`        | Impresoras y faxes           | Placeholder |

---

## 5. Estilos (`styles.css`)

Estructura por secciones comentadas:

1. **Reset + variables (`:root`)** — paleta Luna exacta, fuentes Tahoma.
2. **Login screen** — gradiente azul XP, avatar, barra superior/inferior.
3. **Desktop** — fondo `XP.jpg`, rejilla de iconos, texto con sombra.
4. **Ventanas** — chrome azul `#0A246A → #2F6AE8`, controles minimize/maximize/close, borde 3D.
5. **Taskbar** — altura 30px, gradiente `#245EDC → #1944A5`, botones de ventana con efecto hundido.
6. **Botón Inicio** — verde `#3C8F37 → #64A634` con logo Windows (4 rectángulos CSS puros).
7. **Start Menu** — dos columnas (blanco izq + azul claro der), header con avatar, footer con cerrar sesión/apagar.
8. **System Tray** — hora, iconos, globo de notificación.
9. **Diálogos** — shutdown dialog estilo XP.
10. **Context menu** — fondo blanco, hover azul.
11. **Scrollbars** — custom XP style.

### Variables clave
```css
--xp-taskbar-height: 30px;
--xp-title-bar-height: 28px;
--desktop-icon-size: 32px;
--xp-blue: #0058E6;
--xp-green: #3C8F37;
```

---

## 6. Lógica (`script.js`)

Todo dentro de una IIFE `(function(){ "use strict"; ... })();`. Secciones en orden:

### 6.1 Configuración
- `STORAGE_KEY = "xp-personal-config-v2"`
- `defaults`: `displayName`, `mouseVolume: 25`, `keyboardVolume: 10`, `systemVolume: 50`, `clockFormat: "12h"`, `iconSize: 32`, `doubleClickToOpen: true`, `startLabel`, etc.
- `loadConfig()` / `saveConfig()`

### 6.2 Audio
- `AUDIO_BASE` — rutas a sonidos sistema
- `KEYBOARD_SAMPLES`, `SPACE_SAMPLES`, `SPECIAL_KEY_SAMPLES`
- `playSample(src, volume)` — pool de `Audio` cacheados
- `playSystemSound(name)`, `playClickSound()`, `playKeyboardSound(key)`

### 6.3 Login
- Listener submit en `#login-form` → `showDesktop()`
- Botón power en login abre `#shutdown-dialog`

### 6.4 Gestión de ventanas
- `windowState = new Map<id, {el, btn, minimized, maximized, prevRect}>`
- `openWindow(id, opts)`, `closeWindow(id)`, `minimizeWindow(id)`, `toggleMaximize(id)`, `bringToFront(id)`
- Drag: mousedown en titlebar → mousemove/mouseup en document
- Resize: handle SE abajo-derecha

### 6.5 Taskbar dinámica
- Al abrir ventana → crea botón en `.taskbar__windows`
- Click en botón: minimiza/restaura/trae al frente
- Reloj actualizado cada segundo; formato según `config.clockFormat`

### 6.6 Start Menu
- Toggle botón Inicio (con sonido `Windows XP Start.mp3` opcional)
- Click fuera → cierra
- Ítems conectados por `data-open-window`
- "Cerrar sesión" → `showLogin()`
- "Apagar" → abre `#shutdown-dialog`

### 6.7 Iconos de escritorio
- Drag & drop con persistencia (`saveIconPositions()`)
- Single o double click configurable (`config.doubleClickToOpen`)
- Selección con rectángulo de arrastre (pendiente refinar)
- Menú contextual al click derecho

### 6.8 Menú contextual
- `showContextMenu(x, y, items)` — items `{label, action, disabled, separator}`
- Usado en: iconos, escritorio, botones de taskbar

### 6.9 Shutdown
- Diálogo → seleccionar → pantalla `#power-screen`
- "Reiniciar" vuelve al login tras 2.4s

### 6.10 Apps mini
- **Notepad:** textarea + guardado a `localStorage`
- **Paint:** canvas 2D, colores preset, pincel
- **Calculadora:** `Function('"use strict"; return (' + safe + ')')()` con sanitización `[^0-9+\-*/().%]`
- **Ejecutar:** mapa de comandos (`notepad`, `calc`, `iexplore`, `control`, `mspaint`, `msconfig`, ...)
- **Buscar:** filtra contenido de ventanas por texto
- **Panel de Control:** 6 tabs (Apariencia, Sonidos, Cuenta, Fecha/Hora, Inicio, Sistema) — todos editan `config` en vivo

---

## 7. Assets disponibles y su uso

### Sonidos de sistema (`xpsounds2/`)
| Archivo | Usado en |
|---------|----------|
| `Windows XP Logon Sound.mp3`   | Al hacer login |
| `Windows XP Startup.mp3`       | Primera carga del escritorio |
| `Windows XP Shutdown.mp3`      | Al apagar |
| `Windows XP Logoff Sound.mp3`  | Al cerrar sesión |
| `Windows XP Minimize.mp3`      | Minimizar ventana |
| `Windows XP Restore.mp3`       | Restaurar/maximizar |
| `Windows XP Menu Command.mp3`  | Abrir ventana, start menu |
| `Windows XP Ding.mp3`          | Acción genérica |
| `Windows XP Error.mp3`         | Comando inválido en Ejecutar |
| `Windows XP Notify.mp3`        | Diálogo apagado |
| `Windows XP Balloon.mp3`       | **Sin usar aún** — para tooltips/globo tray |
| `Windows XP Critical Stop.mp3` | **Sin usar aún** — errores graves |
| `Windows XP Recycle.mp3`       | **Sin usar aún** — vaciar papelera |
| `Windows XP Hardware Insert/Remove.mp3` | **Sin usar aún** |
| `tada.mp3`, `chimes.mp3`, `chord.mp3` | **Sin usar aún** |

### Teclado mecánico (`Razer Green (Blackwidow Elite) - Akira/`)
| Archivo | Tecla |
|---------|-------|
| `key1.wav` – `key6.wav` | Teclas normales (random pool) |
| `space1.wav`, `space2.wav` | Barra espaciadora |
| `ent.wav` | Enter |
| `back.wav` | Backspace |
| `shift.wav`, `rshift.wav` | Shift |
| `ctrl.wav` | Ctrl |
| `alt.wav` | Alt |
| `caps.wav` | Caps Lock |
| `nO.wav` | **Sin asignar** |

### Iconos (`Windows XP Icon Pack/Windows XP High Resolution Icon Pack/Windows XP Icons/`)
~400 PNG HD. Actualmente se usan vía CSS inline o `<img src="...">` **con fallback a CSS-art**. Algunos ya referenciados:
- `My Computer.png`, `My Documents.png`, `Recycle Bin Empty.png`, `Internet Explorer.png`
- `Notepad.png`, `Calculator.png`, `Paint.png`, `Control Panel.png`

> **Nota para el siguiente agente:** reemplazar CSS-art por `<img>` apuntando a estos PNG da un look más fiel. Están todos disponibles.

### Imagen de fondo
- `XP.jpg` — wallpaper "Bliss"

---

## 8. Lo que FALTA por completar

### 8.1 Contenido personal (prioridad ALTA)
El usuario es **la persona** cuyos datos deben poblar el sitio. Faltan:
- [ ] **`#profile`** (Acerca de mí): nombre completo, apodo, edad, ubicación, frase personal, foto.
- [ ] **`#birth`** (Mi nacimiento): fecha, lugar, historia, zodiaco.
- [ ] **`#personality`** (Mi personalidad): rasgos, MBTI, aficiones, valores.
- [ ] **`#pictures`** (Mis imágenes): galería con fotos reales del usuario.
- [ ] **`#music`** (Mi música): lista de canciones favoritas con reproductor (usar `<audio>`).
- [ ] Datos de contacto (email real) para `#email`.

> **El agente debe pedirle estos datos al usuario** antes de escribirlos.

### 8.2 Funcionalidades XP pendientes (prioridad MEDIA)
- [ ] **Mi PC** → doble-click en unidades que abran ventanas con contenido real.
- [ ] **Papelera** que acepte arrastrar iconos y los "borre" con animación.
- [ ] **Recientes** en menú Inicio con historial real.
- [ ] **Tooltips** amarillos estilo XP en hover sobre iconos/botones.
- [ ] **Globo de notificación** del system tray (usar `Windows XP Balloon.mp3`).
- [ ] **Rectángulo de selección** al arrastrar en zona vacía del escritorio.
- [ ] **Snap de ventanas** al borde superior = maximizar.
- [ ] **Alt+Tab** para ciclar ventanas.
- [ ] **Sonido de "lock"** al bloquear con Win+L.
- [ ] **Papelera animada** (icono cambia lleno/vacío).
- [ ] **Screensaver** tras inactividad (bubbles, 3D pipes, texto).

### 8.3 Refinamiento visual (prioridad BAJA)
- [ ] Reemplazar iconos CSS-art por PNGs reales del pack.
- [ ] Animación de "abrir" ventana (scale + fade) idéntica a XP.
- [ ] Sombra bajo ventanas idéntica a XP (`box-shadow` sutil).
- [ ] Fuente Franklin Gothic para títulos de Start Menu (fallback Tahoma ya está).
- [ ] Cursor personalizado `cursor: url(...)` estilo XP.

### 8.4 Extras "que parezca SO real" (prioridad BAJA)
- [ ] **BIOS/POST falso** antes del login (pantalla negra + texto blanco).
- [ ] **BSOD** como easter egg (Ctrl+Alt+Del triple).
- [ ] **Juegos:** Buscaminas, Solitario, Pinball (hay versiones HTML libres).
- [ ] **Impresoras** abre diálogo "Agregar impresora".

---

## 9. Convenciones de código

- **JS:** `"use strict"`, sin clases, IIFE global, funciones pequeñas.
- **HTML:** `data-*` attributes para conectar eventos (`data-open-window`, `data-window-action`, `data-config-action`, `data-taskbar-action`).
- **CSS:** variables `--xp-*`, BEM suave (`window__title`, `taskbar__button`).
- **Sin comentarios innecesarios** en código — el código debe ser autoexplicativo.
- **Nada de frameworks** — mantener vanilla.

---

## 10. Checklist para el siguiente agente

1. [ ] Leer este documento completo.
2. [ ] Correr `node server.js` y abrir `http://127.0.0.1:3000`.
3. [ ] Login de prueba con cualquier contraseña → debe entrar al escritorio.
4. [ ] Verificar sonidos (logon, startup, click al abrir ventanas).
5. [ ] Preguntar al usuario por los datos reales (sección 8.1) **antes** de escribir contenido.
6. [ ] Nunca romper la paleta Luna ni cambiar a tema oscuro sin permiso explícito.
7. [ ] Mantener todo en `index.html` + `styles.css` + `script.js` — no fragmentar en módulos salvo que el usuario lo pida.
8. [ ] Actualizar este `ESTRUCTURA.md` cuando se completen tareas o se añadan nuevas.

---

## 11. Contacto con el usuario — cosas que pidió explícitamente

- Look **literal** de Windows XP (no "inspirado"). Investigar imágenes reales.
- Todo debe ser interactuable y funcional, no solo visual.
- Comportamiento de "sistema operativo": login → escritorio → apps → apagado.
- En español.
- Volúmenes de click y teclado **bajos por defecto** (ya configurados: 25% y 10%).
- Si algo falta → documentarlo aquí (ya lo estás haciendo).

---

*Última actualización: 2026-04-22*
