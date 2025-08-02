import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, 
  Github, 
  Twitter, 
  Mail, 
  ArrowUpRight,
  Heart
} from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Voice Studio", href: "#studio" },
        { name: "3D Audio", href: "#spatial" },
        { name: "Harmonizer", href: "#harmony" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "API Reference", href: "#api" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Examples", href: "#examples" },
        { name: "Blog", href: "#blog" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
        { name: "Privacy", href: "#privacy" },
        { name: "Terms", href: "#terms" }
      ]
    }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">VoxCraft</span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                    Beta
                  </Badge>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                Advanced voice and audio processing platform powered by cutting-edge AI. 
                Transform, enhance, and spatialize audio with professional-grade tools.
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="border-glass-border bg-glass-bg backdrop-blur-sm">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-glass-border bg-glass-bg backdrop-blur-sm">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-glass-border bg-glass-bg backdrop-blur-sm">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
              {footerSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a 
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                        >
                          {link.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">
                Get the latest updates on new features, tutorials, and voice processing innovations.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2024 VoxCraft. Made with</span>
              <Heart className="w-4 h-4 text-primary fill-current" />
              <span>for audio creators worldwide.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-foreground transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;