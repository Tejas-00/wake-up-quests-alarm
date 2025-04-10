import React, { useState } from "react";
import { useAlarms, AlarmDay, MissionType } from "../context/AlarmContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Camera, 
  Calculator, 
  Puzzle, 
  X, 
  ArrowLeft, 
  Volume2, 
  Vibrate
} from "lucide-react";
import { toast } from "sonner";

interface AlarmFormProps {
  onCancel: () => void;
}

const AlarmForm: React.FC<AlarmFormProps> = ({ onCancel }) => {
  const { createAlarm } = useAlarms();
  
  const [time, setTime] = useState("07:30");
  const [days, setDays] = useState<AlarmDay>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [label, setLabel] = useState("");
  const [missionType, setMissionType] = useState<MissionType>("photo");
  const [vibrate, setVibrate] = useState(true);
  const [soundId, setSoundId] = useState("default");

  const handleToggleDay = (day: keyof AlarmDay) => {
    setDays({ ...days, [day]: !days[day] });
  };

  const handleSetWeekdays = () => {
    setDays({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    });
  };

  const handleSetWeekends = () => {
    setDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: true,
      sunday: true,
    });
  };

  const handleSetEveryday = () => {
    setDays({
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate time
    if (!time) {
      toast.error("Please select a time");
      return;
    }

    // Check if at least one day is selected
    if (!Object.values(days).some(Boolean)) {
      toast.error("Please select at least one day");
      return;
    }

    createAlarm({
      time,
      days,
      label,
      missionType,
      vibrate,
      soundId,
      enabled: true,
    });
    
    toast.success("Alarm created successfully");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto pb-20">
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium">New Alarm</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="flex justify-center p-6">
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-4xl text-center w-40 h-16"
          />
        </div>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Repeat</h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Button 
              type="button" 
              variant={Object.values(days).every(Boolean) ? "default" : "outline"} 
              size="sm" 
              onClick={handleSetEveryday}
            >
              Every Day
            </Button>
            <Button 
              type="button" 
              variant={days.monday && days.tuesday && days.wednesday && days.thursday && days.friday && !days.saturday && !days.sunday ? "default" : "outline"} 
              size="sm" 
              onClick={handleSetWeekdays}
            >
              Weekdays
            </Button>
            <Button 
              type="button" 
              variant={!days.monday && !days.tuesday && !days.wednesday && !days.thursday && !days.friday && days.saturday && days.sunday ? "default" : "outline"} 
              size="sm" 
              onClick={handleSetWeekends}
            >
              Weekends
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as Array<keyof AlarmDay>).map((day) => (
              <button
                key={day}
                type="button"
                className={`text-center p-2 rounded-full w-8 h-8 flex items-center justify-center ${
                  days[day] ? "bg-primary text-primary-foreground" : "bg-secondary/10"
                }`}
                onClick={() => handleToggleDay(day)}
              >
                {day.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Wake-up Mission</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={missionType === "photo" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 items-center gap-2"
              onClick={() => setMissionType("photo")}
            >
              <Camera className="h-6 w-6" />
              <span>Photo</span>
            </Button>
            <Button
              type="button"
              variant={missionType === "math" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 items-center gap-2"
              onClick={() => setMissionType("math")}
            >
              <Calculator className="h-6 w-6" />
              <span>Math</span>
            </Button>
            <Button
              type="button"
              variant={missionType === "puzzle" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 items-center gap-2"
              onClick={() => setMissionType("puzzle")}
            >
              <Puzzle className="h-6 w-6" />
              <span>Puzzle</span>
            </Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                <span>Sound</span>
              </div>
              <span className="text-muted-foreground text-sm">Default</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="h-5 w-5" />
                <span>Vibrate</span>
              </div>
              <Switch checked={vibrate} onCheckedChange={setVibrate} />
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Label htmlFor="label">Label (optional)</Label>
          <Input
            id="label"
            placeholder="e.g., Work, School, etc."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Save Alarm
        </Button>
      </form>
    </div>
  );
};

export default AlarmForm;
