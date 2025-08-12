import { 
  users, voiceProfiles, audioProjects, audioScenes,
  type User, type InsertUser,
  type VoiceProfile, type InsertVoiceProfile,
  type AudioProject, type InsertAudioProject,
  type AudioScene, type InsertAudioScene
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Voice Profile operations
  getVoiceProfile(id: string): Promise<VoiceProfile | undefined>;
  getVoiceProfilesByUser(userId: string): Promise<VoiceProfile[]>;
  getPublicVoiceProfiles(): Promise<VoiceProfile[]>;
  createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile>;
  updateVoiceProfile(id: string, updates: Partial<VoiceProfile>): Promise<VoiceProfile | undefined>;
  deleteVoiceProfile(id: string): Promise<boolean>;
  
  // Audio Project operations
  getAudioProject(id: string): Promise<AudioProject | undefined>;
  getAudioProjectsByUser(userId: string): Promise<AudioProject[]>;
  createAudioProject(project: InsertAudioProject): Promise<AudioProject>;
  updateAudioProject(id: string, updates: Partial<AudioProject>): Promise<AudioProject | undefined>;
  deleteAudioProject(id: string): Promise<boolean>;
  
  // Audio Scene operations
  getAudioScene(id: string): Promise<AudioScene | undefined>;
  getAudioScenesByProject(projectId: string): Promise<AudioScene[]>;
  getAudioScenesByUser(userId: string): Promise<AudioScene[]>;
  createAudioScene(scene: InsertAudioScene): Promise<AudioScene>;
  updateAudioScene(id: string, updates: Partial<AudioScene>): Promise<AudioScene | undefined>;
  deleteAudioScene(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private voiceProfiles: Map<string, VoiceProfile>;
  private audioProjects: Map<string, AudioProject>;
  private audioScenes: Map<string, AudioScene>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.voiceProfiles = new Map();
    this.audioProjects = new Map();
    this.audioScenes = new Map();
    this.currentUserId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Voice Profile operations
  async getVoiceProfile(id: string): Promise<VoiceProfile | undefined> {
    return this.voiceProfiles.get(id);
  }

  async getVoiceProfilesByUser(userId: string): Promise<VoiceProfile[]> {
    return Array.from(this.voiceProfiles.values()).filter(
      (profile) => profile.userId === userId
    );
  }

  async getPublicVoiceProfiles(): Promise<VoiceProfile[]> {
    return Array.from(this.voiceProfiles.values()).filter(
      (profile) => profile.isPublic
    );
  }

  async createVoiceProfile(insertProfile: InsertVoiceProfile): Promise<VoiceProfile> {
    const id = crypto.randomUUID();
    const now = new Date();
    const profile: VoiceProfile = { 
      ...insertProfile, 
      id, 
      createdAt: now,
      updatedAt: now,
      isPublic: insertProfile.isPublic ?? false,
      isCustom: insertProfile.isCustom ?? false,
      description: insertProfile.description ?? null,
      voiceSettings: insertProfile.voiceSettings ?? {}
    };
    this.voiceProfiles.set(id, profile);
    return profile;
  }

  async updateVoiceProfile(id: string, updates: Partial<VoiceProfile>): Promise<VoiceProfile | undefined> {
    const existing = this.voiceProfiles.get(id);
    if (!existing) return undefined;
    
    const updated: VoiceProfile = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.voiceProfiles.set(id, updated);
    return updated;
  }

  async deleteVoiceProfile(id: string): Promise<boolean> {
    return this.voiceProfiles.delete(id);
  }

  // Audio Project operations
  async getAudioProject(id: string): Promise<AudioProject | undefined> {
    return this.audioProjects.get(id);
  }

  async getAudioProjectsByUser(userId: string): Promise<AudioProject[]> {
    return Array.from(this.audioProjects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async createAudioProject(insertProject: InsertAudioProject): Promise<AudioProject> {
    const id = crypto.randomUUID();
    const now = new Date();
    const project: AudioProject = { 
      ...insertProject, 
      id, 
      createdAt: now,
      updatedAt: now,
      voiceProfileId: insertProject.voiceProfileId ?? null,
      audioSettings: insertProject.audioSettings ?? {},
      audioUrl: insertProject.audioUrl ?? null
    };
    this.audioProjects.set(id, project);
    return project;
  }

  async updateAudioProject(id: string, updates: Partial<AudioProject>): Promise<AudioProject | undefined> {
    const existing = this.audioProjects.get(id);
    if (!existing) return undefined;
    
    const updated: AudioProject = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.audioProjects.set(id, updated);
    return updated;
  }

  async deleteAudioProject(id: string): Promise<boolean> {
    return this.audioProjects.delete(id);
  }

  // Audio Scene operations
  async getAudioScene(id: string): Promise<AudioScene | undefined> {
    return this.audioScenes.get(id);
  }

  async getAudioScenesByProject(projectId: string): Promise<AudioScene[]> {
    return Array.from(this.audioScenes.values()).filter(
      (scene) => scene.projectId === projectId
    );
  }

  async getAudioScenesByUser(userId: string): Promise<AudioScene[]> {
    return Array.from(this.audioScenes.values()).filter(
      (scene) => scene.userId === userId
    );
  }

  async createAudioScene(insertScene: InsertAudioScene): Promise<AudioScene> {
    const id = crypto.randomUUID();
    const now = new Date();
    const scene: AudioScene = { 
      ...insertScene, 
      id, 
      createdAt: now,
      updatedAt: now,
      projectId: insertScene.projectId ?? null,
      spatialConfig: insertScene.spatialConfig ?? {},
      ambientSounds: insertScene.ambientSounds ?? []
    };
    this.audioScenes.set(id, scene);
    return scene;
  }

  async updateAudioScene(id: string, updates: Partial<AudioScene>): Promise<AudioScene | undefined> {
    const existing = this.audioScenes.get(id);
    if (!existing) return undefined;
    
    const updated: AudioScene = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.audioScenes.set(id, updated);
    return updated;
  }

  async deleteAudioScene(id: string): Promise<boolean> {
    return this.audioScenes.delete(id);
  }
}

export const storage = new MemStorage();
