function showArrows() {
  if (arrows) return;

  const elements = document.getElementsByClassName("arrow");
  for (const element of elements) {
    function increase() {
      if (element.style.opacity >= 1) {
        arrows = true;
        return;
      }

      element.style.opacity = element.style.opacity * 1 + 0.1;
      setTimeout(increase, 10);
    }

    increase();
  }
}