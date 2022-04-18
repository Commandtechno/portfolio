import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { load } from "cheerio";

const input = readFileSync(resolve("html", "index.html"), "utf-8");
const $ = load(input);

$("*").each((_, el) => {
  const $el = $(el);
  const children = $el.html().trim();
  if (children.startsWith("{") && children.endsWith("}")) {
    const file = children.slice(1, -1) + ".html";
    const nested = readFileSync(resolve("html", file), "utf-8");
    $el.html(nested);
  }
});

const output = $.html();
writeFileSync("temp.html", output, "utf-8");