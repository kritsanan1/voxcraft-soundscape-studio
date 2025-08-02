import { 
  users, 
  voiceProfiles, 
  audioProjects, 
  audioScenes,
  type User, 
  type InsertUser,
  type VoiceProfile,
  type InsertVoiceProfile,
  type AudioProject,
  type InsertAudioProject,
  type AudioScene,
  type InsertAudioScene
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Voice Profile methods
  getVoiceProfile(id: string): Promise<VoiceProfile | undefined>;
  getVoiceProfilesByUser(userId: number): Promise<VoiceProfile[]>;
  getPublicVoiceProfiles(): Promise<VoiceProfile[]>;
  createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile>;
  updateVoiceProfile(id: string, profile: Partial<InsertVoiceProfile>): Promise<VoiceProfile | undefined>;
  deleteVoiceProfile(id: string): Promise<boolean>;
  
  // Audio Project methods
  getAudioProject(id: string): Promise<AudioProject | undefined>;
  getAudioProjectsByUser(userId: number): Promise<AudioProject[]>;
  createAudioProject(project: InsertAudioProject): Promise<AudioProject>;
  updateAudioProject(id: string, project: Partial<InsertAudioProject>): Promise<AudioProject | undefined>;
  deleteAudioProject(id: string): Promise<boolean>;
  
  // Audio Scene methods
  getAudioScene(id: string): Promise<AudioScene | undefined>;
  getAudioScenesByUser(userId: number): Promise<AudioScene[]>;
  getAudioScenesByProject(projectId: string): Promise<AudioScene[]>;
  createAudioScene(scene: InsertAudioScene): Promise<AudioScene>;
  updateAudioScene(id: string, scene: Partial<InsertAudioScene>): Promise<AudioScene | undefined>;
  deleteAudioScene(id: string): Promise<boolean>;
}

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Voice Profile methods
  async getVoiceProfile(id: string): Promise<VoiceProfile | undefined> {
    const result = await db.select().from(voiceProfiles).where(eq(voiceProfiles.id, id)).limit(1);
    return result[0];
  }

  async getVoiceProfilesByUser(userId: number): Promise<VoiceProfile[]> {
    return await db.select().from(voiceProfiles).where(eq(voiceProfiles.userId, userId));
  }

  async getPublicVoiceProfiles(): Promise<VoiceProfile[]> {
    return await db.select().from(voiceProfiles).where(eq(voiceProfiles.isPublic, true));
  }

  async createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile> {
    const result = await db.insert(voiceProfiles).values(profile).returning();
    return result[0];
  }

  async updateVoiceProfile(id: string, profile: Partial<InsertVoiceProfile>): Promise<VoiceProfile | undefined> {
    const result = await db.update(voiceProfiles).set(profile).where(eq(voiceProfiles.id, id)).returning();
    return result[0];
  }

  async deleteVoiceProfile(id: string): Promise<boolean> {
    const result = await db.delete(voiceProfiles).where(eq(voiceProfiles.id, id));
    return result.rowCount > 0;
  }

  // Audio Project methods
  async getAudioProject(id: string): Promise<AudioProject | undefined> {
    const result = await db.select().from(audioProjects).where(eq(audioProjects.id, id)).limit(1);
    return result[0];
  }

  async getAudioProjectsByUser(userId: number): Promise<AudioProject[]> {
    return await db.select().from(audioProjects).where(eq(audioProjects.userId, userId));
  }

  async createAudioProject(project: InsertAudioProject): Promise<AudioProject> {
    const result = await db.insert(audioProjects).values(project).returning();
    return result[0];
  }

  async updateAudioProject(id: string, project: Partial<InsertAudioProject>): Promise<AudioProject | undefined> {
    const result = await db.update(audioProjects).set(project).where(eq(audioProjects.id, id)).returning();
    return result[0];
  }

  async deleteAudioProject(id: string): Promise<boolean> {
    const result = await db.delete(audioProjects).where(eq(audioProjects.id, id));
    return result.rowCount > 0;
  }

  // Audio Scene methods
  async getAudioScene(id: string): Promise<AudioScene | undefined> {
    const result = await db.select().from(audioScenes).where(eq(audioScenes.id, id)).limit(1);
    return result[0];
  }

  async getAudioScenesByUser(userId: number): Promise<AudioScene[]> {
    return await db.select().from(audioScenes).where(eq(audioScenes.userId, userId));
  }

  async getAudioScenesByProject(projectId: string): Promise<AudioScene[]> {
    return await db.select().from(audioScenes).where(eq(audioScenes.projectId, projectId));
  }

  async createAudioScene(scene: InsertAudioScene): Promise<AudioScene> {
    const result = await db.insert(audioScenes).values(scene).returning();
    return result[0];
  }

  async updateAudioScene(id: string, scene: Partial<InsertAudioScene>): Promise<AudioScene | undefined> {
    const result = await db.update(audioScenes).set(scene).where(eq(audioScenes.id, id)).returning();
    return result[0];
  }

  async deleteAudioScene(id: string): Promise<boolean> {
    const result = await db.delete(audioScenes).where(eq(audioScenes.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
