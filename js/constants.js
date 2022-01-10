// activity types
const A = {
  Game: 0,
  Streaming: 1,
  Listening: 2,
  Watching: 3,
  Custom: 4,
  Competing: 5
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
  Top: [0, -100],
  Bottom: [0, 100],
  Left: [-100, 0],
  Right: [100, 0]
};

let state = "center";
let arrows = true;
let isPending = false;
let startTouch;