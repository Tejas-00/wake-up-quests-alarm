
import { Alarm } from "../context/AlarmContext";
import { getAlarms } from "./alarmStorage";

let alarmCheckInterval: ReturnType<typeof setInterval> | null = null;
let activeAlarmId: string | null = null;
let alarmAudio: HTMLAudioElement | null = null;
let completedAlarmIds: Record<string, string> = {}; // Store completed alarms as { alarmId: dateString }

interface TriggerOptions {
  onAlarmTriggered: (alarm: Alarm) => void;
}

// Check if a specific alarm should trigger now
export const shouldTriggerAlarm = (alarm: Alarm): boolean => {
  if (!alarm.enabled) return false;
  
  const now = new Date();
  const [alarmHours, alarmMinutes] = alarm.time.split(':').map(Number);
  
  // Check if the current time matches the alarm time
  if (now.getHours() === alarmHours && now.getMinutes() === alarmMinutes) {
    // Check if the alarm is set for today
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = daysOfWeek[now.getDay()];
    
    // Don't trigger if it's been completed today
    const dateString = now.toDateString();
    if (completedAlarmIds[alarm.id] === dateString) {
      console.log(`Alarm ${alarm.id} already completed today`);
      return false;
    }
    
    return alarm.days[today as keyof typeof alarm.days];
  }
  
  return false;
};

// Start monitoring alarms
export const startAlarmMonitoring = (options: TriggerOptions): void => {
  console.log("Starting alarm monitoring...");
  
  // Stop any existing monitoring
  stopAlarmMonitoring();
  
  // Reset completed alarms at midnight
  const resetCompletedAlarmsAtMidnight = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeToMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      console.log("Resetting completed alarms at midnight");
      completedAlarmIds = {};
      // Set up the next reset
      resetCompletedAlarmsAtMidnight();
    }, timeToMidnight);
  };
  
  // Set up initial reset
  resetCompletedAlarmsAtMidnight();
  
  // Check for alarms every minute
  alarmCheckInterval = window.setInterval(() => {
    if (activeAlarmId) return; // Don't check if an alarm is already active
    
    const alarms = getAlarms();
    const now = new Date();
    
    // Log for debugging
    console.log(`Checking alarms at ${now.toLocaleTimeString()}...`);
    
    // Check each alarm
    for (const alarm of alarms) {
      if (shouldTriggerAlarm(alarm)) {
        console.log(`Alarm triggered: ${alarm.label || alarm.time}`);
        triggerAlarm(alarm, options.onAlarmTriggered);
        break;
      }
    }
  }, 60000); // Check every minute
  
  // Also check immediately on startup
  setTimeout(() => {
    const alarms = getAlarms();
    const now = new Date();
    console.log(`Initial alarm check at ${now.toLocaleTimeString()}...`);
    
    for (const alarm of alarms) {
      if (shouldTriggerAlarm(alarm)) {
        console.log(`Alarm triggered on initial check: ${alarm.label || alarm.time}`);
        triggerAlarm(alarm, options.onAlarmTriggered);
        break;
      }
    }
  }, 1000);
};

// Preload audio element to avoid playback issues on mobile
const preloadAlarmSound = (): HTMLAudioElement => {
  const audio = new Audio("/sounds/alarm-sound.mp3");
  // Enable auto-play on mobile by adding user interaction event listeners
  document.addEventListener('touchstart', () => {
    // Create and play a silent audio to enable audio context
    const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPz8/Pz8/TExMTExZWVlZWVlnZ2dnZ3V1dXV1dYODg4ODkZGRkZGRn5+fn5+frKysrKy6urq6urq/v7+/v7/MzMzMzMzY2NjY2Nra2tra2uTk5OTk8vLy8vLy//////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAXwAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Qy7y8vLy8vL9h555519l5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5f/7kmRAP/0MkLJBQngAi9GePCpGAAZTM8YagAAKFGY6UxMAAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAf/7kkQAP/AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAABAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBA");
    silentAudio.play().then(() => {
      silentAudio.pause();
      silentAudio.remove();
    }).catch(e => console.log("Silent audio play failed:", e));
  }, { once: true });
  
  return audio;
};

// Trigger a specific alarm
export const triggerAlarm = (alarm: Alarm, callback: (alarm: Alarm) => void): void => {
  activeAlarmId = alarm.id;
  
  // Create audio element for alarm sound with improved mobile handling
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio = null;
  }
  
  alarmAudio = preloadAlarmSound();
  alarmAudio.loop = true;
  alarmAudio.volume = 1.0; // Full volume for mobile
  
  // Ensure audio plays even if the app is in background
  try {
    // Play the alarm sound with retry mechanism
    const playWithRetry = (retries = 3) => {
      alarmAudio!.play()
        .then(() => {
          console.log("Alarm sound playing successfully");
        })
        .catch(error => {
          console.error("Error playing alarm sound:", error);
          
          // Try again with user interaction if available
          if (retries > 0) {
            console.log(`Retrying playback, ${retries} attempts left`);
            setTimeout(() => playWithRetry(retries - 1), 1000);
          }
        });
    };
    
    playWithRetry();
    
    // Use device vibration if available
    if (navigator.vibrate) {
      // Vibrate pattern: 500ms vibrate, 200ms pause, repeat
      const vibrateInterval = setInterval(() => {
        navigator.vibrate([500, 200, 500]);
      }, 1500);
      
      // Store the interval ID in window for cleanup
      window.alarmVibrateInterval = vibrateInterval;
    }
  } catch (e) {
    console.error("Critical error triggering alarm:", e);
  }
  
  // Notify the callback
  callback(alarm);
};

// Dismiss the currently active alarm
export const dismissAlarm = (): void => {
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    alarmAudio = null;
  }
  
  // Stop vibration if active
  if (navigator.vibrate && window.alarmVibrateInterval) {
    navigator.vibrate(0); // Stop vibration
    clearInterval(window.alarmVibrateInterval);
    window.alarmVibrateInterval = null;
  }
  
  // Mark this alarm as completed for today
  if (activeAlarmId) {
    completedAlarmIds[activeAlarmId] = new Date().toDateString();
    console.log(`Marked alarm ${activeAlarmId} as completed for today`);
  }
  
  activeAlarmId = null;
};

// Stop monitoring alarms
export const stopAlarmMonitoring = (): void => {
  if (alarmCheckInterval) {
    window.clearInterval(alarmCheckInterval);
    alarmCheckInterval = null;
  }
  
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio = null;
  }
  
  // Stop vibration if active
  if (navigator.vibrate && window.alarmVibrateInterval) {
    navigator.vibrate(0);
    clearInterval(window.alarmVibrateInterval);
    window.alarmVibrateInterval = null;
  }
  
  activeAlarmId = null;
};

// Get the currently active alarm ID (if any)
export const getActiveAlarmId = (): string | null => {
  return activeAlarmId;
};

// Add to window object for TypeScript
declare global {
  interface Window {
    alarmVibrateInterval: number | null;
  }
}

// Initialize window.alarmVibrateInterval
window.alarmVibrateInterval = null;
