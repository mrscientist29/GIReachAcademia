import { promises as fs } from 'fs';
import { join } from 'path';
import type { WebsiteSettings, InsertWebsiteSettings, PageContent, InsertPageContent, User, InsertUser, MediaLibrary, InsertMediaLibrary } from '@shared/schema';

const STORAGE_DIR = join(process.cwd(), 'data');
const SETTINGS_FILE = join(STORAGE_DIR, 'website-settings.json');
const CONTENT_FILE = join(STORAGE_DIR, 'page-contents.json');
const USERS_FILE = join(STORAGE_DIR, 'users.json');
const MEDIA_FILE = join(STORAGE_DIR, 'media-library.json');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// File-based storage for settings when database is not available
export class FileStorage {
  private settingsCache: Map<string, WebsiteSettings> = new Map();
  private contentCache: Map<string, PageContent> = new Map();
  private usersCache: Map<string, User> = new Map();
  private usersByEmail: Map<string, User> = new Map();
  private mediaCache: Map<string, MediaLibrary> = new Map();
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    await ensureStorageDir();
    await this.loadSettings();
    await this.loadContent();
    await this.loadUsers();
    await this.loadMedia();
    this.initialized = true;
  }

  private async loadSettings() {
    try {
      const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
      const settings: WebsiteSettings[] = JSON.parse(data);
      for (const setting of settings) {
        this.settingsCache.set(setting.settingKey, setting);
      }
    } catch (error) {
      // File doesn't exist yet, that's okay
      console.log('No existing settings file found, starting fresh');
    }
  }

  private async loadContent() {
    try {
      const data = await fs.readFile(CONTENT_FILE, 'utf-8');
      const contents: PageContent[] = JSON.parse(data);
      for (const content of contents) {
        this.contentCache.set(content.pageId, content);
      }
    } catch (error) {
      // File doesn't exist yet, that's okay
      console.log('No existing content file found, starting fresh');
    }
  }

  private async loadUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const users: User[] = JSON.parse(data);
      for (const user of users) {
        this.usersCache.set(user.id, user);
        this.usersByEmail.set(user.email, user);
      }
      console.log(`Loaded ${users.length} users from file storage`);
    } catch (error) {
      // File doesn't exist yet, that's okay
      console.log('No existing users file found, starting fresh');
    }
  }

  private async loadMedia() {
    try {
      const data = await fs.readFile(MEDIA_FILE, 'utf-8');
      const mediaItems: MediaLibrary[] = JSON.parse(data);
      for (const media of mediaItems) {
        this.mediaCache.set(media.id, media);
      }
      console.log(`Loaded ${mediaItems.length} media items from file storage`);
    } catch (error) {
      // File doesn't exist yet, that's okay
      console.log('No existing media file found, starting fresh');
    }
  }

  private async saveSettings() {
    const settings = Array.from(this.settingsCache.values());
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  }

  private async saveContent() {
    const contents = Array.from(this.contentCache.values());
    await fs.writeFile(CONTENT_FILE, JSON.stringify(contents, null, 2));
  }

  private async saveUsers() {
    const users = Array.from(this.usersCache.values());
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  private async saveMedia() {
    const mediaItems = Array.from(this.mediaCache.values());
    await fs.writeFile(MEDIA_FILE, JSON.stringify(mediaItems, null, 2));
  }

  // Website settings operations
  async getWebsiteSettings(settingKey: string): Promise<WebsiteSettings | undefined> {
    await this.init();
    return this.settingsCache.get(settingKey);
  }

  async getAllWebsiteSettings(): Promise<WebsiteSettings[]> {
    await this.init();
    return Array.from(this.settingsCache.values());
  }

  async saveWebsiteSettings(settingsData: InsertWebsiteSettings): Promise<WebsiteSettings> {
    await this.init();
    
    const settings: WebsiteSettings = {
      id: `file-${Date.now()}`,
      settingKey: settingsData.settingKey,
      settingValue: settingsData.settingValue,
      isActive: true,
      updatedById: settingsData.updatedById || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.settingsCache.set(settings.settingKey, settings);
    await this.saveSettings();
    return settings;
  }

  async updateWebsiteSettings(settingKey: string, settingValue: any, updatedById?: string): Promise<WebsiteSettings | undefined> {
    await this.init();
    
    const existing = this.settingsCache.get(settingKey);
    if (!existing) return undefined;

    const updated: WebsiteSettings = {
      ...existing,
      settingValue,
      updatedById: updatedById || null,
      updatedAt: new Date(),
    };

    this.settingsCache.set(settingKey, updated);
    await this.saveSettings();
    return updated;
  }

  // Page content operations
  async getPageContent(pageId: string): Promise<PageContent | undefined> {
    await this.init();
    return this.contentCache.get(pageId);
  }

  async getAllPageContents(): Promise<PageContent[]> {
    await this.init();
    return Array.from(this.contentCache.values());
  }

  async savePageContent(contentData: InsertPageContent): Promise<PageContent> {
    await this.init();
    
    const content: PageContent = {
      id: `file-${Date.now()}`,
      pageId: contentData.pageId,
      pageName: contentData.pageName,
      sections: contentData.sections,
      isPublished: true,
      updatedById: contentData.updatedById || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.contentCache.set(content.pageId, content);
    await this.saveContent();
    return content;
  }

  async updatePageContent(pageId: string, updates: Partial<InsertPageContent>): Promise<PageContent | undefined> {
    await this.init();
    
    const existing = this.contentCache.get(pageId);
    if (!existing) return undefined;

    const updated: PageContent = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.contentCache.set(pageId, updated);
    await this.saveContent();
    return updated;
  }

  async deletePageContent(pageId: string): Promise<boolean> {
    await this.init();
    
    const deleted = this.contentCache.delete(pageId);
    if (deleted) {
      await this.saveContent();
    }
    return deleted;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    await this.init();
    return this.usersCache.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.init();
    return this.usersByEmail.get(email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    await this.init();
    
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'mentee',
      institution: userData.institution || null,
      yearOfStudy: userData.yearOfStudy || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.usersCache.set(user.id, user);
    this.usersByEmail.set(user.email, user);
    await this.saveUsers();
    
    console.log(`Created user: ${user.email} with ID: ${user.id}`);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    await this.init();
    
    const existing = this.usersCache.get(id);
    if (!existing) return undefined;

    // If email is being updated, update the email index
    if (updates.email && updates.email !== existing.email) {
      this.usersByEmail.delete(existing.email);
      this.usersByEmail.set(updates.email, existing);
    }

    const updated: User = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.usersCache.set(id, updated);
    if (updated.email !== existing.email) {
      this.usersByEmail.set(updated.email, updated);
    }
    
    await this.saveUsers();
    return updated;
  }

  // Media library operations
  async getMediaLibrary(): Promise<MediaLibrary[]> {
    await this.init();
    const mediaItems = Array.from(this.mediaCache.values());
    return mediaItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMediaItem(id: string): Promise<MediaLibrary | undefined> {
    await this.init();
    return this.mediaCache.get(id);
  }

  async uploadMedia(mediaData: InsertMediaLibrary): Promise<MediaLibrary> {
    await this.init();
    
    const media: MediaLibrary = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      ...mediaData,
      createdAt: new Date(),
    };

    this.mediaCache.set(media.id, media);
    await this.saveMedia();
    
    console.log(`Uploaded media: ${media.originalName} with ID: ${media.id}`);
    return media;
  }

  async updateMediaItem(id: string, updates: Partial<InsertMediaLibrary>): Promise<MediaLibrary | undefined> {
    await this.init();
    
    const existing = this.mediaCache.get(id);
    if (!existing) return undefined;

    const updated: MediaLibrary = {
      ...existing,
      ...updates,
    };

    this.mediaCache.set(id, updated);
    await this.saveMedia();
    return updated;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    await this.init();
    
    const deleted = this.mediaCache.delete(id);
    if (deleted) {
      await this.saveMedia();
    }
    return deleted;
  }
}

export const fileStorage = new FileStorage();