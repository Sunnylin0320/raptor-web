// A single status card used in the Robot Status panel.
// Can render either a progress bar (type="bar") or plain text (type="text").

function SensorStatusCard({
  label,
  value,
  type = "text",
  max = 100,
  warning = false,
}) {
  return (
    <div
      style={{
        padding: "0.5rem 1rem",
        width: "180px", // fixed width so long topic names don't overflow into neighboring cards
        flexShrink: 0, // don't let flexbox compress this card
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          wordBreak: "break-word", // wrap long labels instead of overflowing horizontally
        }}
      >
        {label}
      </div>

      {type === "bar" && (
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
              width: `${(value / max) * 100}%`,
              background: warning ? "#e74c3c" : "#2ecc71",
              height: "100%",
              borderRadius: "3px",
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
