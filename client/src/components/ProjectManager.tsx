import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  FolderOpen, Plus, Download, Share2, Trash2, 
  Music, Clock, Calendar, User 
} from "lucide-react";

interface AudioProject {
  id: string;
  title: string;
  content: string;
  audio_url?: string;
  audio_settings: any;
  voice_profile_id?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<AudioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('audio_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a project title",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create projects",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('audio_projects')
        .insert({
          title: newProjectTitle,
          content: "",
          audio_settings: {},
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      setProjects([data, ...projects]);
      setNewProjectTitle("");
      
      toast({
        title: "Project Created",
        description: "New project created successfully!",
      });

    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('audio_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== id));
      
      toast({
        title: "Project Deleted",
        description: "Project deleted successfully!",
      });

    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const downloadProject = (project: AudioProject) => {
    const projectData = {
      title: project.title,
      content: project.content,
      settings: project.audio_settings,
      created: project.created_at,
      updated: project.updated_at
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Project exported successfully!",
    });
  };

  const shareProject = async (project: AudioProject) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.content,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${project.title}\n\n${project.content}`);
      toast({
        title: "Copied",
        description: "Project content copied to clipboard!",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="animate-pulse">Loading projects...</div>
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
            <FolderOpen className="w-4 h-4 mr-2" />
            Project Manager
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Your Voice Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage, organize, and access all your voice and audio projects
          </p>
        </div>

        {/* Create New Project */}
        <Card className="mb-8 bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Create New Project
            </CardTitle>
            <CardDescription>
              Start a new voice project with AI-powered features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter project title..."
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="bg-muted/30 border-border/50"
                onKeyPress={(e) => e.key === 'Enter' && createProject()}
              />
              <Button 
                onClick={createProject}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card hover:shadow-glow transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(project.updated_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Project
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    {project.audio_url && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        Audio
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {project.content && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => shareProject(project)}
                          size="sm"
                          variant="outline"
                          className="border-glass-border bg-glass-bg backdrop-blur-sm"
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => downloadProject(project)}
                          size="sm"
                          variant="outline"
                          className="border-glass-border bg-glass-bg backdrop-blur-sm"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => deleteProject(project.id)}
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-glass-bg backdrop-blur-sm border-glass-border shadow-card">
            <CardContent className="text-center py-12">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first voice project to get started with VoxCraft
              </p>
              <Button 
                onClick={() => setNewProjectTitle("My First Project")}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ProjectManager;