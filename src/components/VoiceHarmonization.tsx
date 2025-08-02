import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Plus, Minus, Volume2, Settings, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HarmonyVoice {
  id: string;
  voice_id: string;
  pitch_offset: number;
  volume: number;
  delay: number;
  enabled: boolean;
}

const VoiceHarmonization = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [harmonyStyle, setHarmonyStyle] = useState("close");
  const [harmonyVoices, setHarmonyVoices] = useState<HarmonyVoice[]>([
    { id: "1", voice_id: "Aria", pitch_offset: 0.3, volume: 0.7, delay: 0, enabled: true },
    { id: "2", voice_id: "Roger", pitch_offset: -0.2, volume: 0.6, delay: 0.1, enabled: true },
  ]);
  const [masterVolume, setMasterVolume] = useState([0.8]);
  const [harmonySpread, setHarmonySpread] = useState([0.5]);
  const [reverbAmount, setReverbAmount] = useState([0.3]);
  
  const { toast } = useToast();

  const harmonyStyles = [
    { value: "close", label: "Close Harmony", description: "Tight, traditional harmonies" },
    { value: "wide", label: "Wide Harmony", description: "Spread out harmonic intervals" },
    { value: "jazz", label: "Jazz Harmony", description: "Complex jazz voicings" },
    { value: "gospel", label: "Gospel Harmony", description: "Rich gospel-style harmonies" },
    { value: "choral", label: "Choral Harmony", description: "Classical choral arrangements" },
    { value: "modern", label: "Modern Harmony", description: "Contemporary pop harmonies" }
  ];

  const availableVoices = [
    "Aria", "Roger", "Sarah", "Laura", "Charlie", "George", 
    "Callum", "River", "Liam", "Charlotte", "Alice", "Matilda"
  ];

  const addHarmonyVoice = () => {
    if (harmonyVoices.length >= 6) {
      toast({
        title: "Maximum Voices Reached",
        description: "You can have up to 6 harmony voices.",
        variant: "destructive",
      });
      return;
    }

    const newVoice: HarmonyVoice = {
      id: Date.now().toString(),
      voice_id: availableVoices[harmonyVoices.length % availableVoices.length],
      pitch_offset: (harmonyVoices.length % 2 === 0 ? 1 : -1) * (0.2 + harmonyVoices.length * 0.1),
      volume: 0.6,
      delay: harmonyVoices.length * 0.05,
      enabled: true
    };

    setHarmonyVoices([...harmonyVoices, newVoice]);
  };

  const removeHarmonyVoice = (id: string) => {
    setHarmonyVoices(harmonyVoices.filter(voice => voice.id !== id));
  };

  const updateHarmonyVoice = (id: string, updates: Partial<HarmonyVoice>) => {
    setHarmonyVoices(harmonyVoices.map(voice => 
      voice.id === id ? { ...voice, ...updates } : voice
    ));
  };

  const generateHarmony = async () => {
    toast({
      title: "Generating Harmony",
      description: "Creating AI-driven harmony arrangement...",
    });
    
    // Simulate harmony generation
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      toast({
        title: "Harmony Generated",
        description: "Your harmony arrangement is ready!",
      });
    }, 3000);
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <Music className="w-4 h-4 mr-2" />
            Voice Harmonization
          </Badge>
          <h2 className="text-4xl font-bold mb-4">AI-Driven Harmony Generation</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create rich, multi-layered vocal harmonies with intelligent voice arrangement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Harmony Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Harmony Settings
                </CardTitle>
                <CardDescription>
                  Configure your harmony style and overall sound
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Harmony Style */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Harmony Style</label>
                  <Select value={harmonyStyle} onValueChange={setHarmonyStyle}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {harmonyStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          <div>
                            <div className="font-medium">{style.label}</div>
                            <div className="text-xs text-muted-foreground">{style.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Master Volume */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Master Volume</label>
                    <span className="text-sm text-muted-foreground">{Math.round(masterVolume[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={masterVolume}
                    onValueChange={setMasterVolume}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                {/* Harmony Spread */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Harmony Spread</label>
                    <span className="text-sm text-muted-foreground">{Math.round(harmonySpread[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={harmonySpread}
                    onValueChange={setHarmonySpread}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                {/* Reverb Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Reverb</label>
                    <span className="text-sm text-muted-foreground">{Math.round(reverbAmount[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={reverbAmount}
                    onValueChange={setReverbAmount}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                <Button 
                  onClick={generateHarmony}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isPlaying ? "Playing Harmony" : "Generate Harmony"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Individual Voice Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Harmony Voices
                  </CardTitle>
                  <Button
                    onClick={addHarmonyVoice}
                    size="sm"
                    variant="outline"
                    className="border-glass-border bg-glass-bg backdrop-blur-sm"
                    disabled={harmonyVoices.length >= 6}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Voice
                  </Button>
                </div>
                <CardDescription>
                  Fine-tune individual harmony voices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {harmonyVoices.map((voice, index) => (
                  <div key={voice.id} className="p-4 bg-muted/10 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Voice {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateHarmonyVoice(voice.id, { enabled: !voice.enabled })}
                          size="sm"
                          variant={voice.enabled ? "default" : "outline"}
                          className="h-6 w-6 p-0"
                        >
                          {voice.enabled ? "On" : "Off"}
                        </Button>
                        {harmonyVoices.length > 1 && (
                          <Button
                            onClick={() => removeHarmonyVoice(voice.id)}
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Voice Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Voice</label>
                      <Select 
                        value={voice.voice_id} 
                        onValueChange={(value) => updateHarmonyVoice(voice.id, { voice_id: value })}
                      >
                        <SelectTrigger className="bg-muted/30 border-border/50 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVoices.map((voiceName) => (
                            <SelectItem key={voiceName} value={voiceName}>
                              {voiceName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pitch Offset */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium">Pitch Offset</label>
                        <span className="text-xs text-muted-foreground">
                          {voice.pitch_offset > 0 ? '+' : ''}{voice.pitch_offset.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        value={[voice.pitch_offset]}
                        onValueChange={([value]) => updateHarmonyVoice(voice.id, { pitch_offset: value })}
                        min={-1}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>

                    {/* Volume */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium">Volume</label>
                        <span className="text-xs text-muted-foreground">{Math.round(voice.volume * 100)}%</span>
                      </div>
                      <Slider
                        value={[voice.volume]}
                        onValueChange={([value]) => updateHarmonyVoice(voice.id, { volume: value })}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>

                    {/* Delay */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium">Delay</label>
                        <span className="text-xs text-muted-foreground">{voice.delay.toFixed(2)}s</span>
                      </div>
                      <Slider
                        value={[voice.delay]}
                        onValueChange={([value]) => updateHarmonyVoice(voice.id, { delay: value })}
                        min={0}
                        max={0.5}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceHarmonization;