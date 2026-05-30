import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import BreathingCircle from "@/components/BreathingCircle";

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(4);

  const handleReset = () => {
    setIsActive(false);
    setTimeout(() => setIsActive(true), 100);
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen pb-20 md:pb-8 md:pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <Card className="backdrop-blur-sm bg-card/80 border-border shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl md:text-4xl font-bold">Guided Breathing</CardTitle>
              <CardDescription className="text-base md:text-lg">
                Follow the circle to regulate your breathing and calm your mind. Breathing exercises activate your body's natural relaxation response.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="flex justify-center py-8">
                <BreathingCircle isActive={isActive} duration={duration} />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setIsActive(!isActive)}
                    className="gap-2"
                    aria-label={isActive ? "Pause breathing exercise" : "Start breathing exercise"}
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-5 h-5" aria-hidden="true" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" aria-hidden="true" />
                        Start
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2"
                    disabled={!isActive}
                    aria-label="Reset breathing exercise"
                  >
                    <RotateCcw className="w-5 h-5" aria-hidden="true" />
                    Reset
                  </Button>
                </div>

                <div className="bg-muted rounded-lg p-6" role="region" aria-label="Breathing duration control">
                  <label htmlFor="duration-slider" className="block text-sm font-medium mb-3">
                    Breathing Duration: {duration} seconds
                  </label>
                  <input
                    id="duration-slider"
                    type="range"
                    min="3"
                    max="8"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-valuemin={3}
                    aria-valuemax={8}
                    aria-valuenow={duration}
                    aria-label="Adjust breathing duration in seconds"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Faster (3s)</span>
                    <span>Slower (8s)</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-lg">Benefits of Deep Breathing</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Reduces stress hormones like cortisol</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Improves focus and mental clarity</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Lowers heart rate and blood pressure</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Enhances sleep quality</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default Breathing;
