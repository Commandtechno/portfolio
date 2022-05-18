import { $ } from "../util/$";

const guide = $<HTMLParagraphElement>("guide");
guide.innerText =
  "ontouchstart" in window
    ? "Swipe left, right, up, or down to navigate"
    : "Use your arrow keys to navigate";