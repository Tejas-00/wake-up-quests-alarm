import React, { useState } from "react";
import { useAlarms, Alarm, MissionType } from "../context/AlarmContext";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Camera, Calculator, Puzzle, Edit2, Trash2 } from "lucide-react";
import { shouldTriggerAlarm } from "../utils/alarm";
import AlarmForm from "./AlarmForm";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const getMissionIcon = (type: MissionType) => {
  switch (type) {
    case "photo":
      return <Camera className="h-4 w-4 text-mission-photo" />;
    case "math":
      return <Calculator className="h-4 w-4 text-mission-math" />;
    case "puzzle":
      return <Puzzle className="h-4 w-4 text-mission-puzzle" />;
    default:
      return null;
  }
};

const getMissionLabel = (type: MissionType) => {
  switch (type) {
    case "photo":
      return "Photo Mission";
    case "math":
      return "Math Mission";
    case "puzzle":
      return "Puzzle Mission";
    default:
      return "Unknown Mission";
  }
};

const getMissionColor = (type: MissionType) => {
  switch (type) {
    case "photo":
      return "bg-blue-100 text-blue-700";
    case "math":
      return "bg-orange-100 text-orange-700";
    case "puzzle":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getDayLabels = (days: Alarm["days"]) => {
  const dayLabels: string[] = [];
  
  if (days.monday) dayLabels.push("Mon");
  if (days.tuesday) dayLabels.push("Tue");
  if (days.wednesday) dayLabels.push("Wed");
  if (days.thursday) dayLabels.push("Thu");
  if (days.friday) dayLabels.push("Fri");
  if (days.saturday) dayLabels.push("Sat");
  if (days.sunday) dayLabels.push("Sun");
  
  if (dayLabels.length === 7) return "Every day";
  if (dayLabels.length === 0) return "One time";
  if (dayLabels.length === 5 && days.monday && days.tuesday && days.wednesday && days.thursday && days.friday) {
    return "Weekdays";
  }
  if (dayLabels.length === 2 && days.saturday && days.sunday) {
    return "Weekends";
  }
  
  return dayLabels.join(", ");
};

const getNextAlarmTime = (alarms: Alarm[]): { alarm: Alarm; timeUntil: string } | null => {
  if (!alarms || alarms.length === 0) return null;
  
  const enabledAlarms = alarms.filter(a => a.enabled);
  if (enabledAlarms.length === 0) return null;
  
  const now = new Date();
  let closestAlarm: Alarm | null = null;
  let closestTime: Date | null = null;
  
  for (const alarm of enabledAlarms) {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    
    // Check each day of the week
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkDate = new Date();
      checkDate.setDate(now.getDate() + dayOffset);
      
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = daysOfWeek[checkDate.getDay()];
      
      // Skip if alarm is not set for this day
      if (!alarm.days[dayName as keyof typeof alarm.days]) continue;
      
      // Set the time for comparison
      checkDate.setHours(hours, minutes, 0, 0);
      
      // Skip if this time is in the past
      if (dayOffset === 0 && checkDate <= now) continue;
      
      // If this is the closest alarm so far, save it
      if (!closestTime || checkDate < closestTime) {
        closestTime = checkDate;
        closestAlarm = alarm;
      }
      
      // We only need to check the first valid day for each alarm
      break;
    }
  }
  
  if (closestAlarm && closestTime) {
    // Calculate time until the alarm
    const diffMs = closestTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format the time until
    let timeUntil = "";
    if (diffHours > 0) {
      timeUntil += `${diffHours}h `;
    }
    timeUntil += `${diffMinutes}m`;
    
    return { alarm: closestAlarm, timeUntil };
  }
  
  return null;
};

const AlarmListItem: React.FC<{ 
  alarm: Alarm, 
  onEdit: (alarm: Alarm) => void,
  onDelete: (alarm: Alarm) => void
}> = ({ alarm, onEdit, onDelete }) => {
  const { toggleAlarm } = useAlarms();
  
  return (
    <div className="alarm-item bg-card rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="alarm-time text-xl font-semibold">{alarm.time}</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{getDayLabels(alarm.days)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`mission-badge ${getMissionColor(alarm.missionType)} px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
              {getMissionIcon(alarm.missionType)}
              <span>{getMissionLabel(alarm.missionType)}</span>
            </div>
          </div>
          {alarm.label && (
            <p className="text-sm mt-2 text-muted-foreground">{alarm.label}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Switch 
            checked={alarm.enabled}
            onCheckedChange={() => toggleAlarm(alarm.id)}
          />
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8" 
              onClick={() => onEdit(alarm)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8 text-destructive hover:text-destructive/80" 
              onClick={() => onDelete(alarm)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlarmList: React.FC = () => {
  const { alarms, removeAlarm } = useAlarms();
  const nextAlarm = getNextAlarmTime(alarms);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [alarmToDelete, setAlarmToDelete] = useState<Alarm | null>(null);
  
  const enabledAlarms = alarms.filter(alarm => alarm.enabled);
  const disabledAlarms = alarms.filter(alarm => !alarm.enabled);
  
  const handleDeleteAlarm = () => {
    if (alarmToDelete) {
      removeAlarm(alarmToDelete.id);
      toast.success("Alarm deleted successfully");
      setAlarmToDelete(null);
    }
  };
  
  if (editingAlarm) {
    return (
      <AlarmForm 
        alarmToEdit={editingAlarm}
        onCancel={() => setEditingAlarm(null)}
      />
    );
  }
  
  if (alarms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-dashed border-border my-4">
        <Bell className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No alarms yet</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Tap the + button below to create your first alarm
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 p-4">
      {nextAlarm && (
        <div className="bg-primary/10 p-3 rounded-lg mb-4">
          <p className="text-sm">
            <span className="font-semibold">Next alarm:</span> {nextAlarm.alarm.time} 
            <span className="text-muted-foreground ml-2">({nextAlarm.timeUntil} from now)</span>
          </p>
        </div>
      )}
    
      {enabledAlarms.length > 0 && (
        <div className="space-y-3">
          {enabledAlarms.map(alarm => (
            <AlarmListItem 
              key={alarm.id} 
              alarm={alarm}
              onEdit={setEditingAlarm}
              onDelete={setAlarmToDelete}
            />
          ))}
        </div>
      )}
      
      {disabledAlarms.length > 0 && (
        <div className="space-y-1 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground ml-1 mb-2">Disabled Alarms</h3>
          {disabledAlarms.map(alarm => (
            <AlarmListItem 
              key={alarm.id} 
              alarm={alarm}
              onEdit={setEditingAlarm}
              onDelete={setAlarmToDelete}
            />
          ))}
        </div>
      )}
      
      <AlertDialog open={alarmToDelete !== null} onOpenChange={(open) => !open && setAlarmToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Alarm</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this alarm? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlarm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlarmList;
