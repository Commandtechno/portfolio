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