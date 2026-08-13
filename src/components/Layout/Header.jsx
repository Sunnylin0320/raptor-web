// Top header bar: app title, connection/recording status badges,
// session info, and the "Generate template" action.

function Header({ connected }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.2rem", margin: 0 }}>RaPToR Web</h1>

        <span
          style={{
            background: connected ? "#e6f4ea" : "#fdecea",
            color: connected ? "#2e7d32" : "#c62828",
            border: connected ? "1px solid #b7dfc0" : "1px solid #f5c6cb",
            borderRadius: "12px",
            padding: "0.2rem 0.7rem",
            fontSize: "0.8rem",
          }}
        >
          ● {connected ? "Connected to robot" : "Disconnected"}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          fontSize: "0.85rem",
          color: "#555",
        }}
      >
        <button
          style={{
            padding: "0.4rem 0.8rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: "#f5f5f5",
            cursor: "pointer",
          }}
        >
          Generate template
        </button>
      </div>
    </div>
  );
}

export default Header;

