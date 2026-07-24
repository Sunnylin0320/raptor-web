// A single action button (e.g. Dock, Undock, Rotate angle).
// "selected" highlights the button when it's the currently chosen action.

function ActionButton({ icon, label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.7rem 1rem",
        border: selected ? "1px solid #90caf9" : "1px solid #ccc",
        background: selected ? "#e3f2fd" : "#f5f5f5",
        color: selected ? "#1565c0" : "#333",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
        textAlign: "left",
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default ActionButton;
