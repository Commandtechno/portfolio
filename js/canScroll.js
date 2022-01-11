const nonScrollable = new Set(["profile", "profile-avatar-container", "social-desktop"]);

function canScrollX(element) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollWidth > element.clientWidth;
}

function canScrollY(element) {
  if (nonScrollable.has(element.id)) return false;
  return element.scrollHeight > element.clientHeight;
}