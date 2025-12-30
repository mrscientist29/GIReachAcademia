// Footer Settings Management Store

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface FooterSettings {
  // Main content
  description: string;
  
  // Social media links
  socialLinks: SocialLink[];
  
  // Quick links
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  
  // Contact information
  contactTitle: string;
  contactInfo: ContactInfo;
  
  // Footer bottom
  copyrightText: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  
  // Styling
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

// Default footer settings
const defaultFooterSettings: FooterSettings = {
  description: "Advancing medical research in Pakistan through collaborative excellence, mentorship, and innovative gastroenterology studies.",
  
  socialLinks: [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/gireach',
      icon: 'Linkedin',
      color: 'from-blue-600 to-blue-700',
      enabled: true
    },
    {
      id: 'twitter',
      name: 'Twitter',
      url: 'https://twitter.com/gireach',
      icon: 'Twitter',
      color: 'from-sky-500 to-sky-600',
      enabled: true
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://facebook.com/gireach',
      icon: 'Facebook',
      color: 'from-blue-700 to-blue-800',
      enabled: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com/gireach',
      icon: 'Instagram',
      color: 'from-pink-500 to-purple-600',
      enabled: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://youtube.com/@gireach',
      icon: 'Youtube',
      color: 'from-red-500 to-red-600',
      enabled: true
    }
  ],
  
  quickLinksTitle: "Quick Links",
  quickLinks: [
    { id: 'home', label: 'Home', url: '/', enabled: true },
    { id: 'about', label: 'About Us', url: '/about', enabled: true },
    { id: 'programs', label: 'Programs', url: '/programs', enabled: true },
    { id: 'publications', label: 'Publications', url: '/publications', enabled: true },
    { id: 'resources', label: 'Resources', url: '/resources', enabled: true },
    { id: 'contact', label: 'Contact', url: '/contact', enabled: true }
  ],
  
  contactTitle: "Contact Info",
  contactInfo: {
    email: "info@gireach.pk",
    phone: "+92 (21) 1234-5678",
    address: "Karachi, Pakistan"
  },
  
  copyrightText: "© 2024 GI REACH. All rights reserved.",
  privacyPolicyUrl: "/privacy",
  termsOfServiceUrl: "/terms",
  
  backgroundColor: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
  textColor: "text-white",
  accentColor: "text-cyan-400"
};

class FooterStore {
  private storageKey = 'gireach-footer';
  private cachedSettings: FooterSettings | null = null;

  // Get footer settings from localStorage with fallback to defaults
  getFooterSettings(): FooterSettings {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const settings = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        this.cachedSettings = { ...defaultFooterSettings, ...settings };
        return this.cachedSettings;
      }
    } catch (error) {
      console.warn('FooterStore: Error reading from localStorage:', error);
    }

    this.cachedSettings = defaultFooterSettings;
    return this.cachedSettings;
  }

  // Get footer settings synchronously (for backward compatibility)
  getFooterSettingsSync(): FooterSettings {
    return this.getFooterSettings();
  }

  // Save footer settings to localStorage and database
  async saveFooterSettings(settings: FooterSettings): Promise<void> {
    try {
      console.log('FooterStore: Saving footer settings...');
      
      // Save to database via global settings store
      const { globalSettingsStore } = await import('./settings-store');
      await globalSettingsStore.saveSetting('footer', settings);
      
      // Update cache
      this.cachedSettings = settings;
      
      // Save to localStorage as backup
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      
      // Dispatch update event
      this.notifyFooterUpdate(settings);
      
      console.log('FooterStore: Footer settings saved successfully');
    } catch (error) {
      console.error('FooterStore: Error saving footer settings:', error);
      throw error;
    }
  }

  // Load footer settings from database
  async loadFooterSettings(): Promise<FooterSettings> {
    try {
      console.log('FooterStore: Loading footer settings from database...');
      
      const { globalSettingsStore } = await import('./settings-store');
      const settings = await globalSettingsStore.getSetting('footer');
      
      if (settings) {
        // Merge with defaults to ensure all properties exist
        const mergedSettings = { ...defaultFooterSettings, ...settings };
        this.cachedSettings = mergedSettings;
        
        // Cache to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(mergedSettings));
        
        console.log('FooterStore: Loaded footer settings from database');
        return mergedSettings;
      } else {
        console.log('FooterStore: No footer settings in database, using defaults');
        return this.getFooterSettings();
      }
    } catch (error) {
      console.warn('FooterStore: Error loading from database, using localStorage/defaults:', error);
      return this.getFooterSettings();
    }
  }

  // Initialize footer store
  async initialize(): Promise<void> {
    try {
      await this.loadFooterSettings();
    } catch (error) {
      console.warn('FooterStore: Initialization failed, using defaults:', error);
      this.cachedSettings = defaultFooterSettings;
    }
  }

  // Clear cache to force reload
  invalidateCache(): void {
    this.cachedSettings = null;
  }

  // Notify components about footer updates
  private notifyFooterUpdate(settings: FooterSettings): void {
    const event = new CustomEvent('footerUpdated', { 
      detail: { settings } 
    });
    window.dispatchEvent(event);
  }

  // Update a single social link
  async updateSocialLink(linkId: string, updates: Partial<SocialLink>): Promise<void> {
    const settings = this.getFooterSettings();
    const linkIndex = settings.socialLinks.findIndex(link => link.id === linkId);
    
    if (linkIndex !== -1) {
      settings.socialLinks[linkIndex] = { ...settings.socialLinks[linkIndex], ...updates };
      await this.saveFooterSettings(settings);
    }
  }

  // Add a new social link
  async addSocialLink(link: Omit<SocialLink, 'id'>): Promise<void> {
    const settings = this.getFooterSettings();
    const newLink: SocialLink = {
      ...link,
      id: `social-${Date.now()}`
    };
    settings.socialLinks.push(newLink);
    await this.saveFooterSettings(settings);
  }

  // Remove a social link
  async removeSocialLink(linkId: string): Promise<void> {
    const settings = this.getFooterSettings();
    settings.socialLinks = settings.socialLinks.filter(link => link.id !== linkId);
    await this.saveFooterSettings(settings);
  }

  // Update a quick link
  async updateQuickLink(linkId: string, updates: Partial<QuickLink>): Promise<void> {
    const settings = this.getFooterSettings();
    const linkIndex = settings.quickLinks.findIndex(link => link.id === linkId);
    
    if (linkIndex !== -1) {
      settings.quickLinks[linkIndex] = { ...settings.quickLinks[linkIndex], ...updates };
      await this.saveFooterSettings(settings);
    }
  }

  // Reset to default settings
  async resetToDefaults(): Promise<void> {
    this.cachedSettings = null;
    localStorage.removeItem(this.storageKey);
    await this.saveFooterSettings(defaultFooterSettings);
  }
}

export const footerStore = new FooterStore();

// Hook for using footer settings in components
export function useFooterSettings() {
  const getSettings = () => footerStore.getFooterSettingsSync();
  const getSettingsAsync = () => footerStore.loadFooterSettings();
  const saveSettings = (settings: FooterSettings) => footerStore.saveFooterSettings(settings);
  const updateSocialLink = (linkId: string, updates: Partial<SocialLink>) => 
    footerStore.updateSocialLink(linkId, updates);
  const addSocialLink = (link: Omit<SocialLink, 'id'>) => footerStore.addSocialLink(link);
  const removeSocialLink = (linkId: string) => footerStore.removeSocialLink(linkId);
  
  return { 
    getSettings, 
    getSettingsAsync, 
    saveSettings, 
    updateSocialLink, 
    addSocialLink, 
    removeSocialLink 
  };
}