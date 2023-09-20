import { ActivityType } from "../constants";
import { tooltip } from "../util/tooltip";
import { $ } from "../util/$";

import { Activity } from "../components/Activity";

import streaming from "../../assets/status/streaming.svg";
import online from "../../assets/status/online.svg";
import dnd from "../../assets/status/dnd.svg";
import idle from "../../assets/status/idle.svg";
import offline from "../../assets/status/offline.svg";

const profileElement = $<HTMLDivElement>("profile");
const statusContainerElement = $<HTMLDivElement>("profile-avatar-status-container");
const statusElement = $<HTMLImageElement>("profile-avatar-status");

let currentElement: HTMLElement;

function show() {
  statusContainerElement.style.display = null;
}

function hide() {
  statusContainerElement.style.display = "none";
}

function connect() {
  const secure = window.location.protocol === "https:";
  const ws = new WebSocket(`${secure ? "wss" : "ws"}://${window.location.host}/presence`);

  let ping = setInterval(() => ws.send(""), 5000);
  ws.addEventListener("message", message => {
    const presence = JSON.parse(message.data);
    const isStreaming = presence.activities.some(activity => activity.type === ActivityType.Streaming);

    if (isStreaming) {
      statusElement.src = streaming;
      tooltip(statusContainerElement, "Streaming");
      show();
    } else
      switch (presence.status) {
        case "online":
          statusElement.src = online;
          tooltip(statusElement, "Online");
          show();
          break;

        case "dnd":
          statusElement.src = dnd;
          tooltip(statusElement, "Do Not Disturb");
          show();
          break;

        case "idle":
          statusElement.src = idle;
          tooltip(statusElement, "Idle");
          show();
          break;

        case "offline":
          statusElement.src = offline;
          tooltip(statusElement, "Offline");
          show();
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
  });

  ws.addEventListener("close", () => {
    if (currentElement) currentElement.remove();
    hide();
    clearInterval(ping);
    setTimeout(connect, 5000);
  });
}

connect();
