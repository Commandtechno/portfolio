import { Dir, Pos, State } from "../constants";
import { animate } from "./animate";
import { setTab } from "./setTab";
import { $ } from "./$";

let state: typeof State[keyof typeof State] = State.Center;
let isPending = false;

const CENTER = $<HTMLDivElement>("center");
const TOP = $<HTMLDivElement>("top");
const BOTTOM = $<HTMLDivElement>("bottom");
const LEFT = $<HTMLDivElement>("left");
const RIGHT = $<HTMLDivElement>("right");

export async function move(direction: typeof Dir[keyof typeof Dir]) {
  if (isPending) return;
  isPending = true;

  switch (direction) {
    case Dir.Up:
      switch (state) {
        case State.Center:
          state = State.Top;
          setTab("blog");
          await animate([
            [CENTER, Pos.Bottom],
            [TOP, Pos.Center]
          ]);
          break;

        case State.Bottom:
          state = State.Center;
          setTab();
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
          setTab("contact");
          await animate([
            [CENTER, Pos.Top],
            [BOTTOM, Pos.Center]
          ]);
          break;

        case State.Top:
          state = State.Center;
          setTab();
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
          setTab("gfx");
          await animate([
            [CENTER, Pos.Right],
            [LEFT, Pos.Center]
          ]);
          break;

        case State.Right:
          state = State.Center;
          setTab();
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
          setTab("dev");
          await animate([
            [CENTER, Pos.Left],
            [RIGHT, Pos.Center]
          ]);
          break;

        case State.Left:
          state = State.Center;
          setTab();
          await animate([
            [CENTER, Pos.Center],
            [LEFT, Pos.Left]
          ]);
          break;
      }
  }

  isPending = false;
}