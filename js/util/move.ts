import { Dir, Pos, State } from "../constants";
import { animate } from "./animate";
import { setHash } from "./hash";
import { $ } from "./$";

let state: (typeof State)[keyof typeof State] = State.Center;
let isPending = false;

const CENTER = $<HTMLDivElement>("center");
const TOP = $<HTMLDivElement>("top");
const BOTTOM = $<HTMLDivElement>("bottom");
const LEFT = $<HTMLDivElement>("left");
const RIGHT = $<HTMLDivElement>("right");

const ARROW_UP = $<HTMLDivElement>("arrow-up");
const ARROW_DOWN = $<HTMLDivElement>("arrow-down");
const ARROW_LEFT = $<HTMLDivElement>("arrow-left");
const ARROW_RIGHT = $<HTMLDivElement>("arrow-right");

function hideArrows(...arrows: HTMLDivElement[]) {
  arrows.forEach(arrow => (arrow.style.opacity = "0"));
  setTimeout(() => arrows.forEach(arrow => (arrow.style.display = "none")), 200);
}

function showArrows(...arrows: HTMLDivElement[]) {
  arrows.forEach(arrow => (arrow.style.display = null));
  setTimeout(() => arrows.forEach(arrow => (arrow.style.opacity = "1")), 200);
}

export async function move(direction: (typeof Dir)[keyof typeof Dir]) {
  if (isPending) return;
  isPending = true;

  switch (direction) {
    case Dir.Up:
      switch (state) {
        case State.Center:
          state = State.Top;
          setHash("blog");
          hideArrows(ARROW_UP, ARROW_LEFT, ARROW_RIGHT);
          await animate([
            [CENTER, Pos.Bottom],
            [TOP, Pos.Center]
          ]);
          break;

        case State.Bottom:
          state = State.Center;
          setHash();
          showArrows(ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT);
          await animate([
            [CENTER, Pos.Center],
            [BOTTOM, Pos.Bottom]
          ]);
          break;
      }
      break;

    case Dir.Down:
      switch (state) {
        case State.Center:
          state = State.Bottom;
          setHash("contact");
          hideArrows(ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT);
          await animate([
            [CENTER, Pos.Top],
            [BOTTOM, Pos.Center]
          ]);
          break;

        case State.Top:
          state = State.Center;
          setHash();
          showArrows(ARROW_UP, ARROW_LEFT, ARROW_RIGHT);
          await animate([
            [CENTER, Pos.Center],
            [TOP, Pos.Top]
          ]);
          break;
      }
      break;

    case Dir.Left:
      switch (state) {
        case State.Center:
          state = State.Left;
          setHash("gfx");
          hideArrows(ARROW_UP, ARROW_DOWN, ARROW_LEFT);
          await animate([
            [CENTER, Pos.Right],
            [LEFT, Pos.Center]
          ]);
          break;

        case State.Right:
          state = State.Center;
          setHash();
          showArrows(ARROW_UP, ARROW_DOWN, ARROW_RIGHT);
          await animate([
            [CENTER, Pos.Center],
            [RIGHT, Pos.Right]
          ]);
          break;
      }
      break;

    case Dir.Right:
      switch (state) {
        case State.Center:
          state = State.Right;
          setHash("dev");
          hideArrows(ARROW_UP, ARROW_DOWN, ARROW_RIGHT);
          await animate([
            [CENTER, Pos.Left],
            [RIGHT, Pos.Center]
          ]);
          break;

        case State.Left:
          state = State.Center;
          setHash();
          showArrows(ARROW_UP, ARROW_DOWN, ARROW_LEFT);
          await animate([
            [CENTER, Pos.Center],
            [LEFT, Pos.Left]
          ]);
          break;
      }
  }

  isPending = false;
}
