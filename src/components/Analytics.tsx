
import React from "react";
import { Card } from "@/components/ui/card";
import { useAlarms } from "../context/AlarmContext";
import { 
  Clock, 
  BarChart3, 
  Bell, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const Analytics: React.FC = () => {
  const { 
    getAverageWakeUpTime, 
    getAverageSnoozeCount, 
    getSuccessRate, 
    stats 
  } = useAlarms();
  
  const averageWakeUpTime = getAverageWakeUpTime();
  const averageSnoozeCount = getAverageSnoozeCount();
  const successRate = getSuccessRate();
  
  if (stats.length === 0) {
    return (
      <div className="p-4">
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No data yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your first alarm to see analytics
          </p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-2 rounded-full mb-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm text-muted-foreground">Avg. Wake-up</h3>
            <p className="text-2xl font-bold">{averageWakeUpTime || 'N/A'}</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 p-2 rounded-full mb-2">
              <Bell className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="text-sm text-muted-foreground">Avg. Snoozes</h3>
            <p className="text-2xl font-bold">{averageSnoozeCount}</p>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-muted-foreground">Alarm Success Rate</h3>
          <p className="text-lg font-bold">{successRate}%</p>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              successRate >= 70 ? 'bg-green-500' : successRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-xs">Success: {stats.filter(s => s.dismissed).length}</p>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs">Missed: {stats.filter(s => !s.dismissed).length}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm text-muted-foreground mb-3">Recent Trends</h3>
        
        <div className="flex items-center gap-3 border-b border-border pb-3 mb-3">
          <div className={successRate >= 50 ? "text-green-500" : "text-red-500"}>
            {successRate >= 50 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {successRate >= 50 ? "Good progress!" : "Room for improvement"}
            </p>
            <p className="text-xs text-muted-foreground">
              {successRate >= 50 
                ? "You're doing well at completing your wake-up missions" 
                : "You're having trouble completing your wake-up missions"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={averageSnoozeCount <= 1 ? "text-green-500" : "text-orange-500"}>
            {averageSnoozeCount <= 1 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {averageSnoozeCount <= 1 ? "Minimal snoozing" : "Frequent snoozing"}
            </p>
            <p className="text-xs text-muted-foreground">
              {averageSnoozeCount <= 1 
                ? "You rarely use the snooze button" 
                : "You tend to snooze your alarms often"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
