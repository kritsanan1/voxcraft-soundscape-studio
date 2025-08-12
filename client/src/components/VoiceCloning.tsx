import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, Mic, Play, Pause, Loader2, CheckCircle, 
  AlertTriangle, Trash2, Copy, Star, Volume2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VoiceClone {
  id: string;
  name: string;
  description: string;
  status: 'processing' | 'ready' | 'failed';
  qualityScore: number;
  audioSampleUrl: string;
  createdAt: string;
}

const VoiceCloning = () => {
  const [clones, setClones] = useState<VoiceClone[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [newCloneName, setNewCloneName] = useState("");
  const [newCloneDescription, setNewCloneDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playingClone, setPlayingClone] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File",
          description: "Please select an audio file (MP3, WAV, M4A, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        toast({
          title: "File Too Large",
          description: "Audio file must be under 25MB for voice cloning",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        setSelectedFile(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Auto stop after 2 minutes (recommended for voice cloning)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          setRecordingTime(0);
          clearInterval(timer);
        }
      }, 120000);

    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const createVoiceClone = async () => {
    if (!selectedFile || !newCloneName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and audio sample for the voice clone.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Upload audio file and create clone
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('name', newCloneName);
      formData.append('description', newCloneDescription);
      formData.append('userId', 'demo-user');

      const response = await fetch('/api/voice-clones', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newClone = await response.json();
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add to clones list
      setClones(prev => [newClone, ...prev]);

      // Reset form
      setNewCloneName("");
      setNewCloneDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Voice Clone Created",
        description: `${newCloneName} is now processing. This may take a few minutes.`,
      });

    } catch (error) {
      console.error('Voice cloning error:', error);
      toast({
        title: "Cloning Failed",
        description: error instanceof Error ? error.message : "Failed to create voice clone. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const playClonePreview = async (clone: VoiceClone) => {
    if (playingClone === clone.id) {
      setPlayingClone(null);
      return;
    }

    try {
      setPlayingClone(clone.id);
      
      // Generate a preview with the cloned voice
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: "Hello! This is a preview of your custom voice clone. How does it sound?",
          voice_id: clone.id,
          userId: 'demo-user'
        })
      });

      if (!response.ok) throw new Error('Failed to generate preview');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setPlayingClone(null);
      audio.onerror = () => {
        setPlayingClone(null);
        toast({
          title: "Playback Error",
          description: "Unable to play voice preview.",
          variant: "destructive",
        });
      };

      await audio.play();

    } catch (error) {
      setPlayingClone(null);
      toast({
        title: "Preview Failed",
        description: "Unable to generate voice preview.",
        variant: "destructive",
      });
    }
  };

  const deleteClone = async (cloneId: string) => {
    try {
      await apiRequest(`/api/voice-clones/${cloneId}`, { method: 'DELETE' });
      setClones(prev => prev.filter(clone => clone.id !== cloneId));
      toast({
        title: "Clone Deleted",
        description: "Voice clone has been removed.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete voice clone.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, qualityScore?: number) => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ready {qualityScore && `(${Math.round(qualityScore * 100)}%)`}
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing...
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Volume2 className="w-4 h-4 mr-2" />
            Advanced Voice Cloning
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Create Custom Voices</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clone any voice with just a few minutes of audio. Perfect for personalized content creation and professional voiceovers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create New Clone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Create Voice Clone
              </CardTitle>
              <CardDescription>
                Upload high-quality audio (2-5 minutes recommended) or record directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Clone Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Voice Name</label>
                <Input
                  value={newCloneName}
                  onChange={(e) => setNewCloneName(e.target.value)}
                  placeholder="My Custom Voice"
                  disabled={isUploading}
                />
              </div>

              {/* Clone Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                <Textarea
                  value={newCloneDescription}
                  onChange={(e) => setNewCloneDescription(e.target.value)}
                  placeholder="Professional male voice, clear articulation..."
                  disabled={isUploading}
                  rows={2}
                />
              </div>

              {/* Audio Upload/Record */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isRecording}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Audio
                  </Button>
                  <Button
                    variant="outline"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isRecording ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop ({recordingTime}s)
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Record
                      </>
                    )}
                  </Button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="audio/*"
                  className="hidden"
                />

                {selectedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
              </div>

              {/* Quality Tips */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Tips for best results:</strong>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Use clear, high-quality audio (no background noise)</li>
                    <li>• Include varied speech patterns and emotions</li>
                    <li>• 2-5 minutes of audio provides optimal cloning quality</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Create Button */}
              <Button
                onClick={createVoiceClone}
                disabled={!selectedFile || !newCloneName.trim() || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Clone...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Create Voice Clone
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Clones */}
          <Card>
            <CardHeader>
              <CardTitle>Your Voice Clones</CardTitle>
              <CardDescription>
                Manage and preview your custom voices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clones.length === 0 ? (
                <div className="text-center py-8">
                  <Volume2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No voice clones yet</p>
                  <p className="text-sm text-muted-foreground">Create your first custom voice to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clones.map((clone) => (
                    <div key={clone.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{clone.name}</h4>
                          {clone.description && (
                            <p className="text-sm text-muted-foreground">{clone.description}</p>
                          )}
                        </div>
                        {getStatusBadge(clone.status, clone.qualityScore)}
                      </div>

                      <div className="flex gap-2 mt-3">
                        {clone.status === 'ready' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => playClonePreview(clone)}
                            disabled={playingClone === clone.id}
                          >
                            {playingClone === clone.id ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Playing...
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Preview
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteClone(clone.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>

                        {clone.status === 'ready' && clone.qualityScore && clone.qualityScore > 0.8 && (
                          <Badge variant="outline" className="ml-auto">
                            <Star className="w-3 h-3 mr-1" />
                            High Quality
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VoiceCloning;