import { getAssetURL } from "../../util/getAssetURL";
import { jsx } from "../../jsx";

import { ActivityProps, ProgressBar } from ".";

export function Activity(activity: ActivityProps) {
  let { url, name, details, state } = activity;
  let progressBar;

  if (activity.id.startsWith("spotify")) {
    if (activity.sync_id) url = "https://open.spotify.com/track/" + activity.sync_id;
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

  let Container = url ? "a" : "div";
  let ContainerProps: JSX.IntrinsicElements[keyof JSX.IntrinsicElements] = url && {
    href: url,
    rel: "noopener norefferer",
    target: "_blank"
  };

  return (
    <Container id="profile-activity" {...ContainerProps}>
      {activity.assets.large_image && (
        <div id="profile-activity-assets">
          <img
            id="profile-activity-large-image"
            alt={activity.assets.large_text}
            src={getAssetURL(activity.application_id, activity.assets.large_image)}
            width={120}
            height={120}
          />
          {activity.assets.small_image && (
            <div id="profile-activity-small-image-container" className="circle">
              <img
                id="profile-activity-small-image"
                className="circle"
                alt={activity.assets.small_text}
                src={getAssetURL(activity.application_id, activity.assets.small_image)}
                width={40}
                height={40}
              />
            </div>
          )}
        </div>
      )}
      <div id="profile-activity-content">
        <h2 id="profile-activity-name">{name}</h2>
        <h3 id="profile-activity-details">{details}</h3>
        <h3 id="profile-activity-state">{state}</h3>
        {progressBar}
      </div>
    </Container>
  );
}