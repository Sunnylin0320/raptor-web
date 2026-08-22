import { useState } from "react";
import SensorStatusCard from "./SensorStatusCard";
import SensorTogglePanel from "./SensorTogglePanel";
import { SENSOR_TOPICS } from "../../data/sensorTopics";
import { formatSensorName } from "../../utils/formatSensorName";

function RobotStatusPanel({ sensorValues }) {
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
    <div style={{ padding: "1rem" }}>
      <h3
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          marginTop: 0,
          marginBottom: "1rem",
        }}
      >
        Robot Status
        {/* {connected ? "🟢" : "🔴"} */}
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
        {activeTopics.map((sensor) => {
          const rawValue = sensorValues[sensor.topic];
          const isBar = sensor.displayType === "percentage";
          const isStatus = sensor.displayType === "status";
          

          // Extract the numeric portion from strings like "78.0%" for the bar's
          // width calculation, while still passing the original string as the
          // displayed value.
          const numericValue =
            isBar && rawValue ? parseFloat(rawValue) : undefined;

          return (
            <SensorStatusCard
              key={sensor.topic}
              label={formatSensorName(sensor.topic)}
              value={rawValue ?? "Waiting..."}
              type={isBar ? "bar" : isStatus ? "status" : "text"}
              max={sensor.max}
              barValue={numericValue}
              goodValues={sensor.goodValues}
              description={sensor.description}
            />
          );
        })}
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
