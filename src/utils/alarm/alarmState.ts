
// State management for alarms
let activeAlarmId: string | null = null;
let alarmCheckInterval: ReturnType<typeof setInterval> | null = null;
let completedAlarmIds: Record<string, string> = {}; // Store completed alarms as { alarmId: dateString }

// Get the currently active alarm ID (if any)
export const getActiveAlarmId = (): string | null => {
  return activeAlarmId;
};

// Set active alarm ID
export const setActiveAlarmId = (id: string | null): void => {
  activeAlarmId = id;
};

// Mark an alarm as completed for today
export const markAlarmCompleted = (id: string): void => {
  if (id) {
    completedAlarmIds[id] = new Date().toDateString();
    console.log(`Marked alarm ${id} as completed for today`);
  }
};

// Check if an alarm has been completed today
export const isAlarmCompletedToday = (alarmId: string): boolean => {
  const dateString = new Date().toDateString();
  return completedAlarmIds[alarmId] === dateString;
};

// Reset completed alarms
export const resetCompletedAlarms = (): void => {
  completedAlarmIds = {};
};

// Set alarm check interval
export const setAlarmCheckInterval = (interval: ReturnType<typeof setInterval> | null): void => {
  alarmCheckInterval = interval;
};

// Get alarm check interval
export const getAlarmCheckInterval = (): ReturnType<typeof setInterval> | null => {
  return alarmCheckInterval;
};

// Initialize window.alarmVibrateInterval
window.alarmVibrateInterval = null;
