const fs = require("fs");
if (!fs.existsSync("build")) fs.mkdirSync("build");

const html = fs.readFileSync("html/index.html", "utf8").replace(/{\w+}/g, file => {
  file = file.slice(1, -1);
  return fs.readFileSync("html/" + file + ".html", "utf8");
});

fs.writeFileSync("build/index.html", html);

const css = fs.readFileSync("css/index.css", "utf8").replace(/\/\* {\w+} \*\//g, file => {
  file = file.slice(4, -4);
  return fs.readFileSync("css/" + file + ".css", "utf8");
});

fs.writeFileSync("build/index.css", css);

const js = fs.readFileSync("js/index.js", "utf8").replace(/\/\/ {\w+}/g, file => {
  file = file.slice(4, -1);
  return fs.readFileSync("js/" + file + ".js", "utf8");
});

fs.writeFileSync("build/index.js", js);