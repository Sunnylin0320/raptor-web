// Top header bar: app title, connection status badge, and scene switcher.

import { useState, useEffect, useRef } from "react";

function Header({ connected }) {
  const [selectedWorld, setSelectedWorld] = useState("depot");
  const [switching, setSwitching] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "scene_switch_started") {
        setSwitching(true);
      }
    };
    wsRef.current = ws;
    return () => ws.close();
  }, []);

  const handleSwitchScene = () => {
    wsRef.current?.send(
      JSON.stringify({
        switch_scene: true,
        world_name: selectedWorld,
      }),
    );
    setSwitching(true);
    setTimeout(() => {
      setSwitching(false);
    }, 1000);
  };

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
        <h1
          style={{
            fontSize: "1.2rem",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          RaPToR Web
        </h1>

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

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <select
          value={selectedWorld}
          onChange={(e) => setSelectedWorld(e.target.value)}
          disabled={switching}
          style={{
            padding: "0.4rem 0.6rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "0.85rem",
          }}
        >
          <option value="depot">Depot</option>
          <option value="maze">Maze</option>
        </select>

        <button
          onClick={handleSwitchScene}
          disabled={switching}
          style={{
            padding: "0.4rem 0.8rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: switching ? "#eee" : "#f5f5f5",
            color: switching ? "#999" : "#333",
            cursor: switching ? "default" : "pointer",
            fontSize: "0.85rem",
          }}
        >
          {switching ? "Switching... (1-2 min)" : "Switch Scene"}
        </button>
      </div>
    </div>
  );
}

export default Header;
