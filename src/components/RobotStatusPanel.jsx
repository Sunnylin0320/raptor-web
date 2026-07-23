// Panel showing key robot status indicators.
// The set of displayed cards is now driven by which sensors are toggled
// on in the sensor list below — this state is "lifted up" to this
// component so both the summary cards and the toggle list can share it.

import { useState } from "react";
import SensorStatusCard from "./SensorStatusCard";
import SensorTogglePanel from "./SensorTogglePanel";
import { SENSOR_TOPICS } from "../data/sensorTopics";

// Mock values for now — will be replaced with real WebSocket data later.
const MOCK_VALUES = {
  "/battery_state": "78%",
  "/odom": "x=1.23, y=0.45",
  "/dock_status": "Free",
  "/hazard_detection": "None",
};

function RobotStatusPanel() {
  const [expanded, setExpanded] = useState(false);

  // Lifted state: which topics are currently toggled on.
  // Shared between the top summary cards and the toggle list below.
  const [enabledTopics, setEnabledTopics] = useState({
    "/battery_state": true, // a couple enabled by default so the panel isn't empty
    "/dock_status": true,
    "/hazard_detection": true,
  });

  const toggleTopic = (topic) => {
    setEnabledTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  // Only the topics currently toggled on will be shown as cards above.
  const activeTopics = SENSOR_TOPICS.filter(
    (sensor) => enabledTopics[sensor.topic],
  );

  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem" }}>
      <h3
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Robot Status
      </h3>

      {/* Top row: dynamically generated from enabled sensors.
    Fixed max height with vertical scroll, so selecting many sensors
    doesn't push the rest of the page down indefinitely. */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #eee",
          overflowX: "auto",
        }}
      >
        {activeTopics.length === 0 && (
          <span style={{ color: "#999", fontSize: "0.85rem" }}>
            No sensors selected. Toggle sensors below to display them here.
          </span>
        )}
        {activeTopics.map((sensor) => (
          <SensorStatusCard
            key={sensor.topic}
            label={sensor.topic}
            value={MOCK_VALUES[sensor.topic] ?? "Waiting..."}
            type="text"
          />
        ))}
      </div>
      {/* Compact toggle row: click to expand the full sensor list */}
      <div style={{ paddingTop: "0.75rem" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            fontSize: "0.85rem",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {expanded
            ? "▲ Hide sensors"
            : `▼ Show more sensors (${SENSOR_TOPICS.length} available)`}
        </button>

        {expanded && (
          <div style={{ marginTop: "0.75rem" }}>
            <SensorTogglePanel
              enabledTopics={enabledTopics}
              onToggle={toggleTopic}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RobotStatusPanel;
