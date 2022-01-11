// activity types
const A = {
  Game: 0,
  Streaming: 1,
  Listening: 2,
  Watching: 3,
  Custom: 4,
  Competing: 5
};

// directions
const D = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right"
};

// states
const S = {
  Center: "center",
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right"
};

// positions
const P = {
  Center: [0, 0],
  Top: [0, -100],
  Bottom: [0, 100],
  Left: [-100, 0],
  Right: [100, 0]
};

let state = "center";
let arrows = true;
let isPending = false;
let startTouch;

function show(element) {
  element.style.display = null;
}
function hide(element) {
  element.style.display = "none";
}
function anim(actions) {
  return Promise.all(
    actions.map(([state, [targetX, targetY]]) => {
      const element = document.getElementById(state);
      let shouldHide = false;

      if (targetX === P.Center[0] && targetY === P.Center[1]) element.style.visibility = null;
      else shouldHide = true;

      element.style.left = targetX + "vw";
      element.style.top = targetY + "vh";

      return new Promise(resolve =>
        setTimeout(() => {
          if (shouldHide) element.style.visibility = "hidden";
          resolve();
        }, 500)
      );
    })
  );
}
async function move(direction) {
  if (isPending) return;
  isPending = true;

  switch (direction) {
    case D.Up:
      switch (state) {
        case S.Center:
          state = S.Top;
          await anim([
            [S.Center, P.Bottom],
            [S.Top, P.Center]
          ]);
          break;

        case S.Bottom:
          state = S.Center;
          await anim([
            [S.Center, P.Center],
            [S.Bottom, P.Bottom]
          ]);
          break;
      }
      break;

    case D.Down:
      switch (state) {
        case S.Center:
          state = S.Bottom;
          await anim([
            [S.Center, P.Top],
            [S.Bottom, P.Center]
          ]);
          break;

        case S.Top:
          state = S.Center;
          await anim([
            [S.Center, P.Center],
            [S.Top, P.Top]
          ]);
          break;
      }
      break;

    case D.Left:
      switch (state) {
        case S.Center:
          state = S.Left;
          await anim([
            [S.Center, P.Right],
            [S.Left, P.Center]
          ]);
          break;

        case S.Right:
          state = S.Center;
          await anim([
            [S.Center, P.Center],
            [S.Right, P.Right]
          ]);
          break;
      }
      break;

    case D.Right:
      switch (state) {
        case S.Center:
          state = S.Right;
          await anim([
            [S.Center, P.Left],
            [S.Right, P.Center]
          ]);
          break;

        case S.Left:
          state = S.Center;
          await anim([
            [S.Center, P.Center],
            [S.Left, P.Left]
          ]);
          break;
      }
  }

  isPending = false;
}

function tooltip(element, content) {
  element.alt = content;
  element.title = content;
  element.ariaLabel = content;
}
function getAssetURL(application, asset) {
  if (!asset) return null;
  if (asset.includes(":")) {
    const [platform, id] = asset.split(":");
    switch (platform) {
      case "mp":
        return `https://media.discordapp.net/${id}`;
      case "spotify":
        return `https://i.scdn.co/image/${id}`;
      case "youtube":
        return `https://i.ytimg.com/vi/${id}/hqdefault_live.jpg`;
      case "twitch":
        return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${id}.png`;
      default:
        return null;
    }
  }

  return "https://cdn.discordapp.com/app-assets/" + application + "/" + asset;
}

window.addEventListener("wheel", ({ deltaX, deltaY }) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) move(D.Right);
    else if (deltaX < 0) move(D.Left);
  } else {
    if (deltaY > 0) move(D.Down);
    else if (deltaY < 0) move(D.Up);
  }
});
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
window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  startTouch = {
    x: touch.clientX,
    y: touch.clientY
  };
});
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

window.addEventListener("touchend", event => {
  if (!startTouch) return;
  const [touch] = event.changedTouches;

  const deltaX = touch.clientX - startTouch.x;
  const deltaY = touch.clientY - startTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) move(D.Left);
    else if (deltaX < 0) move(D.Right);
  } else {
    if (deltaY > 0) move(D.Up);
    else if (deltaY < 0) move(D.Down);
  }

  startTouch = null;
});