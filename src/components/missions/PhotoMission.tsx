
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PhotoMissionProps {
  onComplete: () => void;
  onCancel: () => void;
}

const PhotoMission: React.FC<PhotoMissionProps> = ({ onComplete, onCancel }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [targetItem, setTargetItem] = useState<string>("bathroom sink");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const targetItems = [
    "bathroom sink",
    "refrigerator",
    "window",
    "front door",
    "kitchen counter",
    "toothbrush",
    "coffee maker",
    "shower"
  ];

  useEffect(() => {
    // Randomly select a target item
    const randomIndex = Math.floor(Math.random() * targetItems.length);
    setTargetItem(targetItems[randomIndex]);
    
    return () => {
      // Clean up the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCapturing(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setPhoto(dataUrl);
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsCapturing(false);
      
      // In a real app, we would do image recognition here
      // For now, we'll just simulate success after a delay
      setTimeout(() => {
        toast.success("Photo verified!");
        onComplete();
      }, 1500);
    }
  };

  const retryPhoto = () => {
    setPhoto(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="bg-mission-photo text-white p-4">
        <h2 className="text-lg font-medium text-center">Photo Mission</h2>
        <p className="text-center text-sm">
          Take a photo of your {targetItem} to turn off the alarm
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!isCapturing && !photo ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-mission-photo/20 p-6 rounded-full">
              <Camera className="h-16 w-16 text-mission-photo" />
            </div>
            <h3 className="text-xl font-medium">Take a photo of your {targetItem}</h3>
            <p className="text-muted-foreground mb-4 max-w-xs">
              This will help you wake up by getting you out of bed and moving around
            </p>
            <Button 
              onClick={startCamera} 
              className="bg-mission-photo hover:bg-mission-photo/90 text-white"
              size="lg"
            >
              Start Camera
            </Button>
          </div>
        ) : isCapturing && !photo ? (
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <Button 
              onClick={takePhoto} 
              className="bg-mission-photo hover:bg-mission-photo/90 text-white"
              size="lg"
            >
              Take Photo
            </Button>
          </div>
        ) : photo ? (
          <div className="flex flex-col items-center w-full max-w-md">
            <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden mb-4">
              <img 
                src={photo} 
                alt="Captured" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-pulse-ring">
                  <CheckCircle className="h-16 w-16 text-green-400" />
                </div>
              </div>
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Verifying photo...
            </p>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onCancel}
        >
          Emergency Cancel (Will Re-Ring Soon)
        </Button>
      </div>
    </div>
  );
};

export default PhotoMission;
