
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Moon, BarChart3, Plus } from "lucide-react";
import { AlarmProvider, useAlarms } from "../context/AlarmContext";
import AlarmList from "../components/AlarmList";
import AlarmForm from "../components/AlarmForm";
import SleepSounds from "../components/SleepSounds";
import Analytics from "../components/Analytics";
import PhotoMission from "../components/missions/PhotoMission";
import MathMission from "../components/missions/MathMission";
import PuzzleMission from "../components/missions/PuzzleMission";
import { useToast } from "@/hooks/use-toast";

type ActiveTab = "alarms" | "sleep" | "analytics";

const AlarmApp = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("alarms");
  const [showAlarmForm, setShowAlarmForm] = useState(false);
  const [showMissionDemo, setShowMissionDemo] = useState<"photo" | "math" | "puzzle" | null>(null);
  const { toast } = useToast();
  const { alarms, activeAlarmId, dismissCurrentAlarm, addStat } = useAlarms();

  const activeAlarm = alarms.find(alarm => alarm.id === activeAlarmId);

  useEffect(() => {
    if (activeAlarm) {
      setShowMissionDemo(activeAlarm.missionType);
      
      const audio = new Audio("/sounds/alarm-sound.mp3");
      audio.play().catch(e => console.error("Could not play alarm sound:", e));
      
      toast({
        title: "Alarm Going Off!",
        description: activeAlarm.label || "Complete the mission to dismiss the alarm",
        variant: "destructive",
      });
    }
  }, [activeAlarmId, activeAlarm, toast]);

  const handleComplete = () => {
    if (activeAlarmId) {
      addStat({
        date: new Date().toISOString(),
        alarmId: activeAlarmId,
        dismissed: true,
        snoozeCount: 0,
        completionTimeMs: 0,
      });
      
      dismissCurrentAlarm();
    }
    
    toast({
      title: "Mission Complete!",
      description: "Alarm has been turned off.",
    });
    setShowMissionDemo(null);
  };

  const handleCancel = () => {
    if (!activeAlarmId) {
      setShowMissionDemo(null);
    }
    
    toast({
      title: "Mission Cancelled",
      description: activeAlarmId ? "You must complete the mission to dismiss the alarm." : "Alarm will ring again soon.",
      variant: "destructive",
    });
  };

  const renderContent = () => {
    if (showAlarmForm) {
      return <AlarmForm onCancel={() => setShowAlarmForm(false)} />;
    }

    switch (showMissionDemo) {
      case "photo":
        return <PhotoMission onComplete={handleComplete} onCancel={handleCancel} />;
      case "math":
        return <MathMission onComplete={handleComplete} onCancel={handleCancel} />;
      case "puzzle":
        return <PuzzleMission onComplete={handleComplete} onCancel={handleCancel} />;
      default:
        switch (activeTab) {
          case "alarms":
            return (
              <div className="flex-1 overflow-auto">
                <AlarmList />
              </div>
            );
          case "sleep":
            return (
              <div className="flex-1 overflow-auto">
                <SleepSounds />
              </div>
            );
          case "analytics":
            return (
              <div className="flex-1 overflow-auto">
                <Analytics />
              </div>
            );
        }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-sleep-background">
      <header className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-alarm-primary">
            Wake Up Quests
          </h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowMissionDemo("photo")}
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </main>

      {!showAlarmForm && !showMissionDemo && (
        <>
          <div className="fixed bottom-20 right-6">
            <Button
              variant="default"
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg"
              onClick={() => setShowAlarmForm(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
          
          <footer className="border-t border-border bg-background dark:bg-sleep-background">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as ActiveTab)}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="alarms" className="py-6">
                  <div className="flex flex-col items-center gap-1">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Alarms</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="sleep" className="py-6">
                  <div className="flex flex-col items-center gap-1">
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Sleep</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="py-6">
                  <div className="flex flex-col items-center gap-1">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs">Insights</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </footer>
        </>
      )}
    </div>
  );
};

const Index = () => (
  <AlarmProvider>
    <AlarmApp />
  </AlarmProvider>
);

export default Index;
