window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  let scrollTop;
  let scrollLeft;
  for (const element of event.path) {
    if (isRoot(element)) break;
    if (element.scrollHeight > element.clientHeight) {
      scrollTop = element.scrollTop;
      scrollLeft = element.scrollLeft;
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