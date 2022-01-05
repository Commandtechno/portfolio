// anim.js
function anim(actions) {
  return Promise.all(
    actions.map(([state, [x, y]]) => {
      const element = document.getElementById(state);
      const animation = {
        left: `${x}vw`,
        top: `${y}vh`
      };

      return new Promise(resolve => $(element).animate(animation, resolve));
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

  fetch("http://localhost:3001")
    .then(res => res.json())
    .then(presence => {
      console.log(presence);
      const activity = presence.activities.find(activity => activity.type !== 4);
      if (!activity) return;

      if (activity.assets.large_image) {
        const element = document.getElementById("profile-activity-large-image");
        const image = getAssetURL(activity.application_id, activity.assets.large_image);
        if (image) {
          element.src = image;
          element.style.display = null;
        }
      }

      if (activity.assets.small_image) {
        const element = document.getElementById("profile-activity-small-image");
        const image = getAssetURL(activity.application_id, activity.assets.small_image);
        if (image) {
          element.src = image;
          element.parentElement.style.display = null;
        }
      }

      if (activity.id === "spotify:1") {
        if (activity.details) {
          const element = document.getElementById("profile-activity-name");
          element.innerText = activity.details;
        }

        if (activity.state) {
          const element = document.getElementById("profile-activity-details");
          element.innerText = "by " + activity.state;
        }

        if (activity.assets.large_text) {
          const element = document.getElementById("profile-activity-state");
          element.innerText = "on " + activity.assets.large_text;
        }

        if (activity.timestamps) {
          const bar = document.getElementById("profile-activity-bar");
          const slider = document.getElementById("profile-activity-bar-slider");

          const completed = Date.now() - activity.timestamps.start;
          const total = activity.timestamps.end - activity.timestamps.start;

          slider.style.width = (completed / total) * 100 + "%";
          bar.style.display = null;
        }
      } else {
        if (activity.name) {
          const element = document.getElementById("profile-activity-name");
          element.innerText = activity.name;
        }

        if (activity.details) {
          const element = document.getElementById("profile-activity-details");
          element.innerText = activity.details;
        }

        if (activity.state) {
          const element = document.getElementById("profile-activity-state");
          if (activity.party?.size) {
            const [min, max] = activity.party.size;
            element.innerText = activity.state + " (" + min + " of " + max + ")";
          } else {
            element.innerText = activity.state;
          }
        }
      }

      const element = document.getElementById("profile-activity");
      element.style.display = null;
    });
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