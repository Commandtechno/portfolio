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
  Center: [1, 1],
  Top: [1, -12],
  Bottom: [1, 12],
  Left: [-12, 1],
  Right: [12, 1]
};

let state = "center";
let arrows = true;
let isPending = false;
let startTouch;

async function move(direction) {
  if (isPending) return;
  isPending = true;

  switch (direction) {
    case D.Up:
      switch (state) {
        case S.Center:
          state = S.Top;
          hideArrows();
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
          showArrows();
          break;

        default:
          quake();
      }
      break;

    case D.Down:
      switch (state) {
        case S.Center:
          state = S.Bottom;
          hideArrows();
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
          showArrows();
          break;

        default:
          quake();
      }
      break;

    case D.Left:
      switch (state) {
        case S.Center:
          state = S.Left;
          hideArrows();
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
          showArrows();
          break;

        default:
          quake();
      }
      break;

    case D.Right:
      switch (state) {
        case S.Center:
          state = S.Right;
          hideArrows();
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
          showArrows();
          break;

        default:
          quake();
      }
  }

  isPending = false;
}

function anim(actions) {
  return Promise.all(
    actions.map(([state, [x, y]]) => {
      const element = document.getElementById(state);
      const animation = {
        "margin-left": `${x * 10}vw`,
        "margin-top": `${y * 10}vh`
      };

      return new Promise(resolve => $(element).animate(animation, resolve));
    })
  );
}

function quake(i = 16) {
  document.body.style.marginTop = `${Math.random() * i - i / 2}px`;
  document.body.style.marginLeft = `${Math.random() * i - i / 2}px`;

  if (i > 0) {
    setTimeout(() => quake(i - 1), 16);
    return;
  }

  document.body.style.marginTop = "0";
  document.body.style.marginLeft = "0";
}

function showArrows() {
  if (arrows) return;

  const elements = document.getElementsByClassName("arrow");
  for (const element of elements) {
    function increase() {
      if (element.style.opacity >= 1) {
        arrows = true;
        return;
      }

      element.style.opacity = element.style.opacity * 1 + 0.1;
      setTimeout(increase, 10);
    }

    increase();
  }
}

function hideArrows() {
  if (!arrows) return;

  const elements = document.getElementsByClassName("arrow");
  for (const element of elements) {
    function decrease() {
      if (element.style.opacity <= 0) {
        arrows = false;
        return;
      }

      element.style.opacity -= 0.1;
      setTimeout(decrease, 10);
    }

    decrease();
  }
}

window.addEventListener("touchmove", event => event.preventDefault(), { passive: false });
window.addEventListener("touchstart", event => {
  if (startTouch) return;
  const [touch] = event.touches;

  startTouch = {
    x: touch.clientX,
    y: touch.clientY
  };
});

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