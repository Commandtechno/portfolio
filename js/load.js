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

  // const images = document.getElementsByTagName("img");
  // for (const image of images) {
  //   if (!image.alt) alert("Missing alt attribute on image: " + image.src);
  //   tippy(image, {
  //     content: image.alt
  //     // placement: image.getAttribute("tooltip-placement") || "top"
  //   });
  // }

  const submit = document.getElementById("form-submit");
  submit.onclick = event => {
    const email = document.getElementById("form-email").value;
    const subject = document.getElementById("form-subject").value;
    const content = document.getElementById("form-content").value;
    console.log({ email, subject, content });
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

  const ws = new WebSocket("ws://localhost:3001");
  let interval;

  ws.onmessage = message => {
    const presence = JSON.parse(message.data);
    console.log(presence);

    statusElement.src = "assets/status/" + presence.status + ".png";
    show(statusContainerElement);

    const activity = presence.activities.find(activity => activity.type !== 4);
    if (!activity) {
      hide(activityElement);
      return;
    }

    let { name, details, state } = activity;
    let largeImage;
    let smallImage;
    let barCompleted;
    let barTotal;

    if (activity.assets.large_image)
      largeImage = getAssetURL(activity.application_id, activity.assets.large_image);

    if (activity.assets.small_image)
      smallImage = getAssetURL(activity.application_id, activity.assets.small_image);

    if (activity.id === "spotify:1") {
      activityElement.href = "https://open.spotify.com/track/" + activity.sync_id;
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
      state += " (" + min + " of " + max + ")";
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

    if (largeImage) {
      largeImageElement.src = largeImage;
      show(largeImageElement);
    } else hide(largeImageElement);

    if (smallImage) {
      smallImageElement.src = smallImage;
      show(smallImageContainerElement);
    } else hide(smallImageContainerElement);

    if (barCompleted && barTotal) {
      barElement.style.width = (barCompleted / barTotal) * 100 + "%";
      show(barContainerElement);
    } else hide(barContainerElement);

    show(activityElement);
  };
});