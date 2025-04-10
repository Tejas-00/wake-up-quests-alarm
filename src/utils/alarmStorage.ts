
import { Alarm } from "../context/AlarmContext";

export const getAlarms = (): Alarm[] => {
  try {
    const alarmsJson = localStorage.getItem("alarms");
    return alarmsJson ? JSON.parse(alarmsJson) : [];
  } catch (error) {
    console.error("Error loading alarms:", error);
    return [];
  }
};

export const saveAlarm = (alarm: Alarm): void => {
  try {
    const alarms = getAlarms();
    const index = alarms.findIndex((a) => a.id === alarm.id);
    
    if (index >= 0) {
      // Update existing alarm
      alarms[index] = alarm;
    } else {
      // Add new alarm
      alarms.push(alarm);
    }
    
    localStorage.setItem("alarms", JSON.stringify(alarms));
  } catch (error) {
    console.error("Error saving alarm:", error);
  }
};

export const deleteAlarm = (id: string): void => {
  try {
    const alarms = getAlarms();
    const updatedAlarms = alarms.filter((alarm) => alarm.id !== id);
    localStorage.setItem("alarms", JSON.stringify(updatedAlarms));
  } catch (error) {
    console.error("Error deleting alarm:", error);
  }
};

// Sleep sounds management
export interface SleepSound {
  id: string;
  name: string;
  source: string;
  isCustom: boolean;
}

export const getDefaultSounds = (): SleepSound[] => {
  return [
    { id: "rain", name: "Rain", source: "rain.mp3", isCustom: false },
    { id: "white_noise", name: "White Noise", source: "white_noise.mp3", isCustom: false },
    { id: "ocean_waves", name: "Ocean Waves", source: "ocean_waves.mp3", isCustom: false },
    { id: "forest", name: "Forest", source: "forest.mp3", isCustom: false },
    { id: "thunderstorm", name: "Thunderstorm", source: "thunderstorm.mp3", isCustom: false },
  ];
};

export const getSounds = (): SleepSound[] => {
  try {
    const customSoundsJson = localStorage.getItem("custom_sounds");
    const customSounds = customSoundsJson ? JSON.parse(customSoundsJson) : [];
    return [...getDefaultSounds(), ...customSounds];
  } catch (error) {
    console.error("Error loading sleep sounds:", error);
    return getDefaultSounds();
  }
};

export const saveCustomSound = (sound: Omit<SleepSound, "id" | "isCustom">): void => {
  try {
    const sounds = getSounds().filter(s => s.isCustom);
    const newSound: SleepSound = {
      ...sound,
      id: Date.now().toString(),
      isCustom: true
    };
    
    localStorage.setItem("custom_sounds", JSON.stringify([...sounds, newSound]));
  } catch (error) {
    console.error("Error saving custom sound:", error);
  }
};

export const deleteCustomSound = (id: string): void => {
  try {
    const sounds = getSounds().filter(s => s.isCustom);
    const updatedSounds = sounds.filter(sound => sound.id !== id);
    localStorage.setItem("custom_sounds", JSON.stringify(updatedSounds));
  } catch (error) {
    console.error("Error deleting custom sound:", error);
  }
};
