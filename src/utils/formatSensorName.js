// Converts a raw ROS 2 topic name (e.g. "/battery_state") into a
// human-friendly display label (e.g. "battery state").
export function formatSensorName(topic) {
  return topic
    .replace(/^\//, "") // remove leading slash
    .replace(/_/g, " "); // replace underscores with spaces
}
