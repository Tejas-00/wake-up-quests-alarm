
// Vibration handling for alarms

// Start device vibration
export const startVibration = (): void => {
  if (!navigator.vibrate) {
    console.log("Vibration API not supported");
    return;
  }
  
  // Stop any existing vibration first
  stopVibration();
  
  // Vibrate pattern: 500ms vibrate, 200ms pause, repeat
  const vibrateInterval = window.setInterval(() => {
    navigator.vibrate([500, 200, 500]);
  }, 1500);
  
  // Store the interval ID in window for cleanup
  window.alarmVibrateInterval = vibrateInterval;
};

// Stop device vibration
export const stopVibration = (): void => {
  if (!navigator.vibrate) return;
  
  navigator.vibrate(0); // Stop vibration
  
  if (window.alarmVibrateInterval) {
    window.clearInterval(window.alarmVibrateInterval);
    window.alarmVibrateInterval = null;
  }
};
