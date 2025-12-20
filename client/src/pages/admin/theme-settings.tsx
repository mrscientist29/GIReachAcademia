import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin-layout";
import { 
  Palette, 
  Type, 
  Layout, 
  Save, 
  RotateCcw, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  Sun,
  Moon
} from "lucide-react";

interface ThemeSettings {
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

function ThemeSettingsContent() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
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
  });

  const colorPresets = [
    {
      name: "Medical Blue",
      colors: {
        primary: "#3b82f6",
        secondary: "#f1f5f9",
        accent: "#10b981",
        background: "#ffffff",
        text: "#1f2937",
        muted: "#6b7280"
      }
    },
    {
      name: "Professional Green",
      colors: {
        primary: "#059669",
        secondary: "#f0fdf4",
        accent: "#3b82f6",
        background: "#ffffff",
        text: "#1f2937",
        muted: "#6b7280"
      }
    },
    {
      name: "Academic Purple",
      colors: {
        primary: "#7c3aed",
        secondary: "#faf5ff",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#1f2937",
        muted: "#6b7280"
      }
    },
    {
      name: "Research Orange",
      colors: {
        primary: "#ea580c",
        secondary: "#fff7ed",
        accent: "#3b82f6",
        background: "#ffffff",
        text: "#1f2937",
        muted: "#6b7280"
      }
    }
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter (Modern)" },
    { value: "Roboto", label: "Roboto (Clean)" },
    { value: "Open Sans", label: "Open Sans (Friendly)" },
    { value: "Lato", label: "Lato (Professional)" },
    { value: "Poppins", label: "Poppins (Rounded)" },
    { value: "Montserrat", label: "Montserrat (Elegant)" }
  ];

  const handleSaveTheme = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save theme
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply theme to CSS variables
      const root = document.documentElement;
      root.style.setProperty('--primary', themeSettings.colors.primary);
      root.style.setProperty('--secondary', themeSettings.colors.secondary);
      root.style.setProperty('--accent', themeSettings.colors.accent);
      root.style.setProperty('--background', themeSettings.colors.background);
      root.style.setProperty('--text', themeSettings.colors.text);
      root.style.setProperty('--muted', themeSettings.colors.muted);
      
      toast({
        title: "Theme Saved",
        description: "Your theme settings have been applied successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetTheme = () => {
    setThemeSettings({
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
    });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setThemeSettings(prev => ({
      ...prev,
      colors: preset.colors
    }));
  };

  const updateColor = (colorKey: keyof ThemeSettings['colors'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const updateTypography = (key: keyof ThemeSettings['typography'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };

  const updateLayout = (key: keyof ThemeSettings['layout'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-end">
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleResetTheme}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSaveTheme} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Theme"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="colors" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Presets</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => applyColorPreset(preset)}
                            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex space-x-1">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: preset.colors.primary }}
                                />
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: preset.colors.accent }}
                                />
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: preset.colors.secondary }}
                                />
                              </div>
                              <span className="font-medium text-gray-900">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Colors</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(themeSettings.colors).map(([key, value]) => (
                          <div key={key}>
                            <Label htmlFor={`color-${key}`} className="capitalize">
                              {key} Color
                            </Label>
                            <div className="flex space-x-2 mt-2">
                              <Input
                                id={`color-${key}`}
                                type="color"
                                value={value}
                                onChange={(e) => updateColor(key as keyof ThemeSettings['colors'], e.target.value)}
                                className="w-16 h-10 p-1 border rounded"
                              />
                              <Input
                                value={value}
                                onChange={(e) => updateColor(key as keyof ThemeSettings['colors'], e.target.value)}
                                placeholder="#000000"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="font-family">Font Family</Label>
                        <Select
                          value={themeSettings.typography.fontFamily}
                          onValueChange={(value) => updateTypography('fontFamily', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="font-size">Base Font Size</Label>
                        <Select
                          value={themeSettings.typography.fontSize}
                          onValueChange={(value) => updateTypography('fontSize', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14px">Small (14px)</SelectItem>
                            <SelectItem value="16px">Medium (16px)</SelectItem>
                            <SelectItem value="18px">Large (18px)</SelectItem>
                            <SelectItem value="20px">Extra Large (20px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="line-height">Line Height</Label>
                        <Select
                          value={themeSettings.typography.lineHeight}
                          onValueChange={(value) => updateTypography('lineHeight', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.4">Tight (1.4)</SelectItem>
                            <SelectItem value="1.6">Normal (1.6)</SelectItem>
                            <SelectItem value="1.8">Relaxed (1.8)</SelectItem>
                            <SelectItem value="2.0">Loose (2.0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="font-weight">Font Weight</Label>
                        <Select
                          value={themeSettings.typography.fontWeight}
                          onValueChange={(value) => updateTypography('fontWeight', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">Light (300)</SelectItem>
                            <SelectItem value="400">Normal (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semi Bold (600)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="container-width">Container Width</Label>
                        <Select
                          value={themeSettings.layout.containerWidth}
                          onValueChange={(value) => updateLayout('containerWidth', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1024px">Small (1024px)</SelectItem>
                            <SelectItem value="1200px">Medium (1200px)</SelectItem>
                            <SelectItem value="1400px">Large (1400px)</SelectItem>
                            <SelectItem value="100%">Full Width</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="border-radius">Border Radius</Label>
                        <Select
                          value={themeSettings.layout.borderRadius}
                          onValueChange={(value) => updateLayout('borderRadius', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0px">None (0px)</SelectItem>
                            <SelectItem value="4px">Small (4px)</SelectItem>
                            <SelectItem value="8px">Medium (8px)</SelectItem>
                            <SelectItem value="12px">Large (12px)</SelectItem>
                            <SelectItem value="16px">Extra Large (16px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="spacing">Spacing Scale</Label>
                        <Select
                          value={themeSettings.layout.spacing}
                          onValueChange={(value) => updateLayout('spacing', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12px">Compact (12px)</SelectItem>
                            <SelectItem value="16px">Normal (16px)</SelectItem>
                            <SelectItem value="20px">Comfortable (20px)</SelectItem>
                            <SelectItem value="24px">Spacious (24px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="shadow-intensity">Shadow Intensity</Label>
                        <Select
                          value={themeSettings.layout.shadowIntensity}
                          onValueChange={(value) => updateLayout('shadowIntensity', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="strong">Strong</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dark-mode">Dark Mode</Label>
                          <p className="text-sm text-gray-600">Enable dark theme for your website</p>
                        </div>
                        <Switch
                          id="dark-mode"
                          checked={themeSettings.darkMode}
                          onCheckedChange={(checked) => setThemeSettings(prev => ({ ...prev, darkMode: checked }))}
                        />
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Sun className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Advanced Settings</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Additional customization options like custom CSS, animations, and responsive breakpoints will be available in future updates.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={previewMode === 'tablet' ? 'default' : 'outline'}
                      onClick={() => setPreviewMode('tablet')}
                    >
                      <Tablet className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className={`border border-gray-200 rounded-lg overflow-hidden ${
                  previewMode === 'mobile' ? 'max-w-sm mx-auto' : 
                  previewMode === 'tablet' ? 'max-w-md mx-auto' : ''
                }`}>
                  <div 
                    className="p-4 space-y-4"
                    style={{
                      backgroundColor: themeSettings.colors.background,
                      color: themeSettings.colors.text,
                      fontFamily: themeSettings.typography.fontFamily,
                      fontSize: themeSettings.typography.fontSize,
                      lineHeight: themeSettings.typography.lineHeight
                    }}
                  >
                    <div 
                      className="p-4 rounded"
                      style={{
                        backgroundColor: themeSettings.colors.primary,
                        color: themeSettings.colors.background,
                        borderRadius: themeSettings.layout.borderRadius
                      }}
                    >
                      <h4 className="font-bold">Primary Section</h4>
                      <p className="text-sm opacity-90">This is how your primary color looks</p>
                    </div>

                    <div 
                      className="p-4 rounded"
                      style={{
                        backgroundColor: themeSettings.colors.secondary,
                        color: themeSettings.colors.text,
                        borderRadius: themeSettings.layout.borderRadius
                      }}
                    >
                      <h4 className="font-semibold">Secondary Section</h4>
                      <p className="text-sm" style={{ color: themeSettings.colors.muted }}>
                        Secondary background with muted text
                      </p>
                    </div>

                    <button 
                      className="px-4 py-2 rounded font-medium"
                      style={{
                        backgroundColor: themeSettings.colors.accent,
                        color: themeSettings.colors.background,
                        borderRadius: themeSettings.layout.borderRadius
                      }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Current Theme</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Font: {themeSettings.typography.fontFamily}</p>
                    <p>Size: {themeSettings.typography.fontSize}</p>
                    <p>Radius: {themeSettings.layout.borderRadius}</p>
                    <p>Mode: {themeSettings.darkMode ? 'Dark' : 'Light'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeSettings() {
  return (
    <AdminLayout currentPage="theme-settings">
      <ThemeSettingsContent />
    </AdminLayout>
  );
}