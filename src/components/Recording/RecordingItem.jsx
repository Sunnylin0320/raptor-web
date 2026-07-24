// A single recording entry. Shows either the "currently recording" state
// (highlighted, with a Stop button) or a completed recording (with
// Play/Delete buttons).

function RecordingItem({
  name,
  duration,
  isRecording,
  onPlay,
  onDelete,
  onStop,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 0.8rem",
        marginBottom: "0.5rem",
        borderRadius: "6px",
        border: isRecording ? "1px solid #f5c6cb" : "1px solid #eee",
        background: isRecording ? "#fdecea" : "#fff",
      }}
    >
      <div
        style={{ fontSize: "0.85rem", color: isRecording ? "#c62828" : "#333" }}
      >
        {isRecording && "● "}
        {isRecording ? `Recording: ${name} — ${duration}` : name}
      </div>

      <div style={{ display: "flex", gap: "0.4rem" }}>
        {isRecording ? (
          <button
            onClick={onStop}
            style={{
              padding: "0.3rem 0.7rem",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              background: "#fff",
              color: "#c62828",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Stop
          </button>
        ) : (
          <>
            <button
              onClick={onPlay}
              style={{
                padding: "0.3rem 0.7rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: "#f5f5f5",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              ▶ Play
            </button>
            <button
              onClick={onDelete}
              style={{
                padding: "0.3rem 0.7rem",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                background: "#fff",
                color: "#c62828",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RecordingItem;
