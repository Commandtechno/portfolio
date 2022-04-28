export function canScrollX(element: HTMLElement) {
  return element.offsetWidth > element.clientWidth;
}

export function canScrollY(element: HTMLElement) {
  return element.offsetHeight > element.clientHeight;
}
