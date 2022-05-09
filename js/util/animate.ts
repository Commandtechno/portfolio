import { Pos, State } from "../constants";
import { $ } from "./$";

export type Action = [typeof State[keyof typeof State], typeof Pos[keyof typeof Pos]];

export function animate(actions: Action[]) {
  return Promise.all(
    actions.map(([state, [targetX, targetY]]) => {
      const element = $<HTMLDivElement>(state);
      let shouldHide = false;

      const [centerX, centerY] = Pos.Center;
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