window.addEventListener(
  "touchmove",
  event => {
    event.preventDefault();
    for (const element of event.path) {
      if (element === document.body) break;
      if (element.scrollHeight > element.clientHeight) {
        const deltaY = startTouch.y - event.touches[0].clientY;
        element.scrollTop = startTouch.scrollTop + deltaY;
        break;
      }
    }
  },
  { passive: false }
);