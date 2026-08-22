// Recording management panel: start/stop recording key sequences from
// Movement Control, manage the list of saved recordings, and trigger
// playback. Mirrors the original Tkinter move.py's recording format:
// a list of (key, duration) pairs.
//
// Tracks which recording (if any) is currently playing, so the Play
// button gives clear visual feedback instead of appearing unresponsive.

import { useState, useEffect, useRef } from "react";
import RecordingItem from "./RecordingItem";

function RecordingManagement({
  isRecording,
  setIsRecording,
  currentSequence,
  setCurrentSequence,
  onLogEvent,
}) {
  const [recordings, setRecordings] = useState({});
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [playingName, setPlayingName] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");
    ws.onopen = () => {
      console.log("Recording WebSocket connected");
      ws.send(JSON.stringify({ recording_action: "list" }));
    };
    ws.onerror = (error) => console.error("Recording WebSocket error:", error);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("RecordingManagement received:", data);
      if (data.type === "recordings_list") {
        setRecordings(data.recordings);
      } else if (data.type === "playback_finished") {
        // Backend confirms playback of this recording has completed.
        setPlayingName((current) => (current === data.name ? null : current));
        onLogEvent?.(`Finished playing: ${data.name}`, "success");
      }
    };
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [onLogEvent]);

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
    const startTime = Date.now();
    setCurrentSequence([]);
    setRecordingStartTime(startTime);
    setNow(startTime);
    setIsRecording(true);
    onLogEvent?.("Recording started", "info");
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    const events = [];
    for (let i = 0; i < currentSequence.length; i++) {
      const current = currentSequence[i];
      const next = currentSequence[i + 1];
      const delaySeconds = next
        ? (next.timestamp - current.timestamp) / 1000
        : 0;

      if (current.type === "action") {
        events.push({
          type: "action",
          name: current.name,
          params: current.params ?? {},
          delay: delaySeconds,
        });
      } else {
        events.push({ type: "key", key: current.key, delay: delaySeconds });
      }
    }

    const nextIndex = Object.keys(recordings).length + 1;
    const name = `Recording_${String(nextIndex).padStart(2, "0")}`;

    wsRef.current?.send(
      JSON.stringify({
        recording_action: "save",
        name,
        sequence: events,
      }),
    );

    onLogEvent?.(`Recording saved: ${name}`, "success");
    setCurrentSequence([]);
  };

  const handlePlay = (name) => {
    if (playingName) return; // prevent starting a second playback while one is running
    setPlayingName(name);
    wsRef.current?.send(JSON.stringify({ recording_action: "play", name }));
    onLogEvent?.(`Playing: ${name}`, "info");
  };

  const handleDelete = (name) => {
    wsRef.current?.send(JSON.stringify({ recording_action: "delete", name }));
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
        Recording Management
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
          isPlaying={playingName === name}
          disabled={playingName !== null && playingName !== name}
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
