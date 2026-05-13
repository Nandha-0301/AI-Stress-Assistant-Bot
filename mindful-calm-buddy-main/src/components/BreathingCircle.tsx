import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BreathingCircleProps {
  isActive: boolean;
  duration?: number;
}

const BreathingCircle = ({ isActive, duration = 4 }: BreathingCircleProps) => {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  useEffect(() => {
    if (!isActive) return;

    const cycle = async () => {
      setPhase("inhale");
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      setPhase("hold");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPhase("exhale");
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    };

    const interval = setInterval(cycle, (duration * 2 + 2) * 1000);
    cycle();

    return () => clearInterval(interval);
  }, [isActive, duration]);

  const phaseText = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8" role="region" aria-label="Breathing exercise">
      <motion.div
        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full"
        style={{
          background: "var(--gradient-breathing)",
          boxShadow: "var(--shadow-glow)",
        }}
        animate={
          isActive
            ? {
                scale: phase === "inhale" ? 1.3 : phase === "hold" ? 1.3 : 0.8,
                opacity: phase === "hold" ? 0.9 : 1,
              }
            : { scale: 1 }
        }
        transition={{
          duration: phase === "hold" ? 2 : duration,
          ease: "easeInOut",
        }}
        aria-live="polite"
        aria-label={isActive ? `Breathing phase: ${phaseText[phase]}` : "Breathing circle inactive"}
      />
      
      {isActive && (
        <motion.p
          className="text-2xl md:text-3xl font-medium text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {phaseText[phase]}
        </motion.p>
      )}
    </div>
  );
};

export default BreathingCircle;
