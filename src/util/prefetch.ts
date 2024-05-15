export function prefetch({ target }: { target: HTMLAnchorElement }) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = target.href;
  document.head.appendChild(link);
}
