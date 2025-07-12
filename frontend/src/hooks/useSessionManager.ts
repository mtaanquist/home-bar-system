import { useEffect } from "react";
import { useApp } from "../context/AppContext";

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ACTIVITY_KEY = "homeBarSystem_lastActivity";

export const useSessionManager = () => {
  const {
    currentView,
    setCurrentView,
    setUserType,
    setCurrentBar,
    setCustomerName,
  } = useApp();

  const updateActivity = () => {
    localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
  };

  const checkSessionTimeout = () => {
    const lastActivity = localStorage.getItem(ACTIVITY_KEY);
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - parseInt(lastActivity);
    return timeSinceActivity > SESSION_TIMEOUT;
  };

  const clearSession = () => {
    setCurrentView("landing");
    setUserType(null);
    setCurrentBar(null);
    setCustomerName("");
    localStorage.removeItem(ACTIVITY_KEY);
  };

  useEffect(() => {
    // Check for expired session on mount
    if (currentView !== "landing" && checkSessionTimeout()) {
      console.log("Session expired, clearing...");
      clearSession();
      return;
    }

    // Update activity timestamp when component mounts
    if (currentView !== "landing") {
      updateActivity();
    }

    // Set up activity listeners
    const handleActivity = () => {
      if (currentView !== "landing") {
        updateActivity();
      }
    };

    // Listen for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [currentView]);

  return { clearSession, updateActivity };
};
