// Theme Management System for dynamic theme application

export interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  layout: {
    containerWidth: string;
    borderRadius: string;
    spacing: string;
    shadowIntensity: string;
  };
  darkMode: boolean;
}

// GI REACH Logo-inspired theme with Deep Navy Blue background
const gireachTheme: ThemeSettings = {
  colors: {
    primary: "#06b6d4", // Bright cyan for primary elements (good contrast on dark)
    secondary: "#1e40af", // Slightly lighter navy for secondary elements
    accent: "#06b6d4", // Bright cyan from "GI" text
    background: "#1e3a8a", // Deep navy blue background
    text: "#ffffff", // White text for contrast on dark background
    muted: "#cbd5e1" // Light gray for muted text
  },
  typography: {
    fontFamily: "Inter",
    fontSize: "16px",
    lineHeight: "1.6",
    fontWeight: "400"
  },
  layout: {
    containerWidth: "1200px",
    borderRadius: "12px",
    spacing: "16px",
    shadowIntensity: "medium"
  },
  darkMode: false
};

// Default theme settings (fallback)
const defaultTheme: ThemeSettings = {
  colors: {
    primary: "#3b82f6",
    secondary: "#f1f5f9",
    accent: "#10b981",
    background: "#ffffff",
    text: "#1f2937",
    muted: "#6b7280"
  },
  typography: {
    fontFamily: "Inter",
    fontSize: "16px",
    lineHeight: "1.6",
    fontWeight: "400"
  },
  layout: {
    containerWidth: "1200px",
    borderRadius: "8px",
    spacing: "16px",
    shadowIntensity: "medium"
  },
  darkMode: false
};

// Theme store using localStorage
class ThemeStore {
  private storageKey = 'gireach-theme';

  getTheme(): ThemeSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : gireachTheme;
    } catch (error) {
      console.error('Error loading theme:', error);
      return gireachTheme;
    }
  }

  saveTheme(theme: ThemeSettings): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(theme));
      this.applyTheme(theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  applyTheme(theme: ThemeSettings): void {
    // Don't apply theme to admin pages
    if (window.location.pathname.startsWith('/admin')) {
      console.log('Skipping theme application for admin page');
      return;
    }
    
    const root = document.documentElement;
    
    // For Deep Navy Blue background, we treat it as a dark theme
    const isDark = theme.colors.background === '#1e3a8a' || theme.darkMode;
    
    // Apply dark mode class for Tailwind (only for public pages)
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    
    // Apply theme colors directly
    const colors = theme.colors;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-muted', colors.muted);
    
    // Directly apply background and text colors to body and main elements (only for public pages)
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    
    // Apply to main content areas (exclude admin areas)
    const mainElements = document.querySelectorAll('main:not(.admin-main), .main-content:not(.admin-content), #root:not(.admin-root)');
    mainElements.forEach(element => {
      (element as HTMLElement).style.backgroundColor = colors.background;
      (element as HTMLElement).style.color = colors.text;
    });
    
    // Update navigation and header backgrounds (exclude admin navigation)
    const navElements = document.querySelectorAll('nav:not(.admin-nav), header:not(.admin-header)');
    navElements.forEach(element => {
      (element as HTMLElement).style.backgroundColor = colors.background;
      (element as HTMLElement).style.color = colors.text;
    });
    
    console.log('Applied Deep Navy Blue theme to public pages only:', colors);
    
    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--font-size', theme.typography.fontSize);
    root.style.setProperty('--line-height', theme.typography.lineHeight);
    root.style.setProperty('--font-weight', theme.typography.fontWeight);
    
    // Apply layout
    root.style.setProperty('--container-width', theme.layout.containerWidth);
    root.style.setProperty('--border-radius', theme.layout.borderRadius);
    root.style.setProperty('--spacing', theme.layout.spacing);
    
    // Apply shadow intensity (adjust for dark mode)
    const shadowMap = isDark ? {
      none: '0 0 0 0 rgba(0, 0, 0, 0)',
      light: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      strong: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
    } : {
      none: '0 0 0 0 rgba(0, 0, 0, 0)',
      light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    };
    root.style.setProperty('--shadow', shadowMap[theme.layout.shadowIntensity as keyof typeof shadowMap]);
    
    // Apply background color to body for full dark mode effect
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }

  private getDarkModeColors(lightColors: ThemeSettings['colors']): ThemeSettings['colors'] {
    // Convert light theme colors to appropriate dark theme colors
    return {
      primary: this.adjustColorForDark(lightColors.primary),
      secondary: '#1f2937', // Dark gray
      accent: this.adjustColorForDark(lightColors.accent),
      background: '#111827', // Very dark gray
      text: '#f9fafb', // Light gray/white
      muted: '#9ca3af' // Medium gray
    };
  }

  private adjustColorForDark(color: string): string {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Lighten the color for dark mode (increase brightness)
    const factor = 1.3;
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  resetTheme(): void {
    this.saveTheme(gireachTheme);
  }

  applyGireachTheme(): void {
    this.saveTheme(gireachTheme);
  }

  applyDeepNavyTheme(): void {
    console.log('Applying Deep Navy Blue theme...');
    this.saveTheme(gireachTheme);
    
    // Force immediate application (only for public pages)
    setTimeout(() => {
      if (!window.location.pathname.startsWith('/admin')) {
        this.applyTheme(gireachTheme);
      }
    }, 100);
  }

  // Ensure admin pages keep their original styling
  preserveAdminStyling(): void {
    if (window.location.pathname.startsWith('/admin')) {
      // Reset admin page styling to original
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      
      console.log('Preserved admin page styling');
    }
  }

  // Preset themes based on common medical/academic color schemes
  getPresetThemes(): { [key: string]: ThemeSettings } {
    return {
      gireach: gireachTheme,
      medical: {
        ...gireachTheme,
        colors: {
          primary: "#dc2626", // Medical red
          secondary: "#fef2f2",
          accent: "#059669", // Medical green
          background: "#ffffff",
          text: "#1f2937",
          muted: "#6b7280"
        }
      },
      academic: {
        ...gireachTheme,
        colors: {
          primary: "#7c3aed", // Academic purple
          secondary: "#f3f4f6",
          accent: "#f59e0b", // Academic gold
          background: "#ffffff",
          text: "#1f2937",
          muted: "#6b7280"
        }
      },
      ocean: {
        ...gireachTheme,
        colors: {
          primary: "#0ea5e9", // Ocean blue
          secondary: "#f0f9ff",
          accent: "#06b6d4", // Cyan
          background: "#ffffff",
          text: "#1f2937",
          muted: "#64748b"
        }
      }
    };
  }

  // Initialize theme on app load
  initializeTheme(): void {
    const theme = this.getTheme();
    this.applyTheme(theme);
    
    // Apply GI REACH theme by default if no theme is stored
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      this.applyGireachTheme();
    }
  }
}

export const themeStore = new ThemeStore();

// Hook for using theme in components
export function useTheme() {
  const getTheme = () => themeStore.getTheme();
  const saveTheme = (theme: ThemeSettings) => themeStore.saveTheme(theme);
  const resetTheme = () => themeStore.resetTheme();
  
  return { getTheme, saveTheme, resetTheme };
}