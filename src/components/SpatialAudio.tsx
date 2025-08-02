import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Volume2, RotateCcw, Play, Settings, AlertTriangle } from "lucide-react";
import * as THREE from "three";

// WebGL detection utility
const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

// Animated Audio Source in 3D space
const AudioSource = ({ position, isActive }: { position: [number, number, number], isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={isActive ? "#ef4444" : "#64748b"} 
          emissive={isActive ? "#ef4444" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Sphere>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Voice
      </Text>
    </group>
  );
};

// Listener representation
const Listener = () => {
  return (
    <group position={[0, 0, 0]}>
      <Sphere args={[0.15]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} />
      </Sphere>
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Listener
      </Text>
    </group>
  );
};

// 2D Fallback Component for when WebGL is not available
const SpatialAudio2D = ({ sourcePosition, isPlaying, onPositionChange }: {
  sourcePosition: [number, number, number],
  isPlaying: boolean,
  onPositionChange: (position: [number, number, number]) => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up coordinate system (center of canvas)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 30;

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, canvas.height);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(canvas.width, centerY + i * scale);
        ctx.stroke();
      }

      // Draw listener (center)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw listener label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Listener', centerX, centerY + 25);

      // Draw audio source
      const sourceX = centerX + sourcePosition[0] * scale;
      const sourceY = centerY - sourcePosition[2] * scale; // Flip Y for screen coordinates
      
      ctx.fillStyle = isPlaying ? '#ef4444' : '#64748b';
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, isPlaying ? 12 : 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw pulsing effect if playing
      if (isPlaying) {
        const time = Date.now() * 0.003;
        const pulseRadius = 12 + Math.sin(time) * 4;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(sourceX, sourceY, pulseRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      
      // Draw source label
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('Voice', sourceX, sourceY - 20);

      // Draw connection line
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sourceX, sourceY);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    draw();
    const interval = setInterval(draw, 100); // Redraw for animation

    return () => clearInterval(interval);
  }, [sourcePosition, isPlaying]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="bg-muted/10 rounded-lg border border-border"
      />
      <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        2D View (WebGL Unavailable)
      </div>
    </div>
  );
};

const SpatialAudio = () => {
  const [sourcePosition, setSourcePosition] = useState<[number, number, number]>([2, 1, 0]);
  const [environment, setEnvironment] = useState("room");
  const [distance, setDistance] = useState([3]);
  const [reverb, setReverb] = useState([0.5]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  
  useEffect(() => {
    // Check WebGL availability on mount
    setWebGLAvailable(isWebGLAvailable());
  }, []);

  const environments = [
    { value: "room", label: "Small Room" },
    { value: "hall", label: "Concert Hall" },
    { value: "cathedral", label: "Cathedral" },
    { value: "outdoor", label: "Outdoor Space" },
    { value: "studio", label: "Recording Studio" }
  ];

  const resetPosition = () => {
    setSourcePosition([2, 1, 0]);
  };

  return (
    <section className="py-20 px-6 bg-gradient-hero">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <Volume2 className="w-4 h-4 mr-2" />
            3D Spatial Audio
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Immersive Audio Positioning</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Position voices in 3D space with realistic environmental effects and distance modeling
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">3D Audio Space</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetPosition}
                      className="border-glass-border bg-glass-bg backdrop-blur-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="h-96 bg-muted/10 rounded-lg overflow-hidden relative">
                  {webGLAvailable ? (
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                          <div className="text-sm text-muted-foreground">Loading 3D View...</div>
                        </div>
                      </div>
                    }>
                      <Canvas 
                        camera={{ position: [5, 3, 5], fov: 60 }}
                        onCreated={() => console.log('WebGL Canvas created successfully')}
                        onError={(error) => {
                          console.error('Canvas error:', error);
                          setWebGLAvailable(false);
                        }}
                      >
                        <ambientLight intensity={0.2} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ef4444" />
                        
                        <AudioSource position={sourcePosition} isActive={isPlaying} />
                        <Listener />
                        
                        {/* Grid floor */}
                        <gridHelper args={[10, 10, "#64748b", "#374151"]} position={[0, -2, 0]} />
                        
                        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                      </Canvas>
                    </Suspense>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4 text-amber-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">3D view unavailable - showing 2D fallback</span>
                      </div>
                      <SpatialAudio2D 
                        sourcePosition={sourcePosition}
                        isPlaying={isPlaying}
                        onPositionChange={setSourcePosition}
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/20 rounded">
                    <div className="text-primary font-medium">X: {sourcePosition[0].toFixed(1)}</div>
                    <div className="text-muted-foreground">Left/Right</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded">
                    <div className="text-primary font-medium">Y: {sourcePosition[1].toFixed(1)}</div>
                    <div className="text-muted-foreground">Up/Down</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded">
                    <div className="text-primary font-medium">Z: {sourcePosition[2].toFixed(1)}</div>
                    <div className="text-muted-foreground">Front/Back</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Spatial Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Spatial Settings</h3>
                </div>

                {/* Environment Preset */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Environment</label>
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {environments.map((env) => (
                        <SelectItem key={env.value} value={env.value}>
                          {env.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance Control */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Distance</label>
                    <span className="text-sm text-muted-foreground">{distance[0]}m</span>
                  </div>
                  <Slider
                    value={distance}
                    onValueChange={setDistance}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Reverb Control */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Reverb</label>
                    <span className="text-sm text-muted-foreground">{Math.round(reverb[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={reverb}
                    onValueChange={setReverb}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Position Controls */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Position Controls</label>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>X (Left/Right)</span>
                      <span>{sourcePosition[0].toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[sourcePosition[0]]}
                      onValueChange={(value) => setSourcePosition([value[0], sourcePosition[1], sourcePosition[2]])}
                      min={-5}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Y (Up/Down)</span>
                      <span>{sourcePosition[1].toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[sourcePosition[1]]}
                      onValueChange={(value) => setSourcePosition([sourcePosition[0], value[0], sourcePosition[2]])}
                      min={-2}
                      max={4}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Z (Front/Back)</span>
                      <span>{sourcePosition[2].toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[sourcePosition[2]]}
                      onValueChange={(value) => setSourcePosition([sourcePosition[0], sourcePosition[1], value[0]])}
                      min={-5}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Presets */}
            <Card className="p-4 bg-glass-bg backdrop-blur-sm border-glass-border">
              <div className="space-y-3">
                <h4 className="font-medium">Quick Positions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcePosition([-3, 1, 0])}
                    className="border-glass-border bg-glass-bg backdrop-blur-sm text-xs"
                  >
                    Left
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcePosition([3, 1, 0])}
                    className="border-glass-border bg-glass-bg backdrop-blur-sm text-xs"
                  >
                    Right
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcePosition([0, 1, 3])}
                    className="border-glass-border bg-glass-bg backdrop-blur-sm text-xs"
                  >
                    Behind
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSourcePosition([0, 3, 0])}
                    className="border-glass-border bg-glass-bg backdrop-blur-sm text-xs"
                  >
                    Above
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpatialAudio;