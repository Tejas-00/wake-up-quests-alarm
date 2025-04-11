
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

  // Setup audio context as early as possible for mobile
  useEffect(() => {
    // Initialize audio context on component mount - important for mobile
    const initializeAudio = () => {
      // Create and play a silent audio to enable audio context on mobile
      const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1TSS0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPz8/Pz8/TExMTExZWVlZWVlnZ2dnZ3V1dXV1dYODg4ODkZGRkZGRn5+fn5+frKysrKy6urq6urq/v7+/v7/MzMzMzMzY2NjY2Nra2tra2uTk5OTk8vLy8vLy//////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAXwAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Qy7y8vLy8vL9h555519l5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5f/7kmRAP/0MkLJBQngAi9GePCpGAAZTM8YagAAKFGY6UxMAAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAf/7kkQAP/AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAABAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBA");
      silentSound.volume = 0.01; // Almost silent
      silentSound.play().then(() => {
        silentSound.pause();
        silentSound.remove();
        console.log("Audio context initialized successfully");
      }).catch(e => {
        console.log("Failed to initialize audio context:", e);
      });
    };

    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove the event listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    // Also try to initialize immediately (might work on desktop)
    initializeAudio();

    // Check for active alarm on component mount
    if (activeAlarm) {
      handleAlarmActivation(activeAlarm);
    }

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (activeAlarm) {
      handleAlarmActivation(activeAlarm);
    }
  }, [activeAlarmId, activeAlarm]);

  const handleAlarmActivation = (alarm: typeof activeAlarm) => {
    if (!alarm) return;
    
    // Determine which mission to show based on the mission type
    let missionToShow = alarm.missionType;
    
    // If the mission type is "random", randomly select a mission
    if (missionToShow === "random") {
      const missions = ["photo", "math", "puzzle"];
      const randomIndex = Math.floor(Math.random() * missions.length);
      missionToShow = missions[randomIndex] as "photo" | "math" | "puzzle";
    }
    
    setShowMissionDemo(missionToShow as "photo" | "math" | "puzzle");
    
    toast({
      title: "Alarm Going Off!",
      description: alarm.label || "Complete the mission to dismiss the alarm",
      variant: "destructive",
    });
  };

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
    <div className="flex flex-col h-[100vh] bg-background dark:bg-sleep-background">
      <header className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-alarm-primary">
            Wake Up Quests
          </h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
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
          
          <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background dark:bg-sleep-background">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as ActiveTab)}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="alarms" className="py-4">
                  <div className="flex flex-col items-center gap-1">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Alarms</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="sleep" className="py-4">
                  <div className="flex flex-col items-center gap-1">
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Sleep</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="py-4">
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
