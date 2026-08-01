// Recording management panel: start/stop recording key sequences from
// Movement Control, manage the list of saved recordings, and trigger
// playback. Mirrors the original Tkinter move.py's recording format:
// a list of (key, duration) pairs.

import { useState, useEffect, useRef } from "react";
import RecordingItem from "./RecordingItem";

function RecordingManagement({
  isRecording,
  setIsRecording,
  currentSequence,
  setCurrentSequence,
}) {
  const [recordings, setRecordings] = useState({});
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const controlWsRef = useRef(null);

  // Separate WebSocket connection dedicated to recording save/load/play,
  // so it doesn't interfere with the movement control connection.
  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");
    ws.onopen = () => console.log("Recording WebSocket connected");
    ws.onerror = (error) => console.error("Recording WebSocket error:", error);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "recordings_list") {
        setRecordings(data.recordings);
      }
    };
    controlWsRef.current = ws;

    // Request the existing recordings list on connect
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ recording_action: "list" }));
    });

    return () => {
      ws.close();
    };
  }, []);

  // Tick every second while recording, so the duration display updates.
  useEffect(() => {
    if (!isRecording) return;
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, [isRecording]);

  const formatDuration = (startTime, currentTime) => {
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setCurrentSequence([]);
    setRecordingStartTime(Date.now());
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    // Convert the raw {key, timestamp} events into (key, duration) pairs,
    // matching the original move.py format.
    const pairs = [];
    for (let i = 0; i < currentSequence.length; i++) {
      const current = currentSequence[i];
      const next = currentSequence[i + 1];
      const durationMs = next ? next.timestamp - current.timestamp : 0;
      pairs.push([current.key, durationMs / 1000]);
    }

    const nextIndex = Object.keys(recordings).length + 1;
    const name = `Recording_${String(nextIndex).padStart(2, "0")}`;

    controlWsRef.current?.send(
      JSON.stringify({
        recording_action: "save",
        name,
        sequence: pairs,
      }),
    );

    setCurrentSequence([]);
  };

  const handlePlay = (name) => {
    controlWsRef.current?.send(
      JSON.stringify({
        recording_action: "play",
        name,
      }),
    );
  };

  const handleDelete = (name) => {
    controlWsRef.current?.send(
      JSON.stringify({
        recording_action: "delete",
        name,
      }),
    );
  };

  const recordingNames = Object.keys(recordings);

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
        Session Management
      </h3>

      {isRecording && (
        <RecordingItem
          name="Recording in progress"
          duration={formatDuration(recordingStartTime, now)}
          isRecording={true}
          onStop={handleStopRecording}
        />
      )}

      {recordingNames.map((name) => (
        <RecordingItem
          key={name}
          name={name}
          isRecording={false}
          onPlay={() => handlePlay(name)}
          onDelete={() => handleDelete(name)}
        />
      ))}

      {!isRecording && (
        <button
          onClick={handleStartRecording}
          style={{
            width: "100%",
            padding: "0.6rem",
            marginTop: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#f5f5f5",
            color: "#333",
            cursor: "pointer",
          }}
        >
          ● New recording
        </button>
      )}
    </div>
  );
}

export default RecordingManagement;
