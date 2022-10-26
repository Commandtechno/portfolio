import { Pos } from "../constants";

type Action = [HTMLDivElement, typeof Pos[keyof typeof Pos]];

const [centerX, centerY] = Pos.Center;

export function animate(actions: Action[]) {
  return Promise.all(
    actions.map(([element, [targetX, targetY]]) => {
      let shouldHide = false;
      if (targetX === centerX && targetY === centerY) element.style.visibility = null;
      else shouldHide = true;

      element.style.left = targetX + "%";
      element.style.top = targetY + "%";

      return new Promise(resolve =>
        setTimeout(() => {
          if (shouldHide) element.style.visibility = "hidden";
          resolve(void 0);
        }, 500)
      );
    })
  );
}