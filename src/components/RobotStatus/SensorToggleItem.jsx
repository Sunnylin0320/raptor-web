import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { formatSensorName } from "../../utils/formatSensorName";

function SensorToggleItem({ topic, description, enabled, onToggle }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const labelRef = useRef(null);

  const handleMouseEnter = () => {
    if (labelRef.current) {
      const rect = labelRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top - 8, // just above the item
        left: rect.left,
      });
    }
    setShowTooltip(true);
  };

  return (
    <>
      <label
        ref={labelRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
          cursor: "pointer",
          minHeight: "36px",
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
            marginTop: "2px",
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
            lineHeight: 1.35,
          }}
        >
          {formatSensorName(topic)}
        </span>
      </label>

      {showTooltip &&
        description &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateY(-100%)",
              background: "#333",
              color: "#fff",
              padding: "0.4rem 0.6rem",
              borderRadius: "6px",
              fontSize: "0.7rem",
              whiteSpace: "normal",
              width: "160px",
              zIndex: 9999,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            {description}
          </div>,
          document.body,
        )}
    </>
  );
}

export default SensorToggleItem;
