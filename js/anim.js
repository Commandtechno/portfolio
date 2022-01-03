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