// A single status card used in the Robot Status panel.
// Can render either a progress bar (type="bar") or plain text (type="text").

function SensorStatusCard({
  label,
  value,
  type = "text",
  max = 100,
  barValue,
  warning = false,
}) {
  return (
    <div
      style={{
        padding: "0.5rem 1rem",
        width: "180px",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          wordBreak: "break-word",
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

      <div
        style={{
          fontSize: "1.5rem",
          color: warning ? "#e74c3c" : "#333",
          wordBreak: "break-word",
        }}
      >
        {value}
        {warning && " ⚠"}
      </div>
    </div>
  );
}

export default SensorStatusCard;