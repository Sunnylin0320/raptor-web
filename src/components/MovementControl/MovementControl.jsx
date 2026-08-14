import { useState, useEffect, useRef, useCallback } from "react";
import DirectionKey from "./DirectionKey";

const VALID_KEYS = ["w", "a", "s", "d", "x", "q", "e", "z", "c"];

function MovementControl({ connected, onKeyEvent }) {
  const [activeKey, setActiveKey] = useState(null);
  const [controlEnabled, setControlEnabled] = useState(false);
  const controlWsRef = useRef(null);

  // Derived value: control is only truly active if BOTH the user has
  // pressed Start control AND the robot is currently connected.
  // Computed directly during render — no extra state or effect needed
  // to keep it in sync.
  const isControlActive = controlEnabled && connected;

  const controlEnabledRef = useRef(false);
  useEffect(() => {
    controlEnabledRef.current = isControlActive;
  }, [isControlActive]);

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

  const handlePress = useCallback(
    (key) => {
      if (!controlEnabledRef.current) return;
      setActiveKey(key);
      sendKey(key);
      onKeyEvent?.(key);
    },
    [onKeyEvent],
  );

  const handleRelease = useCallback(() => {
    if (!controlEnabledRef.current) return;
    setActiveKey(null);
    sendKey("stop");
    onKeyEvent?.("stop");
  }, [onKeyEvent]);

  const handleStartControl = () => {
    if (!connected) {
      alert(
        "Robot is not connected. Please connect to the robot before starting control.",
      );
      return;
    }
    setControlEnabled(true);
  };

  const handleStopControl = () => {
    setControlEnabled(false);
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
  }, [handlePress, handleRelease]);

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
        Movement Control {isControlActive ? "🟢" : "🔴"}
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          opacity: isControlActive ? 1 : 0.4,
          pointerEvents: isControlActive ? "auto" : "none",
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
            active={activeKey === "s"}
            arrow="↓"
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
      </div>

      <div
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      >
        {!isControlActive ? (
          <button
            onClick={handleStartControl}
            style={{
              width: "70%",
              padding: "0.6rem",
              background: connected ? "#e8f5e9" : "#f5f5f5",
              color: connected ? "#2e7d32" : "#999",
              border: connected ? "1px solid #a5d6a7" : "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ▶ Start control
          </button>
        ) : (
          <button
            onClick={handleStopControl}
            style={{
              width: "70%",
              padding: "0.6rem",
              background: "#fdecea",
              color: "#c62828",
              border: "1px solid #f5c6cb",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ■ Stop control
          </button>
        )}
      </div>
    </div>
  );
}

export default MovementControl;
