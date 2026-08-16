// Terminal panel: fully replicates the original Tkinter terminal.py behavior.
// Commands typed here are sent to ros_bridge.py and executed as real shell
// commands via subprocess; output streams back in real time, with stderr
// lines shown in red.
//
// Also displays the shared eventLog (movement key presses, action
// invocations, recording events, etc.) alongside typed command output,
// so the terminal serves as a unified log of everything happening in
// the system — matching the original design's requirement that the
// terminal logs the robot's actions, not just typed commands.

import { useState, useEffect, useRef } from "react";

const TYPE_COLORS = {
  info: "#333",
  success: "#2e7d32",
  warning: "#c62828",
  error: "#c62828",
};

function TerminalPanel({ eventLog = [], onLogEvent }) {
  const [command, setCommand] = useState("");
  const [commandLines, setCommandLines] = useState([
    {
      text: "Terminal ready. Type a command and press Enter or Execute.",
      isError: false,
    },
  ]);
  const terminalWsRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.211.55.3:6790");

    ws.onopen = () => console.log("Terminal WebSocket connected");
    ws.onerror = (error) => console.error("Terminal WebSocket error:", error);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "terminal_output") {
        setCommandLines((prev) => [
          ...prev,
          { text: data.line, isError: data.is_error },
        ]);
        if (data.is_error) {
          onLogEvent?.(data.line.trim(), "error");
        }
      } else if (data.type === "terminal_clear") {
        setCommandLines([]);
      }
    };

    terminalWsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [onLogEvent]);

  // Combine the shared event log with locally-typed command output into
  // a single, chronologically merged list for display.
  const combinedLines = [
    ...eventLog.map((event) => ({
      text: `[${event.timestamp}] ${event.message}`,
      isError: event.type === "error" || event.type === "warning",
      color: TYPE_COLORS[event.type] ?? TYPE_COLORS.info,
    })),
    ...commandLines.map((line) => ({
      text: line.text,
      isError: line.isError,
      isCommand: line.isCommand,
      color: line.isError ? "#c62828" : line.isCommand ? "#1565c0" : "#333",
    })),
  ];

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [combinedLines.length]);

  const handleExecute = () => {
    if (!command.trim()) return;

    setCommandLines((prev) => [
      ...prev,
      { text: `$ ${command}`, isError: false, isCommand: true },
    ]);
    terminalWsRef.current?.send(JSON.stringify({ command }));
    setCommand("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleExecute();
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "0.75rem",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        Terminal
      </h3>

      <div
        ref={outputRef}
        style={{
          background: "#fafafa",
          border: "1px solid #eee",
          color: "#333",
          fontFamily: "monospace",
          fontSize: "0.8rem",
          padding: "0.75rem",
          height: "220px",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          marginBottom: "0.75rem",
          borderRadius: "4px",
        }}
      >
        {combinedLines.map((line, index) => (
          <div key={index} style={{ color: line.color }}>
            {line.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a command..."
          style={{
            flex: 1,
            padding: "0.6rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "0.85rem",
            fontFamily: "monospace",
          }}
        />
        <button
          onClick={handleExecute}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Execute
        </button>
      </div>
    </div>
  );
}

export default TerminalPanel;
