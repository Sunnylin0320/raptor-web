// Actions panel: a grid of predefined robot actions (Dock, Undock, etc.),
// plus a parameter input and Run button for the currently selected action.
// This mirrors the original Tkinter RaPToR GUI's Actions section, where
// each action can take an optional parameter string before being sent.

import { useState } from "react";
import ActionButton from "./ActionButton";

// Static list of available actions. In the original RaPToR toolkit these
// are discovered dynamically from the robot's action servers; for now we
// hardcode the known Create 3 actions to match the design.
const ACTIONS = [
  { name: "dock", label: "Dock", icon: "⬇" },
  { name: "undock", label: "Undock", icon: "⬆" },
  { name: "rotate_angle", label: "Rotate angle", icon: "↻" },
  { name: "drive_arc", label: "Drive arc", icon: "⌒" },
  { name: "navigate_to_position", label: "Navigate", icon: "📍" },
  { name: "audio_note_sequence", label: "Audio sequence", icon: "♪" },
  { name: "led_animation", label: "LED animation", icon: "💡" },
  { name: "drive_distance", label: "Drive distance", icon: "→" },
];

// Default placeholder parameter text shown per action, just for display
// purposes (matches the design's example: "angle: 1.57, max_rotation_speed: 0.5")
const DEFAULT_PARAMS = {
  rotate_angle: "angle: 1.57, max_rotation_speed: 0.5",
  drive_distance: "distance: 0.5, max_translation_speed: 0.3",
  drive_arc:
    "translate_direction: 1, angle: 1.57, radius: 0.5, max_translation_speed: 0.3",
};

function ActionsPanel() {
  // Which action is currently selected (by name), or null if none selected.
  const [selectedAction, setSelectedAction] = useState(null);

  // The text currently typed into the parameter input box.
  const [paramText, setParamText] = useState("");

  const handleSelectAction = (action) => {
    setSelectedAction(action.name);
    setParamText(DEFAULT_PARAMS[action.name] ?? "");
  };

  const handleRun = () => {
    // Placeholder for now — will later send the action + params
    // through the WebSocket to ros_bridge.py.
    console.log(`Running action "${selectedAction}" with params: ${paramText}`);
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

      {/* 2-column grid of action buttons */}
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
            onClick={() => handleSelectAction(action)}
          />
        ))}
      </div>

      {/* Selected action + parameter input, only shown once an action is chosen */}
      {selectedActionData && (
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
