// Top-level layout for the RaPToR web dashboard.
import { useState, useEffect } from "react";
import Header from "./components/Layout/Header";
import RobotStatusPanel from "./components/RobotStatus/RobotStatusPanel";
import MovementControl from "./components/MovementControl/MovementControl";
import ActionsPanel from "./components/Actions/ActionsPanel";
import TerminalPanel from "./components/Terminal/TerminalPanel";
import RecordingManagement from "./components/Recording/RecordingManagement";
import Toast from "./components/Toast/Toast";

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

const getTimestamp = () => new Date().toTimeString().slice(0, 8);

function App() {
  const [connected, setConnected] = useState(false);
  const [sensorValues, setSensorValues] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const [currentSequence, setCurrentSequence] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message) => {
    setToastMessage(message);
  };

  // Unified event log, shared across the whole app: movement key presses,
  // action invocations, recording events, etc. all get logged here, then
  // rendered by TerminalPanel — matching the original design's requirement
  // that the terminal logs the robot's actions, not just typed commands.
  const [eventLog, setEventLog] = useState([]);

  const logEvent = (message, type = "info") => {
    setEventLog((prev) => [
      ...prev,
      { timestamp: getTimestamp(), message, type },
    ]);
  };

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
        <div style={{ ...cardStyle, flex: 0.6 }}>
          <MovementControl
            connected={connected}
            onKeyEvent={isRecording ? recordKeyEvent : undefined}
            onShowToast={showToast}
            onLogEvent={logEvent}
          />
        </div>
        <div
          style={{
            flex: 2.4,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={cardStyle}>
            <ActionsPanel onLogEvent={logEvent} />
          </div>
          <div style={cardStyle}>
            <TerminalPanel eventLog={eventLog} onLogEvent={logEvent} />
          </div>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <RecordingManagement
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            currentSequence={currentSequence}
            setCurrentSequence={setCurrentSequence}
            onLogEvent={logEvent}
          />
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

export default App;
