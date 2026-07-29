// Top header bar: app title, connection/recording status badges,
// session info, and the "Generate template" action.
// All values are static placeholders for now.

function Header() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.2rem", margin: 0 }}>RaPToR Web</h1>

        {/* <span
          style={{
            background: "#e6f4ea",
            color: "#2e7d32",
            border: "1px solid #b7dfc0",
            borderRadius: "12px",
            padding: "0.2rem 0.7rem",
            fontSize: "0.8rem",
          }}
        >
          ● Connected to robot
        </span> */}

        {/* <span
          style={{
            background: "#fdecea",
            color: "#c62828",
            border: "1px solid #f5c6cb",
            borderRadius: "12px",
            padding: "0.2rem 0.7rem",
            fontSize: "0.8rem",
          }}
        >
          ● Recording active
        </span> */}
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
