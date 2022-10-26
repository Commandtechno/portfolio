// scuffed but it works
const nonScrollable = new Set([
  "profile",
  "profile-avatar-container",
  "profile-activity",
  "profile-activity-assets",
  "social-desktop-container"
]);

export function canScrollX(element: HTMLElement) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollWidth > element.clientWidth;
}

export function canScrollY(element: HTMLElement) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollHeight > element.clientHeight;
}