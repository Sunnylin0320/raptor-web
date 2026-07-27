// Panel showing key robot status indicators.
// The set of displayed cards is now driven by which sensors are toggled
// on in the sensor list below — this state is "lifted up" to this
// component so both the summary cards and the toggle list can share it.

import { useState, useEffect } from "react";
import SensorStatusCard from "./SensorStatusCard";
import SensorTogglePanel from "./SensorTogglePanel";
import { SENSOR_TOPICS } from "../../data/sensorTopics";

function RobotStatusPanel() {
  const [expanded, setExpanded] = useState(false);

  const [enabledTopics, setEnabledTopics] = useState({
    "/battery_state": true,
    "/dock_status": true,
    "/hazard_detection": true,
  });

  // Real sensor values received from the WebSocket, keyed by topic name.
  // e.g. { "/battery_state": "78%", "/odom": "x=1.23, y=0.45" }
  const [sensorValues, setSensorValues] = useState({});

  const [connected, setConnected] = useState(false);

  // Connect to the sensor data WebSocket once, when this component mounts.
  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6789");

    ws.onopen = () => {
      console.log("Sensor WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Merge the new data into existing values, so topics not included
      // in this message (e.g. ones not enabled on the backend) aren't lost.
      setSensorValues((prev) => ({ ...prev, ...data }));
    };

    ws.onclose = () => {
      console.log("Sensor WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("Sensor WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

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