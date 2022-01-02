// keys
const K = {
  Up: "ArrowUp",
  Down: "ArrowDown",
  Left: "ArrowLeft",
  Right: "ArrowRight"
};

// directions
const D = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right"
};

// states
const S = {
  Center: "center",
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right"
};

// positions
const P = {
  Center: [0, 0],
  Top: [0, -10],
  Bottom: [0, 10],
  Left: [-10, 0],
  Right: [10, 0]
};

let state = "center";
let arrows = true;
let isPending = false;
let startTouch;