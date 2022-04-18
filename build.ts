import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { execFileSync } from "child_process";
import { resolve } from "path";
import { load } from "cheerio";

if (!existsSync(resolve(__dirname, "build"))) mkdirSync("build");
if (!existsSync(resolve(__dirname, "build", "assets")))
  cpSync(resolve(__dirname, "assets"), resolve(__dirname, "build", "assets"), { recursive: true });

const input = readFileSync(resolve(__dirname, "html", "index.html"), "utf-8");
const $ = load(input);

function esbuild(file: string) {
  return execFileSync(
    resolve(__dirname, "node_modules", ".bin", "esbuild"),
    [__dirname + file, "--bundle", "--minify"],
    { encoding: "utf-8" }
  );
}

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

  const output = esbuild(src);
  $el.text(output);
});

$('link[href][rel="stylesheet"]').each((i, el) => {
  const $el = $(el);
  const href = $el.attr("href");
  const style = esbuild(href);
  $el.replaceWith(`<style>${style}</style>`);
});

const output = $.html();
writeFileSync(resolve(__dirname, "build", "index.html"), output, "utf-8");