import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, Settings2, Mic } from "lucide-react";

const VoiceStudio = () => {
  const [text, setText] = useState("Welcome to VoxCraft - the future of voice processing.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [age, setAge] = useState("adult");
  const [accent, setAccent] = useState("american");
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [clarity, setClarity] = useState([0.8]);

  const emotions = [
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "angry", label: "Angry", emoji: "😠" },
    { value: "excited", label: "Excited", emoji: "🤩" },
    { value: "calm", label: "Calm", emoji: "😌" },
    { value: "worried", label: "Worried", emoji: "😟" },
    { value: "confident", label: "Confident", emoji: "😎" }
  ];

  const ages = [
    { value: "child", label: "Child (8-12)" },
    { value: "teen", label: "Teen (13-19)" },
    { value: "adult", label: "Adult (20-50)" },
    { value: "senior", label: "Senior (50+)" }
  ];

  const accents = [
    { value: "american", label: "American English" },
    { value: "british", label: "British English" },
    { value: "australian", label: "Australian English" },
    { value: "canadian", label: "Canadian English" }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual TTS playback
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <Mic className="w-4 h-4 mr-2" />
            Voice Studio
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Create Your Perfect Voice</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fine-tune every aspect of your audio with our advanced voice processing tools
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Text Input & Basic Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Text Input</h3>
                  <Badge variant="outline" className="text-xs">
                    {text.length} characters
                  </Badge>
                </div>
                <Textarea
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] bg-muted/30 border-border/50 resize-none"
                />
                <div className="flex gap-3">
                  <Button 
                    onClick={handlePlayPause}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Generate & Play"}
                  </Button>
                  <Button variant="outline" className="border-glass-border bg-glass-bg backdrop-blur-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>

            {/* Waveform Visualization */}
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audio Visualization</h3>
                <div className="h-40 bg-muted/20 rounded-lg p-4 relative overflow-hidden">
                  <div className="flex items-end justify-center h-full gap-1">
                    {[...Array(60)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-primary animate-visualizer' : 'bg-muted'
                        }`}
                        style={{
                          width: '3px',
                          height: isPlaying ? `${Math.random() * 90 + 10}%` : '20%',
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Voice Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Voice Settings</h3>
                </div>

                {/* Emotion Control */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Emotion</label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emotions.map((emo) => (
                        <SelectItem key={emo.value} value={emo.value}>
                          <span className="flex items-center gap-2">
                            {emo.emoji} {emo.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age Control */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Voice Age</label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ages.map((ageOption) => (
                        <SelectItem key={ageOption.value} value={ageOption.value}>
                          {ageOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Accent Control */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Accent</label>
                  <Select value={accent} onValueChange={setAccent}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accents.map((accentOption) => (
                        <SelectItem key={accentOption.value} value={accentOption.value}>
                          {accentOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Control */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Speed</label>
                    <span className="text-sm text-muted-foreground">{speed[0]}x</span>
                  </div>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Pitch Control */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Pitch</label>
                    <span className="text-sm text-muted-foreground">{pitch[0]}x</span>
                  </div>
                  <Slider
                    value={pitch}
                    onValueChange={setPitch}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Clarity Control */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Clarity</label>
                    <span className="text-sm text-muted-foreground">{Math.round(clarity[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={clarity}
                    onValueChange={setClarity}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceStudio;