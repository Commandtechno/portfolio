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
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
  Center: "center"
};

// positions
const P = {
  Top: [0, -1],
  Bottom: [0, 1],
  Left: [-1, 0],
  Right: [1, 0],
  Center: [0, 0]
};

let isPending = false;
let state = "center";

function hide(state) {
  document.getElementById(state).style.display = "none";
}

function show(state) {
  document.getElementById(state).style.display = null;
}

function anim(actions) {
  return Promise.all(
    actions.map(([state, [x, y]]) => {
      const animation = {
        "margin-left": `${x * 100}vw`,
        "margin-top": `${y * 100}vh`
      };

      const centered = x === P.Center[0] || y === P.Center[1];
      if (centered) show(state);

      return new Promise(resolve =>
        $("#" + state).animate(animation, () => {
          if (!centered) hide(state);
          resolve();
        })
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

let firstTouch;

window.addEventListener("touchstart", event => {
  if (firstTouch) return;
  const [touch] = event.touches;

  firstTouch = {
    x: touch.clientX,
    y: touch.clientY
  };
});

window.addEventListener("touchend", event => {
  if (!firstTouch) return;
  const [touch] = event.changedTouches;

  const deltaX = touch.clientX - firstTouch.x;
  const deltaY = touch.clientY - firstTouch.y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) move(D.Left);
    else move(D.Right);
  } else {
    if (deltaY > 0) move(D.Up);
    else move(D.Down);
  }

  firstTouch = null;
});