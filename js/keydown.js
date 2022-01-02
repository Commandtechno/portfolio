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
  }
});

window.onload = () => {
  const tab = new URL(window.location).searchParams.get("tab");

  switch (tab) {
    case "about":
      move(D.Up);
      break;

    case "contact":
      move(D.Down);
      break;

    case "gfx":
      move(D.Left);
      break;

    case "dev":
      move(D.Right);
      break;
  }

  const images = document.getElementsByTagName("img");
  for (const image of images) {
    if (!image.alt) alert("Missing alt attribute on image: " + image.src);
    tippy(image, {
      content: image.alt
    });
  }
};