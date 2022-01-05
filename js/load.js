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

  fetch("http://localhost:3001")
    .then(res => res.json())
    .then(presence => {
      console.log(presence);
      const activity = presence.activities.find(activity => activity.type !== 4);
      if (!activity) return;

      if (activity.assets.large_image) {
        const element = document.getElementById("profile-activity-large-image");
        const image = getAssetURL(activity.application_id, activity.assets.large_image);
        if (image) {
          element.src = image;
          element.style.display = null;
        }
      }

      if (activity.assets.small_image) {
        const element = document.getElementById("profile-activity-small-image");
        const image = getAssetURL(activity.application_id, activity.assets.small_image);
        if (image) {
          element.src = image;
          element.parentElement.style.display = null;
        }
      }

      if (activity.id === "spotify:1") {
        if (activity.details) {
          const element = document.getElementById("profile-activity-name");
          element.innerText = activity.details;
        }

        if (activity.state) {
          const element = document.getElementById("profile-activity-details");
          element.innerText = "by " + activity.state;
        }

        if (activity.assets.large_text) {
          const element = document.getElementById("profile-activity-state");
          element.innerText = "on " + activity.assets.large_text;
        }

        if (activity.timestamps) {
          const bar = document.getElementById("profile-activity-bar");
          const slider = document.getElementById("profile-activity-bar-slider");

          const completed = Date.now() - activity.timestamps.start;
          const total = activity.timestamps.end - activity.timestamps.start;

          slider.style.width = (completed / total) * 100 + "%";
          bar.style.display = null;
        }
      } else {
        if (activity.name) {
          const element = document.getElementById("profile-activity-name");
          element.innerText = activity.name;
        }

        if (activity.details) {
          const element = document.getElementById("profile-activity-details");
          element.innerText = activity.details;
        }

        if (activity.state) {
          const element = document.getElementById("profile-activity-state");
          if (activity.party?.size) {
            const [min, max] = activity.party.size;
            element.innerText = activity.state + " (" + min + " of " + max + ")";
          } else {
            element.innerText = activity.state;
          }
        }
      }

      const element = document.getElementById("profile-activity");
      element.style.display = null;
    });
});