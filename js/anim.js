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