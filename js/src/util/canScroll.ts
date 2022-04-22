export const nonScrollable = new Set(["profile", "profile-avatar-container", "social-desktop"]);

export function canScrollX(element: HTMLElement) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollWidth > element.clientWidth;
}

export function canScrollY(element: HTMLElement) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollHeight > element.clientHeight;
}