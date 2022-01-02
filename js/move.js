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
      }
  }

  isPending = false;
}