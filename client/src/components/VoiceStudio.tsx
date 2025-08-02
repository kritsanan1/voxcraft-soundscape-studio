import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, Settings2, Mic, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VoiceStudio = () => {
  const [text, setText] = useState("Welcome to VoxCraft - the future of voice processing.");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [age, setAge] = useState("adult");
  const [accent, setAccent] = useState("american");
  const [voice, setVoice] = useState("Aria");
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [clarity, setClarity] = useState([0.8]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

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

  const voices = [
    { value: "Aria", label: "Aria (Female)" },
    { value: "Roger", label: "Roger (Male)" },
    { value: "Sarah", label: "Sarah (Female)" },
    { value: "Laura", label: "Laura (Female)" },
    { value: "Charlie", label: "Charlie (Male)" },
    { value: "George", label: "George (Male)" },
    { value: "Callum", label: "Callum (Male)" },
    { value: "River", label: "River (Neutral)" },
    { value: "Liam", label: "Liam (Male)" },
    { value: "Charlotte", label: "Charlotte (Female)" }
  ];

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate speech.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the voice generation feature.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-speech', {
        body: {
          text,
          voice_id: voice,
          emotion,
          age_factor: age === 'child' ? 0.7 : age === 'teen' ? 0.8 : age === 'adult' ? 1.0 : 1.2,
          speed: speed[0],
          pitch: pitch[0],
          clarity: clarity[0],
          voice_settings: {
            stability: 0.5,
            similarity_boost: clarity[0],
            style: emotion === 'dramatic' ? 0.3 : 0.0,
            use_speaker_boost: true
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Create blob URL for audio playback
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setCurrentAudioUrl(audioUrl);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onloadeddata = () => {
        audio.play();
        setIsPlaying(true);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = () => {
        toast({
          title: "Playback Error",
          description: "Failed to play the generated audio.",
          variant: "destructive",
        });
        setIsPlaying(false);
      };

      toast({
        title: "Success",
        description: "Speech generated successfully!",
      });

    } catch (error) {
      console.error('Speech generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (currentAudioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      generateSpeech();
    }
  };

  const handleDownload = () => {
    if (currentAudioUrl) {
      const link = document.createElement('a');
      link.href = currentAudioUrl;
      link.download = `voxcraft-speech-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded",
        description: "Audio file has been downloaded successfully!",
      });
    } else {
      toast({
        title: "No Audio",
        description: "Generate speech first before downloading.",
        variant: "destructive",
      });
    }
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
                    disabled={isGenerating}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? "Generating..." : isPlaying ? "Pause" : "Generate & Play"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-glass-border bg-glass-bg backdrop-blur-sm"
                    onClick={handleDownload}
                    disabled={!currentAudioUrl}
                  >
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

                {/* Voice Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Voice</label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voiceOption) => (
                        <SelectItem key={voiceOption.value} value={voiceOption.value}>
                          {voiceOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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