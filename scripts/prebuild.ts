import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import puppeteer from "puppeteer";

console.log("Launching browser...");
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto("file://" + resolve());

console.log("Loading input...");
const input = readFileSync(resolve("html", "index.html"), "utf-8");
await page.setContent(input);

console.log("Resolving imports...");
await page.exposeFunction("readFileSync", readFileSync);
await page.exposeFunction("resolve", resolve);
await page.evaluate(async () => {
  const elements = document.querySelectorAll("[import]");
  for (const element of elements) {
    const file = element.getAttribute("import") + ".html";
    const path = await resolve("html", file);
    const html = await readFileSync(path, "utf-8");
    element.innerHTML = html;
  }
});

console.log("Rendering images...");
await page.waitForNetworkIdle();
await page.evaluate(() => {
  const images = document.querySelectorAll("img");
  for (const image of images) {
    const src = new URL(image.src);
    src.searchParams.set("as", "webp");
    src.searchParams.set("width", image.width.toString());
    src.searchParams.set("height", image.height.toString());

    image.src = src.toString();
    image.width = image.width;
    image.height = image.height;
  }
});

console.log("Saving output...");
let output = await page.content();
// to make parcel transform the images
output = output.replace(/(?<=src=\".+?)&amp;(?=.+?\")/g, "&");
writeFileSync("index.html", output);

console.log("Closing browser...");
await browser.close();