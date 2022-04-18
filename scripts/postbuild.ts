import { existsSync, rmSync } from "fs";

if (existsSync("temp.html")) rmSync("temp.html");