// import { useState, useEffect, useRef } from "react";

// function App() {
//   const [batteryData, setBatteryData] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const controlWsRef = useRef(null);

//   useEffect(() => {
//     // receive sensor data
//     const dataWs = new WebSocket("ws://10.211.55.3:6789");
//     dataWs.onopen = () => {
//       console.log("Data WebSocket connected");
//       setConnected(true);
//     };
//     dataWs.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Received:", data);
//       setBatteryData(data);
//     };
//     dataWs.onclose = () => {
//       console.log("Data WebSocket disconnected");
//       setConnected(false);
//     };
//     dataWs.onerror = (error) => {
//       console.error("Data WebSocket error:", error);
//     };

//     // sending control commands (keyboard input)
//     const controlWs = new WebSocket("ws://10.211.55.3:6790");
//     controlWs.onopen = () => console.log("Control WebSocket connected");
//     controlWs.onerror = (error) =>
//       console.error("Control WebSocket error:", error);
//     controlWsRef.current = controlWs;

//     return () => {
//       dataWs.close();
//       controlWs.close();
//     };
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const key = e.key.toLowerCase();
//       if (["w", "a", "s", "d"].includes(key)) {
//         controlWsRef.current?.send(JSON.stringify({ key }));
//       }
//     };
//     const handleKeyUp = (e) => {
//       const key = e.key.toLowerCase();
//       if (["w", "a", "s", "d"].includes(key)) {
//         controlWsRef.current?.send(JSON.stringify({ key: "stop" }));
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   return (
//     <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1>RaPToR Web Dashboard</h1>
//       <p>Connection status: {connected ? "✅ Connected" : "❌ Disconnected"}</p>
//       <p>
//         Use W / A / S / D to move the robot (click on the page first to focus)
//       </p>
//       {batteryData && (
//         <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
//           {JSON.stringify(batteryData, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }

// export default App;


// Top-level layout for the RaPToR web dashboard.

import RobotStatusPanel from "./components/RobotStatusPanel";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        RaPToR Web · Connected to robot · Session 00:07:14
      </div>

      <RobotStatusPanel />

      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <div style={{ flex: 1, border: "1px solid #ddd", padding: "1rem" }}>
          Movement Control
        </div>
        <div style={{ flex: 2, border: "1px solid #ddd", padding: "1rem" }}>
          Actions + Event Log
        </div>
        <div style={{ flex: 1, border: "1px solid #ddd", padding: "1rem" }}>
          Session Management
        </div>
      </div>
    </div>
  );
}

export default App;
