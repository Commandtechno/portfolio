function setTab(tab) {
  window.history.replaceState({}, "", tab ? "#" + tab : window.location.pathname);
}