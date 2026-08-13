// Horizontally scrollable row of sensor toggles.
// This component no longer owns the "enabled" state itself —
// it receives it via props from the parent (RobotStatusPanel),
// so both this list and the summary cards above stay in sync.

import { SENSOR_TOPICS } from "../../data/sensorTopics";
import SensorToggleItem from "./SensorToggleItem";

function SensorTogglePanel({ enabledTopics, onToggle }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "0.6rem 1rem",
        maxHeight: "220px",
        overflowY: "auto",
        paddingRight: "0.5rem",
      }}
    >
      {SENSOR_TOPICS.map((sensor) => (
        <SensorToggleItem
          key={sensor.topic}
          topic={sensor.topic}
          enabled={!!enabledTopics[sensor.topic]}
          onToggle={() => onToggle(sensor.topic)}
        />
      ))}
    </div>
  );
}

export default SensorTogglePanel;