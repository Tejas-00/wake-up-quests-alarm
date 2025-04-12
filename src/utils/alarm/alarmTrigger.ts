
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
      return '/sounds/sound.mp3'; // Updated to use manually added sound.mp3
    case 'gentle':
      return '/sounds/sound.mp3'; // Fallback to the manually added sound
    case 'loud':
      return '/sounds/sound.mp3'; // Fallback to the manually added sound
    default:
      return '/sounds/sound.mp3'; // Default fallback to manually added sound
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
