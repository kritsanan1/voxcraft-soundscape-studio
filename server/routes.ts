import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVoiceProfileSchema, 
  insertAudioProjectSchema, 
  insertAudioSceneSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Voice Profiles routes
  app.get("/api/voice-profiles", async (req, res) => {
    try {
      const { userId, isPublic } = req.query;
      
      let profiles;
      if (userId) {
        profiles = await storage.getVoiceProfilesByUser(userId as string);
      } else if (isPublic === 'true') {
        profiles = await storage.getPublicVoiceProfiles();
      } else {
        return res.status(400).json({ error: "userId or isPublic=true required" });
      }
      
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch voice profiles" });
    }
  });

  app.post("/api/voice-profiles", async (req, res) => {
    try {
      const profileData = insertVoiceProfileSchema.parse(req.body);
      const profile = await storage.createVoiceProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid voice profile data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create voice profile" });
      }
    }
  });

  app.put("/api/voice-profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const profile = await storage.updateVoiceProfile(id, updates);
      
      if (!profile) {
        return res.status(404).json({ error: "Voice profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update voice profile" });
    }
  });

  app.delete("/api/voice-profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVoiceProfile(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Voice profile not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete voice profile" });
    }
  });

  // Audio Projects routes
  app.get("/api/audio-projects", async (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const projects = await storage.getAudioProjectsByUser(userId as string);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audio projects" });
    }
  });

  app.post("/api/audio-projects", async (req, res) => {
    try {
      const projectData = insertAudioProjectSchema.parse(req.body);
      const project = await storage.createAudioProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid project data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create audio project" });
      }
    }
  });

  app.put("/api/audio-projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const project = await storage.updateAudioProject(id, updates);
      
      if (!project) {
        return res.status(404).json({ error: "Audio project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update audio project" });
    }
  });

  app.delete("/api/audio-projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAudioProject(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Audio project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete audio project" });
    }
  });

  // Speech Generation route (migrated from Supabase Edge Function)
  app.post("/api/generate-speech", async (req, res) => {
    try {
      const { 
        text, 
        voice_id = 'Aria',
        model_id = 'eleven_multilingual_v2',
        voice_settings = {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        },
        emotion = 'neutral',
        age_factor = 1.0,
        speed = 1.0,
        pitch = 1.0,
        clarity = 1.0,
        userId
      } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
      if (!elevenLabsApiKey) {
        return res.status(500).json({ error: 'ElevenLabs API key not configured' });
      }

      // Voice ID mapping for popular voices
      const voiceMap: Record<string, string> = {
        'Aria': '9BWtsMINqrJLrRacOk9x',
        'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
        'Sarah': 'EXAVITQu4vr4xnSDxMaL',
        'Laura': 'FGY2WhTYpPnrIDTdsKH5',
        'Charlie': 'IKne3meq5aSn9XLyUdCD',
        'George': 'JBFqnCBsd6RMkjVDRZzb',
        'Callum': 'N2lVS1w4EtoT3dr4eOWO',
        'River': 'SAz9YHcvj6GT2YYXdXww',
        'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
        'Charlotte': 'XB0fDUnXU5powFXDhCwa',
        'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
        'Matilda': 'XrExE9yKIg1WjnnlVkGX',
        'Will': 'bIHbv24MWmeRgasZH58o',
        'Jessica': 'cgSgspJ2msm6clMCkdW9',
        'Eric': 'cjVigY5qzO86Huf0OWal',
        'Chris': 'iP95p4xoKVk53GoZ742B',
        'Brian': 'nPczCjzI2devNBz1zQrb',
        'Daniel': 'onwK4e9ZLuTAKqWW03F9',
        'Lily': 'pFZP5JQG7iQjIQuC4Bku',
        'Bill': 'pqHfZKP75CvOlQylNhV4'
      };

      const actualVoiceId = voiceMap[voice_id] || voice_id;

      // Adjust voice settings based on emotion and other parameters
      const adjustedSettings = {
        ...voice_settings,
        stability: Math.max(0, Math.min(1, voice_settings.stability + (emotion === 'excited' ? 0.2 : emotion === 'calm' ? -0.2 : 0))),
        similarity_boost: Math.max(0, Math.min(1, voice_settings.similarity_boost * clarity)),
        style: Math.max(0, Math.min(1, voice_settings.style + (emotion === 'dramatic' ? 0.3 : 0))),
      };

      // Call ElevenLabs TTS API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: model_id,
          voice_settings: adjustedSettings,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', errorText);
        return res.status(response.status).json({ error: `TTS generation failed: ${errorText}` });
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Store the generated audio metadata in the database
      try {
        await storage.createAudioProject({
          userId,
          title: `Generated Speech - ${new Date().toISOString()}`,
          content: text,
          audioSettings: {
            voice_id,
            model_id,
            voice_settings: adjustedSettings,
            emotion,
            age_factor,
            speed,
            pitch,
            clarity
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      });
      res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error('Error in generate-speech:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // AI Content Generation route (migrated from Supabase Edge Function)
  app.post("/api/ai-content-generator", async (req, res) => {
    try {
      const { 
        type, 
        topic, 
        style, 
        length, 
        audience,
        voice_suggestions = true,
        emotional_cues = true,
        pronunciation_guides = false,
        userId
      } = req.body;

      if (!topic || !type) {
        return res.status(400).json({ error: 'Topic and type are required' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      // Create content generation prompt based on type and parameters
      const lengthMap = {
        short: "100-200 words",
        medium: "300-500 words", 
        long: "600-1000 words"
      };

      const systemPrompt = `You are VoxCraft's AI Content Generator, specialized in creating high-quality ${type} content optimized for text-to-speech conversion. 

Key requirements:
- Generate ${lengthMap[length]} of content
- Target audience: ${audience}
- Style: ${style}
- Topic: ${topic}
- Optimize for voice delivery (clear, flowing sentences)
${voice_suggestions ? '- Include voice/character suggestions in [VOICE: character_name] tags' : ''}
${emotional_cues ? '- Include emotional direction in [EMOTION: feeling] tags' : ''}
${pronunciation_guides ? '- Include pronunciation guides for difficult words in [PRONOUNCE: word = pronunciation] tags' : ''}

Format the response as JSON with:
- content: The main text content
- metadata: Object with voice_suggestions, emotional_cues, estimated_duration, recommended_voices array
- scenes: Array of scene objects if applicable (for scripts/dialogues)
- tips: Array of voice acting tips for delivery`;

      const userPrompt = `Create a ${type} about "${topic}" in ${style} style for ${audience}. Length: ${length}.

Additional context:
- This will be converted to speech using advanced TTS
- Include natural pauses and breathing points
- Make it engaging and suitable for audio consumption`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        return res.status(response.status).json({ error: `Content generation failed: ${errorText}` });
      }

      const data = await response.json();
      let generatedContent;
      
      try {
        generatedContent = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        // If JSON parsing fails, return the content as plain text with basic metadata
        generatedContent = {
          content: data.choices[0].message.content,
          metadata: {
            estimated_duration: Math.ceil(data.choices[0].message.content.length / 150), // rough estimate
            recommended_voices: ["Aria", "Sarah", "Roger"],
            voice_suggestions: voice_suggestions,
            emotional_cues: emotional_cues
          },
          scenes: [],
          tips: ["Speak clearly and at a moderate pace", "Use natural pauses for punctuation"]
        };
      }

      // Store the generated content in the database
      try {
        await storage.createAudioProject({
          userId,
          title: `AI Generated ${type.charAt(0).toUpperCase() + type.slice(1)} - ${topic}`,
          content: generatedContent.content,
          audioSettings: {
            generation_type: type,
            style,
            length,
            audience,
            voice_suggestions,
            emotional_cues,
            pronunciation_guides,
            metadata: generatedContent.metadata
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      res.json(generatedContent);
    } catch (error) {
      console.error('Error in ai-content-generator:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Audio Scenes routes
  app.get("/api/audio-scenes", async (req, res) => {
    try {
      const { userId, projectId } = req.query;
      
      let scenes;
      if (projectId) {
        scenes = await storage.getAudioScenesByProject(projectId as string);
      } else if (userId) {
        scenes = await storage.getAudioScenesByUser(userId as string);
      } else {
        return res.status(400).json({ error: "userId or projectId required" });
      }
      
      res.json(scenes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audio scenes" });
    }
  });

  app.post("/api/audio-scenes", async (req, res) => {
    try {
      const sceneData = insertAudioSceneSchema.parse(req.body);
      const scene = await storage.createAudioScene(sceneData);
      res.status(201).json(scene);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid scene data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create audio scene" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
