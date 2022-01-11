window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  let scrollTop;
  for (const element of event.path) {
    if (element === document.body) break;
    if (element.scrollHeight > element.clientHeight) {
      scrollTop = element.scrollTop;
      break;
    }
  }

  startTouch = {
    x: touch.clientX,
    y: touch.clientY,
    scrollTop
  };
});