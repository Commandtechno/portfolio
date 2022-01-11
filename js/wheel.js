window.addEventListener("wheel", event => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    for (const element of event.path) {
      console.log(element);
      if (isRoot(element)) break;
      if (element.scrollWidth > element.clientWidth) return;
    }

    if (event.deltaX > 0) move(D.Right);
    else if (event.deltaX < 0) move(D.Left);
  } else {
    for (const element of event.path) {
      console.log(element, element.scrollHeight, element.clientHeight);
      if (isRoot(element)) break;
      if (element.scrollHeight > element.clientHeight) return;
    }

    if (event.deltaY > 0) move(D.Down);
    else if (event.deltaY < 0) move(D.Up);
  }
});