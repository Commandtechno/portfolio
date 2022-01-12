function setTab(tab) {
  if (tab) {
    document.title = "Commandtechno | " + tab;
    window.history.replaceState({}, "", "#" + tab);
  } else {
    document.title = "Commandtechno";
    window.history.replaceState({}, "", window.location.pathname);
  }
}