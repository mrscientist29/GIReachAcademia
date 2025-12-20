// Settings synchronization utilities for cross-device access

export interface SyncData {
  logo: any;
  content: Record<string, any>;
  timestamp: number;
}

export class SettingsSync {
  
  // Export all settings to a JSON string
  async exportSettings(): Promise<string> {
    try {
      // Get logo settings
      const logoResponse = await fetch('/api/admin/settings/logo');
      let logoSettings = null;
      if (logoResponse.ok) {
        const logoData = await logoResponse.json();
        logoSettings = logoData.settingValue;
      }

      // Get content settings
      const contentResponse = await fetch('/api/content');
      let contentSettings = {};
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        contentData.forEach((page: any) => {
          contentSettings[page.pageId] = {
            id: page.pageId,
            name: page.pageName,
            sections: page.sections
          };
        });
      }

      const syncData: SyncData = {
        logo: logoSettings,
        content: contentSettings,
        timestamp: Date.now()
      };

      return JSON.stringify(syncData, null, 2);
    } catch (error) {
      console.error('Failed to export settings:', error);
      throw error;
    }
  }

  // Import settings from JSON string
  async importSettings(jsonString: string): Promise<void> {
    try {
      const syncData: SyncData = JSON.parse(jsonString);

      // Import logo settings
      if (syncData.logo) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            settingKey: 'logo',
            settingValue: syncData.logo
          }),
        });
      }

      // Import content settings
      if (syncData.content) {
        for (const [pageId, pageData] of Object.entries(syncData.content)) {
          await fetch('/api/admin/content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pageId: pageId,
              pageName: (pageData as any).name,
              sections: (pageData as any).sections
            }),
          });
        }
      }

      console.log('Settings imported successfully');
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw error;
    }
  }

  // Generate a shareable link (for future implementation)
  generateShareableLink(data: string): string {
    // For now, just return a data URL
    const encoded = btoa(data);
    return `${window.location.origin}/import?data=${encoded}`;
  }

  // Download settings as a file
  downloadSettings(data: string, filename: string = 'gireach-settings.json'): void {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Upload settings from a file
  uploadSettings(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      input.click();
    });
  }
}

export const settingsSync = new SettingsSync();