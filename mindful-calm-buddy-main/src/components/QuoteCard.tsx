import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteCardProps {
  quote: string;
  author: string;
}

const QuoteCard = ({ quote, author }: QuoteCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="backdrop-blur-sm bg-card/80 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-8 md:p-12 relative">
          <QuoteIcon className="absolute top-6 left-6 w-8 h-8 text-primary/20" aria-hidden="true" />
          <blockquote>
            <p className="text-xl md:text-2xl font-light text-foreground leading-relaxed mb-4 pl-8">
              "{quote}"
            </p>
            <footer>
              <cite className="text-base md:text-lg text-muted-foreground font-medium not-italic">
                — {author}
              </cite>
            </footer>
          </blockquote>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuoteCard;
