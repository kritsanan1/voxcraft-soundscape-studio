-- Create voice profiles table for storing custom voices
CREATE TABLE public.voice_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  voice_id TEXT NOT NULL, -- ElevenLabs voice ID
  description TEXT,
  is_custom BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  voice_settings JSONB DEFAULT '{}', -- Store voice parameters (speed, pitch, clarity, etc.)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audio projects table for storing user projects
CREATE TABLE public.audio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- The text to be converted
  voice_profile_id UUID REFERENCES public.voice_profiles(id) ON DELETE SET NULL,
  audio_settings JSONB DEFAULT '{}', -- Store emotion, aging, spatial settings, etc.
  audio_url TEXT, -- URL to generated audio file
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audio scenes table for 3D spatial audio compositions
CREATE TABLE public.audio_scenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.audio_projects(id) ON DELETE CASCADE,
  scene_name TEXT NOT NULL,
  spatial_config JSONB DEFAULT '{}', -- Store 3D positions, environment settings, etc.
  ambient_sounds JSONB DEFAULT '[]', -- Array of ambient sound configurations
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_scenes ENABLE ROW LEVEL SECURITY;

-- Voice profiles policies
CREATE POLICY "Users can view public voice profiles" 
ON public.voice_profiles 
FOR SELECT 
USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can manage their own voice profiles" 
ON public.voice_profiles 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Audio projects policies
CREATE POLICY "Users can manage their own audio projects" 
ON public.audio_projects 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Audio scenes policies
CREATE POLICY "Users can manage their own audio scenes" 
ON public.audio_scenes 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create update triggers for timestamps
CREATE TRIGGER update_voice_profiles_updated_at
BEFORE UPDATE ON public.voice_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audio_projects_updated_at
BEFORE UPDATE ON public.audio_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audio_scenes_updated_at
BEFORE UPDATE ON public.audio_scenes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();