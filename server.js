const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webp": "image/webp",
};

function sendError(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(message);
}

function resolveRequestPath(urlPathname) {
  const normalizedPath = path.normalize(urlPathname).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(ROOT, normalizedPath);

  if (!absolutePath.startsWith(ROOT)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const absolutePath = resolveRequestPath(pathname);

  if (!absolutePath) {
    sendError(response, 403, "Ruta no permitida.");
    return;
  }

  fs.stat(absolutePath, (statError, stats) => {
    if (statError) {
      sendError(response, 404, "Archivo no encontrado.");
      return;
    }

    const finalPath = stats.isDirectory() ? path.join(absolutePath, "index.html") : absolutePath;

    fs.readFile(finalPath, (readError, buffer) => {
      if (readError) {
        sendError(response, 404, "Archivo no encontrado.");
        return;
      }

      const extension = path.extname(finalPath).toLowerCase();
      response.writeHead(200, {
        "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(buffer);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor XP disponible en http://${HOST}:${PORT}`);
});
