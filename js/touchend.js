window.addEventListener("touchend", event => {
  if (!startTouch) return;
  const [touch] = event.changedTouches;

  const deltaX = touch.clientX - startTouch.x;
  const deltaY = touch.clientY - startTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    for (const element of event.path || event.composedPath()) {
      if (isRoot(element)) break;
      if (canScrollX(element)) {
        if (startTouch.initalScrollLeft === 0 && element.scrollTop === 0) move(D.Left);
        if (
          startTouch.initalScrollLeft === element.scrollWidth - element.clientWidth &&
          element.initalScrollLeft === element.scrollWidth - element.clientWidth
        )
          move(D.Right);

        startTouch = null;
        return;
      }
    }

    if (deltaX > 0) move(D.Left);
    else if (deltaX < 0) move(D.Right);
  } else {
    for (const element of event.path || event.composedPath()) {
      if (isRoot(element)) break;
      if (canScrollY(element)) {
        if (startTouch.initialScrollTop === 0 && element.scrollTop === 0) move(D.Up);
        if (
          startTouch.initialScrollTop === element.scrollHeight - element.clientHeight &&
          element.scrollTop === element.scrollHeight - element.clientHeight
        )
          move(D.Down);

        startTouch = null;
        return;
      }
    }

    if (deltaY > 0) move(D.Up);
    else if (deltaY < 0) move(D.Down);
  }

  startTouch = null;
});