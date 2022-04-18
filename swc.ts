import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import * as swc from "@swc/core";

const chunks: Buffer[] = [];
process.stdin.on("data", chunk => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = Buffer.concat(chunks).toString();
  const output = swc.minifySync(input, { mangle: { props: {} } });
  if (!existsSync(resolve(__dirname, "build"))) mkdirSync(resolve(__dirname, "build"));
  writeFileSync(resolve(__dirname, "build", "index.js"), output.code, "utf-8");
});