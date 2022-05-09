export function prefetch({ target }) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = target.href;
  document.head.appendChild(link);
}