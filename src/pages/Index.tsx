
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Moon, BarChart3, Plus } from "lucide-react";
import { AlarmProvider } from "../context/AlarmContext";
import AlarmList from "../components/AlarmList";
import AlarmForm from "../components/AlarmForm";
import SleepSounds from "../components/SleepSounds";
import Analytics from "../components/Analytics";
import PhotoMission from "../components/missions/PhotoMission";
import MathMission from "../components/missions/MathMission";
import PuzzleMission from "../components/missions/PuzzleMission";
import { useToast } from "@/hooks/use-toast";

type ActiveTab = "alarms" | "sleep" | "analytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("alarms");
  const [showAlarmForm, setShowAlarmForm] = useState(false);
  const [showMissionDemo, setShowMissionDemo] = useState<"photo" | "math" | "puzzle" | null>(null);
  const { toast } = useToast();

  const handleComplete = () => {
    toast({
      title: "Mission Complete!",
      description: "Alarm has been turned off.",
    });
    setShowMissionDemo(null);
  };

  const handleCancel = () => {
    toast({
      title: "Mission Cancelled",
      description: "Alarm will ring again soon.",
      variant: "destructive",
    });
    setShowMissionDemo(null);
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
    <AlarmProvider>
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

        {/* Mission Demo Buttons for testing */}
        {!showAlarmForm && !showMissionDemo && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-card rounded-lg shadow-lg p-2 z-10">
            <p className="text-xs text-center mb-2">Demo Missions:</p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-mission-photo border-mission-photo" 
                onClick={() => setShowMissionDemo("photo")}
              >
                Photo
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-mission-math border-mission-math" 
                onClick={() => setShowMissionDemo("math")}
              >
                Math
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-mission-puzzle border-mission-puzzle" 
                onClick={() => setShowMissionDemo("puzzle")}
              >
                Puzzle
              </Button>
            </div>
          </div>
        )}
      </div>
    </AlarmProvider>
  );
};

export default Index;
