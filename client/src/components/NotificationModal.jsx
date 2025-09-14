import { useEffect } from "react";
import Modal from "./Modal";

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  type = "info", 
  title, 
  message,
  autoClose = false,
  autoCloseDelay = 3000 
}) {
  // Auto close functionality
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "#16a34a";
      case "error":
        return "#dc2626";
      case "warning":
        return "#d97706";
      case "info":
      default:
        return "#646cff";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`}
      size="small"
      showCloseButton={!autoClose}
    >
      <div
        style={{
          textAlign: "center",
          padding: window.innerWidth <= 480 ? "0.5rem" : undefined
        }}
      >
        <div
          style={{
            fontSize: window.innerWidth <= 480 ? "2rem" : "3rem",
            marginBottom: window.innerWidth <= 480 ? "0.5rem" : "1rem"
          }}
        >
          {getIcon()}
        </div>
        <p
          style={{
            marginBottom: window.innerWidth <= 480 ? "1rem" : "1.5rem",
            lineHeight: "1.5",
            fontSize: window.innerWidth <= 480 ? "1rem" : undefined
          }}
        >
          {message}
        </p>
        {!autoClose && (
          <button
            onClick={onClose}
            style={{
              backgroundColor: getButtonColor(),
              color: "white",
              padding: window.innerWidth <= 480 ? "0.5rem 1rem" : "0.5rem 1.5rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: window.innerWidth <= 480 ? "1rem" : undefined
            }}
          >
            OK
          </button>
        )}
      </div>
    </Modal>
  );
}
