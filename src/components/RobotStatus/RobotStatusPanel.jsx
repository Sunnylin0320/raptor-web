import { useState } from "react";
import SensorStatusCard from "./SensorStatusCard";
import SensorTogglePanel from "./SensorTogglePanel";
import { SENSOR_TOPICS } from "../../data/sensorTopics";

function RobotStatusPanel({ connected, sensorValues }) {
  const [expanded, setExpanded] = useState(false);
  const [enabledTopics, setEnabledTopics] = useState({});

  const toggleTopic = (topic) => {
    setEnabledTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

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
        Robot Status {connected ? "🟢" : "🔴"}
      </h3>

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
            value={sensorValues[sensor.topic] ?? "Waiting..."}
            type="text"
          />
        ))}
      </div>

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
              sensorValues={sensorValues}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RobotStatusPanel;
