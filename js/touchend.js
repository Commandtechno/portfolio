window.addEventListener("touchend", event => {
  if (!startTouch) return;
  const [touch] = event.changedTouches;

  const deltaX = touch.clientX - startTouch.x;
  const deltaY = touch.clientY - startTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) move(D.Left);
    else if (deltaX < 0) move(D.Right);
  } else {
    if (deltaY > 0) move(D.Up);
    else if (deltaY < 0) move(D.Down);
  }

  startTouch = null;
});