# NHB Music Player

Reproductor de música estilo retro con CRT theme.

## 🚀 Cómo usar (LOCAL)

### Paso 1: Instalar Node.js

1. Descarga Node.js desde https://nodejs.org/ (versión LTS)
2. **Instala completamente**
3. **Reinicia la PC** (importante)
4. Verifica que está instalado: abre terminal y escribe `node --version`

### Paso 2: Instalar dependencias

En la carpeta del proyecto, abre terminal y ejecuta:
```bash
npm install
```

### Paso 3: Generar lista de canciones

```bash
npm run generate
```

Esto:
- Lee todos los MP3 de la carpeta `mus/`
- Detecta qué tienen `EASTER_EGG` en los metadatos (campo "Comments")
- Genera `songs.json` automáticamente

### Paso 4: Ejecutar servidor

```bash
npm run serve
```

Luego abre en el navegador: **http://localhost:8000**

---

## 🎵 Agregar canciones

### Local:
1. Copia el MP3 a `mus/`
2. (Opcional) Edita metadatos del MP3:
   - Campo "Comments": escribe `EASTER_EGG` si quieres que sea easter egg
3. Ejecuta: `npm run generate`
4. Recarga la página

### En GitHub:
1. Sube el proyecto
2. Activa GitHub Pages
3. El workflow automático generará `songs.json` cuando hagas push

---

## 📋 Características

- ✅ Carga automática desde `songs.json`
- ✅ Lee metadatos (título, artista, álbum, año, imagen)
- ✅ Detecta easter eggs desde metadatos
- ✅ Ordena alfabéticamente por artista
- ✅ Easter eggs con probabilidad configurable (5%)
- ✅ Tema CRT retro personalizable
- ✅ Controles: play/pause, anterior/siguiente, shuffle, loop
- ✅ Barra de progreso clicable
- ✅ Reloj integrado

---

## 🎮 Atajos de teclado

| Tecla | Función |
|-------|---------|
| **S** | Skipear pantalla de boot |
| **Espacio** | Play/Pause |
| **→** | Siguiente canción |
| **←** | Canción anterior |

---

## 🔧 Configuración

- Edita `generate-songs.js` para:
  - Cambiar carpeta de música
  - Agregar easter eggs manuales
  
- Edita `index.html` para personalizar:
  - Colores CRT (variables CSS)
  - Probabilidad de easter egg (0.05 = 5%)
  - Mensajes de boot
