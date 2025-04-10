
import React from "react";
import { useAlarms, Alarm, MissionType } from "../context/AlarmContext";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Camera, Calculator, Puzzle } from "lucide-react";

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

const AlarmListItem: React.FC<{ alarm: Alarm }> = ({ alarm }) => {
  const { toggleAlarm } = useAlarms();
  
  return (
    <div className="alarm-item">
      <div className="flex justify-between items-center">
        <div>
          <p className="alarm-time">{alarm.time}</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{getDayLabels(alarm.days)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={`mission-badge ${getMissionColor(alarm.missionType)} flex items-center gap-1`}>
              {getMissionIcon(alarm.missionType)}
              <span>{getMissionLabel(alarm.missionType)}</span>
            </div>
          </div>
          {alarm.label && (
            <p className="text-sm mt-2 text-muted-foreground">{alarm.label}</p>
          )}
        </div>
        <div>
          <Switch 
            checked={alarm.enabled}
            onCheckedChange={() => toggleAlarm(alarm.id)}
          />
        </div>
      </div>
    </div>
  );
};

const AlarmList: React.FC = () => {
  const { alarms } = useAlarms();
  
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
  
  const enabledAlarms = alarms.filter(alarm => alarm.enabled);
  const disabledAlarms = alarms.filter(alarm => !alarm.enabled);
  
  return (
    <div className="space-y-2">
      {enabledAlarms.length > 0 && (
        <div className="space-y-3">
          {enabledAlarms.map(alarm => (
            <AlarmListItem key={alarm.id} alarm={alarm} />
          ))}
        </div>
      )}
      
      {disabledAlarms.length > 0 && (
        <div className="space-y-1 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground ml-1 mb-2">Disabled Alarms</h3>
          {disabledAlarms.map(alarm => (
            <AlarmListItem key={alarm.id} alarm={alarm} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlarmList;
