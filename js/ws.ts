import { ActivityType } from "./constants";
import { $ } from "./util/$";
import { getAssetURL } from "./util/getAssetURL";
import { hide } from "./util/hide";
import { show } from "./util/show";
import { tooltip } from "./util/tooltip";

export function connect() {
  const statusContainerElement = $<HTMLDivElement>("profile-avatar-status-container");
  const statusElement = $<HTMLImageElement>("profile-avatar-status");
  const activityElement = $<HTMLDivElement>("profile-activity");
  const largeImageElement = $<HTMLImageElement>("profile-activity-large-image");
  const smallImageContainerElement = $<HTMLDivElement>("profile-activity-small-image-container");
  const smallImageElement = $<HTMLImageElement>("profile-activity-small-image");
  const nameElement = $<HTMLDivElement>("profile-activity-name");
  const detailsElement = $<HTMLDivElement>("profile-activity-details");
  const stateElement = $<HTMLDivElement>("profile-activity-state");
  const barContainerElement = $<HTMLDivElement>("profile-activity-bar-container");
  const barElement = $<HTMLDivElement>("profile-activity-bar");

  const ws = new WebSocket("wss://" + window.location.host);
  let ping = setInterval(() => ws.send(""), 5000);
  let interval: ReturnType<typeof setInterval>;

  ws.addEventListener("message", message => {
    const presence = JSON.parse(message.data);
    const isStreaming = presence.activities.some(
      activity => activity.type === ActivityType.Streaming
    );

    if (isStreaming) {
      statusElement.src = "assets/status/streaming.svg";
      tooltip(statusContainerElement, "Streaming");
      show(statusContainerElement);
    } else
      switch (presence.status) {
        case "online":
          statusElement.src = "assets/status/online.svg";
          tooltip(statusElement, "Online");
          show(statusContainerElement);
          break;

        case "dnd":
          statusElement.src = "assets/status/dnd.svg";
          tooltip(statusElement, "Do Not Disturb");
          show(statusContainerElement);
          break;

        case "idle":
          statusElement.src = "assets/status/idle.svg";
          tooltip(statusElement, "Idle");
          show(statusContainerElement);
          break;

        case "offline":
          statusElement.src = "assets/status/offline.svg";
          tooltip(statusElement, "Offline");
          show(statusContainerElement);
          break;
      }

    const activity = presence.activities.find(activity => activity.type !== ActivityType.Custom);
    if (!activity) {
      hide(activityElement);
      return;
    }

    let { name, details, state } = activity;
    let barCompleted;
    let barTotal;

    // spotify
    if (activity.id === "spotify:1") {
      activityElement.setAttribute("href", "https://open.spotify.com/track/" + activity.sync_id);
      if (activity.details) name = activity.details;
      if (activity.state) details = "by " + activity.state;
      if (activity.assets.large_text) state = "on " + activity.assets.large_text;
      if (activity.timestamps) {
        barCompleted = Date.now() - activity.timestamps.start;
        barTotal = activity.timestamps.end - activity.timestamps.start;

        clearInterval(interval);
        interval = setInterval(() => {
          barCompleted += 1000;
          barElement.style.width = (barCompleted / barTotal) * 100 + "%";
        }, 1000);
      }
    } else activityElement.removeAttribute("href");

    if (activity.party?.size) {
      const [min, max] = activity.party.size;
      if (state) state += " (" + min + " of " + max + ")";
      else state = "(" + min + " of " + max + ")";
    }

    if (name) {
      nameElement.innerText = name;
      show(nameElement);
    } else hide(nameElement);

    if (details) {
      detailsElement.innerText = details;
      show(detailsElement);
    } else hide(detailsElement);

    if (state) {
      stateElement.innerText = state;
      show(stateElement);
    } else hide(stateElement);

    if (barCompleted && barTotal) {
      barElement.style.width = (barCompleted / barTotal) * 100 + "%";
      show(barContainerElement);
    } else hide(barContainerElement);

    if (activity.assets.large_image) {
      largeImageElement.src = getAssetURL(activity.application_id, activity.assets.large_image);
      if (activity.assets.large_text) tooltip(largeImageElement, activity.assets.large_text);
      show(largeImageElement);
    } else hide(largeImageElement);

    if (activity.assets.large_image && activity.assets.small_image) {
      smallImageElement.src = getAssetURL(activity.application_id, activity.assets.small_image);
      if (activity.assets.small_text) tooltip(smallImageElement, activity.assets.small_text);
      show(smallImageContainerElement);
    } else hide(smallImageContainerElement);

    show(activityElement);
  });

  ws.addEventListener("close", () => {
    hide(activityElement);
    hide(statusContainerElement);

    clearInterval(ping);
    clearInterval(interval);

    setTimeout(connect, 5000);
  });
}