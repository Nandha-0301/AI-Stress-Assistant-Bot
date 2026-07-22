import { NavLink } from "react-router-dom";
import { Home, Wind, MessageCircle, Quote, TrendingUp, Settings } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/breathing", icon: Wind, label: "Breathe" },
    { to: "/quotes", icon: Quote, label: "Quotes" },
    { to: "/chat", icon: MessageCircle, label: "Chat" },
    { to: "/progress", icon: TrendingUp, label: "Progress" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-card/95 backdrop-blur-sm border-t md:border-b border-border z-50" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-around md:justify-center md:space-x-8 h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
                aria-label={label}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs md:text-sm">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
