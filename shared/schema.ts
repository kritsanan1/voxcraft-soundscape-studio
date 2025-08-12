import { pgTable, text, serial, uuid, boolean, timestamp, jsonb, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  voiceId: text("voice_id").notNull(), // ElevenLabs voice ID
  description: text("description"),
  isCustom: boolean("is_custom").default(false),
  isPublic: boolean("is_public").default(false),
  voiceSettings: jsonb("voice_settings").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const audioProjects = pgTable("audio_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(), // The text to be converted
  voiceProfileId: uuid("voice_profile_id"),
  audioSettings: jsonb("audio_settings").default({}),
  audioUrl: text("audio_url"), // URL to generated audio file
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const audioScenes = pgTable("audio_scenes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id"),
  sceneName: text("scene_name").notNull(),
  spatialConfig: jsonb("spatial_config").default({}),
  ambientSounds: jsonb("ambient_sounds").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Voice Cloning table for custom voice creation
export const voiceClones = pgTable("voice_clones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  audioSampleUrl: text("audio_sample_url").notNull(),
  status: text("status").notNull().default("processing"),
  elevenlabsVoiceId: text("elevenlabs_voice_id"),
  trainingMetadata: jsonb("training_metadata").default({}),
  qualityScore: real("quality_score"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Voice Analytics table for tracking usage and performance
export const voiceAnalytics = pgTable("voice_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  voiceId: text("voice_id").notNull(),
  projectId: uuid("project_id"),
  generationType: text("generation_type").notNull(),
  duration: integer("duration").notNull(),
  characterCount: integer("character_count").notNull(),
  emotionUsed: text("emotion_used"),
  qualityRating: integer("quality_rating"),
  processingTime: real("processing_time"),
  cost: real("cost"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
});

// Advanced Audio Processing table for complex operations
export const audioProcessingJobs = pgTable("audio_processing_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  jobType: text("job_type").notNull(),
  inputData: jsonb("input_data").notNull(),
  outputData: jsonb("output_data").default({}),
  status: text("status").notNull().default("queued"),
  progress: integer("progress").default(0),
  errorMessage: text("error_message"),
  estimatedDuration: integer("estimated_duration"),
  actualDuration: integer("actual_duration"),
  priority: integer("priority").default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVoiceProfileSchema = createInsertSchema(voiceProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAudioProjectSchema = createInsertSchema(audioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAudioSceneSchema = createInsertSchema(audioScenes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoiceCloneSchema = createInsertSchema(voiceClones).pick({
  userId: true,
  name: true,
  description: true,
  audioSampleUrl: true,
  trainingMetadata: true,
});

export const insertVoiceAnalyticsSchema = createInsertSchema(voiceAnalytics).pick({
  userId: true,
  voiceId: true,
  projectId: true,
  generationType: true,
  duration: true,
  characterCount: true,
  emotionUsed: true,
  qualityRating: true,
  processingTime: true,
  cost: true,
});

export const insertAudioProcessingJobSchema = createInsertSchema(audioProcessingJobs).pick({
  userId: true,
  jobType: true,
  inputData: true,
  estimatedDuration: true,
  priority: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVoiceProfile = z.infer<typeof insertVoiceProfileSchema>;
export type VoiceProfile = typeof voiceProfiles.$inferSelect;

export type InsertAudioProject = z.infer<typeof insertAudioProjectSchema>;
export type AudioProject = typeof audioProjects.$inferSelect;

export type InsertAudioScene = z.infer<typeof insertAudioSceneSchema>;
export type AudioScene = typeof audioScenes.$inferSelect;

export type InsertVoiceClone = z.infer<typeof insertVoiceCloneSchema>;
export type VoiceClone = typeof voiceClones.$inferSelect;

export type InsertVoiceAnalytics = z.infer<typeof insertVoiceAnalyticsSchema>;
export type VoiceAnalytics = typeof voiceAnalytics.$inferSelect;

export type InsertAudioProcessingJob = z.infer<typeof insertAudioProcessingJobSchema>;
export type AudioProcessingJob = typeof audioProcessingJobs.$inferSelect;
