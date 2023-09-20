import { dirname, extname, join } from "path";
import { existsSync, readFileSync } from "fs";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { CheerioAPI, load } from "cheerio";
import { defineConfig } from "vite";
import { mkdir } from "fs/promises";
import sharp from "sharp";

const htmlCache = new Map<string, CheerioAPI>();

function parseHtml(key: string, content: string, noCache: boolean) {
  if (!noCache && htmlCache.has(key)) return htmlCache.get(key) as CheerioAPI;
  const $ = load(content);
  htmlCache.set(key, $);
  return $;
}

export default defineConfig({
  build: {
    assetsInlineLimit: 0
  },
  plugins: [
    // just svgs since we are doing images separately
    ViteImageOptimizer({ include: /\.svg$/ }),
    ViteMinifyPlugin(),
    {
      name: "html-imports",
      transformIndexHtml: {
        order: "pre",
        handler: async (html, ctx) => {
          const $ = parseHtml(ctx.filename, html, !!ctx.server);
          $('link[rel="import"]').each((_, i) => {
            const fileName = $(i).attr("href");
            if (!fileName) return;

            const content = readFileSync(join(ctx.filename, "..", fileName), "utf-8");
            $(i).replaceWith(content);
          });

          return $.html();
        }
      }
    },
    {
      name: "html-image-sizing",
      transformIndexHtml: {
        order: "pre",
        handler: async (html, ctx) => {
          const $ = parseHtml(ctx.filename, html, !!ctx.server);
          $(".emoji, .badge").each((_, img) => {
            const $img = $(img);
            $img.attr("width", "25");
            $img.attr("height", "25");
          });

          $(".card-icon").each((_, img) => {
            const $img = $(img);
            $img.attr("width", "75");
            $img.attr("height", "75");
          });

          return $.html();
        }
      }
    },
    {
      name: "html-image-optimization",
      apply: "build",
      transformIndexHtml: {
        order: "pre",
        handler: async (html, ctx) => {
          const images = [] as { src: string; dest: string; width?: number; height?: number }[];

          const $ = parseHtml(ctx.filename, html, !!ctx.server);
          $("img").each((_, img) => {
            const $img = $(img);

            const src = $img.attr("src");
            const width = $img.attr("width");
            const height = $img.attr("height");
            if (!src || src.endsWith(".svg")) return;

            const dest = join(
              "assets",
              "dist",
              src.replace(extname(src), width && height ? `_${width}x${height}.webp` : ".webp")
            );

            $img.attr("src", dest);
            images.push({
              src,
              dest,
              width: width ? parseInt(width) : undefined,
              height: height ? parseInt(height) : undefined
            });
          });

          for (const { src, dest, width, height } of images) {
            if (existsSync(dest)) continue;
            console.log("Optimizing image", src);
            await mkdir(dirname(dest), { recursive: true });
            await sharp(join(ctx.filename, "..", src), { animated: true }).resize(width, height).toFile(dest);
          }

          return $.html();
        }
      }
    }
  ]
});
