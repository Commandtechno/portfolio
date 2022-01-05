// anim.js
function anim(actions) {
  return Promise.all(
    actions.map(([state, [x, y]]) => {
      const element = document.getElementById(state);
      const animation = {
        left: `${x}vw`,
        top: `${y}vh`
      };

      let shouldHide = false;
      if (x === P.Center[0] && y === P.Center[1]) {
        show(element);
      } else {
        shouldHide = true;
      }

      return new Promise(resolve =>
        $(element).animate(animation, () => {
          if (shouldHide) hide(element);
          resolve();
        })
      );
    })
  );
}

// constants.js
// keys
const K = {
  Up: "ArrowUp",
  Down: "ArrowDown",
  Left: "ArrowLeft",
  Right: "ArrowRight"
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

// getAssetURL.js
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

// hide.js
function hide(element) {
  element.style.display = "none";
}

// keydown.js
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

// load.js
window.addEventListener("load", () => {
  const tab = new URL(window.location).searchParams.get("tab");

  switch (tab) {
    case "socials":
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

  // const images = document.getElementsByTagName("img");
  // for (const image of images) {
  //   if (!image.alt) alert("Missing alt attribute on image: " + image.src);
  //   tippy(image, {
  //     content: image.alt
  //     // placement: image.getAttribute("tooltip-placement") || "top"
  //   });
  // }

  const submit = document.getElementById("form-submit");
  submit.onclick = event => {
    const email = document.getElementById("form-email").value;
    const subject = document.getElementById("form-subject").value;
    const content = document.getElementById("form-content").value;
    console.log({ email, subject, content });
  };

  const statusContainerElement = document.getElementById("profile-avatar-status-container");
  const statusElement = document.getElementById("profile-avatar-status");
  const activityElement = document.getElementById("profile-activity");
  const largeImageElement = document.getElementById("profile-activity-large-image");
  const smallImageContainerElement = document.getElementById(
    "profile-activity-small-image-container"
  );
  const smallImageElement = document.getElementById("profile-activity-small-image");
  const nameElement = document.getElementById("profile-activity-name");
  const detailsElement = document.getElementById("profile-activity-details");
  const stateElement = document.getElementById("profile-activity-state");
  const barContainerElement = document.getElementById("profile-activity-bar-container");
  const barElement = document.getElementById("profile-activity-bar");

  const ws = new WebSocket("ws://localhost:3001");
  let interval;

  ws.onmessage = message => {
    const presence = JSON.parse(message.data);
    console.log(presence);

    statusElement.src = "assets/status/" + presence.status + ".png";
    show(statusContainerElement);

    const activity = presence.activities.find(activity => activity.type !== 4);
    if (!activity) {
      hide(activityElement);
      return;
    }

    let { name, details, state } = activity;
    let largeImage;
    let smallImage;
    let barCompleted;
    let barTotal;

    if (activity.assets.large_image)
      largeImage = getAssetURL(activity.application_id, activity.assets.large_image);

    if (activity.assets.small_image)
      smallImage = getAssetURL(activity.application_id, activity.assets.small_image);

    if (activity.id === "spotify:1") {
      activityElement.href = "https://open.spotify.com/track/" + activity.sync_id;
      if (activity.details) name = activity.details;
      if (activity.state) details = "by " + activity.state;
      if (activity.assets.large_text) state = "on " + activity.assets.large_text;
      if (activity.timestamps) {
        barCompleted = Date.now() - activity.timestamps.start;
        barTotal = activity.timestamps.end - activity.timestamps.start;

        clearInterval(interval);
        interval = setInterval(() => {
          barCompleted += 1000;
          barElement.style.width = (barCompleted / barTotal) * 100 + "%";
        }, 1000);
      }
    } else activityElement.removeAttribute("href");

    if (activity.party?.size) {
      const [min, max] = activity.party.size;
      state += " (" + min + " of " + max + ")";
    }

    if (name) {
      nameElement.innerText = name;
      show(nameElement);
    } else hide(nameElement);

    if (details) {
      detailsElement.innerText = details;
      show(detailsElement);
    } else hide(detailsElement);

    if (state) {
      stateElement.innerText = state;
      show(stateElement);
    } else hide(stateElement);

    if (largeImage) {
      largeImageElement.src = largeImage;
      show(largeImageElement);
    } else hide(largeImageElement);

    if (smallImage) {
      smallImageElement.src = smallImage;
      show(smallImageContainerElement);
    } else hide(smallImageContainerElement);

    if (barCompleted && barTotal) {
      barElement.style.width = (barCompleted / barTotal) * 100 + "%";
      show(barContainerElement);
    } else hide(barContainerElement);

    show(activityElement);
  };
});

// move.js
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

// show.js
function show(element) {
  element.style.display = null;
}

// touchend.js
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

// touchmove.js
window.addEventListener(
  "touchmove",
  event => event.target === document.body && event.preventDefault(),
  { passive: false }
);

// touchstart.js
window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  startTouch = {
    x: touch.clientX,
    y: touch.clientY
  };
});

// wheel.js
window.addEventListener("wheel", ({ deltaX, deltaY }) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) move(D.Right);
    else if (deltaX < 0) move(D.Left);
  } else {
    if (deltaY > 0) move(D.Down);
    else if (deltaY < 0) move(D.Up);
  }
});