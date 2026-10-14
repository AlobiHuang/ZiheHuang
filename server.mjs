import { createServer } from "node:http";
import { readFile, stat, watch } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5173);
const clients = new Set();
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf" };

watch(root, { recursive: true }, (_event, filename) => {
  if (!filename || filename === "server.mjs") return;
  for (const response of clients) response.write("data: reload\n\n");
});

createServer((request, response) => {
  if (request.url === "/__live") {
    response.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    response.write("data: connected\n\n");
    clients.add(response);
    request.on("close", () => clients.delete(response));
    return;
  }

  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const safePath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(root, safePath === "/" || safePath === "\\" ? "index.html" : safePath);
  stat(filePath, (statError, details) => {
    if (!statError && details.isDirectory()) filePath = join(filePath, "index.html");
    readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }
      const type = types[extname(filePath)] || "application/octet-stream";
      // Byte ranges, as GitHub Pages serves them, so videos can seek in the preview too.
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range || "");
      if (range && (range[1] || range[2])) {
        const start = range[1] ? Number(range[1]) : Math.max(0, data.length - Number(range[2]));
        const end = range[1] && range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
        if (start >= data.length || start > end) { response.writeHead(416, { "Content-Range": `bytes */${data.length}` }); response.end(); return; }
        response.writeHead(206, { "Content-Type": type, "Cache-Control": "no-cache", "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${data.length}`, "Content-Length": end - start + 1 });
        response.end(data.subarray(start, end + 1));
        return;
      }
      response.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache", "Accept-Ranges": "bytes" });
      response.end(data);
    });
  });
}).listen(port, "127.0.0.1", () => console.log(`Personal site ready at http://127.0.0.1:${port}`));
