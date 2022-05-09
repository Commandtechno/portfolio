import { existsSync, rmSync } from "fs";

if (existsSync("prebuild")) rmSync("prebuild", { recursive: true });