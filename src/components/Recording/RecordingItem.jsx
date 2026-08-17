// A single recording entry. Shows one of three states:
// - "currently recording" (highlighted red, with a Stop button)
// - "currently playing" (highlighted blue, button disabled, shows "Playing...")
// - normal/idle (Play/Delete buttons)

function RecordingItem({
  name,
  duration,
  isRecording,
  isPlaying,
  disabled,
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
        border: isRecording
          ? "1px solid #f5c6cb"
          : isPlaying
            ? "1px solid #90caf9"
            : "1px solid #eee",
        background: isRecording ? "#fdecea" : isPlaying ? "#e3f2fd" : "#fff",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          fontSize: "0.85rem",
          color: isRecording ? "#c62828" : isPlaying ? "#1565c0" : "#333",
        }}
      >
        {isRecording && "● "}
        {isPlaying && "▶ "}
        {isRecording
          ? `Recording: ${name} — ${duration}`
          : isPlaying
            ? `Playing: ${name}...`
            : name}
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
              disabled={disabled || isPlaying}
              style={{
                padding: "0.3rem 0.7rem",
                border: isPlaying ? "1px solid #90caf9" : "1px solid #ccc",
                borderRadius: "4px",
                background: isPlaying ? "#bbdefb" : "#f5f5f5",
                color: isPlaying ? "#1565c0" : "#333",
                fontSize: "0.75rem",
                cursor: disabled || isPlaying ? "default" : "pointer",
              }}
            >
              {isPlaying ? "Playing..." : "▶ Play"}
            </button>
            <button
              onClick={onDelete}
              disabled={disabled}
              style={{
                padding: "0.3rem 0.7rem",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                background: "#fff",
                color: "#c62828",
                fontSize: "0.75rem",
                cursor: disabled ? "default" : "pointer",
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
