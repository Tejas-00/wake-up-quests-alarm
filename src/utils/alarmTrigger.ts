
import { Alarm } from "../context/AlarmContext";
import { getAlarms } from "./alarmStorage";

let alarmCheckInterval: number | null = null;
let activeAlarmId: string | null = null;
let alarmAudio: HTMLAudioElement | null = null;

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
    
    return alarm.days[today as keyof typeof alarm.days];
  }
  
  return false;
};

// Start monitoring alarms
export const startAlarmMonitoring = (options: TriggerOptions): void => {
  console.log("Starting alarm monitoring...");
  
  // Stop any existing monitoring
  stopAlarmMonitoring();
  
  // Check for alarms every 15 seconds
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
  }, 15000); // Check every 15 seconds
};

// Trigger a specific alarm
export const triggerAlarm = (alarm: Alarm, callback: (alarm: Alarm) => void): void => {
  activeAlarmId = alarm.id;
  
  // Create audio element for alarm sound
  alarmAudio = new Audio("/sounds/alarm-sound.mp3"); // Default sound
  alarmAudio.loop = true;
  alarmAudio.volume = 0.7;
  
  // Play the alarm sound
  alarmAudio.play().catch(error => {
    console.error("Error playing alarm sound:", error);
  });
  
  // Notify the callback
  callback(alarm);
};

// Dismiss the currently active alarm
export const dismissAlarm = (): void => {
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio = null;
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
  
  activeAlarmId = null;
};

// Get the currently active alarm ID (if any)
export const getActiveAlarmId = (): string | null => {
  return activeAlarmId;
};
