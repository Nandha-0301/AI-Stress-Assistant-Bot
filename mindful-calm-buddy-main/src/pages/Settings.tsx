import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Bell, BellOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Load notification preferences
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    toast({
      title: "Theme updated",
      description: `Switched to ${newDarkMode ? "dark" : "light"} mode`,
    });
  };

  const toggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", String(newValue));
    
    toast({
      title: "Notifications updated",
      description: `Notifications ${newValue ? "enabled" : "disabled"}`,
    });
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen pb-20 md:pb-8 md:pt-20 px-4">
        <div className="container mx-auto max-w-3xl py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-sm bg-card/80 border-border">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl">Settings</CardTitle>
                <CardDescription className="text-base md:text-lg">
                  Customize your CalmSpace experience
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Theme Settings */}
            <Card className="backdrop-blur-sm bg-card/80 border-border">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Appearance</CardTitle>
                <CardDescription>
                  Customize how CalmSpace looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode" className="text-base font-medium flex items-center gap-2">
                      {darkMode ? (
                        <Moon className="w-5 h-5 text-primary" aria-hidden="true" />
                      ) : (
                        <Sun className="w-5 h-5 text-primary" aria-hidden="true" />
                      )}
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                    aria-label="Toggle dark mode"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="backdrop-blur-sm bg-card/80 border-border">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Notifications</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications" className="text-base font-medium flex items-center gap-2">
                      {notifications ? (
                        <Bell className="w-5 h-5 text-primary" aria-hidden="true" />
                      ) : (
                        <BellOff className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                      )}
                      Enable Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive helpful reminders and updates
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={toggleNotifications}
                    aria-label="Toggle notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="daily-reminders" className="text-base font-medium">
                      Daily Wellness Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded to take breathing breaks
                    </p>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={dailyReminders}
                    onCheckedChange={setDailyReminders}
                    disabled={!notifications}
                    aria-label="Toggle daily wellness reminders"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sound-effects" className="text-base font-medium">
                      Sound Effects
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play calming sounds during exercises
                    </p>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                    aria-label="Toggle sound effects"
                  />
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="backdrop-blur-sm bg-card/80 border-border">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">About CalmSpace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  CalmSpace is designed to help students manage exam stress and maintain their mental wellbeing through 
                  evidence-based relaxation techniques and supportive tools.
                </p>
                <p>
                  Version 1.0.0 • Made with care for student wellness
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs">
                    If you're experiencing severe anxiety or mental health concerns, please reach out to a mental health 
                    professional or contact your local crisis helpline.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Settings;
