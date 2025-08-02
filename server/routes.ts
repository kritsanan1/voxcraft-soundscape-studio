import { Express, Request, Response } from "express"; // Import types
import { Server } from "http";
import { storage } from "./storage";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Speech generation route (replacing Supabase Edge Function)
  app.post("/api/generate-speech", async (req: Request, res: Response) => {
    try {
      const { text, voice_id, emotion, age_factor, speed, pitch, clarity, voice_settings } = req.body;
      // In a real application, you would integrate with ElevenLabs or similar here
      // For now, simulate a response
      log(`Generating speech for text: "${text.substring(0, 30)}..." with voice ${voice_id}`, "speech");
      const audioBuffer = Buffer.from("simulated audio data", "utf-8"); // Replace with actual audio buffer
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
    } catch (error: any) {
      log(`Error generating speech: ${error.message}`, "speech");
      res.status(500).json({ error: error.message });
    }
  });

  // AI Content generation route (replacing Supabase Edge Function)
  app.post("/api/ai-content-generator", async (req: Request, res: Response) => {
    try {
      const { type, topic, style, length, audience, voice_suggestions, emotional_cues, pronunciation_guides } = req.body;
      // In a real application, you would integrate with OpenAI or similar here
      // For now, simulate a response
      log(`Generating AI content for topic: "${topic}" of type ${type}`, "ai-content");
      const generatedContent = {
        content: `This is a simulated ${type} about ${topic} in a ${style} style for ${audience}. It's a ${length} piece.`,
        metadata: {
          estimated_duration: length === 'short' ? 1 : length === 'medium' ? 3 : 7,
          recommended_voices: ["Aria", "Roger"],
          voice_suggestions,
          emotional_cues,
        },
        scenes: [],
        tips: ["Speak clearly", "Vary your pace"],
      };
      res.json(generatedContent);
    } catch (error: any) {
      log(`Error generating AI content: ${error.message}`, "ai-content");
      res.status(500).json({ error: error.message });
    }
  });

  // Voice Profiles CRUD routes
  app.get("/api/voice-profiles", async (req: Request, res: Response) => {
    try {
      const { userId, isPublic } = req.query;
      if (isPublic === 'true') {
        const profiles = await storage.getPublicVoiceProfiles();
        res.json(profiles);
      } else if (userId) {
        const profiles = await storage.getVoiceProfilesByUser(parseInt(userId as string));
        res.json(profiles);
      } else {
        // In a real app, you might return profiles for the authenticated user
        res.status(400).json({ error: "Missing userId or isPublic query parameter" });
      }
    } catch (error: any) {
      log(`Error fetching voice profiles: ${error.message}`, "voice-profiles");
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/voice-profiles", async (req: Request, res: Response) => {
    try {
      const newProfile = await storage.createVoiceProfile(req.body);
      res.status(201).json(newProfile);
    } catch (error: any) {
      log(`Error creating voice profile: ${error.message}`, "voice-profiles");
      res.status(500).json({ error: error.message });
    }
  });

  // Audio Projects CRUD routes
  app.get("/api/audio-projects", async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (userId) {
        const projects = await storage.getAudioProjectsByUser(parseInt(userId as string));
        res.json(projects);
      } else {
        // In a real app, you might return projects for the authenticated user
        res.status(400).json({ error: "Missing userId query parameter" });
      }
    } catch (error: any) {
      log(`Error fetching audio projects: ${error.message}`, "audio-projects");
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/audio-projects", async (req: Request, res: Response) => {
    try {
      const newProject = await storage.createAudioProject(req.body);
      res.status(201).json(newProject);
    } catch (error: any) {
      log(`Error creating audio project: ${error.message}`, "audio-projects");
      res.status(500).json({ error: error.message });
    }
  });

  // Audio Scenes CRUD routes
  app.get("/api/audio-scenes", async (req: Request, res: Response) => {
    try {
      const { userId, projectId } = req.query;
      if (projectId) {
        const scenes = await storage.getAudioScenesByProject(projectId as string);
        res.json(scenes);
      } else if (userId) {
        const scenes = await storage.getAudioScenesByUser(parseInt(userId as string));
        res.json(scenes);
      } else {
        // In a real app, you might return scenes for the authenticated user
        res.status(400).json({ error: "Missing userId or projectId query parameter" });
      }
    } catch (error: any) {
      log(`Error fetching audio scenes: ${error.message}`, "audio-scenes");
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/audio-scenes", async (req: Request, res: Response) => {
    try {
      const newScene = await storage.createAudioScene(req.body);
      res.status(201).json(newScene);
    } catch (error: any) {
      log(`Error creating audio scene: ${error.message}`, "audio-scenes");
      res.status(500).json({ error: error.message });
    }
  });

  return server;
}