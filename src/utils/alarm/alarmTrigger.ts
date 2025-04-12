
import { Alarm, TriggerOptions } from './types';
import { startAlarmSound, stopAlarmSound } from './audioHandler';
import { startVibration, stopVibration } from './vibrationHandler';
import { setActiveAlarmId, getActiveAlarmId, markAlarmCompleted } from './alarmState';

// Trigger a specific alarm
export const triggerAlarm = (alarm: Alarm, callback: (alarm: Alarm) => void): void => {
  setActiveAlarmId(alarm.id);
  
  // Start audio and vibration
  startAlarmSound();
  
  if (alarm.vibrate) {
    startVibration();
  }
  
  // Notify the callback
  callback(alarm);
};

// Dismiss the currently active alarm
export const dismissAlarm = (): void => {
  stopAlarmSound();
  stopVibration();
  
  // Mark this alarm as completed for today
  const activeAlarmId = getActiveAlarmId();
  if (activeAlarmId) {
    markAlarmCompleted(activeAlarmId);
  }
  
  setActiveAlarmId(null);
};
