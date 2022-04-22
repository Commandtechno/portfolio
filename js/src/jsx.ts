declare global {
  namespace JSX {
    type Element = HTMLElement;
    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[K]>;
    };
  }
}

export function jsx(
  component: keyof HTMLElementTagNameMap,
  props: { [key: string]: string },
  ...children: (string | Node)[]
) {
  const element = document.createElement(component);
  for (const prop in props) element[prop] = props[prop];
  element.append(...children.filter(child => child));
  return element;
}