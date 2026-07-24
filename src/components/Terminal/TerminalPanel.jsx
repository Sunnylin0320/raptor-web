// Terminal panel: displays a scrollable, auto-logged event history
// with color-coded entry types, plus an input field for executing
// commands directly. New commands are appended to the log in real time.

import { useState } from "react";

const TYPE_COLORS = {
  info: "#333",
  success: "#2e7d32",
  warning: "#c62828",
  highlight: "#1565c0",
};

function TerminalPanel() {
  const [command, setCommand] = useState("");

  const [logs, setLogs] = useState([
    { timestamp: "18:42:01", message: "Control started", type: "success" },
    {
      timestamp: "18:42:03",
      message: "W pressed — linear: 1.0, angular: 0.0",
      type: "info",
    },
    {
      timestamp: "18:42:04",
      message: "A pressed — linear: 0.0, angular: 1.0",
      type: "info",
    },
    {
      timestamp: "18:42:06",
      message: "Recording started: Trial_03",
      type: "highlight",
    },
    {
      timestamp: "18:42:09",
      message: "IR right critically low (8)",
      type: "warning",
    },
  ]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 8); // HH:MM:SS
  };

  const handleExecute = () => {
    if (!command.trim()) return;

    // Placeholder for now — will later send the command through the
    // WebSocket to ros_bridge.py, which will run it and log the real output.
    setLogs((prev) => [
      ...prev,
      {
        timestamp: getCurrentTimestamp(),
        message: `$ ${command}`,
        type: "info",
      },
    ]);
    setCommand("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleExecute();
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.75rem",
            color: "#888",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Terminal{" "}
        </h3>
      </div>

      {/* Scrollable log area with fixed height */}
      <div
        style={{
          background: "#fafafa",
          border: "1px solid #eee",
          borderRadius: "6px",
          padding: "0.75rem",
          maxHeight: "180px",
          overflowY: "auto",
          marginBottom: "0.75rem",
        }}
      >
        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              color: TYPE_COLORS[log.type] ?? TYPE_COLORS.info,
              fontSize: "0.85rem",
              marginBottom: "0.5rem",
            }}
          >
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>

      {/* Command input */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ color: "#888" }}>$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter ROS 2 command, e.g. ros2 topic list"
          style={{
            flex: 1,
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "0.85rem",
          }}
        />
        <button
          onClick={handleExecute}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Execute
        </button>
      </div>
    </div>
  );
}

export default TerminalPanel;
