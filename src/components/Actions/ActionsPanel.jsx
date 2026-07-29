// Actions panel: a grid of predefined robot actions.
// Actions without parameters execute immediately on click, but still
// show a selected state on the button. Actions with parameters show a
// selection + input + Run flow. All actions are sent to ros_bridge.py
// over the control WebSocket (port 6790).

import { useState, useEffect, useRef } from "react";
import ActionButton from "./ActionButton";

const ACTIONS = [
  { name: "dock", label: "Dock", icon: "⬇", requiresParams: false },
  { name: "undock", label: "Undock", icon: "⬆", requiresParams: false },
  {
    name: "rotate_angle",
    label: "Rotate angle",
    icon: "↻",
    requiresParams: true,
    defaultParams: "angle: 1.57, max_rotation_speed: 0.5",
  },
  {
    name: "drive_arc",
    label: "Drive arc",
    icon: "⌒",
    requiresParams: true,
    defaultParams:
      "translate_direction: 1, angle: 1.57, radius: 0.5, max_translation_speed: 0.3",
  },
  {
    name: "navigate_to_position",
    label: "Navigate",
    icon: "📍",
    requiresParams: true,
    defaultParams: "goal_pose: {pose: {position: {x: 1.0, y: 0.5}}}",
  },
  {
    name: "audio_note_sequence",
    label: "Audio sequence",
    icon: "♪",
    requiresParams: true,
    defaultParams:
      "iterations: 1, note_sequence: {append: false, notes: [{frequency: 440, max_runtime: {sec: 0, nanosec: 500000000}}]}",
  },
  {
    name: "led_animation",
    label: "LED animation",
    icon: "💡",
    requiresParams: true,
    defaultParams: "animation_type: 1, max_runtime: {sec: 3, nanosec: 0}",
  },
  {
    name: "drive_distance",
    label: "Drive distance",
    icon: "→",
    requiresParams: true,
    defaultParams: "distance: 0.5, max_translation_speed: 0.3",
  },
];

// Parses a simple "key: value, key2: value2" string into an object.
// Values that look like numbers are converted to numbers.
function parseParamText(text) {
  const params = {};
  if (!text.trim()) return params;

  text.split(",").forEach((pair) => {
    const [key, value] = pair.split(":").map((s) => s.trim());
    if (!key || value === undefined) return;
    const numValue = Number(value);
    params[key] = isNaN(numValue) ? value : numValue;
  });

  return params;
}

function ActionsPanel() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [paramText, setParamText] = useState("");
  const actionWsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");
    ws.onopen = () => console.log("Action WebSocket connected");
    ws.onerror = (error) => console.error("Action WebSocket error:", error);
    actionWsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const sendAction = (actionName, params) => {
    console.log(`Sending action "${actionName}" with params:`, params);
    actionWsRef.current?.send(JSON.stringify({ action: actionName, params }));
  };

  const handleActionClick = (action) => {
    setSelectedAction(action.name);

    if (!action.requiresParams) {
      sendAction(action.name, {});
      return;
    }

    setParamText(action.defaultParams ?? "");
  };

  const handleRun = () => {
    const params = parseParamText(paramText);
    sendAction(selectedAction, params);
  };

  const selectedActionData = ACTIONS.find((a) => a.name === selectedAction);

  return (
    <div>
      <h3
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Actions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {ACTIONS.map((action) => (
          <ActionButton
            key={action.name}
            icon={action.icon}
            label={action.label}
            selected={selectedAction === action.name}
            onClick={() => handleActionClick(action)}
          />
        ))}
      </div>

      {selectedActionData && selectedActionData.requiresParams && (
        <div style={{ borderTop: "1px solid #eee", paddingTop: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#888" }}>
            Selected action
          </div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1565c0",
              marginBottom: "0.5rem",
            }}
          >
            {selectedActionData.label}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={paramText}
              onChange={(e) => setParamText(e.target.value)}
              placeholder="Enter parameters, e.g. angle: 1.57"
              style={{
                flex: 1,
                padding: "0.6rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            />
            <button
              onClick={handleRun}
              style={{
                padding: "0.6rem 1.2rem",
                background: "#e3f2fd",
                color: "#1565c0",
                border: "1px solid #90caf9",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ▶ Run
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionsPanel;
