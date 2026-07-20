import { useState, useEffect, useRef } from "react";

function App() {
  const [batteryData, setBatteryData] = useState(null);
  const [connected, setConnected] = useState(false);
  const controlWsRef = useRef(null);

  useEffect(() => {
    // receive sensor data
    const dataWs = new WebSocket("ws://10.211.55.3:6789");
    dataWs.onopen = () => {
      console.log("Data WebSocket connected");
      setConnected(true);
    };
    dataWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      setBatteryData(data);
    };
    dataWs.onclose = () => {
      console.log("Data WebSocket disconnected");
      setConnected(false);
    };
    dataWs.onerror = (error) => {
      console.error("Data WebSocket error:", error);
    };

    // sending control commands (keyboard input)
    const controlWs = new WebSocket("ws://10.211.55.3:6790");
    controlWs.onopen = () => console.log("Control WebSocket connected");
    controlWs.onerror = (error) =>
      console.error("Control WebSocket error:", error);
    controlWsRef.current = controlWs;

    return () => {
      dataWs.close();
      controlWs.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        controlWsRef.current?.send(JSON.stringify({ key }));
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        controlWsRef.current?.send(JSON.stringify({ key: "stop" }));
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
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>RaPToR Web Dashboard</h1>
      <p>Connection status: {connected ? "✅ Connected" : "❌ Disconnected"}</p>
      <p>
        Use W / A / S / D to move the robot (click on the page first to focus)
      </p>
      {batteryData && (
        <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
          {JSON.stringify(batteryData, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
