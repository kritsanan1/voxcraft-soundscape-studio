import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Mic, 
  Settings, 
  Volume2, 
  Music, 
  Layers3,
  User
} from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Voice Studio", icon: Mic, href: "#studio" },
    { name: "3D Audio", icon: Layers3, href: "#spatial" },
    { name: "Harmonizer", icon: Music, href: "#harmony" },
    { name: "Features", icon: Settings, href: "#features" }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-glass-bg backdrop-blur-md border-b border-glass-border">
      <div className="container mx-auto px-6">
        
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">VoxCraft</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                Beta
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="border-glass-border bg-glass-bg backdrop-blur-sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Mic className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden border-glass-border bg-glass-bg backdrop-blur-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-glass-bg backdrop-blur-md border-b border-glass-border">
            <div className="container mx-auto px-6 py-4">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
                
                <div className="border-t border-glass-border pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-glass-border bg-glass-bg backdrop-blur-sm"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    <Mic className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;