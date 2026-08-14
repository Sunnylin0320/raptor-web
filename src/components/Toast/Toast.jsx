// A simple toast notification that appears at the top-right of the
// screen and automatically disappears after a few seconds.

import { useEffect } from "react";

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        background: "#333",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        fontSize: "0.9rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 1000,
        maxWidth: "320px",
      }}
    >
      {message}
    </div>
  );
}

export default Toast;
