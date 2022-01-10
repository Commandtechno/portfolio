window.addEventListener(
  "touchmove",
  event => {
    let element = event.target;
    while (element.parentElement) {
      if (element === document.body) break;
      if (element.scrollHeight > element.clientHeight) return;
      element = element.parentElement;
    }

    event.preventDefault();
  },
  { passive: false }
);
