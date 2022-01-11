const fs = require("fs");
if (!fs.existsSync("build")) fs.mkdirSync("build");

const html = fs.readFileSync("html/index.html", "utf8").replace(/{\w+}/g, file => {
  file = file.slice(1, -1).toLowerCase();
  return fs.readFileSync("html/" + file + ".html", "utf8");
});

fs.writeFileSync("build/index.html", html);

const css = fs
  .readdirSync("css")
  .map(file => "/* " + file + " */\n" + fs.readFileSync("css/" + file, "utf8"))
  .join("\n\n");

fs.writeFileSync("build/index.css", css);

const js = fs
  .readdirSync("js")
  .map(file => "// " + file + "\n" + fs.readFileSync("js/" + file, "utf8"))
  .join("\n\n");

fs.writeFileSync("build/index.js", js);