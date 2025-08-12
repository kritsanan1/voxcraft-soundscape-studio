import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Sparkles, BookOpen, Mic, Users, Clock, Copy, 
  Download, Play, Wand2, FileText, MessageSquare 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedContent {
  content: string;
  metadata: {
    estimated_duration: number;
    recommended_voices: string[];
    voice_suggestions: boolean;
    emotional_cues: boolean;
  };
  scenes: Array<{
    id: string;
    character: string;
    dialogue: string;
    emotion: string;
  }>;
  tips: string[];
}

const SmartContentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState("script");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("conversational");
  const [length, setLength] = useState("medium");
  const [audience, setAudience] = useState("general");
  const [voiceSuggestions, setVoiceSuggestions] = useState(true);
  const [emotionalCues, setEmotionalCues] = useState(true);
  const [pronunciationGuides, setPronunciationGuides] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  
  const { toast } = useToast();

  const contentTypes = [
    { value: "script", label: "Script", icon: FileText, description: "Dialogue and narration scripts" },
    { value: "dialogue", label: "Dialogue", icon: MessageSquare, description: "Character conversations" },
    { value: "narration", label: "Narration", icon: BookOpen, description: "Voice-over content" },
    { value: "podcast", label: "Podcast", icon: Mic, description: "Podcast episodes and segments" },
    { value: "story", label: "Story", icon: Sparkles, description: "Creative storytelling content" }
  ];

  const styles = [
    { value: "conversational", label: "Conversational" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "dramatic", label: "Dramatic" },
    { value: "educational", label: "Educational" },
    { value: "entertaining", label: "Entertaining" },
    { value: "professional", label: "Professional" },
    { value: "storytelling", label: "Storytelling" }
  ];

  const lengths = [
    { value: "short", label: "Short (1-2 min)", description: "100-200 words" },
    { value: "medium", label: "Medium (3-5 min)", description: "300-500 words" },
    { value: "long", label: "Long (6-10 min)", description: "600-1000 words" }
  ];

  const audiences = [
    { value: "general", label: "General Audience" },
    { value: "children", label: "Children" },
    { value: "teens", label: "Teenagers" },
    { value: "adults", label: "Adults" },
    { value: "professionals", label: "Professionals" },
    { value: "students", label: "Students" },
    { value: "seniors", label: "Seniors" }
  ];

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for content generation.",
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
          description: "Please sign in to use the AI content generator.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('ai-content-generator', {
        body: {
          type: contentType,
          topic,
          style,
          length,
          audience,
          voice_suggestions: voiceSuggestions,
          emotional_cues: emotionalCues,
          pronunciation_guides: pronunciationGuides
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setGeneratedContent(response.data);

      toast({
        title: "Content Generated",
        description: "Your AI-generated content is ready!",
      });

    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      toast({
        title: "Copied",
        description: "Content copied to clipboard!",
      });
    }
  };

  const exportContent = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `voxcraft-${contentType}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exported",
        description: "Content exported successfully!",
      });
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <Wand2 className="w-4 h-4 mr-2" />
            Smart Content Generator
          </Badge>
          <h2 className="text-4xl font-bold mb-4">AI-Powered Content Creation</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate voice-optimized content with intelligent suggestions and emotional cues
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Content Configuration */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Content Settings
                </CardTitle>
                <CardDescription>
                  Configure your AI-generated content parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Content Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Content Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {contentTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Button
                          key={type.value}
                          onClick={() => setContentType(type.value)}
                          variant={contentType === type.value ? "default" : "outline"}
                          className="h-auto p-3 justify-start text-left"
                        >
                          <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    placeholder="Enter your content topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-muted/30 border-border/50"
                  />
                </div>

                {/* Style and Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Style</label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="bg-muted/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((styleOption) => (
                          <SelectItem key={styleOption.value} value={styleOption.value}>
                            {styleOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Length</label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger className="bg-muted/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lengths.map((lengthOption) => (
                          <SelectItem key={lengthOption.value} value={lengthOption.value}>
                            <div>
                              <div className="font-medium">{lengthOption.label}</div>
                              <div className="text-xs text-muted-foreground">{lengthOption.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Audience */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger className="bg-muted/30 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audienceOption) => (
                        <SelectItem key={audienceOption.value} value={audienceOption.value}>
                          {audienceOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Advanced Options</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm">Voice Suggestions</label>
                      <p className="text-xs text-muted-foreground">Include character voice recommendations</p>
                    </div>
                    <Switch
                      checked={voiceSuggestions}
                      onCheckedChange={setVoiceSuggestions}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm">Emotional Cues</label>
                      <p className="text-xs text-muted-foreground">Add emotional direction tags</p>
                    </div>
                    <Switch
                      checked={emotionalCues}
                      onCheckedChange={setEmotionalCues}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm">Pronunciation Guides</label>
                      <p className="text-xs text-muted-foreground">Include pronunciation help for difficult words</p>
                    </div>
                    <Switch
                      checked={pronunciationGuides}
                      onCheckedChange={setPronunciationGuides}
                    />
                  </div>
                </div>

                <Button 
                  onClick={generateContent}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content Display */}
          <div className="space-y-6">
            <Card className="p-6 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Generated Content
                  </CardTitle>
                  {generatedContent && (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={copyToClipboard}
                        size="sm"
                        variant="outline"
                        className="border-glass-border bg-glass-bg backdrop-blur-sm"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        onClick={exportContent}
                        size="sm"
                        variant="outline"
                        className="border-glass-border bg-glass-bg backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-6">
                    {/* Content Metadata */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{generatedContent.metadata.estimated_duration} min
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {generatedContent.metadata.recommended_voices.length} voices
                      </Badge>
                      {generatedContent.metadata.voice_suggestions && (
                        <Badge variant="outline">Voice Suggestions</Badge>
                      )}
                      {generatedContent.metadata.emotional_cues && (
                        <Badge variant="outline">Emotional Cues</Badge>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="space-y-4">
                      <Textarea
                        value={generatedContent.content}
                        onChange={(e) => setGeneratedContent({
                          ...generatedContent,
                          content: e.target.value
                        })}
                        className="min-h-[300px] bg-muted/20 border-border/50 resize-none font-mono text-sm"
                        placeholder="Generated content will appear here..."
                      />
                    </div>

                    {/* Recommended Voices */}
                    {generatedContent.metadata.recommended_voices.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recommended Voices</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.metadata.recommended_voices.map((voice) => (
                            <Badge key={voice} variant="secondary">
                              {voice}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Voice Acting Tips */}
                    {generatedContent.tips.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Voice Acting Tips</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {generatedContent.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">AI Content Generator</p>
                    <p className="text-sm">Configure your settings and click "Generate Content" to create AI-powered voice content</p>
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

export default SmartContentGenerator;