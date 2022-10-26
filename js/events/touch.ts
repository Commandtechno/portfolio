import { move } from "../util/move";
import { Dir } from "../constants";

interface StartTouch {
  x: number;
  y: number;
  initialPath: {
    element: Element;
    scrollTop: number;
    scrollLeft: number;
  }[];
}

const startTouches: { [key: number]: StartTouch } = {};

window.addEventListener("touchstart", event => {
  const touch = event.touches.item(0);
  const initialPath: StartTouch["initialPath"] = [];
  for (const element of event.composedPath() as HTMLElement[])
    initialPath.push({ element, scrollTop: element.scrollTop, scrollLeft: element.scrollLeft });

  startTouches[touch.identifier] = {
    x: touch.clientX,
    y: touch.clientY,
    initialPath
  };
});

window.addEventListener("touchend", event => {
  const touch = event.changedTouches.item(0);
  const startTouch = startTouches[touch.identifier];
  if (!startTouch) return;
  for (const { element, scrollTop, scrollLeft } of startTouch.initialPath)
    if (element.scrollTop !== scrollTop || element.scrollLeft !== scrollLeft) return;

  const deltaX = touch.clientX - startTouch.x;
  const deltaY = touch.clientY - startTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) move(Dir.Left);
    else if (deltaX < 0) move(Dir.Right);
  } else {
    if (deltaY > 0) move(Dir.Up);
    else if (deltaY < 0) move(Dir.Down);
  }

  delete startTouches[touch.identifier];
});