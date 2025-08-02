import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  voiceId: text("voice_id").notNull(),
  description: text("description"),
  isCustom: boolean("is_custom").default(false),
  isPublic: boolean("is_public").default(false),
  voiceSettings: jsonb("voice_settings").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const audioProjects = pgTable("audio_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  voiceProfileId: uuid("voice_profile_id").references(() => voiceProfiles.id, { onDelete: "set null" }),
  audioSettings: jsonb("audio_settings").default({}),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const audioScenes = pgTable("audio_scenes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => audioProjects.id, { onDelete: "cascade" }),
  sceneName: text("scene_name").notNull(),
  spatialConfig: jsonb("spatial_config").default({}),
  ambientSounds: jsonb("ambient_sounds").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Voice Profile schemas
export const insertVoiceProfileSchema = createInsertSchema(voiceProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVoiceProfile = z.infer<typeof insertVoiceProfileSchema>;
export type VoiceProfile = typeof voiceProfiles.$inferSelect;

// Audio Project schemas
export const insertAudioProjectSchema = createInsertSchema(audioProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAudioProject = z.infer<typeof insertAudioProjectSchema>;
export type AudioProject = typeof audioProjects.$inferSelect;

// Audio Scene schemas
export const insertAudioSceneSchema = createInsertSchema(audioScenes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAudioScene = z.infer<typeof insertAudioSceneSchema>;
export type AudioScene = typeof audioScenes.$inferSelect;
