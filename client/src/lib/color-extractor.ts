// Color Extraction Utility for Logo-based Theme Generation

export interface ExtractedColors {
  dominant: string;
  palette: string[];
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export class ColorExtractor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async extractColorsFromImage(imageUrl: string): Promise<ExtractedColors> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Don't set crossOrigin for data URLs (base64 images)
      if (!imageUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        try {
          console.log('Image loaded for color extraction:', img.width, 'x', img.height);
          
          // Set canvas size to image size (but limit for performance)
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          this.canvas.width = Math.max(1, Math.floor(img.width * scale));
          this.canvas.height = Math.max(1, Math.floor(img.height * scale));
          
          console.log('Canvas size:', this.canvas.width, 'x', this.canvas.height);
          
          // Clear canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Draw image to canvas
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
          
          // Extract pixel data
          const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          console.log('Extracted pixel data length:', imageData.data.length);
          
          const colors = this.analyzeColors(imageData);
          console.log('Analyzed colors:', colors);
          
          resolve(colors);
        } catch (error) {
          console.error('Error in color extraction:', error);
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        console.error('Image load error:', error);
        reject(new Error('Failed to load image for color extraction'));
      };
      
      console.log('Loading image for color extraction...');
      img.src = imageUrl;
    });
  }

  private analyzeColors(imageData: ImageData): ExtractedColors {
    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};
    
    console.log('Analyzing', data.length / 4, 'pixels');
    
    // Sample pixels (every 4th pixel for performance)
    let validPixels = 0;
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Skip transparent pixels
      if (a < 128) continue;
      
      validPixels++;
      
      // Group similar colors (reduce precision)
      const key = `${Math.floor(r / 15) * 15},${Math.floor(g / 15) * 15},${Math.floor(b / 15) * 15}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
    
    console.log('Valid pixels:', validPixels, 'Unique colors:', Object.keys(colorCounts).length);
    
    // Convert to array and sort by frequency
    const sortedColors = Object.entries(colorCounts)
      .map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number);
        return { r, g, b, count };
      })
      .sort((a, b) => b.count - a.count);
    
    console.log('Top 5 colors:', sortedColors.slice(0, 5));
    
    // Get dominant colors (excluding very dark/light colors for better contrast)
    const dominantColors = sortedColors
      .filter(color => {
        const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
        return brightness > 20 && brightness < 235; // More inclusive range
      })
      .slice(0, 10);
    
    console.log('Dominant colors after filtering:', dominantColors);
    
    // Fallback if no colors found
    if (dominantColors.length === 0) {
      console.warn('No dominant colors found, using fallback');
      return {
        dominant: '#3b82f6',
        palette: ['#3b82f6', '#10b981', '#f59e0b'],
        primary: '#3b82f6',
        secondary: '#f1f5f9',
        accent: '#10b981',
        background: '#ffffff',
        text: '#1f2937',
        muted: '#6b7280'
      };
    }
    
    // Generate palette
    const palette = dominantColors.map(color => this.rgbToHex(color.r, color.g, color.b));
    
    // Assign semantic colors
    const primary = this.findBestColor(dominantColors, 'primary');
    const secondary = this.findBestColor(dominantColors, 'secondary');
    const accent = this.findBestColor(dominantColors, 'accent');
    
    const result = {
      dominant: palette[0] || '#3b82f6',
      palette,
      primary,
      secondary,
      accent,
      background: '#ffffff',
      text: '#1f2937',
      muted: '#6b7280'
    };
    
    console.log('Final color extraction result:', result);
    return result;
  }

  private findBestColor(colors: { r: number; g: number; b: number; count: number }[], type: 'primary' | 'secondary' | 'accent'): string {
    if (colors.length === 0) return '#3b82f6';
    
    switch (type) {
      case 'primary':
        // Find the most vibrant color
        const vibrantColor = colors.find(color => {
          const saturation = this.getSaturation(color.r, color.g, color.b);
          return saturation > 0.3;
        }) || colors[0];
        return this.rgbToHex(vibrantColor.r, vibrantColor.g, vibrantColor.b);
        
      case 'secondary':
        // Find a complementary or less vibrant color
        const secondaryColor = colors.find((color, index) => {
          const saturation = this.getSaturation(color.r, color.g, color.b);
          return index > 0 && saturation < 0.6;
        }) || colors[1] || colors[0];
        return this.lightenColor(this.rgbToHex(secondaryColor.r, secondaryColor.g, secondaryColor.b), 0.8);
        
      case 'accent':
        // Find a contrasting color
        const accentColor = colors.find((color, index) => {
          const saturation = this.getSaturation(color.r, color.g, color.b);
          return index > 1 && saturation > 0.4;
        }) || colors[2] || colors[1] || colors[0];
        return this.rgbToHex(accentColor.r, accentColor.g, accentColor.b);
        
      default:
        return this.rgbToHex(colors[0].r, colors[0].g, colors[0].b);
    }
  }

  private getSaturation(r: number, g: number, b: number): number {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private lightenColor(hex: string, factor: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    
    return this.rgbToHex(newR, newG, newB);
  }

  // Predefined color schemes based on common logo color combinations
  static getPresetTheme(logoColors: ExtractedColors): ExtractedColors {
    // Analyze the dominant colors and suggest a cohesive theme
    const { palette } = logoColors;
    
    if (palette.length === 0) {
      return logoColors;
    }
    
    // Check for blue-dominant themes (medical/professional)
    const hasBlue = palette.some(color => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return b > r && b > g;
    });
    
    if (hasBlue) {
      return {
        ...logoColors,
        primary: palette.find(c => c.includes('4') || c.includes('5') || c.includes('6')) || palette[0],
        secondary: '#f1f5f9',
        accent: palette.find(c => !c.includes('4') && !c.includes('5')) || '#10b981',
        background: '#ffffff',
        text: '#1f2937',
        muted: '#6b7280'
      };
    }
    
    return logoColors;
  }
}

export const colorExtractor = new ColorExtractor();