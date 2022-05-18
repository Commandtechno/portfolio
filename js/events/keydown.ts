import { move } from "../util/move";
import { Dir } from "../constants";

window.addEventListener("keydown", event => {
  if (event.target !== document.body) return;

  switch (event.key) {
    case "ArrowUp":
    case "W":
    case "w":
      event.preventDefault();
      move(Dir.Up);
      break;

    case "ArrowDown":
    case "S":
    case "s":
      event.preventDefault();
      move(Dir.Down);
      break;

    case "ArrowLeft":
    case "A":
    case "a":
      event.preventDefault();
      move(Dir.Left);
      break;

    case "ArrowRight":
    case "D":
    case "d":
      event.preventDefault();
      move(Dir.Right);
      break;

    case ".":
      window.location.href = "https://github.dev/commandtechno/portfolio";
      break;
  }
});