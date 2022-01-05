window.addEventListener("keydown", event => {
  switch (event.key) {
    case K.Up:
      move(D.Up);
      break;

    case K.Down:
      move(D.Down);
      break;

    case K.Left:
      move(D.Left);
      break;

    case K.Right:
      move(D.Right);
      break;

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