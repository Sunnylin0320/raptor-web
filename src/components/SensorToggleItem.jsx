function SensorToggleItem({ topic, description, enabled, value, onToggle }) { // 5 props
  return (
    <div
      style={{
        flexShrink: 0,
        width: "200px", // slightly wider to accommodate longer topic names
        border: "1px solid #eee",
        borderRadius: "6px",
        padding: "0.5rem",
        boxSizing: "border-box",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          cursor: "pointer",
        }}
      >
        <input type="checkbox" checked={enabled} onChange={onToggle} />
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          {topic}
        </span>
      </label>

      <div style={{ fontSize: "0.65rem", color: "#999", marginTop: "0.2rem" }}>
        {description}
      </div>

      {enabled && (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "0.3rem",
            fontSize: "0.65rem",
            marginTop: "0.3rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {value ?? "Waiting..."}
        </pre>
      )}
    </div>
  );
}

export default SensorToggleItem;
