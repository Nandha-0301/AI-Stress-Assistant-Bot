import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import ProgressCard from "@/components/ProgressCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Activity {
  id: string;
  activity: string;
  date: string;
  duration?: string;
  type: "breathing" | "chat" | "quotes";
}

const Progress = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      // TODO: Replace with real backend URL
      // const response = await axios.get('/api/progress');
      // setActivities(response.data);

      // Simulated data for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockData: Activity[] = [
        {
          id: "1",
          activity: "Completed breathing exercise",
          date: new Date().toLocaleDateString(),
          duration: "5 min",
          type: "breathing",
        },
        {
          id: "2",
          activity: "Read motivational quote",
          date: new Date(Date.now() - 86400000).toLocaleDateString(),
          type: "quotes",
        },
        {
          id: "3",
          activity: "Chat session",
          date: new Date(Date.now() - 86400000).toLocaleDateString(),
          duration: "12 min",
          type: "chat",
        },
        {
          id: "4",
          activity: "Completed breathing exercise",
          date: new Date(Date.now() - 172800000).toLocaleDateString(),
          duration: "8 min",
          type: "breathing",
        },
        {
          id: "5",
          activity: "Read motivational quote",
          date: new Date(Date.now() - 172800000).toLocaleDateString(),
          type: "quotes",
        },
      ];

      setActivities(mockData);
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast({
        title: "Error",
        description: "Failed to load progress data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalActivities: activities.length,
    breathingSessions: activities.filter((a) => a.type === "breathing").length,
    chatSessions: activities.filter((a) => a.type === "chat").length,
    quotesRead: activities.filter((a) => a.type === "quotes").length,
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen pb-20 md:pb-8 md:pt-20 px-4">
        <div className="container mx-auto max-w-5xl py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-card/80 border-border mb-8">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl">Your Progress</CardTitle>
                <CardDescription className="text-base md:text-lg">
                  Track your wellness journey and celebrate your achievements
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="backdrop-blur-sm bg-card/80 border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                      {stats.totalActivities}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Activities</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur-sm bg-card/80 border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                      {stats.breathingSessions}
                    </p>
                    <p className="text-sm text-muted-foreground">Breathing</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="backdrop-blur-sm bg-card/80 border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-secondary mb-1">
                      {stats.chatSessions}
                    </p>
                    <p className="text-sm text-muted-foreground">Chat</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="backdrop-blur-sm bg-card/80 border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl md:text-4xl font-bold text-accent mb-1">
                      {stats.quotesRead}
                    </p>
                    <p className="text-sm text-muted-foreground">Quotes</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Activity History */}
            <Card className="backdrop-blur-sm bg-card/80 border-border">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" aria-label="Loading progress data" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No activities yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start your wellness journey by trying our breathing exercises or chatting with our AI companion!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3" role="list" aria-label="Activity history">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        role="listitem"
                      >
                        <ProgressCard
                          activity={activity.activity}
                          date={activity.date}
                          duration={activity.duration}
                          type={activity.type}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Progress;
