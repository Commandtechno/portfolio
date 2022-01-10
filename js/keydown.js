window.addEventListener("keydown", event => {
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

    case "K":
    case "k":
      if (event.ctrlKey) {
        event.preventDefault();
        document.getElementById("profile-avatar").src = "assets/gaming.png";
        document.getElementById("profile").parentElement.children[1].innerText = "Boop Dog";
        document.getElementById("profile").parentElement.children[2].innerText =
          "Hello there. I'm a gamer and gamer. I'm interested in all things gaming, and gaming! Here you will find my gamings, and the various things I have gamed on.";
      }
      break;
  }
});