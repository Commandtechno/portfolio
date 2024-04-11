/*
  enums but not enums because they dont need to be enumerated 🗿
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
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3
} as const;

// states
export const State = {
  Center: 0,
  Top: 1,
  Bottom: 2,
  Left: 3,
  Right: 4
} as const;

// positions
export const Pos = {
  Center: [0, 0],
  Top: [0, -100],
  Bottom: [0, 100],
  Left: [-100, 0],
  Right: [100, 0]
} as const;
