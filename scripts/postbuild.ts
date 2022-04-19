import { existsSync, rmSync } from "fs";

if (existsSync("index.html")) rmSync("index.html");