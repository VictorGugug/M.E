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
  ".flac": "audio/flac",
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

function resolveExistingPath(urlPathname) {
  const directPath = resolveRequestPath(urlPathname);
  if (directPath && fs.existsSync(directPath)) return directPath;

  const xpAllPath = resolveRequestPath(path.join("/XP ALL", urlPathname));
  if (xpAllPath && fs.existsSync(xpAllPath)) return xpAllPath;

  return directPath;
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(
    requestUrl.pathname === "/" || requestUrl.pathname === "/callback"
      ? "/index.html"
      : requestUrl.pathname
  );
  const absolutePath = resolveExistingPath(pathname);

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

    fs.stat(finalPath, (finalStatError, finalStats) => {
      if (finalStatError) {
        sendError(response, 404, "Archivo no encontrado.");
        return;
      }

      const extension = path.extname(finalPath).toLowerCase();
      const isStaticAsset = ![".html", ".js", ".css"].includes(extension);
      const headers = {
        "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
        "Cache-Control": isStaticAsset ? "public, max-age=604800, immutable" : "no-cache",
        "Accept-Ranges": "bytes",
      };
      const range = request.headers.range;
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match) {
          sendError(response, 416, "Rango no válido.");
          return;
        }
        const start = match[1] ? Number(match[1]) : 0;
        const end = match[2] ? Number(match[2]) : finalStats.size - 1;
        if (start >= finalStats.size || end >= finalStats.size || start > end) {
          response.writeHead(416, { ...headers, "Content-Range": `bytes */${finalStats.size}` });
          response.end();
          return;
        }
        response.writeHead(206, {
          ...headers,
          "Content-Length": end - start + 1,
          "Content-Range": `bytes ${start}-${end}/${finalStats.size}`,
        });
        fs.createReadStream(finalPath, { start, end }).pipe(response);
        return;
      }

      response.writeHead(200, { ...headers, "Content-Length": finalStats.size });
      fs.createReadStream(finalPath).pipe(response);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor XP disponible en http://${HOST}:${PORT}`);
});
