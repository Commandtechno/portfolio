window.addEventListener("wheel", event => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    for (const element of event.path || event.composedPath()) {
      if (isRoot(element)) break;
      if (canScrollX(element)) return;
    }

    if (event.deltaX > 10) move(D.Right);
    else if (event.deltaX < -10) move(D.Left);
  } else {
    for (const element of event.path) {
      if (isRoot(element)) break;
      if (canScrollY(element)) return;
    }

    if (event.deltaY > 10) move(D.Down);
    else if (event.deltaY < -10) move(D.Up);
  }
});