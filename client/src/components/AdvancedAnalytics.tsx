import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, Clock, Users, Mic, Music, 
  Download, RefreshCw, Activity, Target, Zap, 
  Star, Volume2, Headphones, Timer, Award 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsData {
  totalGenerations: number;
  totalDuration: number;
  totalCharacters: number;
  averageQuality: number;
  popularVoices: Array<{ voiceId: string; voiceName: string; count: number; avgQuality: number }>;
  recentActivity: Array<{ date: string; generations: number; duration: number }>;
  usageByEmotion: Array<{ emotion: string; count: number; percentage: number }>;
  dailyStats: Array<{ date: string; generations: number; cost: number; duration: number }>;
  topProjects: Array<{ id: string; title: string; generations: number; avgQuality: number }>;
  performanceMetrics: {
    avgProcessingTime: number;
    successRate: number;
    costEfficiency: number;
  };
}

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [viewMode, setViewMode] = useState("overview");

  const { data: analytics, isLoading, refetch } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics', timeRange],
    queryFn: () => apiRequest('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ 
        userId: 'demo-user',
        timeRange,
        includeDetails: true 
      })
    }),
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 4.0) return "text-green-600";
    if (quality >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = (metric: string) => {
    switch (metric) {
      case 'speed': return <Zap className="w-4 h-4" />;
      case 'quality': return <Star className="w-4 h-4" />;
      case 'efficiency': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading analytics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!analytics) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardContent className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p>No analytics data available</p>
              <Button onClick={() => refetch()} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced Analytics
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Voice Generation Insights</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep analytics and performance metrics for your voice synthesis projects
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
            <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Generations</p>
                      <p className="text-3xl font-bold">{analytics.totalGenerations.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mic className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+12% vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                      <p className="text-3xl font-bold">{formatDuration(analytics.totalDuration)}</p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Timer className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">
                      Avg: {formatDuration(analytics.totalDuration / analytics.totalGenerations)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Characters Processed</p>
                      <p className="text-3xl font-bold">{analytics.totalCharacters.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      Avg: {Math.round(analytics.totalCharacters / analytics.totalGenerations)} per generation
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Quality</p>
                      <p className={`text-3xl font-bold ${getQualityColor(analytics.averageQuality)}`}>
                        {analytics.averageQuality.toFixed(1)}/5.0
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Award className="w-4 h-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-yellow-600">Excellent quality</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Voices */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Most Used Voices
                  </CardTitle>
                  <CardDescription>Your top performing voice selections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.popularVoices.slice(0, 5).map((voice, index) => (
                      <div key={voice.voiceId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{voice.voiceName}</p>
                            <p className="text-sm text-muted-foreground">
                              {voice.count} generations
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm font-medium">{voice.avgQuality.toFixed(1)}</span>
                          </div>
                          <div className="w-24 mt-1">
                            <Progress 
                              value={(voice.count / analytics.popularVoices[0].count) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Emotion Usage
                  </CardTitle>
                  <CardDescription>Distribution of emotional tones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.usageByEmotion.map((emotion) => (
                      <div key={emotion.emotion} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{emotion.emotion}</span>
                          <span className="text-sm text-muted-foreground">
                            {emotion.count} ({emotion.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={emotion.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Processing Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics.performanceMetrics.avgProcessingTime.toFixed(1)}s
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Average processing time</p>
                    <div className="mt-4">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        {analytics.performanceMetrics.avgProcessingTime < 5 ? 'Excellent' : 'Good'} Performance
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {(analytics.performanceMetrics.successRate * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Generation success rate</p>
                    <div className="mt-4">
                      <Progress value={analytics.performanceMetrics.successRate * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Cost Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {formatCurrency(analytics.performanceMetrics.costEfficiency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Cost per minute</p>
                    <div className="mt-4">
                      <Badge variant="outline" className="border-purple-200 text-purple-700">
                        Optimized Spending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Your voice generation activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {analytics.dailyStats.slice(-14).map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t min-h-1"
                        style={{ 
                          height: `${(day.generations / Math.max(...analytics.dailyStats.map(d => d.generations))) * 200}px`
                        }}
                      />
                      <span className="text-xs text-muted-foreground mt-2 transform rotate-45">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Top Performing Projects
                </CardTitle>
                <CardDescription>Projects with highest quality ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProjects.map((project, index) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.generations} generations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-lg font-bold">{project.avgQuality.toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">
                          High Quality
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AdvancedAnalytics;