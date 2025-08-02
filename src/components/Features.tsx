import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AudioWaveform, 
  Layers3, 
  Music, 
  Mic, 
  Settings2, 
  Zap,
  Heart,
  Globe,
  Volume2,
  ArrowRight
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Heart,
      title: "Emotion Control",
      description: "Add authentic emotions to any voice with our advanced AI emotion engine",
      details: ["10+ emotion types", "Real-time adjustment", "Natural transitions"],
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Settings2,
      title: "Voice Aging",
      description: "Transform voice age from child to senior with precise control",
      details: ["Age progression", "Natural voice modeling", "Smooth transitions"],
      color: "text-blue-400", 
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Globe,
      title: "Accent Conversion",
      description: "Convert between accents while maintaining natural speech patterns",
      details: ["Multiple accents", "Regional dialects", "Authentic pronunciation"],
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Layers3,
      title: "3D Spatial Audio",
      description: "Position voices in 3D space with realistic environmental effects",
      details: ["3D positioning", "Environment presets", "Distance modeling"],
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Music,
      title: "Voice Harmonization",
      description: "Create beautiful harmonies with AI-generated vocal arrangements",
      details: ["Multiple harmony styles", "Real-time mixing", "Professional quality"],
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Zap,
      title: "Noise Adaptation",
      description: "Intelligent algorithms that adapt voice characteristics for any environment",
      details: ["Noise reduction", "Clarity enhancement", "Adaptive processing"],
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <AudioWaveform className="w-4 h-4 mr-2" />
            Core Features
          </Badge>
          <h2 className="text-4xl font-bold mb-6">
            Advanced Voice Processing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the power of AI-driven voice transformation with our comprehensive suite of audio processing tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card hover:shadow-glow transition-all duration-300 group"
            >
              <div className="space-y-6">
                {/* Icon & Title */}
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>

                {/* Feature Details */}
                <div className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full border-glass-border bg-glass-bg backdrop-blur-sm group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300"
                >
                  Try Feature
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Volume2 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Powered by Advanced Technology</h3>
              </div>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                VoxCraft combines cutting-edge AI models, real-time audio processing, 
                and 3D spatial algorithms to deliver professional-grade voice transformation.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">AI</div>
                  <div className="text-sm text-muted-foreground">Neural Models</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">3D</div>
                  <div className="text-sm text-muted-foreground">Spatial Audio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">RT</div>
                  <div className="text-sm text-muted-foreground">Real-time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">HQ</div>
                  <div className="text-sm text-muted-foreground">Studio Quality</div>
                </div>
              </div>
              
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Mic className="w-4 h-4 mr-2" />
                Start Creating Now
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;