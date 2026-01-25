import { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/deutlicht-logo-transparent.png";

interface VideoWithFadeOutProps {
  src: string;
  className?: string;
  fadeOutDuration?: number; // in seconds, default 1
}

const VideoWithFadeOut = ({ 
  src, 
  className = "",
  fadeOutDuration = 1
}: VideoWithFadeOutProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showEndImage, setShowEndImage] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;
      
      if (timeRemaining <= fadeOutDuration && timeRemaining > 0) {
        // Calculate fade progress (0 to 1)
        const fadeProgress = 1 - (timeRemaining / fadeOutDuration);
        setFadeOpacity(fadeProgress);
        setShowEndImage(true);
      } else if (timeRemaining <= 0) {
        setFadeOpacity(1);
        setShowEndImage(true);
      } else {
        setFadeOpacity(0);
        setShowEndImage(false);
      }
    };

    const handleEnded = () => {
      setShowEndImage(true);
      setFadeOpacity(1);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [fadeOutDuration]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={className}
      >
        <source src={src} type="video/mp4" />
        Ihr Browser unterstützt keine Videos.
      </video>
      
      {/* Fade overlay with logo */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-[#2b3d50] transition-opacity duration-300"
        style={{ 
          opacity: fadeOpacity,
          pointerEvents: showEndImage ? "auto" : "none"
        }}
      >
        <div className="text-center p-8">
          <img 
            src={logoImg} 
            alt="DeutLicht® Logo" 
            className="max-w-[280px] md:max-w-[360px] mx-auto"
          />
          <p className="mt-6 text-[#c88a04] font-display text-lg md:text-xl">
            Digitale Lösungen mit Weitblick
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoWithFadeOut;
