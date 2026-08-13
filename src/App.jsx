// Top-level layout for the RaPToR web dashboard.
import { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import RobotStatusPanel from "./components/RobotStatus/RobotStatusPanel";
import MovementControl from "./components/MovementControl/MovementControl";
import ActionsPanel from "./components/Actions/ActionsPanel";
import TerminalPanel from "./components/Terminal/TerminalPanel";
import RecordingManagement from "./components/Recording/RecordingManagement";

const cardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
  padding: "1rem",
  backgroundColor: "#fff",
};

const headerCardStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
  padding: "0.02rem 1rem",
  backgroundColor: "#fff",
};

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
    <div style={{ fontFamily: "Inter, sans-serif", padding: "1rem" }}>
      <div style={{ ...headerCardStyle, marginBottom: "1rem" }}>
        <Header connected={connected} />
      </div>

      <div style={{ ...cardStyle, marginBottom: "1rem" }}>
        <RobotStatusPanel connected={connected} sensorValues={sensorValues} />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ ...cardStyle, flex: 1 }}>
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
          <div style={cardStyle}>
            <ActionsPanel />
          </div>
          <div style={cardStyle}>
            <TerminalPanel />
          </div>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
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