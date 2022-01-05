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