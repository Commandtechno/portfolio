export function setTab(tab?: string) {
  window.history.replaceState({}, "", tab ? "#" + tab : window.location.pathname);
}