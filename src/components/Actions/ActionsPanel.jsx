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
    fields: [
      { key: "angle", label: "Angle", hint: "radians, e.g. 1.57 for 90°" },
      {
        key: "max_rotation_speed",
        label: "Max rotation speed",
        hint: "rad/s, e.g. 0.5",
      },
    ],
  },
  {
    name: "drive_arc",
    label: "Drive arc",
    icon: "⌒",
    requiresParams: true,
    fields: [
      {
        key: "translate_direction",
        label: "Direction",
        hint: "1 = forward, -1 = backward",
      },
      { key: "angle", label: "Angle", hint: "radians, e.g. 1.57" },
      { key: "radius", label: "Radius", hint: "meters, e.g. 0.5" },
      {
        key: "max_translation_speed",
        label: "Max speed",
        hint: "m/s, e.g. 0.3",
      },
    ],
  },
  {
    name: "drive_distance",
    label: "Drive distance",
    icon: "→",
    requiresParams: true,
    fields: [
      { key: "distance", label: "Distance", hint: "meters, e.g. 0.5" },
      {
        key: "max_translation_speed",
        label: "Max speed",
        hint: "m/s, e.g. 0.3",
      },
    ],
  },
  {
    name: "navigate_to_position",
    label: "Navigate",
    icon: "📍",
    requiresParams: true,
    fields: [
      {
        key: "goal_pose.pose.position.x",
        label: "Goal X",
        hint: "meters, e.g. 1.0",
      },
      {
        key: "goal_pose.pose.position.y",
        label: "Goal Y",
        hint: "meters, e.g. 0.5",
      },
    ],
  },
  {
    name: "audio_note_sequence",
    label: "Audio sequence",
    icon: "♪",
    requiresParams: true,
    fields: [
      {
        key: "iterations",
        label: "Iterations",
        hint: "e.g. 1 (-1 = repeat forever)",
      },
      {
        key: "note_sequence.notes.0.frequency",
        label: "Note frequency",
        hint: "Hz, e.g. 440",
      },
      {
        key: "note_sequence.notes.0.max_runtime.sec",
        label: "Note duration (sec)",
        hint: "e.g. 0",
      },
    ],
  },
  {
    name: "led_animation",
    label: "LED animation",
    icon: "💡",
    requiresParams: true,
    fields: [
      {
        key: "animation_type",
        label: "Animation type",
        hint: "1 = blink, 2 = spin",
      },
      { key: "max_runtime.sec", label: "Duration (sec)", hint: "e.g. 3" },
    ],
  },
];

function buildNestedParams(fieldValues) {
  const result = {};
  for (const [path, value] of Object.entries(fieldValues)) {
    const keys = path.split(".");
    let current = result;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        if (!current[key]) {
          current[key] = isNaN(keys[index + 1]) ? {} : [];
        }
        current = current[key];
      }
    });
  }
  return result;
}

function ActionsPanel({ onLogEvent, onRecordEvent }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [paramError, setParamError] = useState("");
  const [runningAction, setRunningAction] = useState(null);
  const actionWsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");
    ws.onopen = () => console.log("Action WebSocket connected");
    ws.onerror = (error) => console.error("Action WebSocket error:", error);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "action_finished") {
        setRunningAction((current) => (current === data.name ? null : current));
        setSelectedAction((current) =>
          current === data.name ? null : current,
        ); // ← 新增這行
        const message = data.success
          ? `Action completed: ${data.name}`
          : `Action failed: ${data.name} (status=${data.status})`;
        onLogEvent?.(message, data.success ? "success" : "error");
      }
    };

    actionWsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [onLogEvent]);

  const sendAction = (actionName, params) => {
    console.log(`Sending action "${actionName}" with params:`, params);
    actionWsRef.current?.send(JSON.stringify({ action: actionName, params }));
    onLogEvent?.(`Action executed: ${actionName}`, "info");
    setRunningAction(actionName);
  };

  const handleActionClick = (action) => {
    if (runningAction) return; // block selecting a new action while one is running
    setSelectedAction(action.name);
    setParamError("");

    if (action.requiresParams) {
      const initialValues = {};
      action.fields.forEach((field) => {
        initialValues[field.key] = "";
      });
      setFieldValues(initialValues);
    } else {
      setFieldValues({});
    }
  };

  const handleFieldChange = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleRun = () => {
    const action = ACTIONS.find((a) => a.name === selectedAction);
    setParamError("");

    if (!action.requiresParams) {
      sendAction(action.name, {});
      onRecordEvent?.(action.name, {});
      return;
    }

    const missing = action.fields.filter((f) => fieldValues[f.key] === "");
    if (missing.length > 0) {
      setParamError(
        `Please fill in: ${missing.map((f) => f.label).join(", ")}`,
      );
      return;
    }

    const numericValues = {};
    for (const [key, value] of Object.entries(fieldValues)) {
      const num = Number(value);
      numericValues[key] = isNaN(num) ? value : num;
    }

    const params = buildNestedParams(numericValues);
    sendAction(action.name, params);
    onRecordEvent?.(action.name, params);
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
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {ACTIONS.map((action) => (
          <ActionButton
            key={action.name}
            icon={action.icon}
            label={runningAction === action.name ? "Running..." : action.label}
            selected={
              selectedAction === action.name || runningAction === action.name
            }
            running={runningAction === action.name}
            disabled={runningAction !== null && runningAction !== action.name}
            onClick={() => handleActionClick(action)}
          />
        ))}
      </div>

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
              marginBottom: "0.75rem",
            }}
          >
            {selectedActionData.label}
          </div>

          {selectedActionData.requiresParams && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              {selectedActionData.fields.map((field) => (
                <div key={field.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#555",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={fieldValues[field.key] ?? ""}
                    onChange={(e) =>
                      handleFieldChange(field.key, e.target.value)
                    }
                    placeholder={field.hint}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.6rem",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#999",
                      marginTop: "0.15rem",
                    }}
                  >
                    {field.hint}
                  </div>
                </div>
              ))}

              {paramError && (
                <div style={{ color: "#c62828", fontSize: "0.75rem" }}>
                  {paramError}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={runningAction !== null}
            style={{
              padding: "0.6rem 1.2rem",
              background: runningAction ? "#eee" : "#e3f2fd",
              color: runningAction ? "#999" : "#1565c0",
              border: runningAction ? "1px solid #ddd" : "1px solid #90caf9",
              borderRadius: "6px",
              cursor: runningAction ? "default" : "pointer",
              fontWeight: 600,
              alignSelf: "flex-start",
            }}
          >
            {runningAction ? "Running..." : "▶ Run"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionsPanel;
