import { cp, mkdir, readFile, writeFile } from "fs/promises";
import { dirname, extname, resolve } from "path";
import puppeteer from "puppeteer";
import sharp from "sharp";

console.log("Launching browser...");
const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto("file://" + resolve());

console.log("Loading input...");
const input = await readFile(resolve("html", "index.html"), "utf-8");
await page.setContent(input);

console.log("Resolving imports...");
await page.exposeFunction("resolve", resolve);
await page.exposeFunction("readFile", readFile);
await page.evaluate(async () => {
  const elements = document.querySelectorAll("[import]");
  for (const element of elements) {
    const file = element.getAttribute("import") + ".html";
    const path = await resolve("html", file);
    const html = await readFile(path, "utf-8");
    element.innerHTML = html;
    element.removeAttribute("import");
  }
});

interface Image {
  src: string;
  dest: string;
  width: number;
  height: number;
}

console.log("Rendering images...");
await page.waitForNetworkIdle();
await page.exposeFunction("extname", extname);
const images = await page.evaluate(async () => {
  const images: Image[] = [];
  for (const element of document.querySelectorAll("img")) {
    const { width, height } = element;
    element.width = width;
    element.height = height;

    const src = element.getAttribute("src");
    const ext = await extname(src);
    if (ext !== ".svg") {
      const dest = src.replace(ext, `_${width}x${height}.webp`);
      images.push({ src, dest, width, height });
      element.src = dest;
    }
  }

  return images;
});

for (const image of images) {
  let { src, dest, width, height } = image;
  dest = resolve("prebuild", dest);
  await mkdir(dirname(dest), { recursive: true });
  await sharp(src, { animated: true }).resize({ width, height }).toFile(dest);
}

console.log("Saving output...");
let output = await page.content();

console.log("Closing browser...");
await browser.close();

await cp("css", resolve("prebuild", "css"), { recursive: true });
await cp("assets", resolve("prebuild", "assets"), { recursive: true });
await writeFile(resolve("prebuild", "index.html"), output);