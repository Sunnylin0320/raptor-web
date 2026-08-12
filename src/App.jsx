
// export default App;

// Top-level layout for the RaPToR web dashboard.
import { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import RobotStatusPanel from "./components/RobotStatus/RobotStatusPanel";
import MovementControl from "./components/MovementControl/MovementControl";
import ActionsPanel from "./components/Actions/ActionsPanel";
import TerminalPanel from "./components/Terminal/TerminalPanel";
import RecordingManagement from "./components/Recording/RecordingManagement";

function App() {
  const [connected, setConnected] = useState(false);
  const [sensorValues, setSensorValues] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const [currentSequence, setCurrentSequence] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6789");

    ws.onopen = () => {
      console.log("Sensor WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorValues((prev) => ({ ...prev, ...data }));
    };

    ws.onclose = () => {
      console.log("Sensor WebSocket disconnected");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("Sensor WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const recordKeyEvent = (key) => {
    setCurrentSequence((prev) => [...prev, { key, timestamp: Date.now() }]);
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Header connected={connected} />
      <RobotStatusPanel connected={connected} sensorValues={sensorValues} />

      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <div style={{ flex: 1, border: "1px solid #ddd", padding: "1rem" }}>
          <MovementControl
            onKeyEvent={isRecording ? recordKeyEvent : undefined}
          />
        </div>
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ border: "1px solid #ddd", padding: "1rem" }}>
            <ActionsPanel />
          </div>
          <div style={{ border: "1px solid #ddd", padding: "1rem" }}>
            <TerminalPanel />
          </div>
        </div>
        <div style={{ flex: 1, border: "1px solid #ddd", padding: "1rem" }}>
          <RecordingManagement
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            currentSequence={currentSequence}
            setCurrentSequence={setCurrentSequence}
          />
        </div>
      </div>
    </div>
  );
}

export default App;