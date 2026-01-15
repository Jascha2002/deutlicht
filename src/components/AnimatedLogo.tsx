interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  loop?: boolean;
}

const sizeClasses = {
  sm: "w-32 h-32 md:w-36 md:h-36",
  md: "w-44 h-44 md:w-52 md:h-52",
  lg: "w-52 h-52 md:w-64 md:h-64",
  xl: "w-64 h-64 md:w-80 md:h-80"
};

const AnimatedLogo = ({
  size = "md",
  className = "",
  loop = true
}: AnimatedLogoProps) => {
  return (
    <div className={`rounded-full overflow-hidden shadow-xl border-2 border-accent/30 ${sizeClasses[size]} ${className}`}>
      <video 
        autoPlay 
        muted 
        loop={loop} 
        playsInline 
        className="w-full h-full object-contain scale-95"
      >
        <source src="/videos/deutlicht-logo-animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default AnimatedLogo;