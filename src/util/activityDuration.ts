const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const plural = (n: number) => (n === 1 ? "" : "s");

// 05:00 elapsed
// 25:20 elapsed
// 01:25:20 elapsed
export function formatDigital(ms: number, type: "elapsed" | "left") {
  const hours = Math.floor(ms / HOUR);
  const minutes = Math.floor((ms % HOUR) / MINUTE);
  const seconds = Math.floor((ms % MINUTE) / SECOND);

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${type}`
    : `${pad(minutes)}:${pad(seconds)} ${type}`;
}

// Just started playing
// For 45 minutes
// For 1 hour
// For 3 hours
export function formatNatural(ms: number) {
  if (ms > HOUR) {
    const hours = Math.floor(ms / HOUR);
    return `For ${hours} hour${plural(hours)}`;
  }

  if (ms > MINUTE) {
    const minutes = Math.floor(ms / MINUTE);
    return `For ${minutes} minute${plural(minutes)}`;
  }

  return "Just started playing";
}
