import { createServer } from "node:http";
import { readFile, stat, watch } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 5173);
const clients = new Set();
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".pdf": "application/pdf" };

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
      response.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream", "Cache-Control": "no-cache" });
      response.end(data);
    });
  });
}).listen(port, "127.0.0.1", () => console.log(`Personal site ready at http://127.0.0.1:${port}`));
