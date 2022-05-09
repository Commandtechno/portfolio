import { Dir, Pos, State } from "../constants";
import { animate } from "./animate";
import { setTab } from "./setTab";

let state: typeof State[keyof typeof State] = State.Center;
let isPending = false;

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
            [State.Center, Pos.Bottom],
            [State.Top, Pos.Center]
          ]);
          break;

        case State.Bottom:
          state = State.Center;
          setTab();
          await animate([
            [State.Center, Pos.Center],
            [State.Bottom, Pos.Bottom]
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
            [State.Center, Pos.Top],
            [State.Bottom, Pos.Center]
          ]);
          break;

        case State.Top:
          state = State.Center;
          setTab();
          await animate([
            [State.Center, Pos.Center],
            [State.Top, Pos.Top]
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
            [State.Center, Pos.Right],
            [State.Left, Pos.Center]
          ]);
          break;

        case State.Right:
          state = State.Center;
          setTab();
          await animate([
            [State.Center, Pos.Center],
            [State.Right, Pos.Right]
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
            [State.Center, Pos.Left],
            [State.Right, Pos.Center]
          ]);
          break;

        case State.Left:
          state = State.Center;
          setTab();
          await animate([
            [State.Center, Pos.Center],
            [State.Left, Pos.Left]
          ]);
          break;
      }
  }

  isPending = false;
}