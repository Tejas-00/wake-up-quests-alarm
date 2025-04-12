
export interface Alarm {
  id: string;
  time: string;
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  enabled: boolean;
  label: string;
  missionType: string;
  soundId: string;
  vibrate: boolean;
}

export interface TriggerOptions {
  onAlarmTriggered: (alarm: Alarm) => void;
}

// Add to window object for TypeScript
declare global {
  interface Window {
    alarmVibrateInterval: ReturnType<typeof setInterval> | null;
  }
}
