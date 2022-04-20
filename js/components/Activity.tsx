import { getAssetURL } from "../util/getAssetURL";

function jsx(
  tagName: keyof HTMLElementTagNameMap,
  attrs: { [key: string]: string },
  ...children: (string | Node)[]
) {
  const element = document.createElement(tagName);
  for (const attr in attrs) element.setAttribute(attr, attrs[attr]);
  element.append(...children.filter(child => child));
  return element;
}

interface ActivityProps {
  application_id: string;
  type: number;
  timestamps: {
    start: number;
    end: number;
  };
  state: string;
  sync_id: string;
  party: {
    id: string;
    size: [number, number];
  };
  name: string;
  id: string;
  details: string;
  created_at: number;
  assets: {
    large_image: string;
    large_text: string;
    small_image: string;
    small_text: string;
  };
}

// let ineterval: ReturnType<typeof setInterval>;

export function Activity(activity: ActivityProps) {
  let { name, details, state } = activity;

  let ContainerTag = "div";
  let ContainerProps: { [key: string]: string } = { id: "profile-activity" };

  if (activity.id === "spotify:1") {
    if (activity.sync_id)
      ContainerProps.href = "https://open.spotify.com/track/" + activity.sync_id;

    if (activity.details) name = activity.details;
    if (activity.state) details = "by " + activity.state;
    if (activity.assets.large_text) state = "on " + activity.assets.large_text;
    if (activity.timestamps) {
      // barCompleted = Date.now() - activity.timestamps.start;
      // barTotal = activity.timestamps.end - activity.timestamps.start;
      // clearInterval(interval);
      // interval = setInterval(() => {
      //   barCompleted += 1000;
      //   barElement.style.width = (barCompleted / barTotal) * 100 + "%";
      // }, 1000);
    }
  }

  if (activity.party?.size) {
    const [min, max] = activity.party.size;
    if (state) state += " (" + min + " of " + max + ")";
    else state = "(" + min + " of " + max + ")";
  }

  return (
    <ContainerTag {...ContainerProps}>
      {activity.assets.large_image && (
        <div id="profile-activity-assets">
          <img
            id="profile-activity-large-image"
            width="98"
            height="98"
            src={getAssetURL(activity.application_id, activity.assets.large_image)}
          />
          {activity.assets.small_image && (
            <div id="profile-activity-small-image-container" class="circle">
              <img
                id="profile-activity-small-image"
                class="circle"
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
        <div id="profile-activity-bar-container">
          <div id="profile-activity-bar"></div>
        </div>
      </div>
    </ContainerTag>
  );
}