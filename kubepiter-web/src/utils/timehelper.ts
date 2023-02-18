export function getHumanReadableDuration(timeInSecond: number) {
  if (timeInSecond < 60) return `${timeInSecond}s`;
  const minutes = Math.floor(timeInSecond / 60);
  return `${minutes}m`;
}
