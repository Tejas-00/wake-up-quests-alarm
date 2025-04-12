
import { Alarm, TriggerOptions } from './types';
import { getAlarms } from '../alarmStorage';
import { isAlarmCompletedToday, setAlarmCheckInterval, resetCompletedAlarms } from './alarmState';
import { triggerAlarm } from './alarmTrigger';

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
    if (isAlarmCompletedToday(alarm.id)) {
      console.log(`Alarm ${alarm.id} already completed today`);
      return false;
    }
    
    return alarm.days[today as keyof typeof alarm.days];
  }
  
  return false;
};

// Schedule reset of completed alarms at midnight
export const scheduleResetAtMidnight = (): void => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeToMidnight = tomorrow.getTime() - now.getTime();
  
  window.setTimeout(() => {
    console.log("Resetting completed alarms at midnight");
    resetCompletedAlarms();
    // Set up the next reset
    scheduleResetAtMidnight();
  }, timeToMidnight);
};

// Start monitoring alarms
export const startAlarmMonitoring = (options: TriggerOptions): void => {
  console.log("Starting alarm monitoring...");
  
  // Stop any existing monitoring
  stopAlarmMonitoring();
  
  // Schedule reset of completed alarms at midnight
  scheduleResetAtMidnight();
  
  // Check for alarms every minute
  const interval = window.setInterval(() => {
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
  
  setAlarmCheckInterval(interval);
  
  // Also check immediately on startup
  window.setTimeout(() => {
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

// Stop monitoring alarms
export const stopAlarmMonitoring = (): void => {
  const alarmCheckInterval = setAlarmCheckInterval(null);
  if (alarmCheckInterval) {
    window.clearInterval(alarmCheckInterval);
  }
};
