import { $ } from "../util/$";

const guide = $<HTMLParagraphElement>("guide");
guide.innerText =
  "ontouchstart" in window ? "Swipe up, down, left, or right to navigate" : "Use your arrow keys to navigate";
