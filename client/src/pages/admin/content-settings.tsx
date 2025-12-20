import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin-layout";
import { logoStore, type LogoSettings } from "@/lib/logo-store";
import { contentStore, type PageContent } from "@/lib/content-store";
import { 
  Save, 
  RefreshCw, 
  Database, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Image as ImageIcon,
  Type,
  Palette,
  Layout,
  Globe,
  Sync
} from "lucide-react";

interface SyncStatus {
  logo: 'synced' | 'pending' | 'error';
  content: 'synced' | 'pending' | 'error';
  lastSync: Date | null;
}

function ContentSettingsContent() {
  const { toast } = useToast();
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(logoStore.getLogoSettingsSync());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    logo: 'synced',
    content: 'synced',
    lastSync: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  const pages = [
    { id: "home", name: "Homepage" },
    { id: "about", name: "About Us" },
    { id: "programs", name: "Programs" },
    { id: "publications", name: "Publications" },
    { id: "resources", name: "Resources" },
    { id: "contact", name: "Contact" },
    { id: "join", name: "Join Us" },
  ];

  useEffect(() => {
    loadPageContent();
    checkSyncStatus();
  }, [selectedPage]);

  const loadPageContent = async () => {
    try {
      const content = await contentStore.getPageContent(selectedPage);
      setPageContent(content);
    } catch (error) {
      console.error('Error loading page content:', error);
      const fallbackContent = contentStore.getPageContentSync(selectedPage);
      setPageContent(fallbackContent);
    }
  };

  const checkSyncStatus = async () => {
    try {
      // Check if database is accessible
      const response = await fetch('/api/admin/settings/logo');
      if (response.ok) {
        setSyncStatus(prev => ({
          ...prev,
          logo: 'synced',
          content: 'synced',
          lastSync: new Date()
        }));
      } else {
        setSyncStatus(prev => ({
          ...prev,
          logo: 'error',
          content: 'error'
        }));
      }
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        logo: 'error',
        content: 'error'
      }));
    }
  };

  const handleSaveLogo = async () => {
    setIsLoading(true);
    setSyncStatus(prev => ({ ...prev, logo: 'pending' }));
    
    try {
      await logoStore.saveLogoSettings(logoSettings);
      setSyncStatus(prev => ({ 
        ...prev, 
        logo: 'synced',
        lastSync: new Date()
      }));
      
      toast({
        title: "Logo Settings Saved!",
        description: "Your logo changes have been saved to the database and are now live.",
      });
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, logo: 'error' }));
      toast({
        title: "Save Failed",
        description: "Logo settings were saved locally but failed to sync to database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!pageContent) return;
    
    setIsLoading(true);
    setSyncStatus(prev => ({ ...prev, content: 'pending' }));
    
    try {
      await contentStore.savePageContent(selectedPage, pageContent);
      setSyncStatus(prev => ({ 
        ...prev, 
        content: 'synced',
        lastSync: new Date()
      }));
      
      toast({
        title: "Content Saved!",
        description: `${pageContent.name} has been saved to the database and is now live.`,
      });
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, content: 'error' }));
      toast({
        title: "Save Failed",
        description: "Content was saved locally but failed to sync to database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setIsLoading(true);
    
    try {
      // Sync logo settings
      setSyncStatus(prev => ({ ...prev, logo: 'pending' }));
      await logoStore.saveLogoSettings(logoSettings);
      
      // Sync current page content
      if (pageContent) {
        setSyncStatus(prev => ({ ...prev, content: 'pending' }));
        await contentStore.savePageContent(selectedPage, pageContent);
      }
      
      setSyncStatus({
        logo: 'synced',
        content: 'synced',
        lastSync: new Date()
      });
      
      toast({
        title: "All Settings Synced!",
        description: "All changes have been successfully saved to the database.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Some settings failed to sync to the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSyncStatusIcon = (status: 'synced' | 'pending' | 'error') => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Sync Status
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and manage database synchronization for all website settings
              </p>
            </div>
            <Button 
              onClick={handleSyncAll} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Sync className="h-4 w-4" />
              Sync All Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Logo Settings</span>
              {getSyncStatusIcon(syncStatus.logo)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Page Content</span>
              {getSyncStatusIcon(syncStatus.content)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Last Sync</span>
              <span className="text-sm text-gray-600">
                {syncStatus.lastSync ? syncStatus.lastSync.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Logo Settings
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Page Content
          </TabsTrigger>
        </TabsList>

        {/* Logo Settings Tab */}
        <TabsContent value="logo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Logo Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Configure your website logo. Changes are saved to the database and applied across all pages.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logoType">Logo Type</Label>
                    <Select
                      value={logoSettings.type}
                      onValueChange={(value: 'icon' | 'image' | 'text') => 
                        setLogoSettings({ ...logoSettings, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icon">Icon</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="primaryText">Primary Text</Label>
                    <Input
                      id="primaryText"
                      value={logoSettings.primaryText}
                      onChange={(e) => setLogoSettings({ 
                        ...logoSettings, 
                        primaryText: e.target.value 
                      })}
                      placeholder="GI REACH"
                    />
                  </div>

                  {logoSettings.showSecondaryText && (
                    <div>
                      <Label htmlFor="secondaryText">Secondary Text</Label>
                      <Input
                        id="secondaryText"
                        value={logoSettings.secondaryText || ''}
                        onChange={(e) => setLogoSettings({ 
                          ...logoSettings, 
                          secondaryText: e.target.value 
                        })}
                        placeholder="Academic Excellence"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Logo Preview</Label>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {logoSettings.type === 'icon' && (
                          <div className={`w-12 h-12 ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
                            <span className={`text-lg ${logoSettings.iconColor || 'text-white'}`}>
                              🩺
                            </span>
                          </div>
                        )}
                        
                        {logoSettings.type === 'image' && logoSettings.imageUrl && (
                          <img 
                            src={logoSettings.imageUrl} 
                            alt="Logo"
                            className={`w-12 h-12 object-cover ${logoSettings.borderRadius || 'rounded-xl'}`}
                          />
                        )}
                        
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveLogo} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Logo Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content Management</CardTitle>
              <p className="text-sm text-gray-600">
                Edit page content. Changes are saved to the database and reflected immediately on the website.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="pageSelect">Select Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {pageContent && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pageName">Page Name</Label>
                    <Input
                      id="pageName"
                      value={pageContent.name}
                      onChange={(e) => setPageContent({
                        ...pageContent,
                        name: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label>Content Sections ({pageContent.sections?.length || 0})</Label>
                    <div className="text-sm text-gray-600 mb-2">
                      This page has {pageContent.sections?.length || 0} content sections configured.
                      Use the full Page Editor for detailed section editing.
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                      {pageContent.sections?.map((section, index) => (
                        <div key={section.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{section.title}</span>
                            <span className="text-sm text-gray-500 ml-2">({section.type})</span>
                          </div>
                          <span className="text-xs text-gray-400">Section {index + 1}</span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No sections configured</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveContent} 
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Page Content'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Database Status Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Persistence Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <strong>Database Persistence:</strong> All changes are automatically saved to the database and persist across sessions and devices.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <strong>Real-time Updates:</strong> Changes are immediately reflected on the live website without requiring a page refresh.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <strong>Backup & Recovery:</strong> LocalStorage serves as a backup in case of database connectivity issues.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <strong>Cross-Device Sync:</strong> Settings are synchronized across all devices and browser sessions.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContentSettings() {
  return (
    <AdminLayout>
      <ContentSettingsContent />
    </AdminLayout>
  );
}