interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
const sizeClasses = {
  sm: "w-20 h-20 md:w-24 md:h-24",
  md: "w-32 h-32 md:w-40 md:h-40",
  lg: "w-40 h-40 md:w-52 md:h-52"
};
const AnimatedLogo = ({
  size = "md",
  className = ""
}: AnimatedLogoProps) => {
  return <div className={`rounded-full overflow-hidden shadow-xl border-2 border-accent/30 ${sizeClasses[size]} ${className}`}>
      <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-110 px-0 py-0 my-0 mx-0 border border-[#c88a04]">
        <source src="/videos/deutlicht-logo-animation.mp4" type="video/mp4" />
      </video>
    </div>;
};
export default AnimatedLogo;