import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin-layout";
import { contentStore, type PageContent, type ContentSection } from "@/lib/content-store";
import { logoStore, type LogoSettings } from "@/lib/logo-store";
import { globalSettingsStore } from "@/lib/settings-store";

import { themeStore, type ThemeSettings } from "@/lib/theme-store";
import { 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Layout,
  Settings,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Copy,
  RotateCcw,
  CheckCircle
} from "lucide-react";

function PageEditorContent() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("logo");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(logoStore.getLogoSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const pages = [
    { id: "logo", name: "Logo Settings", description: "Website logo and branding" },
    { id: "home", name: "Homepage", description: "Main landing page" },
    { id: "about", name: "About Us", description: "Company information" },
    { id: "programs", name: "Programs", description: "Research programs" },
    { id: "publications", name: "Publications", description: "Research publications" },
    { id: "resources", name: "Resources", description: "Educational resources" },
    { id: "contact", name: "Contact", description: "Contact information" },
    { id: "join", name: "Join Us", description: "Membership page" },
  ];

  // Load page content based on selected page
  useEffect(() => {
    loadPageContent(selectedPage);
  }, [selectedPage]);

  const loadPageContent = async (pageId: string) => {
    console.log(`PageEditor: Loading content for page: ${pageId}`);
    
    if (pageId === 'logo') {
      try {
        // Load from database via global settings store
        const settings = await globalSettingsStore.getSetting('logo');
        if (settings) {
          setLogoSettings(settings);
          console.log('PageEditor: Loaded logo settings from database:', settings);
        } else {
          // Use defaults if no settings in database
          const defaultSettings = logoStore.getLogoSettingsSync();
          setLogoSettings(defaultSettings);
          console.log('PageEditor: Using default logo settings');
        }
      } catch (error) {
        console.error('PageEditor: Error loading logo settings:', error);
        // Fallback to local store
        const fallbackSettings = logoStore.getLogoSettingsSync();
        setLogoSettings(fallbackSettings);
      }
      setPageContent(null);
    } else {
      try {
        // Load from database via content store
        const content = await contentStore.getPageContent(pageId);
        console.log(`PageEditor: Loaded content for ${pageId}:`, content);
        setPageContent(content);
        
        if (!content) {
          console.error(`PageEditor: No content found for page: ${pageId}`);
        } else if (!content.sections) {
          console.error(`PageEditor: No sections found for page: ${pageId}`);
        } else {
          console.log(`PageEditor: Successfully loaded ${content.sections.length} sections for ${pageId}`);
        }
      } catch (error) {
        console.error(`PageEditor: Error loading content for ${pageId}:`, error);
        // Fallback to sync version
        const fallbackContent = contentStore.getPageContentSync(pageId);
        setPageContent(fallbackContent);
      }
    }
  };

  const handleSaveContent = async () => {
    setIsLoading(true);
    try {
      if (selectedPage === 'logo') {
        // Save logo settings to database
        await globalSettingsStore.saveSetting('logo', logoSettings);
        console.log('PageEditor: Logo settings saved to database');
        
        toast({
          title: "Logo Settings Saved!",
          description: "Your logo changes are now live on your website and will appear on all devices.",
        });
      } else if (pageContent) {
        // Save page content to database
        await contentStore.savePageContent(selectedPage, pageContent);
        console.log('PageEditor: Page content saved to database');
        
        toast({
          title: "Content Saved Successfully!",
          description: `${pageContent.name} has been updated. Changes are now live on your website and will appear on all devices.`,
        });
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSection = (sectionId: string, field: keyof ContentSection, value: any) => {
    if (!pageContent) return;
    
    setPageContent(prev => ({
      ...prev!,
      sections: prev!.sections.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const updateSectionStyles = (sectionId: string, styleField: string, value: string) => {
    if (!pageContent) return;
    
    setPageContent(prev => ({
      ...prev!,
      sections: prev!.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              styles: { 
                ...section.styles, 
                [styleField]: value 
              }
            }
          : section
      )
    }));
  };

  const updateSectionData = (sectionId: string, dataField: string, value: any) => {
    if (!pageContent) return;
    
    setPageContent(prev => ({
      ...prev!,
      sections: prev!.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              data: { 
                ...section.data, 
                [dataField]: value 
              }
            }
          : section
      )
    }));
  };

  const addNewSection = () => {
    if (!pageContent) return;
    
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type: "text",
      title: "New Section",
      content: "Enter your content here...",
      styles: {
        backgroundColor: "bg-white",
        textColor: "text-gray-900",
        fontSize: "text-4xl"
      },
      data: {}
    };
    
    setPageContent(prev => ({
      ...prev!,
      sections: [...prev!.sections, newSection]
    }));
    
    toast({
      title: "Section Added",
      description: "New section has been added to the page.",
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!pageContent) return;
    
    const sectionToDelete = pageContent.sections.find(s => s.id === sectionId);
    
    if (window.confirm(`Are you sure you want to delete "${sectionToDelete?.title}"? This action cannot be undone.`)) {
      setPageContent(prev => ({
        ...prev!,
        sections: prev!.sections.filter(section => section.id !== sectionId)
      }));
      
      toast({
        title: "Section Deleted",
        description: "Section has been removed from the page.",
      });
    }
  };

  const moveSectionUp = (sectionId: string) => {
    if (!pageContent) return;
    
    const sections = [...pageContent.sections];
    const index = sections.findIndex(s => s.id === sectionId);
    
    if (index > 0) {
      [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
      setPageContent(prev => ({
        ...prev!,
        sections
      }));
    }
  };

  const moveSectionDown = (sectionId: string) => {
    if (!pageContent) return;
    
    const sections = [...pageContent.sections];
    const index = sections.findIndex(s => s.id === sectionId);
    
    if (index < sections.length - 1) {
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      setPageContent(prev => ({
        ...prev!,
        sections
      }));
    }
  };

  const duplicateSection = (sectionId: string) => {
    if (!pageContent) return;
    
    const sectionToDuplicate = pageContent.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;
    
    const duplicatedSection: ContentSection = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
      title: `${sectionToDuplicate.title} (Copy)`
    };
    
    const sections = [...pageContent.sections];
    const index = sections.findIndex(s => s.id === sectionId);
    sections.splice(index + 1, 0, duplicatedSection);
    
    setPageContent(prev => ({
      ...prev!,
      sections
    }));
    
    toast({
      title: "Section Duplicated",
      description: "Section has been duplicated successfully.",
    });
  };

  const handlePreview = async () => {
    // Save current changes first
    if (pageContent) {
      try {
        await contentStore.savePageContent(selectedPage, pageContent);
        console.log('PageEditor: Changes saved before preview');
      } catch (error) {
        console.error('PageEditor: Failed to save before preview:', error);
      }
    }
    
    // Open preview in new tab
    const previewUrl = selectedPage === 'home' ? '/' : `/${selectedPage}`;
    window.open(previewUrl, '_blank');
    
    toast({
      title: "Preview Opened",
      description: "Changes have been saved and preview opened in new tab.",
    });
  };

  const handleResetPage = () => {
    if (window.confirm(`Are you sure you want to reset "${pageContent?.name}" to default content? This will remove all your changes.`)) {
      contentStore.resetToDefault();
      loadPageContent(selectedPage);
      
      toast({
        title: "Page Reset",
        description: "Page has been reset to default content.",
      });
    }
  };

  const handleAutoSave = async () => {
    try {
      if (selectedPage === 'logo') {
        await globalSettingsStore.saveSetting('logo', logoSettings);
        console.log('PageEditor: Auto-saved logo settings to database');
      } else if (pageContent) {
        await contentStore.savePageContent(selectedPage, pageContent);
        console.log('PageEditor: Auto-saved page content to database');
      }
    } catch (error) {
      console.error('PageEditor: Auto-save failed:', error);
    }
  };

  const updateLogoSetting = async (field: keyof LogoSettings, value: any) => {
    console.log('PageEditor: Updating logo setting:', field, '=', value);
    
    const updatedSettings = {
      ...logoSettings,
      [field]: value
    };
    
    console.log('PageEditor: New settings:', updatedSettings);
    setLogoSettings(updatedSettings);
    
    // Save to database immediately for real-time updates
    try {
      await globalSettingsStore.saveSetting('logo', updatedSettings);
      console.log('PageEditor: Logo setting saved to database:', field, '=', value);
    } catch (error) {
      console.error('PageEditor: Failed to save logo setting:', error);
    }
  };

  const updateMultipleLogoSettings = async (updates: Partial<LogoSettings>) => {
    console.log('PageEditor: Updating multiple logo settings:', updates);
    
    const updatedSettings = {
      ...logoSettings,
      ...updates
    };
    
    console.log('PageEditor: New settings after batch update:', updatedSettings);
    setLogoSettings(updatedSettings);
    
    // Save to database immediately for real-time updates
    try {
      await globalSettingsStore.saveSetting('logo', updatedSettings);
      console.log('PageEditor: Multiple logo settings saved to database');
    } catch (error) {
      console.error('PageEditor: Failed to save multiple logo settings:', error);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [pageContent, selectedPage, logoSettings]);

  // Show loading only for non-logo pages that haven't loaded content yet
  if (selectedPage !== 'logo' && !pageContent) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page content for "{selectedPage}"...</p>
            <p className="text-sm text-gray-500 mt-2">If this persists, try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Live Editor - Changes affect real website
              </div>
              <div className="text-sm text-gray-600">
                Auto-save: Every 30 seconds
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleResetPage}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Page
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Live Site
              </Button>
              <Button onClick={handleSaveContent} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Page Selector */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Page</h3>
                <div className="space-y-2">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedPage === page.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{page.name}</div>
                      <div className="text-sm text-gray-500">{page.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            {selectedPage === 'logo' ? (
              <LogoEditor 
                logoSettings={logoSettings}
                onUpdateSetting={updateLogoSetting}
                onUpdateMultipleSettings={updateMultipleLogoSettings}
              />
            ) : (
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Editing: {pageContent?.name}
                    </h3>
                    <Button onClick={addNewSection} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>

                <div className="space-y-6">
                  {pageContent.sections.map((section) => (
                    <Card key={section.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {section.type === "hero" && <Layout className="h-4 w-4 text-blue-600" />}
                            {section.type === "text" && <Type className="h-4 w-4 text-green-600" />}
                            {section.type === "services" && <Settings className="h-4 w-4 text-purple-600" />}
                            {section.type === "stats" && <ImageIcon className="h-4 w-4 text-orange-600" />}
                            {section.type === "contact" && <ImageIcon className="h-4 w-4 text-red-600" />}
                            <span className="font-medium text-gray-900">{section.title}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {section.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              onClick={() => moveSectionUp(section.id)}
                              variant="ghost"
                              size="sm"
                              disabled={pageContent.sections.indexOf(section) === 0}
                              title="Move Up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => moveSectionDown(section.id)}
                              variant="ghost"
                              size="sm"
                              disabled={pageContent.sections.indexOf(section) === pageContent.sections.length - 1}
                              title="Move Down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => duplicateSection(section.id)}
                              variant="ghost"
                              size="sm"
                              title="Duplicate Section"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => deleteSection(section.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              title="Delete Section"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Tabs defaultValue="content" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="image">Image</TabsTrigger>
                            <TabsTrigger value="style">Style</TabsTrigger>
                            <TabsTrigger value="data">Data</TabsTrigger>
                          </TabsList>

                          <TabsContent value="content" className="space-y-4">
                            <div>
                              <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                              <Input
                                id={`title-${section.id}`}
                                value={section.title}
                                onChange={(e) => updateSection(section.id, "title", e.target.value)}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`content-${section.id}`}>Content</Label>
                              <Textarea
                                id={`content-${section.id}`}
                                value={section.content}
                                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                                rows={4}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`type-${section.id}`}>Section Type</Label>
                              <Select
                                value={section.type}
                                onValueChange={(value) => updateSection(section.id, "type", value)}
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hero">Hero Section</SelectItem>
                                  <SelectItem value="text">Text Section</SelectItem>
                                  <SelectItem value="services">Services</SelectItem>
                                  <SelectItem value="stats">Statistics</SelectItem>
                                  <SelectItem value="contact">Contact</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TabsContent>

                          <TabsContent value="image" className="space-y-4">
                            <div>
                              <Label htmlFor={`image-${section.id}`}>Image URL</Label>
                              <Input
                                id={`image-${section.id}`}
                                value={section.imageUrl || ""}
                                onChange={(e) => updateSection(section.id, "imageUrl", e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="mt-2"
                              />
                            </div>
                            <div className="flex space-x-4">
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Image
                              </Button>
                              <Button variant="outline" size="sm">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Media Library
                              </Button>
                            </div>
                            {section.imageUrl && (
                              <div className="mt-4">
                                <img
                                  src={section.imageUrl}
                                  alt="Preview"
                                  className="w-full max-w-md h-32 object-cover rounded-lg border"
                                />
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="style" className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`bg-color-${section.id}`}>Background Style</Label>
                                <Select
                                  value={section.styles?.backgroundColor || "bg-white"}
                                  onValueChange={(value) => updateSectionStyles(section.id, "backgroundColor", value)}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bg-white">White</SelectItem>
                                    <SelectItem value="bg-gray-50">Light Gray</SelectItem>
                                    <SelectItem value="bg-gray-100">Medium Gray</SelectItem>
                                    <SelectItem value="bg-blue-50">Light Blue</SelectItem>
                                    <SelectItem value="bg-blue-600">Blue</SelectItem>
                                    <SelectItem value="bg-green-50">Light Green</SelectItem>
                                    <SelectItem value="bg-green-600">Green</SelectItem>
                                    <SelectItem value="bg-purple-50">Light Purple</SelectItem>
                                    <SelectItem value="bg-purple-600">Purple</SelectItem>
                                    <SelectItem value="from-blue-50 to-indigo-100">Blue Gradient</SelectItem>
                                    <SelectItem value="from-green-50 to-emerald-100">Green Gradient</SelectItem>
                                    <SelectItem value="from-purple-50 to-pink-100">Purple Gradient</SelectItem>
                                    <SelectItem value="from-orange-50 to-red-100">Orange Gradient</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor={`text-color-${section.id}`}>Text Color</Label>
                                <Select
                                  value={section.styles?.textColor || "text-gray-900"}
                                  onValueChange={(value) => updateSectionStyles(section.id, "textColor", value)}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text-gray-900">Dark Gray</SelectItem>
                                    <SelectItem value="text-gray-700">Medium Gray</SelectItem>
                                    <SelectItem value="text-gray-600">Light Gray</SelectItem>
                                    <SelectItem value="text-white">White</SelectItem>
                                    <SelectItem value="text-blue-600">Blue</SelectItem>
                                    <SelectItem value="text-blue-800">Dark Blue</SelectItem>
                                    <SelectItem value="text-green-600">Green</SelectItem>
                                    <SelectItem value="text-green-800">Dark Green</SelectItem>
                                    <SelectItem value="text-purple-600">Purple</SelectItem>
                                    <SelectItem value="text-red-600">Red</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`font-size-${section.id}`}>Font Size</Label>
                                <Select
                                  value={section.styles?.fontSize || "text-4xl"}
                                  onValueChange={(value) => updateSectionStyles(section.id, "fontSize", value)}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text-sm">Extra Small (sm)</SelectItem>
                                    <SelectItem value="text-base">Base (16px)</SelectItem>
                                    <SelectItem value="text-lg">Large (lg)</SelectItem>
                                    <SelectItem value="text-xl">Extra Large (xl)</SelectItem>
                                    <SelectItem value="text-2xl">2X Large (2xl)</SelectItem>
                                    <SelectItem value="text-3xl">3X Large (3xl)</SelectItem>
                                    <SelectItem value="text-4xl">4X Large (4xl)</SelectItem>
                                    <SelectItem value="text-5xl">5X Large (5xl)</SelectItem>
                                    <SelectItem value="text-6xl">6X Large (6xl)</SelectItem>
                                    <SelectItem value="text-4xl lg:text-6xl">Responsive Large</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor={`padding-${section.id}`}>Padding</Label>
                                <Select
                                  value={section.styles?.padding || "py-20"}
                                  onValueChange={(value) => updateSectionStyles(section.id, "padding", value)}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="py-4">Small (py-4)</SelectItem>
                                    <SelectItem value="py-8">Medium (py-8)</SelectItem>
                                    <SelectItem value="py-12">Large (py-12)</SelectItem>
                                    <SelectItem value="py-16">Extra Large (py-16)</SelectItem>
                                    <SelectItem value="py-20">2X Large (py-20)</SelectItem>
                                    <SelectItem value="py-24">3X Large (py-24)</SelectItem>
                                    <SelectItem value="py-32">4X Large (py-32)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-2">Style Preview</h4>
                              <div 
                                className={`p-4 rounded-lg ${section.styles?.backgroundColor || 'bg-white'} ${section.styles?.textColor || 'text-gray-900'}`}
                                style={{
                                  background: section.styles?.backgroundColor?.includes('gradient') ? 
                                    `linear-gradient(135deg, var(--tw-gradient-stops))` : undefined
                                }}
                              >
                                <h5 className={`${section.styles?.fontSize || 'text-4xl'} font-bold mb-2`}>
                                  {section.title}
                                </h5>
                                <p className="text-sm opacity-80">
                                  This is how your section will look with the current styling.
                                </p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="data" className="space-y-4">
                            {section.type === 'stats' && (
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <Label>Statistics Data</Label>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const newStats = [...(section.data?.stats || []), { label: 'New Stat', value: '0' }];
                                      updateSectionData(section.id, 'stats', newStats);
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Stat
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {section.data?.stats?.map((stat: any, index: number) => (
                                    <div key={index} className="grid grid-cols-2 gap-2">
                                      <Input
                                        placeholder="Label (e.g., Published Papers)"
                                        value={stat.label}
                                        onChange={(e) => {
                                          const newStats = [...(section.data?.stats || [])];
                                          newStats[index] = { ...stat, label: e.target.value };
                                          updateSectionData(section.id, 'stats', newStats);
                                        }}
                                      />
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Value (e.g., 500+)"
                                          value={stat.value}
                                          onChange={(e) => {
                                            const newStats = [...(section.data?.stats || [])];
                                            newStats[index] = { ...stat, value: e.target.value };
                                            updateSectionData(section.id, 'stats', newStats);
                                          }}
                                        />
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const newStats = section.data?.stats?.filter((_: any, i: number) => i !== index) || [];
                                            updateSectionData(section.id, 'stats', newStats);
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {section.type === 'services' && (
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <Label>Services Data</Label>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const newServices = [...(section.data?.services || []), {
                                        id: `service-${Date.now()}`,
                                        title: 'New Service',
                                        description: 'Service description...',
                                        icon: 'Settings',
                                        color: 'blue'
                                      }];
                                      updateSectionData(section.id, 'services', newServices);
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Service
                                  </Button>
                                </div>
                                <div className="space-y-4">
                                  {section.data?.services?.map((service: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                          <Label>Service Title</Label>
                                          <Input
                                            value={service.title}
                                            onChange={(e) => {
                                              const newServices = [...(section.data?.services || [])];
                                              newServices[index] = { ...service, title: e.target.value };
                                              updateSectionData(section.id, 'services', newServices);
                                            }}
                                            className="mt-2"
                                          />
                                        </div>
                                        <div>
                                          <Label>Color</Label>
                                          <Select
                                            value={service.color}
                                            onValueChange={(value) => {
                                              const newServices = [...(section.data?.services || [])];
                                              newServices[index] = { ...service, color: value };
                                              updateSectionData(section.id, 'services', newServices);
                                            }}
                                          >
                                            <SelectTrigger className="mt-2">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="blue">Blue</SelectItem>
                                              <SelectItem value="green">Green</SelectItem>
                                              <SelectItem value="purple">Purple</SelectItem>
                                              <SelectItem value="orange">Orange</SelectItem>
                                              <SelectItem value="red">Red</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="mb-4">
                                        <Label>Description</Label>
                                        <Textarea
                                          value={service.description}
                                          onChange={(e) => {
                                            const newServices = [...(section.data?.services || [])];
                                            newServices[index] = { ...service, description: e.target.value };
                                            updateSectionData(section.id, 'services', newServices);
                                          }}
                                          rows={3}
                                          className="mt-2"
                                        />
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const newServices = section.data?.services?.filter((_: any, i: number) => i !== index) || [];
                                          updateSectionData(section.id, 'services', newServices);
                                        }}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove Service
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {section.type === 'contact' && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Phone Number</Label>
                                  <Input
                                    value={section.data?.phone || ""}
                                    onChange={(e) => updateSectionData(section.id, 'phone', e.target.value)}
                                    placeholder="+92 (21) 1234-5678"
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label>Email Address</Label>
                                  <Input
                                    value={section.data?.email || ""}
                                    onChange={(e) => updateSectionData(section.id, 'email', e.target.value)}
                                    placeholder="info@gireach.pk"
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label>Physical Address</Label>
                                  <Input
                                    value={section.data?.address || ""}
                                    onChange={(e) => updateSectionData(section.id, 'address', e.target.value)}
                                    placeholder="Karachi, Pakistan"
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                            )}
                            
                            {!section.data || Object.keys(section.data).length === 0 ? (
                              <div className="text-center py-8">
                                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm">
                                  No additional data fields for this section type.
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                  Switch to a different section type (Stats, Services, Contact) to see data options.
                                </p>
                              </div>
                            ) : null}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}

                  {pageContent.sections.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
                      <p className="text-gray-600 mb-4">Start by adding your first section to this page.</p>
                      <Button onClick={addNewSection}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Section
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Logo Editor Component
function LogoEditor({ 
  logoSettings, 
  onUpdateSetting,
  onUpdateMultipleSettings
}: { 
  logoSettings: LogoSettings;
  onUpdateSetting: (field: keyof LogoSettings, value: any) => void;
  onUpdateMultipleSettings: (updates: Partial<LogoSettings>) => void;
}) {
  const { toast } = useToast();
  const iconOptions = [
    { value: 'Stethoscope', label: 'Stethoscope (Medical)' },
    { value: 'Heart', label: 'Heart' },
    { value: 'Shield', label: 'Shield' },
    { value: 'Star', label: 'Star' },
    { value: 'Award', label: 'Award' },
    { value: 'Target', label: 'Target' },
    { value: 'Zap', label: 'Lightning' },
    { value: 'Settings', label: 'Settings' },
    { value: 'FileText', label: 'Document' },
    { value: 'Users', label: 'Users' }
  ];

  const colorOptions = [
    { value: 'bg-blue-600', label: 'Blue', preview: '#3b82f6' },
    { value: 'bg-green-600', label: 'Green', preview: '#16a34a' },
    { value: 'bg-purple-600', label: 'Purple', preview: '#9333ea' },
    { value: 'bg-red-600', label: 'Red', preview: '#dc2626' },
    { value: 'bg-orange-600', label: 'Orange', preview: '#ea580c' },
    { value: 'bg-pink-600', label: 'Pink', preview: '#db2777' },
    { value: 'bg-indigo-600', label: 'Indigo', preview: '#4f46e5' },
    { value: 'bg-gray-600', label: 'Gray', preview: '#4b5563' }
  ];

  const textColorOptions = [
    { value: 'text-gray-900', label: 'Dark Gray' },
    { value: 'text-gray-700', label: 'Medium Gray' },
    { value: 'text-gray-600', label: 'Light Gray' },
    { value: 'text-blue-600', label: 'Blue' },
    { value: 'text-green-600', label: 'Green' },
    { value: 'text-purple-600', label: 'Purple' },
    { value: 'text-red-600', label: 'Red' }
  ];

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Show loading toast
    toast({
      title: "Processing Logo",
      description: "Uploading image and extracting colors...",
    });

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      onUpdateSetting('imageUrl', result);
      
      // Auto-detect image dimensions and extract colors
      const img = new Image();
      img.onload = async () => {
        // Set reasonable default size while maintaining aspect ratio
        const maxSize = 64;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // Update all settings at once using batch update
        onUpdateMultipleSettings({
          imageUrl: result,
          imageWidth: width,
          imageHeight: height
        });
        
        // Apply logo background color as theme color (if it's an icon logo)
        if (logoSettings.type === 'icon' && logoSettings.iconBackground) {
          applyLogoBackgroundAsTheme(logoSettings.iconBackground);
        }
        
        toast({
          title: "Logo Uploaded Successfully!",
          description: `Logo uploaded and resized to ${width}x${height}px`,
        });
      };
      img.src = result;
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload Error",
        description: "Failed to read the image file. Please try again.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
    
    // Clear the input so the same file can be selected again
    event.target.value = '';
  };

  const applyLogoBackgroundAsTheme = (logoBackground: string) => {
    console.log('Applying logo background color as theme:', logoBackground);
    
    // Convert Tailwind class to hex color
    const colorMap: { [key: string]: string } = {
      'bg-blue-600': '#2563eb',
      'bg-green-600': '#16a34a',
      'bg-purple-600': '#9333ea',
      'bg-red-600': '#dc2626',
      'bg-orange-600': '#ea580c',
      'bg-pink-600': '#db2777',
      'bg-indigo-600': '#4f46e5',
      'bg-gray-600': '#4b5563'
    };
    
    const primaryColor = colorMap[logoBackground] || '#2563eb';
    const currentTheme = themeStore.getTheme();
    
    // Create new theme with logo background color as primary
    const newTheme: ThemeSettings = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        primary: primaryColor,
        accent: primaryColor
      }
    };
    
    console.log('New theme with logo color:', newTheme);
    
    // Save and apply the new theme
    themeStore.saveTheme(newTheme);
    
    // Also directly apply the color to common elements for immediate visual feedback
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--accent-color', primaryColor);
    
    // Update buttons and links with the new color
    const buttons = document.querySelectorAll('button:not(.admin-button)');
    buttons.forEach(button => {
      if (button.classList.contains('bg-blue-600') || button.classList.contains('bg-blue-700')) {
        (button as HTMLElement).style.backgroundColor = primaryColor;
      }
    });
    
    // Update navigation and other primary colored elements
    const primaryElements = document.querySelectorAll('.text-blue-600, .bg-blue-600');
    primaryElements.forEach(element => {
      if (element.classList.contains('text-blue-600')) {
        (element as HTMLElement).style.color = primaryColor;
      }
      if (element.classList.contains('bg-blue-600')) {
        (element as HTMLElement).style.backgroundColor = primaryColor;
      }
    });
    
    console.log('Applied logo color directly to elements:', primaryColor);
  };



  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Logo Settings</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Logo Configuration */}
          <div className="space-y-6">
            <div>
              <Label>Logo Type</Label>
              <Select
                value={logoSettings.type}
                onValueChange={(value) => onUpdateSetting('type', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="icon">Icon + Text</SelectItem>
                  <SelectItem value="image">Custom Image</SelectItem>
                  <SelectItem value="text">Text Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {logoSettings.type === 'icon' && (
              <>
                <div>
                  <Label>Icon</Label>
                  <Select
                    value={logoSettings.iconName}
                    onValueChange={(value) => onUpdateSetting('iconName', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Icon Background Color</Label>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => onUpdateSetting('iconBackground', color.value)}
                        className={`w-full h-10 rounded-lg border-2 ${
                          logoSettings.iconBackground === color.value 
                            ? 'border-gray-900' 
                            : 'border-gray-200'
                        } ${color.value} flex items-center justify-center`}
                        title={color.label}
                      >
                        {logoSettings.iconBackground === color.value && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {logoSettings.type === 'image' && (
              <>
                <div>
                  <Label>Logo Image</Label>
                  <div className="mt-2 space-y-4">
                    {/* Current Image Preview */}
                    {logoSettings.imageUrl && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
                        <img
                          src={logoSettings.imageUrl}
                          alt="Current Logo"
                          className="object-cover rounded border"
                          style={{
                            width: Math.min(logoSettings.imageWidth || 48, 64),
                            height: Math.min(logoSettings.imageHeight || 48, 64)
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Current Logo</p>
                          <p className="text-xs text-gray-600">
                            {logoSettings.imageWidth}x{logoSettings.imageHeight}px
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Controls */}
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                        onChange={(e) => handleLogoUpload(e)}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{logoSettings.imageUrl ? 'Change Logo' : 'Upload Logo'}</span>
                      </Button>
                      {logoSettings.imageUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            onUpdateSetting('imageUrl', '');
                            toast({
                              title: "Logo Removed",
                              description: "Logo image has been removed",
                            });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    {/* Upload Guidelines */}
                    <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border">
                      <p className="font-medium text-blue-800 mb-1">Upload Guidelines:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Supported formats: PNG, JPG, GIF, WebP, SVG</li>
                        <li>• Maximum file size: 5MB</li>
                        <li>• Recommended size: 48x48 to 128x128 pixels</li>
                        <li>• For best results, use PNG with transparent background</li>
                      </ul>
                    </div>
                    
                    {/* Alternative URL input */}
                    <div className="border-t pt-4">
                      <Label className="text-sm text-gray-600">Or enter image URL:</Label>
                      <Input
                        value={logoSettings.imageUrl && !logoSettings.imageUrl.startsWith('data:') ? logoSettings.imageUrl : ''}
                        onChange={(e) => onUpdateSetting('imageUrl', e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width (px)</Label>
                    <Input
                      type="number"
                      value={logoSettings.imageWidth || 48}
                      onChange={(e) => onUpdateSetting('imageWidth', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Height (px)</Label>
                    <Input
                      type="number"
                      value={logoSettings.imageHeight || 48}
                      onChange={(e) => onUpdateSetting('imageHeight', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Label>Primary Text (Company Name)</Label>
              <Input
                value={logoSettings.primaryText}
                onChange={(e) => onUpdateSetting('primaryText', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Secondary Text (Tagline)</Label>
              <Input
                value={logoSettings.secondaryText || ''}
                onChange={(e) => onUpdateSetting('secondaryText', e.target.value)}
                placeholder="Optional tagline"
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showSecondaryText"
                checked={logoSettings.showSecondaryText}
                onChange={(e) => onUpdateSetting('showSecondaryText', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="showSecondaryText">Show secondary text</Label>
            </div>

            <div>
              <Label>Primary Text Color</Label>
              <Select
                value={logoSettings.primaryTextColor}
                onValueChange={(value) => onUpdateSetting('primaryTextColor', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {textColorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Font Size</Label>
              <Select
                value={logoSettings.fontSize}
                onValueChange={(value) => onUpdateSetting('fontSize', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-lg">Large</SelectItem>
                  <SelectItem value="text-xl">Extra Large</SelectItem>
                  <SelectItem value="text-2xl">2X Large</SelectItem>
                  <SelectItem value="text-3xl">3X Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logo Preview */}
          <div className="space-y-6">
            <div>
              <Label>Live Preview</Label>
              <div className="mt-4 p-6 bg-gray-50 rounded-lg">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <LogoPreview logoSettings={logoSettings} />
                </div>
              </div>
            </div>



            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Logo Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep your logo simple and readable</li>
                <li>• Use high contrast colors for better visibility</li>
                <li>• Test your logo on different screen sizes</li>
                <li>• For images, use PNG format with transparent background</li>
                <li>• Recommended image size: 48x48 to 64x64 pixels</li>

              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Logo Preview Component
function LogoPreview({ logoSettings }: { logoSettings: LogoSettings }) {
  const iconMap = {
    Stethoscope: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 14a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3M8.5 8.5c0 1-1 1.5-1 1.5S6.5 9.5 6.5 8.5 7 7 7.5 7s1 .5 1 1.5M12 1a4 4 0 0 1 4 4c0 .5-.1 1-.2 1.5L13 8.3V5a1 1 0 0 0-2 0v3.3L8.2 6.5C8.1 6 8 5.5 8 5a4 4 0 0 1 4-4M7.5 10.5c.8 0 1.5.7 1.5 1.5v1.79c0 2.02 1.23 3.84 3.1 4.58.13.05.27.08.4.08.14 0 .27-.03.4-.08 1.87-.74 3.1-2.56 3.1-4.58V12c0-.83.67-1.5 1.5-1.5S19 11.17 19 12v1.79c0 2.78-1.68 5.28-4.25 6.32-.23.09-.48.14-.75.14s-.52-.05-.75-.14C10.68 19.07 9 16.57 9 13.79V12c0-.83.67-1.5 1.5-1.5z"/></svg>,
    Heart: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
    Shield: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C14.8,12.6 13.9,13.5 12.8,13.5H11.2C10.1,13.5 9.2,12.6 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V10.8H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"/></svg>,
    Star: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>,
    Award: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M5,16L3,5L8.5,12L12,4L15.5,12L21,5L19,16H5M12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13Z"/></svg>,
    Target: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/></svg>,
    Zap: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M7,2V13H10V22L17,10H14L17,2H7Z"/></svg>,
    Settings: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>,
    FileText: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>,
    Users: () => <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C18.7 14 24 15.3 24 18V20H8V18C8 15.3 13.3 14 16 14M8 4C10.2 4 12 5.8 12 8S10.2 12 8 12 4 10.2 4 8 5.8 4 8 4M8 14C10.7 14 16 15.3 16 18V20H0V18C0 15.3 5.3 14 8 14Z"/></svg>
  };

  const IconComponent = iconMap[logoSettings.iconName as keyof typeof iconMap];

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon/Image */}
      {logoSettings.type === 'icon' && (
        <div className={`w-12 h-12 ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
          {IconComponent && (
            <div className={logoSettings.iconColor || 'text-white'}>
              <IconComponent />
            </div>
          )}
        </div>
      )}
      
      {logoSettings.type === 'image' && logoSettings.imageUrl && (
        <img 
          src={logoSettings.imageUrl} 
          alt="Logo Preview"
          className={`object-cover ${logoSettings.borderRadius || 'rounded-xl'}`}
          style={{
            width: logoSettings.imageWidth || 48,
            height: logoSettings.imageHeight || 48
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      
      {logoSettings.type === 'text' && (
        <div className={`w-12 h-12 ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
          <span className={`${logoSettings.fontWeight || 'font-bold'} ${logoSettings.iconColor || 'text-white'} text-lg`}>
            {logoSettings.primaryText.charAt(0)}
          </span>
        </div>
      )}

      {/* Logo Text */}
      <div>
        <h1 className={`${logoSettings.fontSize || 'text-2xl'} ${logoSettings.fontWeight || 'font-bold'} ${logoSettings.primaryTextColor || 'text-gray-900'}`}>
          {logoSettings.primaryText}
        </h1>
        {logoSettings.showSecondaryText && logoSettings.secondaryText && (
          <p className={`text-sm ${logoSettings.secondaryTextColor || 'text-gray-600'}`}>
            {logoSettings.secondaryText}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PageEditorFunctional() {
  return (
    <AdminLayout currentPage="page-editor">
      <PageEditorContent />
    </AdminLayout>
  );
}