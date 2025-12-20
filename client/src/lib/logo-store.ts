// Logo Management System

export interface LogoSettings {
  type: 'icon' | 'image' | 'text';
  // For icon type
  iconName?: string;
  iconColor?: string;
  iconBackground?: string;
  // For image type
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  // For text type
  primaryText: string;
  secondaryText?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
  fontSize?: string;
  fontWeight?: string;
  // Common settings
  borderRadius?: string;
  showSecondaryText?: boolean;
}

// Default logo settings
const defaultLogoSettings: LogoSettings = {
  type: 'icon',
  iconName: 'Stethoscope',
  iconColor: 'text-white',
  iconBackground: 'bg-blue-600',
  primaryText: 'GI REACH',
  secondaryText: 'Academic Excellence',
  primaryTextColor: 'text-gray-900',
  secondaryTextColor: 'text-gray-600',
  fontSize: 'text-2xl',
  fontWeight: 'font-bold',
  borderRadius: 'rounded-xl',
  showSecondaryText: true,
  imageWidth: 48,
  imageHeight: 48
};

// Logo store using database-first approach
class LogoStore {
  private storageKey = 'gireach-logo';
  private cachedSettings: LogoSettings | null = null;
  private isInitialized = false;

  async getLogoSettings(): Promise<LogoSettings> {
    console.log('LogoStore: Fetching logo settings from database...');
    try {
      // Always try database first for consistency across devices
      const response = await fetch('/api/admin/settings/logo', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('LogoStore: API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('LogoStore: API response data:', data);
        const settings = { ...defaultLogoSettings, ...data.settingValue };
        this.cachedSettings = settings;
        this.isInitialized = true;
        
        // Update localStorage as cache only
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(settings));
          console.log('LogoStore: Settings cached to localStorage');
        } catch (storageError) {
          console.warn('LogoStore: Failed to cache to localStorage:', storageError);
        }
        return settings;
      } else if (response.status === 404) {
        // Settings not found in database, initialize with defaults
        console.log('LogoStore: Settings not found in database, initializing with defaults');
        await this.initializeDefaultSettings();
        return defaultLogoSettings;
      } else {
        console.warn('LogoStore: API returned status:', response.status);
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (error) {
      console.warn('LogoStore: Failed to fetch from database:', error);
      
      // Only use localStorage as temporary fallback while offline
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const settings = { ...defaultLogoSettings, ...JSON.parse(stored) };
          console.log('LogoStore: Using cached settings (offline mode)');
          return settings;
        }
      } catch (storageError) {
        console.error('LogoStore: Error reading localStorage:', storageError);
      }
      
      // Final fallback to defaults
      console.log('LogoStore: Using default settings (fallback)');
      return defaultLogoSettings;
    }
  }

  // Initialize default settings in database if they don't exist
  private async initializeDefaultSettings(): Promise<void> {
    try {
      console.log('LogoStore: Initializing default settings in database...');
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settingKey: 'logo',
          settingValue: defaultLogoSettings
        }),
      });

      if (response.ok) {
        console.log('LogoStore: Default settings initialized in database');
        this.cachedSettings = defaultLogoSettings;
        this.isInitialized = true;
      } else {
        console.warn('LogoStore: Failed to initialize default settings:', response.status);
      }
    } catch (error) {
      console.error('LogoStore: Error initializing default settings:', error);
    }
  }

  // Synchronous version for backward compatibility
  getLogoSettingsSync(): LogoSettings {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? { ...defaultLogoSettings, ...JSON.parse(stored) } : defaultLogoSettings;
    } catch (error) {
      console.error('Error loading logo settings:', error);
      return defaultLogoSettings;
    }
  }

  async saveLogoSettings(settings: LogoSettings): Promise<void> {
    try {
      console.log('LogoStore: Saving logo settings to database:', settings);
      
      // Save to database (primary storage)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settingKey: 'logo',
          settingValue: settings
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save to database: ${response.status} ${errorText}`);
      }

      console.log('LogoStore: Successfully saved to database');

      // Update cache
      this.cachedSettings = settings;
      this.isInitialized = true;
      
      // Update localStorage as cache
      const settingsJson = JSON.stringify(settings);
      try {
        localStorage.setItem(this.storageKey, settingsJson);
        console.log('LogoStore: Settings cached to localStorage');
      } catch (storageError) {
        console.warn('LogoStore: Failed to cache to localStorage:', storageError);
      }
      
      // Notify all components about the update
      this.notifySettingsUpdate(settings);
      
    } catch (error) {
      console.error('LogoStore: Error saving logo settings to database:', error);
      throw error;
    }
  }

  // Notify all components about settings updates
  private notifySettingsUpdate(settings: LogoSettings): void {
    const settingsJson = JSON.stringify(settings);
    
    // Dispatch custom event for immediate updates
    const event = new CustomEvent('logoUpdated', { detail: settings });
    console.log('LogoStore: Dispatching logoUpdated event');
    window.dispatchEvent(event);
    
    // Dispatch storage event for cross-tab updates
    setTimeout(() => {
      const storageEvent = new StorageEvent('storage', {
        key: this.storageKey,
        newValue: settingsJson,
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href
      });
      console.log('LogoStore: Dispatching storage event');
      window.dispatchEvent(storageEvent);
    }, 100);

    // Dispatch a global settings update event
    setTimeout(() => {
      const globalEvent = new CustomEvent('globalSettingsUpdate', { 
        detail: { type: 'logo', settings } 
      });
      window.dispatchEvent(globalEvent);
    }, 200);
  }

  async resetToDefault(): Promise<void> {
    await this.saveLogoSettings(defaultLogoSettings);
  }
}

export const logoStore = new LogoStore();

// Store the original async method before overriding
const originalSaveLogoSettings = logoStore.saveLogoSettings.bind(logoStore);

// Backward compatibility - expose synchronous methods
(logoStore as any).getLogoSettings = logoStore.getLogoSettingsSync.bind(logoStore);
(logoStore as any).saveLogoSettings = (settings: LogoSettings) => {
  // Call the original async method but don't require await for backward compatibility
  originalSaveLogoSettings(settings).catch(console.error);
};

// Hook for using logo settings in components
export function useLogoSettings() {
  const getSettings = () => logoStore.getLogoSettingsSync();
  const getSettingsAsync = () => logoStore.getLogoSettings();
  const saveSettings = (settings: LogoSettings) => logoStore.saveLogoSettings(settings);
  const resetSettings = () => logoStore.resetToDefault();
  
  return { getSettings, getSettingsAsync, saveSettings, resetSettings };
}