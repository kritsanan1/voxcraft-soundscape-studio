import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, TrendingUp, Clock, Users, 
  Mic, Music, Download, RefreshCw,
  Activity, Target, Zap
} from "lucide-react";

interface AnalyticsData {
  totalProjects: number;
  totalGenerations: number;
  totalDuration: number;
  averageLength: number;
  popularVoices: Array<{ voice: string; count: number }>;
  recentActivity: Array<{ date: string; count: number }>;
  usageByType: Array<{ type: string; count: number }>;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalProjects: 0,
    totalGenerations: 0,
    totalDuration: 0,
    averageLength: 0,
    popularVoices: [],
    recentActivity: [],
    usageByType: []
  });
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(endDate.getDate() - days);

      // Fetch projects data
      const { data: projects, error: projectsError } = await supabase
        .from('audio_projects')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (projectsError) throw projectsError;

      // Fetch voice profiles data
      const { data: voiceProfiles, error: voiceError } = await supabase
        .from('voice_profiles')
        .select('*');

      if (voiceError) throw voiceError;

      // Process analytics data
      const totalProjects = projects?.length || 0;
      const totalGenerations = projects?.filter(p => p.audio_url).length || 0;
      
      // Calculate popular voices from audio_settings
      const voiceUsage: { [key: string]: number } = {};
      projects?.forEach(project => {
        if (project.audio_settings?.voice_id) {
          voiceUsage[project.audio_settings.voice_id] = (voiceUsage[project.audio_settings.voice_id] || 0) + 1;
        }
      });

      const popularVoices = Object.entries(voiceUsage)
        .map(([voice, count]) => ({ voice, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate recent activity (daily counts)
      const activityByDate: { [key: string]: number } = {};
      projects?.forEach(project => {
        const date = new Date(project.created_at).toISOString().split('T')[0];
        activityByDate[date] = (activityByDate[date] || 0) + 1;
      });

      const recentActivity = Object.entries(activityByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

      // Calculate usage by content type (estimate based on content length)
      const usageByType = [
        { type: "Short Content", count: projects?.filter(p => p.content.length < 200).length || 0 },
        { type: "Medium Content", count: projects?.filter(p => p.content.length >= 200 && p.content.length < 500).length || 0 },
        { type: "Long Content", count: projects?.filter(p => p.content.length >= 500).length || 0 }
      ];

      setAnalyticsData({
        totalProjects,
        totalGenerations,
        totalDuration: totalGenerations * 2.5, // Estimate
        averageLength: totalProjects > 0 ? projects.reduce((sum, p) => sum + p.content.length, 0) / totalProjects : 0,
        popularVoices,
        recentActivity,
        usageByType
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = () => {
    const exportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      data: analyticsData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voxcraft-analytics-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Analytics data exported successfully!",
    });
  };

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-pulse">Loading analytics...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics Dashboard
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Usage Analytics</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your voice generation patterns and optimize your workflow
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-glass-bg border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={loadAnalytics}
              size="sm"
              variant="outline"
              className="border-glass-border bg-glass-bg backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={exportAnalytics}
              size="sm"
              variant="outline"
              className="border-glass-border bg-glass-bg backdrop-blur-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{analyticsData.totalProjects}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Audio Generated</p>
                  <p className="text-2xl font-bold">{analyticsData.totalGenerations}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                  <p className="text-2xl font-bold">{analyticsData.totalDuration.toFixed(1)}m</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Length</p>
                  <p className="text-2xl font-bold">{Math.round(analyticsData.averageLength)}</p>
                  <p className="text-xs text-muted-foreground">characters</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Popular Voices */}
          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Popular Voices
              </CardTitle>
              <CardDescription>
                Most used voices in your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularVoices.length > 0 ? (
                  analyticsData.popularVoices.map((voice, index) => (
                    <div key={voice.voice} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{voice.voice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ 
                              width: `${(voice.count / Math.max(...analyticsData.popularVoices.map(v => v.count))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">{voice.count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No voice usage data yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage by Content Type */}
          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Content Distribution
              </CardTitle>
              <CardDescription>
                Projects by content length
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.usageByType.map((usage, index) => (
                  <div key={usage.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary" style={{ 
                        backgroundColor: `hsl(${index * 120}, 70%, 50%)` 
                      }} />
                      <span className="font-medium">{usage.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ 
                            width: `${(usage.count / Math.max(...analyticsData.usageByType.map(u => u.count))) * 100}%`,
                            backgroundColor: `hsl(${index * 120}, 70%, 50%)`
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{usage.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Daily project creation over the last week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-40 gap-2">
                {analyticsData.recentActivity.length > 0 ? (
                  analyticsData.recentActivity.map((day, index) => {
                    const maxCount = Math.max(...analyticsData.recentActivity.map(d => d.count));
                    const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-md transition-all duration-300 hover:bg-primary/80 min-h-[4px]"
                          style={{ height: `${height}%` }}
                          title={`${day.count} projects on ${new Date(day.date).toLocaleDateString()}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground w-full">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity data yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Analytics;