import { useState, useEffect } from "react";
import RecordingItem from "./RecordingItem";

function RecordingManagement() {
  const [activeRecording, setActiveRecording] = useState(() => ({
    name: "Trial_03",
    startTime: Date.now() - 2 * 60 * 1000 - 14 * 1000,
  }));

  const [recordings, setRecordings] = useState([
    { name: "Trial_01" },
    { name: "Trial_02" },
  ]);

  // "now" is updated every second while a recording is active, so the
  // duration display ticks forward in real time. Date.now() is only
  // called inside this effect (not during render), which keeps the
  // component's render logic pure.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeRecording) return;

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeRecording]);

  // Pure function: takes two numbers, returns a string. No calls to
  // Date.now() or anything else unstable — safe to call during render.
  const formatDuration = (startTime, currentTime) => {
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleStopRecording = () => {
    if (!activeRecording) return;
    setRecordings((prev) => [...prev, { name: activeRecording.name }]);
    setActiveRecording(null);
  };

  const handleNewRecording = () => {
    if (activeRecording) return;
    const nextIndex = recordings.length + 1;
    setActiveRecording({
      name: `Trial_${String(nextIndex).padStart(2, "0")}`,
      startTime: Date.now(),
    });
  };

  const handleDelete = (name) => {
    setRecordings((prev) => prev.filter((r) => r.name !== name));
  };

  const handlePlay = (name) => {
    console.log(`Playing recording: ${name}`);
  };

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

      {activeRecording && (
        <RecordingItem
          name={activeRecording.name}
          duration={formatDuration(activeRecording.startTime, now)}
          isRecording={true}
          onStop={handleStopRecording}
        />
      )}

      {recordings.map((recording) => (
        <RecordingItem
          key={recording.name}
          name={recording.name}
          isRecording={false}
          onPlay={() => handlePlay(recording.name)}
          onDelete={() => handleDelete(recording.name)}
        />
      ))}

      <button
        onClick={handleNewRecording}
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
        + New recording
      </button>
    </div>
  );
}

export default RecordingManagement;
