// A single movement control key (e.g. W, A, S, D, X for stop).
// "active" highlights the key when it is currently selected/pressed.

function DirectionKey({ label, arrow, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "60px",
        height: "60px",
        border: active ? "1px solid #e57373" : "1px solid #ccc",
        background: active ? "#fdecea" : "#f5f5f5",
        color: active ? "#c62828" : "#333",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        fontWeight: 600,
      }}
    >
      <span>{label}</span>
      {arrow && <span style={{ fontSize: "0.8rem" }}>{arrow}</span>}
    </button>
  );
}

export default DirectionKey;
