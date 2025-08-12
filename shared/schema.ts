import { pgTable, text, serial, uuid, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVoiceProfile = z.infer<typeof insertVoiceProfileSchema>;
export type VoiceProfile = typeof voiceProfiles.$inferSelect;

export type InsertAudioProject = z.infer<typeof insertAudioProjectSchema>;
export type AudioProject = typeof audioProjects.$inferSelect;

export type InsertAudioScene = z.infer<typeof insertAudioSceneSchema>;
export type AudioScene = typeof audioScenes.$inferSelect;
