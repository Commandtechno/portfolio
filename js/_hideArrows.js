function hideArrows() {
  if (!arrows) return;

  const elements = document.getElementsByClassName("arrow");
  for (const element of elements) {
    function decrease() {
      if (element.style.opacity <= 0) {
        arrows = false;
        return;
      }

      element.style.opacity -= 0.1;
      setTimeout(decrease, 10);
    }

    decrease();
  }
}