export function setHash(tab?: string) {
  window.history.replaceState(null, null, tab ? "#" + tab : window.location.pathname);
}
