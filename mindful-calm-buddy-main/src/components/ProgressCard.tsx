import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressCardProps {
  activity: string;
  date: string;
  duration?: string;
  type: "breathing" | "chat" | "quotes";
}

const ProgressCard = ({ activity, date, duration, type }: ProgressCardProps) => {
  const typeColors = {
    breathing: "text-primary",
    chat: "text-secondary",
    quotes: "text-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="backdrop-blur-sm bg-card/80 border-border hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 flex items-center gap-4">
          <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${typeColors[type]}`} aria-hidden="true" />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">{activity}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <time dateTime={date}>{date}</time>
              {duration && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {duration}
                  </span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressCard;
