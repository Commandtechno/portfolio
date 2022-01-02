window.addEventListener(
  "touchmove",
  event => event.target === document.body && event.preventDefault(),
  { passive: false }
);