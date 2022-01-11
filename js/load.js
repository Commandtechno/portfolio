console.log("hello inspect elementer, thank you for looking at my website");
console.log(
  "if you are testing my website on mobile, i reccomend opening a new tab since chrome switching to mobile keeps the element context from desktop and messes it up lol"
);
console.log("ill add more stuff here but pog ok bye");

window.addEventListener("load", () => {
  const tab = new URL(window.location).searchParams.get("tab");

  switch (tab) {
    case "socials":
      move(D.Up);
      break;

    case "contact":
      move(D.Down);
      break;

    case "gfx":
      move(D.Left);
      break;

    case "dev":
      move(D.Right);
      break;
  }

  for (const element of document.querySelectorAll("[alt]")) {
    const alt = element.getAttribute("alt");
    element.title = alt;
    element.ariaLabel = alt;
  }

  const submit = document.getElementById("form-submit");
  submit.onclick = () => {
    submit.style.backgroundColor = null;
    submit.style.color = null;
    submit.innerText = "Sending...";
    submit.disabled = true;

    const email = document.getElementById("form-email").value;
    const subject = document.getElementById("form-subject").value;
    const content = document.getElementById("form-content").value;
    fetch("/contact", {
      method: "POST",
      body: JSON.stringify({ email, subject, content }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.ok) {
          document.getElementById("form-email").value = "";
          document.getElementById("form-subject").value = "";
          document.getElementById("form-content").value = "";

          submit.style.backgroundColor = "#439543";
          submit.style.color = "white";
          submit.innerText = "Message Sent!";
          submit.disabled = false;
        } else
          res.text().then(text => {
            submit.style.backgroundColor = "#ed4444";
            submit.style.color = "white";
            submit.innerText = text;
            submit.disabled = false;
          });
      })
      .catch(() => {
        submit.style.backgroundColor = "#ed4444";
        submit.style.color = "white";
        submit.innerText = "Unknown Error";
        submit.disabled = false;
      });
  };

  const statusContainerElement = document.getElementById("profile-avatar-status-container");
  const statusElement = document.getElementById("profile-avatar-status");
  const activityElement = document.getElementById("profile-activity");
  const largeImageElement = document.getElementById("profile-activity-large-image");
  const smallImageContainerElement = document.getElementById(
    "profile-activity-small-image-container"
  );
  const smallImageElement = document.getElementById("profile-activity-small-image");
  const nameElement = document.getElementById("profile-activity-name");
  const detailsElement = document.getElementById("profile-activity-details");
  const stateElement = document.getElementById("profile-activity-state");
  const barContainerElement = document.getElementById("profile-activity-bar-container");
  const barElement = document.getElementById("profile-activity-bar");

  const ws = new WebSocket("wss://" + window.location.host);
  let interval;

  setInterval(() => ws.send(""), 1000);
  ws.onmessage = message => {
    const presence = JSON.parse(message.data);
    const isStreaming = presence.activities.some(activity => activity.type === A.Streaming);

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

    const activity = presence.activities.find(activity => activity.type !== A.Custom);
    if (!activity) {
      hide(activityElement);
      return;
    }

    let { name, details, state } = activity;
    let barCompleted;
    let barTotal;

    if (activity.id === "spotify:1") {
      activityElement.setAttribute("href", "https://open.spotify.com/track/" + activity.sync_id);
      activityElement.classList.add("hover");

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
    } else {
      activityElement.removeAttribute("href");
      activityElement.classList.remove("hover");
    }

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
  };
});