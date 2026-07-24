// Movement control panel: keyboard-style directional buttons,
// arranged in a 3x3 grid (Q W E / A S D / Z X C) using CSS Grid.

import { useState } from "react";
import DirectionKey from "./DirectionKey";

function MovementControl() {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <div>
      <h3 style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", marginBottom: "1rem" }}>
        Movement Control
      </h3>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        {/* 3x3 grid: each row is Q/W/E, A/S/D, Z/X/C */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 60px)",
            gridTemplateRows: "repeat(3, 60px)",
            gap: "0.5rem",
          }}
        >
          <DirectionKey label="Q" arrow="↖" active={activeKey === "q"} onClick={() => setActiveKey("q")} />
          <DirectionKey label="W" arrow="↑" active={activeKey === "w"} onClick={() => setActiveKey("w")} />
          <DirectionKey label="E" arrow="↗" active={activeKey === "e"} onClick={() => setActiveKey("e")} />

          <DirectionKey label="A" arrow="←" active={activeKey === "a"} onClick={() => setActiveKey("a")} />
          <DirectionKey label="S" arrow="↓" active={activeKey === "s"} onClick={() => setActiveKey("s")} />
          <DirectionKey label="D" arrow="→" active={activeKey === "d"} onClick={() => setActiveKey("d")} />

          <DirectionKey label="Z" arrow="↙" active={activeKey === "z"} onClick={() => setActiveKey("z")} />
          <DirectionKey label="X" active={activeKey === "x"} onClick={() => setActiveKey("x")} />
          <DirectionKey label="C" arrow="↘" active={activeKey === "c"} onClick={() => setActiveKey("c")} />
        </div>

        <button
          onClick={() => setActiveKey(null)}
          style={{
            width: "100%",
            padding: "0.6rem",
            background: "#fdecea",
            color: "#c62828",
            border: "1px solid #f5c6cb",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ■ Stop control
        </button>
      </div>
    </div>
  );
}

export default MovementControl;