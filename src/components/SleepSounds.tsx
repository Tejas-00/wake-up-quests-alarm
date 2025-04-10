
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Plus, 
  Music, 
  Volume2, 
  Moon, 
  CloudMoon, 
  CloudRain,
  Trees, 
  Waves
} from "lucide-react";
import { getSounds, SleepSound, saveCustomSound } from "../utils/alarmStorage";
import { toast } from "sonner";

const soundIcons: Record<string, React.ReactNode> = {
  rain: <CloudRain className="h-6 w-6" />,
  white_noise: <Volume2 className="h-6 w-6" />,
  ocean_waves: <Waves className="h-6 w-6" />,
  forest: <Trees className="h-6 w-6" />,
  thunderstorm: <CloudMoon className="h-6 w-6" />
};

const SleepSounds: React.FC = () => {
  const [sounds, setSounds] = useState<SleepSound[]>([]);
  const [currentSound, setCurrentSound] = useState<SleepSound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [timer, setTimer] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSounds(getSounds());
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (isPlaying && currentSound) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSound]);

  const handlePlaySound = (sound: SleepSound) => {
    if (currentSound?.id === sound.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSound(sound);
      setIsPlaying(true);
    }
  };

  const handleUploadSound = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("audio/")) {
      toast.error("Please upload an audio file");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        const newSound = {
          name: file.name.replace(/\.[^/.]+$/, ""),
          source: event.target.result,
        };
        saveCustomSound(newSound);
        setSounds(getSounds());
        toast.success("Sound added successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSetTimer = (minutes: number | null) => {
    setTimer(minutes);
    
    if (minutes) {
      toast.success(`Timer set for ${minutes} minutes`);
    } else {
      toast.info("Timer cancelled");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Sleep Sounds
        </h2>
        <Button variant="outline" size="icon" onClick={handleUploadSound}>
          <Plus className="h-5 w-5" />
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="audio/*" 
          onChange={handleFileChange} 
        />
      </div>

      {currentSound && (
        <Card className="p-4 bg-alarm-dark text-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {soundIcons[currentSound.id] || <Music className="h-5 w-5" />}
              <span className="font-medium">{currentSound.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-white hover:bg-white/20"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-white/80" />
            <Slider 
              value={[volume]} 
              min={0} 
              max={100} 
              step={1}
              onValueChange={(value) => setVolume(value[0])} 
              className="flex-1" 
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              variant={timer === 15 ? "secondary" : "outline"} 
              size="sm"
              className="flex-1 border-white/20 text-white hover:text-white hover:bg-white/20"
              onClick={() => handleSetTimer(timer === 15 ? null : 15)}
            >
              15 min
            </Button>
            <Button 
              variant={timer === 30 ? "secondary" : "outline"} 
              size="sm"
              className="flex-1 border-white/20 text-white hover:text-white hover:bg-white/20"
              onClick={() => handleSetTimer(timer === 30 ? null : 30)}
            >
              30 min
            </Button>
            <Button 
              variant={timer === 60 ? "secondary" : "outline"} 
              size="sm"
              className="flex-1 border-white/20 text-white hover:text-white hover:bg-white/20"
              onClick={() => handleSetTimer(timer === 60 ? null : 60)}
            >
              1 hour
            </Button>
          </div>
          
          <audio 
            ref={audioRef} 
            src={currentSound.source}
            loop 
          />
        </Card>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {sounds.map((sound) => (
          <Card 
            key={sound.id} 
            className={`sound-card flex items-center justify-between p-3 ${currentSound?.id === sound.id && isPlaying ? 'border-primary' : ''}`}
            onClick={() => handlePlaySound(sound)}
          >
            <div className="flex items-center gap-2">
              {soundIcons[sound.id] || <Music className="h-5 w-5" />}
              <span className="font-medium text-sm">{sound.name}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {currentSound?.id === sound.id && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SleepSounds;
