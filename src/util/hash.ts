export function setHash(tab?: string) {
  window.history.replaceState(null, "", tab ? "#" + tab : window.location.pathname);
}
