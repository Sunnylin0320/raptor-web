// Movement control panel: keyboard-style directional buttons,
// arranged in a 3x3 grid (Q W E / A S D / Z X C).
// Sends real cmd_vel key commands to ros_bridge.py over WebSocket,
// and also listens for physical keyboard input.

import { useState, useEffect, useRef } from "react";
import DirectionKey from "./DirectionKey";

const VALID_KEYS = ["w", "a", "s", "d", "x", "q", "e", "z", "c"];

function MovementControl() {
  const [activeKey, setActiveKey] = useState(null);
  const controlWsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");
    ws.onopen = () => console.log("Control WebSocket connected");
    ws.onerror = (error) => console.error("Control WebSocket error:", error);
    controlWsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const sendKey = (key) => {
    controlWsRef.current?.send(JSON.stringify({ key }));
  };

  const handlePress = (key) => {
    setActiveKey(key);
    sendKey(key);
  };

  const handleRelease = () => {
    setActiveKey(null);
    sendKey("stop");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (VALID_KEYS.includes(key)) {
        handlePress(key);
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (VALID_KEYS.includes(key)) {
        handleRelease();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div>
      <h3
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: "1rem",
        }}
      >
        Movement Control
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 60px)",
            gridTemplateRows: "repeat(3, 60px)",
            gap: "0.5rem",
          }}
        >
          <DirectionKey
            label="Q"
            arrow="↖"
            active={activeKey === "q"}
            onMouseDown={() => handlePress("q")}
            onMouseUp={handleRelease}
          />
          <DirectionKey
            label="W"
            arrow="↑"
            active={activeKey === "w"}
            onMouseDown={() => handlePress("w")}
            onMouseUp={handleRelease}
          />
          <DirectionKey
            label="E"
            arrow="↗"
            active={activeKey === "e"}
            onMouseDown={() => handlePress("e")}
            onMouseUp={handleRelease}
          />

          <DirectionKey
            label="A"
            arrow="←"
            active={activeKey === "a"}
            onMouseDown={() => handlePress("a")}
            onMouseUp={handleRelease}
          />
          <DirectionKey
            label="S"
            arrow="↓"
            active={activeKey === "s"}
            onMouseDown={() => handlePress("s")}
            onMouseUp={handleRelease}
          />
          <DirectionKey
            label="D"
            arrow="→"
            active={activeKey === "d"}
            onMouseDown={() => handlePress("d")}
            onMouseUp={handleRelease}
          />

          <DirectionKey
            label="Z"
            arrow="↙"
            active={activeKey === "z"}
            onMouseDown={() => handlePress("z")}
            onMouseUp={handleRelease}
          />
          <DirectionKey
            label="X"
            active={activeKey === "x"}
            onMouseDown={() => handlePress("x")}
            onMouseUp={handleRelease}
          />
          <DirectionKey
            label="C"
            arrow="↘"
            active={activeKey === "c"}
            onMouseDown={() => handlePress("c")}
            onMouseUp={handleRelease}
          />
        </div>

        <button
          onClick={handleRelease}
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
