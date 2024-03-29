export function getAssetURL(application: string, asset: string) {
  if (!asset) return null;
  if (asset.includes(":")) {
    const [platform, id] = asset.split(":");
    switch (platform) {
      case "mp":
        return `https://media.discordapp.net/${id}`;

      case "spotify":
        return `https://i.scdn.co/image/${id}`;

      case "youtube":
        return `https://i.ytimg.com/vi/${id}/hqdefault_live.jpg`;

      case "twitch":
        return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${id}.png`;

      default:
        return null;
    }
  }

  return `https://cdn.discordapp.com/app-assets/${application}/${asset}.webp`;
}