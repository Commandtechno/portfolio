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
let startTouch = null;

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
const nonScrollable = new Set(["profile", "profile-avatar-container"]);

function canScrollX(element) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollWidth > element.clientWidth;
}

function canScrollY(element) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollHeight > element.clientHeight;
}
function isRoot(element) {
  return element === document.body || element === document.documentElement;
}

console.log("hello inspect elementer, thank you for looking at my website");
console.log(
  "if you are testing my website on mobile, i reccomend opening a new tab since chrome switching to mobile keeps the element context from desktop and messes it up lol"
);
console.log("ill add more stuff here but pog ok bye");

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

  for (const element of document.querySelectorAll("[alt]")) {
    const alt = element.getAttribute("alt");
    element.title = alt;
    element.ariaLabel = alt;
  }

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

  const ws = new WebSocket("wss://commandtechno.com");
  let interval;

  ws.onclose = console.log;

  ws.onmessage = message => {
    const presence = JSON.parse(message.data);
    const isStreaming = presence.activities.some(activity => activity.type === A.Streaming);

    if (isStreaming) {
      statusElement.src = "assets/status/streaming.svg";
      tooltip(statusContainerElement, "Streaming");
      show(statusContainerElement);
    } else
      switch (presence.status) {
        case "online":
          statusElement.src = "assets/status/online.svg";
          tooltip(statusElement, "Online");
          show(statusContainerElement);
          break;

        case "dnd":
          statusElement.src = "assets/status/dnd.svg";
          tooltip(statusElement, "Do Not Disturb");
          show(statusContainerElement);
          break;

        case "idle":
          statusElement.src = "assets/status/idle.svg";
          tooltip(statusElement, "Idle");
          show(statusContainerElement);
          break;

        case "offline":
          statusElement.src = "assets/status/offline.svg";
          tooltip(statusElement, "Offline");
          show(statusContainerElement);
          break;
      }

    const activity = presence.activities.find(activity => activity.type !== A.Custom);
    if (!activity) {
      hide(activityElement);
      return;
    }

    let { name, details, state } = activity;
    let barCompleted;
    let barTotal;

    if (activity.id === "spotify:1") {
      activityElement.href = "https://open.spotify.com/track/" + activity.sync_id;
      activityElement.classList.add("hover");

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
    } else {
      activityElement.removeAttribute("href");
      activityElement.classList.remove("hover");
    }

    if (activity.party?.size) {
      const [min, max] = activity.party.size;
      if (state) state += " (" + min + " of " + max + ")";
      else state = "(" + min + " of " + max + ")";
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

    if (barCompleted && barTotal) {
      barElement.style.width = (barCompleted / barTotal) * 100 + "%";
      show(barContainerElement);
    } else hide(barContainerElement);

    if (activity.assets.large_image) {
      largeImageElement.src = getAssetURL(activity.application_id, activity.assets.large_image);
      if (activity.assets.large_text) tooltip(largeImageElement, activity.assets.large_text);
      show(largeImageElement);
    } else hide(largeImageElement);

    if (activity.assets.large_image && activity.assets.small_image) {
      smallImageElement.src = getAssetURL(activity.application_id, activity.assets.small_image);
      if (activity.assets.small_text) tooltip(smallImageElement, activity.assets.small_text);
      show(smallImageContainerElement);
    } else hide(smallImageContainerElement);

    show(activityElement);
  };
});
window.addEventListener("wheel", event => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    for (const element of event.path || event.composedPath()) {
      if (isRoot(element)) break;
      if (canScrollX(element)) return;
    }

    if (event.deltaX > 0) move(D.Right);
    else if (event.deltaX < 0) move(D.Left);
  } else {
    for (const element of event.path) {
      if (isRoot(element)) break;
      if (canScrollY(element)) return;
    }

    if (event.deltaY > 0) move(D.Down);
    else if (event.deltaY < 0) move(D.Up);
  }
});
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
  }
});
window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  let scrollTop;
  let scrollLeft;
  for (const element of event.path) {
    if (isRoot(element)) break;

    if (canScrollX(element)) {
      scrollLeft = element.scrollLeft;
      if (scrollTop) break;
    }

    if (canScrollY(element)) {
      scrollTop = element.scrollTop;
      break;
    }
  }

  startTouch = {
    x: touch.clientX,
    y: touch.clientY,

    scrollTop,
    scrollLeft,

    initialScrollTop: scrollTop,
    initialScrollLeft: scrollLeft
  };
});
window.addEventListener(
  "touchmove",
  event => {
    event.preventDefault();

    if (!startTouch) return;
    for (const element of event.path) {
      if (isRoot(element)) break;

      if (canScrollX(element)) {
        const deltaX = startTouch.x - event.touches[0].clientX;
        element.scrollLeft = startTouch.scrollLeft + deltaX;
        break;
      }

      if (canScrollY(element)) {
        const deltaY = startTouch.y - event.touches[0].clientY;
        element.scrollTop = startTouch.scrollTop + deltaY;
        break;
      }
    }
  },
  { passive: false }
);
window.addEventListener("touchend", event => {
  if (!startTouch) return;
  const [touch] = event.changedTouches;

  const deltaX = touch.clientX - startTouch.x;
  const deltaY = touch.clientY - startTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    for (const element of event.path) {
      if (isRoot(element)) break;
      if (canScrollX(element)) {
        if (startTouch.initalScrollLeft === 0 && element.scrollTop === 0) move(D.Left);
        if (
          startTouch.initalScrollLeft === element.scrollWidth - element.clientWidth &&
          element.initalScrollLeft === element.scrollWidth - element.clientWidth
        )
          move(D.Right);

        startTouch = null;
        return;
      }
    }

    if (deltaX > 0) move(D.Left);
    else if (deltaX < 0) move(D.Right);
  } else {
    for (const element of event.path) {
      if (isRoot(element)) break;
      if (canScrollY(element)) {
        if (startTouch.initialScrollTop === 0 && element.scrollTop === 0) move(D.Up);
        if (
          startTouch.initialScrollTop === element.scrollHeight - element.clientHeight &&
          element.scrollTop === element.scrollHeight - element.clientHeight
        )
          move(D.Down);

        startTouch = null;
        return;
      }
    }

    if (deltaY > 0) move(D.Up);
    else if (deltaY < 0) move(D.Down);
  }

  startTouch = null;
});