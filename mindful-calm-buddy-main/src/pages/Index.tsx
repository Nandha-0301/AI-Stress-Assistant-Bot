import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wind, Quote, MessageCircle, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-calm.jpg";

const Index = () => {
  const features = [
    {
      icon: Wind,
      title: "Guided Breathing",
      description: "Calm your mind with scientifically-backed breathing exercises designed to reduce stress instantly.",
      link: "/breathing",
      color: "text-primary",
    },
    {
      icon: Quote,
      title: "Motivational Quotes",
      description: "Find inspiration with curated quotes that uplift and motivate you through challenging times.",
      link: "/quotes",
      color: "text-secondary",
    },
    {
      icon: MessageCircle,
      title: "Supportive Chat",
      description: "Talk to our AI companion anytime you need encouragement, advice, or just someone to listen.",
      link: "/chat",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your wellness journey and celebrate your consistent self-care achievements.",
      link: "/progress",
      color: "text-primary",
    },
  ];

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen pb-20 md:pb-8 md:pt-20">
        {/* Hero Section */}
        <section 
          className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(169, 220, 255, 0.3) 0%, rgba(231, 198, 255, 0.3) 50%, rgba(178, 245, 234, 0.3) 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-40">
            <img 
              src={heroImage} 
              alt="" 
              className="w-full h-full object-cover"
              role="presentation"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Find Your Calm in the Storm
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take a deep breath. You've got this. CalmSpace helps students manage exam stress through mindful exercises and supportive tools.
            </p>
            <Link to="/breathing">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                Start Breathing Exercise
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Toolkit for Stress Relief
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage exam anxiety and maintain your wellbeing, all in one peaceful space.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={feature.link} className="block h-full">
                  <Card className="h-full backdrop-blur-sm bg-card/80 border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 ${feature.color}`}>
                        <feature.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className={`inline-flex items-center gap-2 font-medium ${feature.color} hover:gap-3 transition-all duration-200`}>
                        Try it now
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card 
              className="backdrop-blur-sm border-border overflow-hidden relative"
              style={{
                background: "var(--gradient-calm)",
              }}
            >
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Ready to Take Control of Your Stress?
                </h2>
                <p className="text-base md:text-lg text-muted-foreground mb-6">
                  Join thousands of students who've found their calm with CalmSpace. Start your journey to better mental health today.
                </p>
                <Link to="/chat">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Chat with Our AI Companion
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default Index;
