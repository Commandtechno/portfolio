import { load } from "cheerio";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const input = readFileSync(resolve(__dirname, "html", "index.html"), "utf-8");
const $ = load(input);

$("*").each((i, el) => {
  const $el = $(el);
  const children = $el.html().trim();
  if (children.startsWith("{") && children.endsWith("}")) {
    const file = children.slice(1, -1) + ".html";
    const nested = readFileSync(resolve(__dirname, "html", file), "utf-8");
    $el.html(nested);
  }
});

$("script[src]").each((i, el) => {
  const $el = $(el);
  const src = $el.attr("src");
  $el.removeAttr("src");

  const script = readFileSync(resolve(__dirname, "build", src), "utf-8");
  $el.text(script);
});

$("svg[src]").each((i, el) => {
  const $el = $(el);
  const src = $el.attr("src");
  $el.removeAttr("src");

  const $svg = load(readFileSync(resolve(__dirname, "build", src), "utf-8"));
  for (const attr in $el.attr()) {
    const val = $el.attr(attr);
    $svg("svg").attr(attr, val);
  }

  $el.replaceWith($svg.html());
});

$('link[href][rel="stylesheet"]').each((i, el) => {
  const $el = $(el);
  const href = $el.attr("href");
  const style = readFileSync(resolve(__dirname, "build", href), "utf-8");
  $el.replaceWith(`<style>${style}</style>`);
});

const output = $.html();
writeFileSync(resolve(__dirname, "build", "index.html"), output, "utf-8");