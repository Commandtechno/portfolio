const fs = require("fs");
const input = fs.readFileSync("client.html", "utf8");

const output = input.replace(/"\/[^"]+"/g, match => {
  match = match.slice(1, -1);
  if (!match.startsWith("/assets") || match.endsWith(".js")) return match;
  console.log(match);
  return '"' + new URL(match, "http://localhost:3002").toString() + '"';
});

fs.writeFileSync("client.html", output);