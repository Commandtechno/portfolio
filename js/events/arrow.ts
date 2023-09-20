import { move } from "../util/move";
import { Dir } from "../constants";
import { $ } from "../util/$";

const UP = $<HTMLDivElement>("arrow-up");
const DOWN = $<HTMLDivElement>("arrow-down");
const LEFT = $<HTMLDivElement>("arrow-left");
const RIGHT = $<HTMLDivElement>("arrow-right");

UP.addEventListener("click", () => move(Dir.Up));
DOWN.addEventListener("click", () => move(Dir.Down));
LEFT.addEventListener("click", () => move(Dir.Left));
RIGHT.addEventListener("click", () => move(Dir.Right));
