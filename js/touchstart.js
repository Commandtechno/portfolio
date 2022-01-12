window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  let scrollTop;
  let scrollLeft;
  for (const element of event.path || event.composedPath()) {
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