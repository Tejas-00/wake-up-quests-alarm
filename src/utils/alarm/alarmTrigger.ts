
import { Alarm, TriggerOptions } from './types';
import { startAlarmSound, stopAlarmSound } from './audioHandler';
import { startVibration, stopVibration } from './vibrationHandler';
import { setActiveAlarmId, getActiveAlarmId, markAlarmCompleted } from './alarmState';

// Trigger a specific alarm
export const triggerAlarm = (alarm: Alarm, callback: (alarm: Alarm) => void): void => {
  setActiveAlarmId(alarm.id);
  
  // Start audio and vibration
  const soundPath = getSoundPath(alarm.soundId);
  startAlarmSound(soundPath);
  
  if (alarm.vibrate) {
    startVibration();
  }
  
  // Notify the callback
  callback(alarm);
};

// Helper function to get sound path based on ID
const getSoundPath = (soundId: string): string => {
  // Map sound IDs to their file paths
  // This could be expanded with more sounds in the future
  switch (soundId) {
    case 'default':
      return '/sounds/alarm.mp3';
    case 'gentle':
      return '/sounds/gentle-alarm.mp3';
    case 'loud':
      return '/sounds/loud-alarm.mp3';
    default:
      return '/sounds/alarm.mp3'; // Default fallback
  }
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
