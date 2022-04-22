import { Dir } from "../constants";
import { canScrollX, canScrollY } from "../util/canScroll";
import { isRoot } from "../util/isRoot";
import { move } from "../util/move";

let startTouch: {
  x: number;
  y: number;

  scrollTop: number;
  scrollLeft: number;

  initialScrollTop: number;
  initialScrollLeft: number;
};

window.addEventListener(
  "touchmove",
  event => {
    event.preventDefault();

    if (!startTouch) return;
    for (const element of event.composedPath() as HTMLElement[]) {
      if (isRoot(element)) break;
      if (canScrollX(element)) {
        const deltaX = startTouch.x - event.touches[0].clientX;
        element.scrollLeft = startTouch.scrollLeft + deltaX;
        break;
      }

      if (canScrollY(element)) {
        const deltaY = startTouch.y - event.touches[0].clientY;
        element.scrollTop = startTouch.scrollTop + deltaY;
        break;
      }
    }
  },
  { passive: false }
);

window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const touch = event.touches.item(0);
  let scrollTop: number;
  let scrollLeft: number;

  for (const element of event.composedPath() as HTMLElement[]) {
    if (isRoot(element)) break;
    if (canScrollX(element)) {
      scrollLeft = element.scrollLeft;
      if (scrollTop) break;
    }

    if (canScrollY(element)) {
      scrollTop = element.scrollTop;
      break;
    }
  }

  startTouch = {
    x: touch.clientX,
    y: touch.clientY,

    scrollTop,
    scrollLeft,

    initialScrollTop: scrollTop,
    initialScrollLeft: scrollLeft
  };
});

window.addEventListener("touchend", event => {
  if (!startTouch) return;
  const touch = event.changedTouches.item(0);
  const deltaX = touch.clientX - startTouch.x;
  const deltaY = touch.clientY - startTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    for (const element of event.composedPath() as HTMLElement[]) {
      if (isRoot(element)) break;
      if (canScrollX(element)) {
        if (startTouch.scrollLeft === 0 && element.scrollTop === 0) move(Dir.Left);
        if (
          startTouch.scrollLeft === element.scrollWidth - element.clientWidth &&
          element.scrollLeft === element.scrollWidth - element.clientWidth
        )
          move(Dir.Right);

        startTouch = null;
        return;
      }
    }

    if (deltaX > 0) move(Dir.Left);
    else if (deltaX < 0) move(Dir.Right);
  } else {
    for (const element of event.composedPath() as HTMLElement[]) {
      if (isRoot(element)) break;
      if (canScrollY(element)) {
        if (startTouch.initialScrollTop === 0 && element.scrollTop === 0) move(Dir.Up);
        if (
          startTouch.initialScrollTop === element.scrollHeight - element.clientHeight &&
          element.scrollTop === element.scrollHeight - element.clientHeight
        )
          move(Dir.Down);

        startTouch = null;
        return;
      }
    }

    if (deltaY > 0) move(Dir.Up);
    else if (deltaY < 0) move(Dir.Down);
  }

  startTouch = null;
});