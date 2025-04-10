import React, { createContext, useState, useContext, useEffect } from "react";
import { getAlarms, saveAlarm, deleteAlarm } from "../utils/alarmStorage";
import { startAlarmMonitoring, dismissAlarm, getActiveAlarmId } from "../utils/alarmTrigger";

export type MissionType = "photo" | "math" | "puzzle" | "random";

export interface AlarmDay {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface Alarm {
  id: string;
  time: string;
  days: AlarmDay;
  enabled: boolean;
  label: string;
  missionType: MissionType;
  soundId: string;
  vibrate: boolean;
}

export interface AlarmStat {
  date: string;
  alarmId: string;
  dismissed: boolean;
  snoozeCount: number;
  completionTimeMs: number;
}

interface AlarmContextType {
  alarms: Alarm[];
  stats: AlarmStat[];
  activeAlarmId: string | null;
  createAlarm: (alarm: Omit<Alarm, "id">) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  addStat: (stat: AlarmStat) => void;
  getAverageWakeUpTime: () => string | null;
  getAverageSnoozeCount: () => number;
  getSuccessRate: () => number;
  dismissCurrentAlarm: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const useAlarms = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error("useAlarms must be used within an AlarmProvider");
  }
  return context;
};

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [stats, setStats] = useState<AlarmStat[]>([]);
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);

  useEffect(() => {
    const loadedAlarms = getAlarms();
    setAlarms(loadedAlarms);

    const loadedStats = localStorage.getItem("alarm_stats");
    if (loadedStats) {
      setStats(JSON.parse(loadedStats));
    }

    startAlarmMonitoring({
      onAlarmTriggered: (alarm) => {
        console.log("Alarm triggered:", alarm);
        setActiveAlarmId(alarm.id);
      }
    });

    return () => {
      dismissAlarm();
    };
  }, []);

  useEffect(() => {
    const checkActiveAlarm = () => {
      const currentActiveId = getActiveAlarmId();
      if (currentActiveId !== activeAlarmId) {
        setActiveAlarmId(currentActiveId);
      }
    };

    const intervalId = setInterval(checkActiveAlarm, 1000);
    return () => clearInterval(intervalId);
  }, [activeAlarmId]);

  const dismissCurrentAlarm = () => {
    dismissAlarm();
    setActiveAlarmId(null);
  };

  const createAlarm = (alarm: Omit<Alarm, "id">) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: Date.now().toString(),
    };
    
    saveAlarm(newAlarm);
    setAlarms([...alarms, newAlarm]);
  };

  const updateAlarm = (id: string, updatedFields: Partial<Alarm>) => {
    const updatedAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        const updatedAlarm = { ...alarm, ...updatedFields };
        saveAlarm(updatedAlarm);
        return updatedAlarm;
      }
      return alarm;
    });
    
    setAlarms(updatedAlarms);
  };

  const removeAlarm = (id: string) => {
    deleteAlarm(id);
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      updateAlarm(id, { enabled: !alarm.enabled });
    }
  };

  const addStat = (stat: AlarmStat) => {
    const newStats = [...stats, stat];
    setStats(newStats);
    localStorage.setItem("alarm_stats", JSON.stringify(newStats));
  };

  const getAverageWakeUpTime = () => {
    if (stats.length === 0) return null;
    
    const times = stats.map(stat => {
      const alarmId = stat.alarmId;
      const alarm = alarms.find(a => a.id === alarmId);
      if (!alarm) return null;
      
      const [hours, minutes] = alarm.time.split(":").map(Number);
      return { hours, minutes };
    }).filter(Boolean) as { hours: number; minutes: number }[];
    
    if (times.length === 0) return null;
    
    const totalMinutes = times.reduce((acc, time) => {
      return acc + (time.hours * 60) + time.minutes;
    }, 0);
    
    const averageMinutes = Math.round(totalMinutes / times.length);
    const hours = Math.floor(averageMinutes / 60);
    const minutes = averageMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getAverageSnoozeCount = () => {
    if (stats.length === 0) return 0;
    
    const totalSnoozes = stats.reduce((acc, stat) => acc + stat.snoozeCount, 0);
    return Math.round((totalSnoozes / stats.length) * 10) / 10;
  };

  const getSuccessRate = () => {
    if (stats.length === 0) return 0;
    
    const successfulDismissals = stats.filter(stat => stat.dismissed).length;
    return Math.round((successfulDismissals / stats.length) * 100);
  };

  const value: AlarmContextType = {
    alarms,
    stats,
    activeAlarmId,
    createAlarm,
    updateAlarm,
    removeAlarm,
    toggleAlarm,
    addStat,
    getAverageWakeUpTime,
    getAverageSnoozeCount,
    getSuccessRate,
    dismissCurrentAlarm
  };

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
};
