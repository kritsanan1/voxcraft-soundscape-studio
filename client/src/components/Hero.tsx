import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, AudioWaveform, Volume2, Settings } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-glow/10 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="bg-glass-bg border-glass-border backdrop-blur-sm">
              <AudioWaveform className="w-4 h-4 mr-2" />
              Advanced Voice Processing Platform
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">Vox</span>
                <span className="text-primary bg-gradient-primary bg-clip-text text-transparent">Craft</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Transform your voice with cutting-edge AI. Add emotion, adjust aging, 
                create spatial audio, and harmonize voices with professional-grade precision.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Mic className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
              <Button variant="outline" size="lg" className="border-glass-border bg-glass-bg backdrop-blur-sm">
                <Settings className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Voice Emotions</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3D</div>
                <div className="text-sm text-muted-foreground">Spatial Audio</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">AI</div>
                <div className="text-sm text-muted-foreground">Harmonization</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Interactive Demo */}
          <div className="space-y-6">
            <Card className="p-8 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Voice Studio</h3>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Live Demo
                  </Badge>
                </div>
                
                {/* Waveform Visualization */}
                <div className="h-32 bg-muted/30 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex items-end justify-center h-full gap-1">
                    {[...Array(40)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-primary rounded-full animate-visualizer"
                        style={{
                          width: '4px',
                          height: `${Math.random() * 80 + 20}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
                
                {/* Controls Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emotion</label>
                    <div className="bg-muted/50 rounded px-3 py-2 text-sm text-primary">Happy</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <div className="bg-muted/50 rounded px-3 py-2 text-sm text-primary">Adult</div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Generate Voice
                </Button>
              </div>
            </Card>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-glass-bg backdrop-blur-sm border-glass-border">
                <div className="text-center space-y-2">
                  <div className="text-primary text-2xl">🎭</div>
                  <div className="font-medium">Emotion Control</div>
                  <div className="text-xs text-muted-foreground">10+ emotions</div>
                </div>
              </Card>
              <Card className="p-4 bg-glass-bg backdrop-blur-sm border-glass-border">
                <div className="text-center space-y-2">
                  <div className="text-primary text-2xl">🌍</div>
                  <div className="font-medium">3D Spatial</div>
                  <div className="text-xs text-muted-foreground">Immersive audio</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;