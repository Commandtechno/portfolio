/*
  enums but not enums because they dont need to be enumerated
*/

// activity types
export const ActivityType = {
  Game: 0,
  Streaming: 1,
  Listening: 2,
  Watching: 3,
  Custom: 4,
  Competing: 5
} as const;

// directions
export const Dir = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right"
} as const;

// states
export const State = {
  Center: "center",
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right"
} as const;

// positions
export const Pos = {
  Center: [0, 0],
  Top: [0, -100],
  Bottom: [0, 100],
  Left: [-100, 0],
  Right: [100, 0]
} as const;