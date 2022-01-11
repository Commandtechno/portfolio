window.addEventListener("keydown", event => {
  if (event.target !== document.body && event.target !== document.body) return;
  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "w":
      event.preventDefault();
      move(D.Up);
      break;

    case "ArrowDown":
    case "S":
    case "s":
      event.preventDefault();
      move(D.Down);
      break;

    case "ArrowLeft":
    case "A":
    case "a":
      event.preventDefault();
      move(D.Left);
      break;

    case "ArrowRight":
    case "D":
    case "d":
      event.preventDefault();
      move(D.Right);
      break;

    case ".":
      window.location.href = "https://github.dev/commandtechno/portfolio";
      break;
  }
});