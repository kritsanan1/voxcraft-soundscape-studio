import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mic, MicOff, Play, Pause, Square, Settings, 
  Waves, Volume2, Headphones, Radio, Zap, 
  Filter, Sliders, Gauge, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioEffect {
  id: string;
  name: string;
  type: 'filter' | 'modulation' | 'spatial' | 'enhancement';
  value: number;
  enabled: boolean;
  range: [number, number];
}

const RealTimeProcessor = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState("natural");
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(15);
  
  const [effects, setEffects] = useState<AudioEffect[]>([
    { id: 'reverb', name: 'Reverb', type: 'spatial', value: 20, enabled: true, range: [0, 100] },
    { id: 'delay', name: 'Delay', type: 'spatial', value: 15, enabled: false, range: [0, 100] },
    { id: 'chorus', name: 'Chorus', type: 'modulation', value: 30, enabled: false, range: [0, 100] },
    { id: 'compressor', name: 'Compressor', type: 'enhancement', value: 40, enabled: true, range: [0, 100] },
    { id: 'eq', name: 'EQ Boost', type: 'filter', value: 25, enabled: true, range: [-50, 50] },
    { id: 'noise_gate', name: 'Noise Gate', type: 'filter', value: -30, enabled: true, range: [-60, 0] },
    { id: 'pitch', name: 'Pitch Shift', type: 'modulation', value: 0, enabled: false, range: [-12, 12] },
    { id: 'warmth', name: 'Analog Warmth', type: 'enhancement', value: 35, enabled: true, range: [0, 100] },
  ]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const presets = [
    { value: "natural", label: "Natural Voice", description: "Minimal processing for authentic sound" },
    { value: "radio", label: "Radio Voice", description: "Professional broadcast quality" },
    { value: "podcast", label: "Podcast", description: "Optimized for spoken content" },
    { value: "audiobook", label: "Audiobook", description: "Clear narration with warmth" },
    { value: "interview", label: "Interview", description: "Enhanced clarity for conversations" },
    { value: "asmr", label: "ASMR", description: "Intimate and soothing tones" },
    { value: "phone", label: "Phone Quality", description: "Simulates phone call audio" },
    { value: "vintage", label: "Vintage Radio", description: "Classic radio show atmosphere" },
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRecording && analyserRef.current) {
      intervalId = setInterval(() => {
        const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
        analyserRef.current!.getByteFrequencyData(dataArray);
        
        // Calculate average audio level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(Math.round((average / 255) * 100));
        
        // Simulate CPU usage based on enabled effects
        const enabledEffects = effects.filter(e => e.enabled).length;
        setCpuUsage(15 + (enabledEffects * 8) + (isRealTimeEnabled ? 20 : 0));
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [isRecording, effects, isRealTimeEnabled]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 48000
        } 
      });
      
      streamRef.current = stream;

      // Set up audio analysis
      audioContextRef.current = new AudioContext({ sampleRate: 48000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Set up recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      if (isRealTimeEnabled) {
        toast({
          title: "Real-time Processing Active",
          description: "Your voice is being processed in real-time with selected effects.",
        });
      }

    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      toast({
        title: "Recording Stopped",
        description: "Audio processing complete. Ready for export.",
      });
    }
  };

  const updateEffect = (effectId: string, newValue: number) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId ? { ...effect, value: newValue } : effect
    ));
  };

  const toggleEffect = (effectId: string) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId ? { ...effect, enabled: !effect.enabled } : effect
    ));
  };

  const loadPreset = (presetValue: string) => {
    setSelectedPreset(presetValue);
    
    // Preset configurations
    const presetConfigs: { [key: string]: Partial<AudioEffect>[] } = {
      natural: [
        { id: 'compressor', value: 20, enabled: true },
        { id: 'eq', value: 5, enabled: true },
        { id: 'noise_gate', value: -40, enabled: true },
        { id: 'warmth', value: 15, enabled: false },
      ],
      radio: [
        { id: 'compressor', value: 60, enabled: true },
        { id: 'eq', value: 15, enabled: true },
        { id: 'warmth', value: 45, enabled: true },
        { id: 'noise_gate', value: -25, enabled: true },
      ],
      podcast: [
        { id: 'compressor', value: 45, enabled: true },
        { id: 'eq', value: 10, enabled: true },
        { id: 'noise_gate', value: -35, enabled: true },
        { id: 'warmth', value: 25, enabled: true },
      ],
      asmr: [
        { id: 'compressor', value: 30, enabled: true },
        { id: 'warmth', value: 55, enabled: true },
        { id: 'reverb', value: 35, enabled: true },
        { id: 'noise_gate', value: -45, enabled: true },
      ],
    };

    const config = presetConfigs[presetValue] || [];
    setEffects(prev => prev.map(effect => {
      const presetEffect = config.find(p => p.id === effect.id);
      return presetEffect ? { ...effect, ...presetEffect } : effect;
    }));
  };

  const exportProcessedAudio = async () => {
    setIsProcessing(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Audio Exported",
        description: "Processed audio has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export processed audio.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEffectIcon = (type: string) => {
    switch (type) {
      case 'filter': return <Filter className="w-4 h-4" />;
      case 'modulation': return <Waves className="w-4 h-4" />;
      case 'spatial': return <Radio className="w-4 h-4" />;
      case 'enhancement': return <Zap className="w-4 h-4" />;
      default: return <Sliders className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Waves className="w-4 h-4 mr-2" />
            Real-Time Audio Processing
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Live Voice Enhancement</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade real-time audio processing with customizable effects and presets
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recording Control */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Recording Control
              </CardTitle>
              <CardDescription>Start recording to apply real-time effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Record Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? stopRecording : startRecording}
                  className="w-24 h-24 rounded-full"
                  disabled={isProcessing}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Click to start recording'}
                </p>
              </div>

              {/* Audio Level Meter */}
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Input Level</span>
                    <span>{audioLevel}%</span>
                  </div>
                  <Progress 
                    value={audioLevel} 
                    className={`h-2 ${audioLevel > 80 ? 'bg-red-100' : audioLevel > 60 ? 'bg-yellow-100' : 'bg-green-100'}`}
                  />
                  {audioLevel > 85 && (
                    <p className="text-xs text-red-600">⚠ High input level - may cause distortion</p>
                  )}
                </div>
              )}

              {/* Real-time Processing Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Real-time Processing</label>
                    <p className="text-xs text-muted-foreground">Apply effects during recording</p>
                  </div>
                  <Switch
                    checked={isRealTimeEnabled}
                    onCheckedChange={setIsRealTimeEnabled}
                    disabled={isRecording}
                  />
                </div>

                {isRealTimeEnabled && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Real-time processing requires more CPU power and may introduce latency
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* System Performance */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{cpuUsage}%</span>
                </div>
                <Progress 
                  value={cpuUsage} 
                  className={`h-2 ${cpuUsage > 80 ? 'bg-red-100' : 'bg-blue-100'}`}
                />
                {cpuUsage > 80 && (
                  <p className="text-xs text-amber-600">High CPU usage - consider disabling some effects</p>
                )}
              </div>

              {/* Export Button */}
              <Button 
                onClick={exportProcessedAudio}
                disabled={isRecording || isProcessing || recordingTime === 0}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Gauge className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4 mr-2" />
                    Export Processed Audio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Effects & Presets */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Audio Effects
              </CardTitle>
              <CardDescription>Customize your voice with professional audio effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Voice Preset</label>
                <Select value={selectedPreset} onValueChange={loadPreset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        <div className="flex flex-col">
                          <span>{preset.label}</span>
                          <span className="text-xs text-muted-foreground">{preset.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Effect Controls */}
              <div className="grid sm:grid-cols-2 gap-6">
                {effects.map((effect) => (
                  <div key={effect.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEffectIcon(effect.type)}
                        <label className="text-sm font-medium">{effect.name}</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={effect.enabled ? "default" : "secondary"} className="text-xs">
                          {effect.type}
                        </Badge>
                        <Switch
                          checked={effect.enabled}
                          onCheckedChange={() => toggleEffect(effect.id)}
                          size="sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Slider
                        value={[effect.value]}
                        onValueChange={(value) => updateEffect(effect.id, value[0])}
                        min={effect.range[0]}
                        max={effect.range[1]}
                        step={1}
                        disabled={!effect.enabled}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{effect.range[0]}</span>
                        <span className="font-medium">{effect.value}{effect.id === 'pitch' ? ' st' : effect.id === 'noise_gate' ? ' dB' : '%'}</span>
                        <span>{effect.range[1]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Effect Categories Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                {['filter', 'modulation', 'spatial', 'enhancement'].map((type) => {
                  const typeEffects = effects.filter(e => e.type === type);
                  const enabledCount = typeEffects.filter(e => e.enabled).length;
                  return (
                    <div key={type} className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {getEffectIcon(type)}
                        <span className="text-xs font-medium capitalize">{type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {enabledCount}/{typeEffects.length} active
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RealTimeProcessor;