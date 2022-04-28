import { getAssetURL } from "../../util/getAssetURL";
import { jsx } from "../../jsx";

import { ActivityProps, ProgressBar } from ".";

export function Activity(activity: ActivityProps) {
  let { name, details, state } = activity;

  let Container = "div";
  let ContainerProps: { [key: string]: string } = { id: "profile-activity" };

  let progressBar;

  if (activity.id === "spotify:1") {
    if (activity.sync_id) {
      Container = "a";
      ContainerProps.rel = "noopener noreferrer";
      ContainerProps.target = "_blank";
      ContainerProps.alt = activity.details + " on Spotify";
      ContainerProps.href = "https://open.spotify.com/track/" + activity.sync_id;
    }

    if (activity.details) name = activity.details;
    if (activity.state) details = "by " + activity.state;
    if (activity.assets.large_text) state = "on " + activity.assets.large_text;
    if (activity.timestamps) {
      let total = activity.timestamps.end - activity.timestamps.start;
      let completed = Date.now() - activity.timestamps.start;

      progressBar = ProgressBar({
        setup(bar) {
          bar.style.width = `${(completed / total) * 100}%`;
        },
        update(bar) {
          completed += 1000;
          bar.style.width = `${(completed / total) * 100}%`;
        }
      });
    }
  }

  if (activity.party?.size) {
    const [min, max] = activity.party.size;
    if (state) state += " (" + min + " of " + max + ")";
    else state = "(" + min + " of " + max + ")";
  }

  return (
    <Container {...ContainerProps}>
      {activity.assets.large_image && (
        <div id="profile-activity-assets">
          <img
            id="profile-activity-large-image"
            width={98}
            height={98}
            src={getAssetURL(activity.application_id, activity.assets.large_image)}
          />
          {activity.assets.small_image && (
            <div id="profile-activity-small-image-container" className="circle">
              <img
                id="profile-activity-small-image"
                className="circle"
                src={getAssetURL(activity.application_id, activity.assets.small_image)}
              />
            </div>
          )}
        </div>
      )}
      <div id="profile-activity-content">
        <h3 id="profile-activity-name">{name}</h3>
        <p id="profile-activity-details">{details}</p>
        <p id="profile-activity-state">{state}</p>
        {progressBar}
      </div>
    </Container>
  );
}