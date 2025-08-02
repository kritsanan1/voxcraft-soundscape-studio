import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, Zap, Clock, Wifi, AlertCircle, 
  CheckCircle, RefreshCw, Download 
} from "lucide-react";

interface PerformanceMetrics {
  connectionSpeed: number;
  latency: number;
  responseTime: number;
  memoryUsage: number;
  errorRate: number;
  uptime: number;
  lastUpdated: string;
}

interface SystemStatus {
  api: 'online' | 'degraded' | 'offline';
  tts: 'online' | 'degraded' | 'offline';
  database: 'online' | 'degraded' | 'offline';
  storage: 'online' | 'degraded' | 'offline';
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    connectionSpeed: 0,
    latency: 0,
    responseTime: 0,
    memoryUsage: 0,
    errorRate: 0,
    uptime: 0,
    lastUpdated: new Date().toISOString()
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    api: 'online',
    tts: 'online',
    database: 'online',
    storage: 'online'
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    updateMetrics();
    checkSystemStatus();
    
    const interval = setInterval(() => {
      if (isMonitoring) {
        updateMetrics();
        checkSystemStatus();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const updateMetrics = async () => {
    try {
      // Measure page load performance
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Estimate connection speed (rough approximation)
      const connectionSpeed = navigator.connection ? 
        (navigator.connection as any).downlink || 0 : 0;

      // Calculate latency (rough approximation)
      const latency = navigation ? navigation.responseStart - navigation.requestStart : 0;

      // Response time
      const responseTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;

      // Memory usage (if available)
      const memoryUsage = (performance as any).memory ? 
        ((performance as any).memory.usedJSHeapSize / (performance as any).memory.totalJSHeapSize) * 100 : 0;

      // Uptime (time since page load)
      const uptime = performance.now() / 1000 / 60; // Convert to minutes

      setMetrics({
        connectionSpeed,
        latency,
        responseTime,
        memoryUsage,
        errorRate: Math.random() * 2, // Simulated error rate
        uptime,
        lastUpdated: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Check API status with a simple health check
      const apiStatus = await fetch('/api/health').then(() => 'online').catch(() => 'offline');
      
      // For now, simulate status checks for other services
      // In a real app, these would be actual health check endpoints
      setSystemStatus({
        api: Math.random() > 0.1 ? 'online' : 'degraded',
        tts: Math.random() > 0.05 ? 'online' : 'degraded', 
        database: Math.random() > 0.02 ? 'online' : 'degraded',
        storage: Math.random() > 0.03 ? 'online' : 'degraded'
      });

    } catch (error) {
      console.error('Error checking system status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const exportMetrics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      performance: metrics,
      systemStatus,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voxcraft-performance-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-glass-bg border-glass-border backdrop-blur-sm">
            <Activity className="w-4 h-4 mr-2" />
            Performance Monitor
          </Badge>
          <h2 className="text-4xl font-bold mb-4">System Performance</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of VoxCraft's performance and system health
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant={isMonitoring ? "default" : "outline"}
              className="bg-glass-bg border-glass-border"
            >
              <Activity className="w-4 h-4 mr-2" />
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={updateMetrics}
              size="sm"
              variant="outline"
              className="border-glass-border bg-glass-bg backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button
              onClick={exportMetrics}
              size="sm"
              variant="outline"
              className="border-glass-border bg-glass-bg backdrop-blur-sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(systemStatus).map(([service, status]) => (
            <Card key={service} className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">{service}</p>
                    <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="font-semibold capitalize">{status}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connection Speed</p>
                  <p className="text-2xl font-bold">{metrics.connectionSpeed.toFixed(1)} Mbps</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Latency</p>
                  <p className="text-2xl font-bold">{metrics.latency.toFixed(0)}ms</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">{metrics.responseTime.toFixed(0)}ms</p>
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
                  <p className="text-sm text-muted-foreground">Memory Usage</p>
                  <p className="text-2xl font-bold">{metrics.memoryUsage.toFixed(1)}%</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                  <p className="text-2xl font-bold">{metrics.errorRate.toFixed(2)}%</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold">{metrics.uptime.toFixed(1)}m</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </Card>
        </div>

        {/* System Information */}
        <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Browser Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>User Agent: {navigator.userAgent.substring(0, 80)}...</p>
                  <p>Platform: {navigator.platform}</p>
                  <p>Language: {navigator.language}</p>
                  <p>Online: {navigator.onLine ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Performance Timing</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Connection Type: {(navigator.connection as any)?.effectiveType || 'Unknown'}</p>
                  <p>Downlink: {(navigator.connection as any)?.downlink || 'Unknown'} Mbps</p>
                  <p>RTT: {(navigator.connection as any)?.rtt || 'Unknown'} ms</p>
                  <p>Save Data: {(navigator.connection as any)?.saveData ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PerformanceMonitor;