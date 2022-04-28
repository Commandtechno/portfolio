declare global {
  namespace JSX {
    type Element = HTMLElement;
    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[K]>;
    };
  }
}

export function jsx<T extends keyof JSX.IntrinsicElements>(
  tag: T,
  props: Partial<HTMLElementTagNameMap[T]>,
  ...children: (string | Node)[]
): HTMLElementTagNameMap[T] {
  const element = document.createElement<T>(tag);
  for (const prop in props) element[prop] = props[prop];
  element.append(...children.filter(child => child));
  return element;
}

jsx("a", { href: "commandtechno.com" });