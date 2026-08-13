import { formatSensorName } from "../../utils/formatSensorName";

function SensorToggleItem({ topic, enabled, onToggle }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        cursor: "pointer",
      }}
    >
      <span
        onClick={onToggle}
        style={{
          position: "relative",
          display: "inline-block",
          width: "26px",
          height: "15px",
          borderRadius: "8px",
          backgroundColor: enabled ? "#4caf50" : "#ccc",
          transition: "background-color 0.2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: enabled ? "13px" : "2px",
            width: "11px",
            height: "11px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            transition: "left 0.2s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </span>

      <span
        style={{
          fontSize: "0.75rem",
          color: "#444",
          wordBreak: "break-word",
          lineHeight: 1.2,
        }}
      >
        {formatSensorName(topic)}
      </span>
    </label>
  );
}

export default SensorToggleItem;
