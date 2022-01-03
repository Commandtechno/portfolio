const { createServer } = require("http");
const { get } = require("https");

createServer((req, res) =>
  get(new URL(req.url, "https://discord.com"), proxy => {
    res.writeHead(proxy.statusCode, { ...proxy.headers, "access-control-allow-origin": "*" });
    proxy.pipe(res);
  })
).listen(3002);