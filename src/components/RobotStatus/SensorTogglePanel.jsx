// Horizontally scrollable row of sensor toggles.
// This component no longer owns the "enabled" state itself —
// it receives it via props from the parent (RobotStatusPanel),
// so both this list and the summary cards above stay in sync.

import { SENSOR_TOPICS } from "../../data/sensorTopics";
import SensorToggleItem from "./SensorToggleItem";

const MOCK_VALUES = {
  "/battery_state": "78%",
  "/odom": "x=1.23, y=0.35",
};

function SensorTogglePanel({ enabledTopics, onToggle }) {
  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "0.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      {SENSOR_TOPICS.map((sensor) => (
        <SensorToggleItem
          key={sensor.topic}
          topic={sensor.topic}
          description={sensor.description}
          enabled={!!enabledTopics[sensor.topic]}
          value={MOCK_VALUES[sensor.topic]}
          onToggle={() => onToggle(sensor.topic)}
        />
      ))}
    </div>
  );
}

export default SensorTogglePanel;
