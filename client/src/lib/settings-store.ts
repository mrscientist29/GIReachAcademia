// Global Website Settings Management System
// This ensures all settings are loaded from database and consistent across devices

export interface WebsiteSettings {
  logo?: any;
  theme?: any;
  navigation?: any;
  footer?: any;
  [key: string]: any;
}

class GlobalSettingsStore {
  private cache: Map<string, any> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  // Initialize all settings from database
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log('GlobalSettingsStore: Initializing settings from database...');
      
      const response = await fetch('/api/admin/settings', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const allSettings = await response.json();
        console.log('GlobalSettingsStore: Loaded settings from database:', allSettings);
        
        // Cache all settings
        allSettings.forEach((setting: any) => {
          this.cache.set(setting.settingKey, setting.settingValue);
        });
        
        this.isInitialized = true;
        console.log('GlobalSettingsStore: Initialization complete');
        
        // Notify components that settings are ready
        this.notifyInitialized();
      } else {
        console.warn('GlobalSettingsStore: Failed to load settings:', response.status);
        // Initialize with empty cache - components will use defaults
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('GlobalSettingsStore: Error initializing settings:', error);
      // Initialize with empty cache - components will use defaults
      this.isInitialized = true;
    }
  }

  // Get a specific setting
  async getSetting(key: string): Promise<any> {
    await this.initialize();
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // If not in cache, try to fetch from database
    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.cache.set(key, data.settingValue);
        return data.settingValue;
      }
    } catch (error) {
      console.warn(`GlobalSettingsStore: Error fetching setting ${key}:`, error);
    }

    return null;
  }

  // Save a setting to database and update cache
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      console.log(`GlobalSettingsStore: Saving setting ${key}:`, value);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settingKey: key,
          settingValue: value
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save setting: ${response.status} ${errorText}`);
      }

      // Update cache
      this.cache.set(key, value);
      
      console.log(`GlobalSettingsStore: Successfully saved setting ${key}`);
      
      // Notify components about the update
      this.notifySettingUpdate(key, value);
      
    } catch (error) {
      console.error(`GlobalSettingsStore: Error saving setting ${key}:`, error);
      throw error;
    }
  }

  // Get all settings
  async getAllSettings(): Promise<WebsiteSettings> {
    await this.initialize();
    
    const settings: WebsiteSettings = {};
    this.cache.forEach((value, key) => {
      settings[key] = value;
    });
    
    return settings;
  }

  // Check if settings are initialized
  isReady(): boolean {
    return this.isInitialized;
  }

  // Clear cache and reinitialize
  async refresh(): Promise<void> {
    this.cache.clear();
    this.isInitialized = false;
    this.initPromise = null;
    await this.initialize();
  }

  // Notify components about setting updates
  private notifySettingUpdate(key: string, value: any): void {
    // Dispatch specific setting update event
    const event = new CustomEvent('settingUpdated', { 
      detail: { key, value } 
    });
    window.dispatchEvent(event);

    // Dispatch global settings update event
    setTimeout(() => {
      const globalEvent = new CustomEvent('globalSettingsUpdate', { 
        detail: { type: key, settings: value } 
      });
      window.dispatchEvent(globalEvent);
    }, 100);
  }

  // Notify components that settings are initialized
  private notifyInitialized(): void {
    const event = new CustomEvent('settingsInitialized', { 
      detail: { settings: Object.fromEntries(this.cache) } 
    });
    window.dispatchEvent(event);
  }
}

// Create singleton instance
export const globalSettingsStore = new GlobalSettingsStore();

// Hook for React components
export function useGlobalSettings() {
  return {
    getSetting: (key: string) => globalSettingsStore.getSetting(key),
    saveSetting: (key: string, value: any) => globalSettingsStore.saveSetting(key, value),
    getAllSettings: () => globalSettingsStore.getAllSettings(),
    refresh: () => globalSettingsStore.refresh(),
    isReady: () => globalSettingsStore.isReady(),
  };
}

// Initialize settings when the module loads
if (typeof window !== 'undefined') {
  // Initialize on page load
  globalSettingsStore.initialize().catch(console.error);
  
  // Re-initialize when page becomes visible (mobile app switching)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('GlobalSettingsStore: Page became visible, refreshing settings...');
      globalSettingsStore.refresh().catch(console.error);
    }
  });
  
  // Re-initialize on window focus
  window.addEventListener('focus', () => {
    console.log('GlobalSettingsStore: Window focused, refreshing settings...');
    globalSettingsStore.refresh().catch(console.error);
  });
}