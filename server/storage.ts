import { 
  users, voiceProfiles, audioProjects, audioScenes, voiceClones, voiceAnalytics, audioProcessingJobs,
  type User, type InsertUser,
  type VoiceProfile, type InsertVoiceProfile,
  type AudioProject, type InsertAudioProject,
  type AudioScene, type InsertAudioScene,
  type VoiceClone, type InsertVoiceClone,
  type VoiceAnalytics, type InsertVoiceAnalytics,
  type AudioProcessingJob, type InsertAudioProcessingJob
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

  // Voice Clone operations (Advanced Feature)
  getVoiceClone(id: string): Promise<VoiceClone | undefined>;
  getVoiceClonesByUser(userId: string): Promise<VoiceClone[]>;
  createVoiceClone(clone: InsertVoiceClone): Promise<VoiceClone>;
  updateVoiceClone(id: string, updates: Partial<VoiceClone>): Promise<VoiceClone | undefined>;
  deleteVoiceClone(id: string): Promise<boolean>;

  // Voice Analytics operations (Advanced Feature)
  createVoiceAnalytics(analytics: InsertVoiceAnalytics): Promise<VoiceAnalytics>;
  getVoiceAnalyticsByUser(userId: string, limit?: number): Promise<VoiceAnalytics[]>;
  getVoiceAnalyticsSummary(userId: string, days?: number): Promise<{
    totalGenerations: number;
    totalDuration: number;
    totalCharacters: number;
    averageQuality: number;
    popularVoices: Array<{ voiceId: string; count: number }>;
  }>;

  // Audio Processing Job operations (Advanced Feature)
  createAudioProcessingJob(job: InsertAudioProcessingJob): Promise<AudioProcessingJob>;
  getAudioProcessingJob(id: string): Promise<AudioProcessingJob | undefined>;
  getAudioProcessingJobsByUser(userId: string): Promise<AudioProcessingJob[]>;
  updateAudioProcessingJob(id: string, updates: Partial<AudioProcessingJob>): Promise<AudioProcessingJob | undefined>;
  getQueuedJobs(limit?: number): Promise<AudioProcessingJob[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private voiceProfiles: Map<string, VoiceProfile>;
  private audioProjects: Map<string, AudioProject>;
  private audioScenes: Map<string, AudioScene>;
  private voiceClones: Map<string, VoiceClone>;
  private voiceAnalytics: Map<string, VoiceAnalytics>;
  private audioProcessingJobs: Map<string, AudioProcessingJob>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.voiceProfiles = new Map();
    this.audioProjects = new Map();
    this.audioScenes = new Map();
    this.voiceClones = new Map();
    this.voiceAnalytics = new Map();
    this.audioProcessingJobs = new Map();
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

  // Voice Clone operations (Advanced Feature)
  async getVoiceClone(id: string): Promise<VoiceClone | undefined> {
    return this.voiceClones.get(id);
  }

  async getVoiceClonesByUser(userId: string): Promise<VoiceClone[]> {
    return Array.from(this.voiceClones.values()).filter(
      (clone) => clone.userId === userId
    );
  }

  async createVoiceClone(clone: InsertVoiceClone): Promise<VoiceClone> {
    const id = crypto.randomUUID();
    const now = new Date();
    const voiceClone: VoiceClone = { 
      ...clone, 
      id, 
      createdAt: now,
      updatedAt: now,
      status: "processing",
      elevenlabsVoiceId: null,
      qualityScore: null,
      trainingMetadata: clone.trainingMetadata ?? {},
      description: clone.description ?? null
    };
    this.voiceClones.set(id, voiceClone);
    return voiceClone;
  }

  async updateVoiceClone(id: string, updates: Partial<VoiceClone>): Promise<VoiceClone | undefined> {
    const clone = this.voiceClones.get(id);
    if (!clone) return undefined;
    
    const updatedClone = { ...clone, ...updates, updatedAt: new Date() };
    this.voiceClones.set(id, updatedClone);
    return updatedClone;
  }

  async deleteVoiceClone(id: string): Promise<boolean> {
    return this.voiceClones.delete(id);
  }

  // Voice Analytics operations (Advanced Feature)
  async createVoiceAnalytics(analytics: InsertVoiceAnalytics): Promise<VoiceAnalytics> {
    const id = crypto.randomUUID();
    const now = new Date();
    const voiceAnalytics: VoiceAnalytics = { 
      ...analytics, 
      id, 
      timestamp: now,
      projectId: analytics.projectId ?? null,
      emotionUsed: analytics.emotionUsed ?? null,
      qualityRating: analytics.qualityRating ?? null,
      processingTime: analytics.processingTime ?? null,
      cost: analytics.cost ?? null
    };
    this.voiceAnalytics.set(id, voiceAnalytics);
    return voiceAnalytics;
  }

  async getVoiceAnalyticsByUser(userId: string, limit = 100): Promise<VoiceAnalytics[]> {
    const analytics = Array.from(this.voiceAnalytics.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return analytics.slice(0, limit);
  }

  async getVoiceAnalyticsSummary(userId: string, days = 30): Promise<{
    totalGenerations: number;
    totalDuration: number;
    totalCharacters: number;
    averageQuality: number;
    popularVoices: Array<{ voiceId: string; count: number }>;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const userAnalytics = Array.from(this.voiceAnalytics.values())
      .filter((a) => a.userId === userId && a.timestamp >= cutoffDate);

    const totalGenerations = userAnalytics.length;
    const totalDuration = userAnalytics.reduce((sum, a) => sum + a.duration, 0);
    const totalCharacters = userAnalytics.reduce((sum, a) => sum + a.characterCount, 0);
    
    const qualityRatings = userAnalytics.filter(a => a.qualityRating != null).map(a => a.qualityRating!);
    const averageQuality = qualityRatings.length > 0 
      ? qualityRatings.reduce((sum, rating) => sum + rating, 0) / qualityRatings.length 
      : 0;

    const voiceCounts = userAnalytics.reduce((acc, a) => {
      acc[a.voiceId] = (acc[a.voiceId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularVoices = Object.entries(voiceCounts)
      .map(([voiceId, count]) => ({ voiceId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalGenerations,
      totalDuration,
      totalCharacters,
      averageQuality,
      popularVoices
    };
  }

  // Audio Processing Job operations (Advanced Feature)
  async createAudioProcessingJob(job: InsertAudioProcessingJob): Promise<AudioProcessingJob> {
    const id = crypto.randomUUID();
    const now = new Date();
    const processingJob: AudioProcessingJob = { 
      ...job, 
      id, 
      createdAt: now,
      updatedAt: now,
      status: "queued",
      progress: 0,
      outputData: {},
      errorMessage: null,
      estimatedDuration: job.estimatedDuration ?? null,
      actualDuration: null,
      priority: job.priority ?? 5
    };
    this.audioProcessingJobs.set(id, processingJob);
    return processingJob;
  }

  async getAudioProcessingJob(id: string): Promise<AudioProcessingJob | undefined> {
    return this.audioProcessingJobs.get(id);
  }

  async getAudioProcessingJobsByUser(userId: string): Promise<AudioProcessingJob[]> {
    return Array.from(this.audioProcessingJobs.values())
      .filter((job) => job.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateAudioProcessingJob(id: string, updates: Partial<AudioProcessingJob>): Promise<AudioProcessingJob | undefined> {
    const job = this.audioProcessingJobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates, updatedAt: new Date() };
    this.audioProcessingJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getQueuedJobs(limit = 10): Promise<AudioProcessingJob[]> {
    return Array.from(this.audioProcessingJobs.values())
      .filter((job) => job.status === "queued")
      .sort((a, b) => b.priority - a.priority || a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
