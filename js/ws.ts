import { ActivityType } from "./constants";
import { getAssetURL } from "./util/getAssetURL";
import { tooltip } from "./util/tooltip";
import { hide } from "./util/hide";
import { show } from "./util/show";
import { $ } from "./util/$";
import { Activity } from "./components/Activity";

const streaming = require("../assets/status/streaming.svg");
const online = require("../assets/status/online.svg");
const dnd = require("../assets/status/dnd.svg");
const idle = require("../assets/status/idle.svg");
const offline = require("../assets/status/offline.svg");

let currentElement: HTMLElement;

export function connect() {
  const profileElement = $<HTMLDivElement>("profile");
  const statusContainerElement = $<HTMLDivElement>("profile-avatar-status-container");
  const statusElement = $<HTMLImageElement>("profile-avatar-status");
  const activityElement = $<HTMLDivElement>("profile-activity");
  // const assetsElement = $<HTMLDivElement>("profile-activity-assets");
  // const largeImageElement = $<HTMLImageElement>("profile-activity-large-image");
  // const smallImageContainerElement = $<HTMLDivElement>("profile-activity-small-image-container");
  // const smallImageElement = $<HTMLImageElement>("profile-activity-small-image");
  // const nameElement = $<HTMLDivElement>("profile-activity-name");
  // const detailsElement = $<HTMLDivElement>("profile-activity-details");
  // const stateElement = $<HTMLDivElement>("profile-activity-state");
  // const barContainerElement = $<HTMLDivElement>("profile-activity-bar-container");
  // const barElement = $<HTMLDivElement>("profile-activity-bar");

  const ws = new WebSocket("wss://commandtechno.com");
  let ping = setInterval(() => ws.send(""), 5000);
  let interval: ReturnType<typeof setInterval>;

  ws.addEventListener("message", message => {
    const presence = JSON.parse(message.data);
    const isStreaming = presence.activities.some(
      activity => activity.type === ActivityType.Streaming
    );

    if (isStreaming) {
      statusElement.src = streaming;
      tooltip(statusContainerElement, "Streaming");
      show(statusContainerElement);
    } else
      switch (presence.status) {
        case "online":
          statusElement.src = online;
          tooltip(statusElement, "Online");
          show(statusContainerElement);
          break;

        case "dnd":
          statusElement.src = dnd;
          tooltip(statusElement, "Do Not Disturb");
          show(statusContainerElement);
          break;

        case "idle":
          statusElement.src = idle;
          tooltip(statusElement, "Idle");
          show(statusContainerElement);
          break;

        case "offline":
          statusElement.src = offline;
          tooltip(statusElement, "Offline");
          show(statusContainerElement);
          break;
      }

    const activity = presence.activities.find(activity => activity.type !== ActivityType.Custom);
    if (!activity) {
      if (currentElement) currentElement.remove();
      return;
    }

    const element = Activity(activity);
    if (currentElement) currentElement.remove();
    profileElement.appendChild(element);
    currentElement = element;

    // let { name, details, state } = activity;
    // let barCompleted;
    // let barTotal;

    // // spotify
    // if (activity.id === "spotify:1") {
    //   if (activity.sync_id)
    //     activityElement.setAttribute("href", "https://open.spotify.com/track/" + activity.sync_id);
    //   else activityElement.removeAttribute("href");

    //   if (activity.details) name = activity.details;
    //   if (activity.state) details = "by " + activity.state;
    //   if (activity.assets.large_text) state = "on " + activity.assets.large_text;
    //   if (activity.timestamps) {
    //     barCompleted = Date.now() - activity.timestamps.start;
    //     barTotal = activity.timestamps.end - activity.timestamps.start;

    //     clearInterval(interval);
    //     interval = setInterval(() => {
    //       barCompleted += 1000;
    //       barElement.style.width = (barCompleted / barTotal) * 100 + "%";
    //     }, 1000);
    //   }
    // } else activityElement.removeAttribute("href");

    // if (activity.party?.size) {
    //   const [min, max] = activity.party.size;
    //   if (state) state += " (" + min + " of " + max + ")";
    //   else state = "(" + min + " of " + max + ")";
    // }

    // if (name) {
    //   nameElement.innerText = name;
    //   show(nameElement);
    // } else hide(nameElement);

    // if (details) {
    //   detailsElement.innerText = details;
    //   show(detailsElement);
    // } else hide(detailsElement);

    // if (state) {
    //   stateElement.innerText = state;
    //   show(stateElement);
    // } else hide(stateElement);

    // if (barCompleted && barTotal) {
    //   barElement.style.width = (barCompleted / barTotal) * 100 + "%";
    //   show(barContainerElement);
    // } else hide(barContainerElement);

    // if (activity.assets.large_image) {
    //   show(assetsElement);

    //   largeImageElement.src = getAssetURL(activity.application_id, activity.assets.large_image);
    //   if (activity.assets.large_text) tooltip(largeImageElement, activity.assets.large_text);
    //   show(largeImageElement);

    //   if (activity.assets.small_image) {
    //     smallImageElement.src = getAssetURL(activity.application_id, activity.assets.small_image);
    //     if (activity.assets.small_text) tooltip(smallImageElement, activity.assets.small_text);
    //     show(smallImageContainerElement);
    //   } else hide(smallImageContainerElement);
    // } else {
    //   hide(assetsElement);
    //   hide(largeImageElement);
    //   hide(smallImageContainerElement);
    // }

    // show(activityElement);
  });

  ws.addEventListener("close", () => {
    hide(activityElement);
    hide(statusContainerElement);

    clearInterval(ping);
    clearInterval(interval);

    setTimeout(connect, 5000);
  });
}