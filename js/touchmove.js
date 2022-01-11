window.addEventListener(
  "touchmove",
  event => {
    event.preventDefault();

    if (!startTouch) return;
    for (const element of event.path) {
      if (isRoot(element)) break;
      if (element.scrollHeight > element.clientHeight) {
        const deltaY = startTouch.y - event.touches[0].clientY;
        element.scrollTop = startTouch.scrollTop + deltaY;
        break;
      }

      if (element.scrollWidth > element.clientWidth) {
        const deltaX = startTouch.x - event.touches[0].clientX;
        element.scrollLeft = startTouch.scrollLeft + deltaX;
        break;
      }
    }
  },
  { passive: false }
);