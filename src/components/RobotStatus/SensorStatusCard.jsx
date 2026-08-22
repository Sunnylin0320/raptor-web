// A single status card used in the Robot Status panel.
// Renders one of three modes based on `type`:
// - "bar": a progress bar (e.g. battery percentage)
// - "status": a colored dot + label on the same line (e.g. docked, slipping)
// - "text": plain text value (default)
// A small "i" button in the top-right corner reveals the sensor's
// description on click.

import { useState } from "react";

function SensorStatusCard({
  label,
  value,
  type = "text",
  max = 100,
  barValue,
  warning = false,
  goodValues = [],
  description,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const isGood = goodValues.includes(value);

  return (
    <div
      style={{
        padding: "0.5rem 1rem",
        width: "220px",
        flexShrink: 0,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {description && (
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "13px",
            height: "13px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            background: "#fff",
            color: "#999",
            fontSize: "0.55rem",
            fontStyle: "normal",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            lineHeight: 1,
          }}
        >
          i
        </button>
      )}

      {showInfo && (
        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "4px",
            width: "180px",
            background: "#333",
            color: "#fff",
            padding: "0.5rem 0.6rem",
            borderRadius: "6px",
            fontSize: "0.7rem",
            lineHeight: 1.4,
            zIndex: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {description}
        </div>
      )}

      <div
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          wordBreak: "break-word",
          paddingRight: "1.2rem",
        }}
      >
        {label}
      </div>

      {type === "bar" && barValue !== undefined && !isNaN(barValue) && (
        <div
          style={{
            background: "#eee",
            height: "6px",
            borderRadius: "3px",
            margin: "0.5rem 0",
          }}
        >
          <div
            style={{
              width: `${Math.min((barValue / max) * 100, 100)}%`,
              background: warning ? "#e74c3c" : "#2ecc71",
              height: "100%",
              borderRadius: "3px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      {type === "status" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.4rem",
          }}
        >
          <span
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: isGood ? "#2ecc71" : "#e74c3c",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: isGood ? "#2ecc71" : "#e74c3c",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </span>
        </div>
      ) : (
        <div
          style={{
            fontSize: "1.05rem",
            fontWeight: 500,
            color: warning ? "#e74c3c" : "#333",
            fontFamily:
              type === "text" ? "'SF Mono', 'Consolas', monospace" : "inherit",
            wordBreak: "break-word",
          }}
        >
          {typeof value === "string" && value.includes(",")
            ? value
                .split(",")
                .map((part, index) => <div key={index}>{part.trim()}</div>)
            : value}
          {warning && " ⚠"}
        </div>
      )}
    </div>
  );
}

export default SensorStatusCard;
