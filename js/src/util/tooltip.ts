export function tooltip(element: HTMLElement, content: string) {
  element.setAttribute("alt", content);
  element.setAttribute("title", content);
  element.setAttribute("aria-label", content);
}