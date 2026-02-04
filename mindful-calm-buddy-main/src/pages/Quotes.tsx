import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import QuoteCard from "@/components/QuoteCard";

const quotes = [
  { quote: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { quote: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
];

const Quotes = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getRandomQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === currentQuote && quotes.length > 1);
    setCurrentQuote(newQuote);
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen pb-20 md:pb-8 md:pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Daily Motivation
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Let these words inspire you on your journey
            </p>
          </div>

          <QuoteCard quote={currentQuote.quote} author={currentQuote.author} />

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={getRandomQuote}
              className="gap-2"
              aria-label="Get a new random quote"
            >
              <Shuffle className="w-5 h-5" aria-hidden="true" />
              New Quote
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-muted/50 rounded-xl p-6 space-y-3"
          >
            <h2 className="font-semibold text-lg">Why Motivation Matters</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reading motivational quotes can shift your mindset, boost your confidence, and remind you of your inner strength. 
              During stressful times like exams, these small moments of inspiration can make a big difference in maintaining 
              a positive outlook and staying resilient.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
};

export default Quotes;
