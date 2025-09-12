import { useState, useEffect, useCallback } from "react";
import API from "../helpers/api";

const useAutoUpdate = (checkInterval = 30 * 60 * 1000) => {
  // Default: 30 minutes
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [versionInfo, setVersionInfo] = useState(null);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await API.get("/version");
      const currentVersion = response.data.version;

      // Check for Git updates
      if (
        response.data.git &&
        !response.data.git.error &&
        response.data.git.hasUpdates
      ) {
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
      }

      setVersionInfo(response.data);
      setLastChecked(new Date());
      localStorage.setItem("appVersion", currentVersion);
      localStorage.setItem("lastUpdateCheck", new Date().toISOString());
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const triggerUpdate = useCallback(async () => {
    try {
      await API.post("/update");
      // Reload the page after successful update
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error triggering update:", error);
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  useEffect(() => {
    // Check for updates on component mount
    checkForUpdates();

    // Set up interval for automatic checking
    const interval = setInterval(checkForUpdates, checkInterval);

    // Check for updates when the page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForUpdates();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkForUpdates, checkInterval]);

  return {
    updateAvailable,
    isChecking,
    lastChecked,
    versionInfo,
    checkForUpdates,
    triggerUpdate,
    dismissUpdate,
  };
};

export default useAutoUpdate;
