import { canScrollX, canScrollY } from "../util/canScroll";
import { move } from "../util/move";
import { Dir } from "../constants";

window.addEventListener("wheel", event => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    for (const element of event.composedPath() as HTMLElement[]) if (canScrollX(element)) return;

    if (event.deltaX > 10) move(Dir.Right);
    else if (event.deltaX < -10) move(Dir.Left);
  } else {
    for (const element of event.composedPath() as HTMLElement[]) if (canScrollY(element)) return;

    if (event.deltaY > 10) move(Dir.Down);
    else if (event.deltaY < -10) move(Dir.Up);
  }
});