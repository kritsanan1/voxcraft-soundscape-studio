import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, Pause, Volume2, Plus, Trash2, TreePine, Waves, 
  Car, Music, Bird, Zap, Settings, Sparkles 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AmbientSound {
  id: string;
  type: string;
  volume: number;
  position: [number, number, number];
  loop: boolean;
  fadeIn: number;
  fadeOut: number;
  enabled: boolean;
}

interface EnvironmentEffect {
  id: string;
  name: string;
  type: string;
  intensity: number;
  enabled: boolean;
}

const AudioSceneBuilder = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneType, setSceneType] = useState("nature");
  const [ambientSounds, setAmbientSounds] = useState<AmbientSound[]>([
    {
      id: "1",
      type: "forest",
      volume: 0.6,
      position: [0, 0, -2],
      loop: true,
      fadeIn: 2,
      fadeOut: 2,
      enabled: true
    }
  ]);
  const [environmentEffects, setEnvironmentEffects] = useState<EnvironmentEffect[]>([
    {
      id: "1",
      name: "Natural Reverb",
      type: "reverb",
      intensity: 0.4,
      enabled: true
    }
  ]);
  const [masterVolume, setMasterVolume] = useState([0.7]);
  const [sceneDescription, setSceneDescription] = useState("A peaceful forest clearing with gentle wind and distant birds");
  
  const { toast } = useToast();

  const sceneTypes = [
    { value: "nature", label: "Nature", icon: TreePine },
    { value: "urban", label: "Urban", icon: Car },
    { value: "ocean", label: "Ocean", icon: Waves },
    { value: "space", label: "Space", icon: Sparkles },
    { value: "cafe", label: "Café", icon: Music },
    { value: "rain", label: "Rain", icon: Zap }
  ];

  const ambientSoundTypes = {
    nature: ["forest", "birds", "wind", "stream", "crickets", "owl"],
    urban: ["traffic", "subway", "crowd", "construction", "sirens", "footsteps"],
    ocean: ["waves", "seagulls", "whale", "underwater", "storm", "calm"],
    space: ["ambient", "solar_wind", "cosmic", "station", "engine", "silence"],
    cafe: ["chatter", "coffee_machine", "jazz", "pages", "cutlery", "ambience"],
    rain: ["light_rain", "heavy_rain", "thunder", "drizzle", "storm", "drops"]
  };

  const effectTypes = [
    { value: "reverb", label: "Reverb", description: "Spatial echo effect" },
    { value: "delay", label: "Delay", description: "Time-based echo" },
    { value: "filter", label: "Filter", description: "Frequency filtering" },
    { value: "modulation", label: "Modulation", description: "Dynamic movement" },
    { value: "distortion", label: "Distortion", description: "Texture and warmth" },
    { value: "compression", label: "Compression", description: "Dynamic control" }
  ];

  const addAmbientSound = () => {
    const currentSounds = ambientSoundTypes[sceneType as keyof typeof ambientSoundTypes] || [];
    if (currentSounds.length === 0) return;

    const newSound: AmbientSound = {
      id: Date.now().toString(),
      type: currentSounds[ambientSounds.length % currentSounds.length],
      volume: 0.5,
      position: [
        (Math.random() - 0.5) * 4,
        0,
        (Math.random() - 0.5) * 4
      ],
      loop: true,
      fadeIn: 1,
      fadeOut: 1,
      enabled: true
    };

    setAmbientSounds([...ambientSounds, newSound]);
  };

  const removeAmbientSound = (id: string) => {
    setAmbientSounds(ambientSounds.filter(sound => sound.id !== id));
  };

  const updateAmbientSound = (id: string, updates: Partial<AmbientSound>) => {
    setAmbientSounds(ambientSounds.map(sound => 
      sound.id === id ? { ...sound, ...updates } : sound
    ));
  };

  const addEnvironmentEffect = () => {
    const newEffect: EnvironmentEffect = {
      id: Date.now().toString(),
      name: "New Effect",
      type: "reverb",
      intensity: 0.5,
      enabled: true
    };

    setEnvironmentEffects([...environmentEffects, newEffect]);
  };

  const removeEnvironmentEffect = (id: string) => {
    setEnvironmentEffects(environmentEffects.filter(effect => effect.id !== id));
  };

  const updateEnvironmentEffect = (id: string, updates: Partial<EnvironmentEffect>) => {
    setEnvironmentEffects(environmentEffects.map(effect => 
      effect.id === id ? { ...effect, ...updates } : effect
    ));
  };

  const generateAIScene = async () => {
    if (!sceneDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a scene description for AI generation.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generating AI Scene",
      description: "Creating ambient sounds and effects based on your description...",
    });
    
    // Simulate AI scene generation
    setTimeout(() => {
      // Generate new ambient sounds based on description
      const newSounds: AmbientSound[] = [
        {
          id: Date.now().toString(),
          type: "generated_ambient",
          volume: 0.6,
          position: [0, 0, 0],
          loop: true,
          fadeIn: 3,
          fadeOut: 3,
          enabled: true
        },
        {
          id: (Date.now() + 1).toString(),
          type: "generated_texture",
          volume: 0.4,
          position: [2, 0, -1],
          loop: true,
          fadeIn: 2,
          fadeOut: 2,
          enabled: true
        }
      ];

      setAmbientSounds(prev => [...prev, ...newSounds]);
      
      toast({
        title: "AI Scene Generated",
        description: "New ambient sounds have been added to your scene!",
      });
    }, 3000);
  };

  const playScene = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Scene Stopped" : "Scene Playing",
      description: isPlaying ? "Audio scene playback stopped." : "Playing your audio scene...",
    });
  };

  const currentSoundTypes = ambientSoundTypes[sceneType as keyof typeof ambientSoundTypes] || [];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Audio Scene Builder
          </Badge>
          <h2 className="text-4xl font-bold mb-4">AI-Generated Ambient Soundscapes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create immersive audio environments with intelligent ambient sound generation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Scene Configuration */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Scene Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Scene Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Scene Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {sceneTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Button
                          key={type.value}
                          onClick={() => setSceneType(type.value)}
                          variant={sceneType === type.value ? "default" : "outline"}
                          className="h-auto p-3 flex flex-col gap-1"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-xs">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Scene Description */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Scene Description</label>
                  <Textarea
                    placeholder="Describe the audio scene you want to create..."
                    value={sceneDescription}
                    onChange={(e) => setSceneDescription(e.target.value)}
                    className="min-h-[80px] bg-muted/30 border-border/50 resize-none"
                  />
                  <Button 
                    onClick={generateAIScene}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Scene
                  </Button>
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

                <Button 
                  onClick={playScene}
                  className="w-full"
                  variant={isPlaying ? "destructive" : "default"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isPlaying ? "Stop Scene" : "Play Scene"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Ambient Sounds */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Ambient Sounds
                  </CardTitle>
                  <Button
                    onClick={addAmbientSound}
                    size="sm"
                    variant="outline"
                    className="border-glass-border bg-glass-bg backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Sound
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {ambientSounds.map((sound, index) => (
                  <div key={sound.id} className="p-4 bg-muted/10 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{sound.type.replace('_', ' ')}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateAmbientSound(sound.id, { enabled: !sound.enabled })}
                          size="sm"
                          variant={sound.enabled ? "default" : "outline"}
                          className="h-6 w-12 text-xs p-0"
                        >
                          {sound.enabled ? "On" : "Off"}
                        </Button>
                        <Button
                          onClick={() => removeAmbientSound(sound.id)}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Sound Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Type</label>
                      <Select 
                        value={sound.type} 
                        onValueChange={(value) => updateAmbientSound(sound.id, { type: value })}
                      >
                        <SelectTrigger className="bg-muted/30 border-border/50 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currentSoundTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Volume */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium">Volume</label>
                        <span className="text-xs text-muted-foreground">{Math.round(sound.volume * 100)}%</span>
                      </div>
                      <Slider
                        value={[sound.volume]}
                        onValueChange={([value]) => updateAmbientSound(sound.id, { volume: value })}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>

                    {/* Position Controls */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">X</label>
                        <Input
                          type="number"
                          value={sound.position[0].toFixed(1)}
                          onChange={(e) => {
                            const newPos = [...sound.position] as [number, number, number];
                            newPos[0] = parseFloat(e.target.value) || 0;
                            updateAmbientSound(sound.id, { position: newPos });
                          }}
                          className="h-8 text-xs bg-muted/30 border-border/50"
                          min={-5}
                          max={5}
                          step={0.1}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Y</label>
                        <Input
                          type="number"
                          value={sound.position[1].toFixed(1)}
                          onChange={(e) => {
                            const newPos = [...sound.position] as [number, number, number];
                            newPos[1] = parseFloat(e.target.value) || 0;
                            updateAmbientSound(sound.id, { position: newPos });
                          }}
                          className="h-8 text-xs bg-muted/30 border-border/50"
                          min={-5}
                          max={5}
                          step={0.1}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Z</label>
                        <Input
                          type="number"
                          value={sound.position[2].toFixed(1)}
                          onChange={(e) => {
                            const newPos = [...sound.position] as [number, number, number];
                            newPos[2] = parseFloat(e.target.value) || 0;
                            updateAmbientSound(sound.id, { position: newPos });
                          }}
                          className="h-8 text-xs bg-muted/30 border-border/50"
                          min={-5}
                          max={5}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {ambientSounds.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No ambient sounds added yet</p>
                    <p className="text-xs">Click "Add Sound" to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Environment Effects */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Environment Effects
                  </CardTitle>
                  <Button
                    onClick={addEnvironmentEffect}
                    size="sm"
                    variant="outline"
                    className="border-glass-border bg-glass-bg backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Effect
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {environmentEffects.map((effect) => (
                  <div key={effect.id} className="p-4 bg-muted/10 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={effect.name}
                        onChange={(e) => updateEnvironmentEffect(effect.id, { name: e.target.value })}
                        className="font-medium bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateEnvironmentEffect(effect.id, { enabled: !effect.enabled })}
                          size="sm"
                          variant={effect.enabled ? "default" : "outline"}
                          className="h-6 w-12 text-xs p-0"
                        >
                          {effect.enabled ? "On" : "Off"}
                        </Button>
                        <Button
                          onClick={() => removeEnvironmentEffect(effect.id)}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Effect Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Effect Type</label>
                      <Select 
                        value={effect.type} 
                        onValueChange={(value) => updateEnvironmentEffect(effect.id, { type: value })}
                      >
                        <SelectTrigger className="bg-muted/30 border-border/50 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {effectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Intensity */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium">Intensity</label>
                        <span className="text-xs text-muted-foreground">{Math.round(effect.intensity * 100)}%</span>
                      </div>
                      <Slider
                        value={[effect.intensity]}
                        onValueChange={([value]) => updateEnvironmentEffect(effect.id, { intensity: value })}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}

                {environmentEffects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No effects added yet</p>
                    <p className="text-xs">Click "Add Effect" to enhance your scene</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudioSceneBuilder;