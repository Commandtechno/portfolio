import { ActivityType } from "../constants";
import { tooltip } from "../util/tooltip";
import { hide } from "../util/hide";
import { show } from "../util/show";
import { $ } from "../util/$";

import { Activity } from "../components/Activity";

const streaming = require("../../assets/status/streaming.svg");
const online = require("../../assets/status/online.svg");
const dnd = require("../../assets/status/dnd.svg");
const idle = require("../../assets/status/idle.svg");
const offline = require("../../assets/status/offline.svg");

const profileElement = $<HTMLDivElement>("profile");
const statusContainerElement = $<HTMLDivElement>("profile-avatar-status-container");
const statusElement = $<HTMLImageElement>("profile-avatar-status");

let currentElement: HTMLElement;

function connect() {
  const ws = new WebSocket("wss://" + window.location.host);
  let ping = setInterval(() => ws.send(""), 5000);

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
  });

  ws.addEventListener("close", () => {
    if (currentElement) currentElement.remove();
    hide(statusContainerElement);

    clearInterval(ping);
    setTimeout(connect, 5000);
  });
}

connect();