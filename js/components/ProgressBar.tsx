import { jsx } from "../jsx";

let currentTimer: ReturnType<typeof setInterval>;

export function ProgressBar({
  setup,
  update
}: {
  setup(bar: HTMLElement);
  update(bar: HTMLElement);
}) {
  const bar = <div id="profile-activity-bar"></div>;
  setup(bar);

  if (currentTimer) clearInterval(currentTimer);
  currentTimer = setInterval(() => update(bar), 1000);

  return <div id="profile-activity-bar-container">{bar}</div>;
}