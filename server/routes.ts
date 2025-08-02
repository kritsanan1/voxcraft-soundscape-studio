import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAudioProjectSchema, insertVoiceProfileSchema, insertAudioSceneSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Speech generation route (replacing Supabase Edge Function)
  app.post("/api/generate-speech", async (req, res) => {
    try {
      const { text, voice_id = 'Aria', model_id = 'eleven_multilingual_v2', voice_settings = {}, emotion = 'neutral', age_factor = 1.0, speed = 1.0, pitch = 1.0, clarity = 1.0 } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // For now, return a placeholder response until we get the ElevenLabs API key
      res.status(501).json({ 
        error: 'Speech generation requires ElevenLabs API key. Please configure ELEVENLABS_API_KEY environment variable.',
        placeholder: true,
        requestData: { text, voice_id, emotion }
      });
    } catch (error) {
      console.error('Error in generate-speech:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // AI Content generation route (replacing Supabase Edge Function)
  app.post("/api/ai-content-generator", async (req, res) => {
    try {
      const { type, topic, style, length, audience, voice_suggestions = true, emotional_cues = true, pronunciation_guides = false } = req.body;

      if (!topic || !type) {
        return res.status(400).json({ error: 'Topic and type are required' });
      }

      // For now, return a placeholder response until we get the OpenAI API key
      res.status(501).json({ 
        error: 'AI content generation requires OpenAI API key. Please configure OPENAI_API_KEY environment variable.',
        placeholder: true,
        requestData: { type, topic, style, length, audience }
      });
    } catch (error) {
      console.error('Error in ai-content-generator:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Voice Profiles CRUD routes
  app.get("/api/voice-profiles", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const publicOnly = req.query.public === 'true';

      if (publicOnly) {
        const profiles = await storage.getPublicVoiceProfiles();
        res.json(profiles);
      } else if (userId) {
        const profiles = await storage.getVoiceProfilesByUser(parseInt(userId));
        res.json(profiles);
      } else {
        res.status(400).json({ error: 'userId parameter required unless requesting public profiles' });
      }
    } catch (error) {
      console.error('Error fetching voice profiles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/voice-profiles", async (req, res) => {
    try {
      const profileData = insertVoiceProfileSchema.parse(req.body);
      const profile = await storage.createVoiceProfile(profileData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid profile data', details: error.errors });
      } else {
        console.error('Error creating voice profile:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Audio Projects CRUD routes
  app.get("/api/audio-projects", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: 'userId parameter required' });
      }

      const projects = await storage.getAudioProjectsByUser(parseInt(userId));
      res.json(projects);
    } catch (error) {
      console.error('Error fetching audio projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/audio-projects", async (req, res) => {
    try {
      const projectData = insertAudioProjectSchema.parse(req.body);
      const project = await storage.createAudioProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid project data', details: error.errors });
      } else {
        console.error('Error creating audio project:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Audio Scenes CRUD routes
  app.get("/api/audio-scenes", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const projectId = req.query.projectId as string;

      if (projectId) {
        const scenes = await storage.getAudioScenesByProject(projectId);
        res.json(scenes);
      } else if (userId) {
        const scenes = await storage.getAudioScenesByUser(parseInt(userId));
        res.json(scenes);
      } else {
        res.status(400).json({ error: 'userId or projectId parameter required' });
      }
    } catch (error) {
      console.error('Error fetching audio scenes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/audio-scenes", async (req, res) => {
    try {
      const sceneData = insertAudioSceneSchema.parse(req.body);
      const scene = await storage.createAudioScene(sceneData);
      res.json(scene);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid scene data', details: error.errors });
      } else {
        console.error('Error creating audio scene:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
