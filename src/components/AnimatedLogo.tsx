interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  loop?: boolean;
}

const sizeClasses = {
  sm: "w-24 h-24 md:w-28 md:h-28",
  md: "w-36 h-36 md:w-44 md:h-44",
  lg: "w-44 h-44 md:w-56 md:h-56",
  xl: "w-56 h-56 md:w-72 md:h-72"
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
        className="w-full h-full object-cover scale-100"
      >
        <source src="/videos/deutlicht-logo-animation.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default AnimatedLogo;