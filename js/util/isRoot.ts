export function isRoot(element: HTMLElement) {
  return element === document.body || element === document.documentElement;
}