window.addEventListener(
  "touchmove",
  event => {
    event.preventDefault();

    if (!startTouch) return;
    for (const element of event.path) {
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