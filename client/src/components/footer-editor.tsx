import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { footerStore, type FooterSettings, type SocialLink, type QuickLink } from "@/lib/footer-store";
import { 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  RotateCcw,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from "lucide-react";

// Icon options for social media
const socialIconOptions = [
  { value: 'Facebook', label: 'Facebook', icon: Facebook },
  { value: 'Twitter', label: 'Twitter', icon: Twitter },
  { value: 'Linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'Instagram', label: 'Instagram', icon: Instagram },
  { value: 'Youtube', label: 'YouTube', icon: Youtube },
  { value: 'Mail', label: 'Email', icon: Mail },
  { value: 'Phone', label: 'Phone', icon: Phone },
  { value: 'MapPin', label: 'Location', icon: MapPin }
];

// Color options for social media icons
const colorOptions = [
  { value: 'from-blue-600 to-blue-700', label: 'Blue', preview: '#3b82f6' },
  { value: 'from-sky-500 to-sky-600', label: 'Sky Blue', preview: '#0ea5e9' },
  { value: 'from-blue-700 to-blue-800', label: 'Dark Blue', preview: '#1d4ed8' },
  { value: 'from-pink-500 to-purple-600', label: 'Pink/Purple', preview: '#ec4899' },
  { value: 'from-red-500 to-red-600', label: 'Red', preview: '#ef4444' },
  { value: 'from-green-500 to-green-600', label: 'Green', preview: '#22c55e' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow/Orange', preview: '#eab308' },
  { value: 'from-purple-500 to-purple-600', label: 'Purple', preview: '#a855f7' },
  { value: 'from-indigo-500 to-indigo-600', label: 'Indigo', preview: '#6366f1' },
  { value: 'from-gray-600 to-gray-700', label: 'Gray', preview: '#4b5563' }
];

export default function FooterEditor() {
  const { toast } = useToast();
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(footerStore.getFooterSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load footer settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await footerStore.loadFooterSettings();
        setFooterSettings(settings);
        console.log('FooterEditor: Loaded settings:', settings);
      } catch (error) {
        console.error('FooterEditor: Error loading settings:', error);
        const fallbackSettings = footerStore.getFooterSettings();
        setFooterSettings(fallbackSettings);
      }
    };

    loadSettings();

    // Listen for footer updates
    const handleFooterUpdate = (e: CustomEvent) => {
      console.log('FooterEditor: Footer updated via event');
      setFooterSettings(e.detail.settings);
    };

    window.addEventListener('footerUpdated', handleFooterUpdate as EventListener);
    return () => window.removeEventListener('footerUpdated', handleFooterUpdate as EventListener);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await footerStore.saveFooterSettings(footerSettings);
      
      toast({
        title: "Footer Settings Saved!",
        description: "Your footer changes are now live across all pages and will appear on all devices.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save footer settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset the footer to default settings? This will remove all your customizations.")) {
      try {
        await footerStore.resetToDefaults();
        const defaultSettings = footerStore.getFooterSettings();
        setFooterSettings(defaultSettings);
        
        toast({
          title: "Footer Reset",
          description: "Footer has been reset to default settings.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to reset footer settings.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePreview = () => {
    // Open the homepage in a new tab to see footer changes
    window.open('/', '_blank');
    
    toast({
      title: "Preview Opened",
      description: "Footer preview opened in new tab. Changes are applied in real-time.",
    });
  };

  const updateSetting = (field: keyof FooterSettings, value: any) => {
    setFooterSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateContactInfo = (field: keyof FooterSettings['contactInfo'], value: string) => {
    setFooterSettings(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
    setFooterSettings(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      name: 'New Social Link',
      url: 'https://example.com',
      icon: 'Facebook',
      color: 'from-blue-600 to-blue-700',
      enabled: true
    };

    setFooterSettings(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));

    toast({
      title: "Social Link Added",
      description: "New social media link has been added. Don't forget to save your changes.",
    });
  };

  const removeSocialLink = (index: number) => {
    const linkName = footerSettings.socialLinks[index]?.name || 'link';
    
    if (window.confirm(`Are you sure you want to remove the ${linkName} social link?`)) {
      setFooterSettings(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.filter((_, i) => i !== index)
      }));

      toast({
        title: "Social Link Removed",
        description: `${linkName} has been removed from the footer.`,
      });
    }
  };

  const updateQuickLink = (index: number, field: keyof QuickLink, value: any) => {
    setFooterSettings(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addQuickLink = () => {
    const newLink: QuickLink = {
      id: `quick-${Date.now()}`,
      label: 'New Link',
      url: '/new-page',
      enabled: true
    };

    setFooterSettings(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, newLink]
    }));

    toast({
      title: "Quick Link Added",
      description: "New quick link has been added. Don't forget to save your changes.",
    });
  };

  const removeQuickLink = (index: number) => {
    const linkLabel = footerSettings.quickLinks[index]?.label || 'link';
    
    if (window.confirm(`Are you sure you want to remove the "${linkLabel}" quick link?`)) {
      setFooterSettings(prev => ({
        ...prev,
        quickLinks: prev.quickLinks.filter((_, i) => i !== index)
      }));

      toast({
        title: "Quick Link Removed",
        description: `"${linkLabel}" has been removed from the footer.`,
      });
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Footer Settings</h3>
            <p className="text-sm text-gray-600">Customize your website footer content and appearance</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Footer
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="links">Quick Links</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div>
              <Label htmlFor="description">Footer Description</Label>
              <Textarea
                id="description"
                value={footerSettings.description}
                onChange={(e) => updateSetting('description', e.target.value)}
                rows={4}
                className="mt-2"
                placeholder="Brief description about your organization..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quickLinksTitle">Quick Links Section Title</Label>
                <Input
                  id="quickLinksTitle"
                  value={footerSettings.quickLinksTitle}
                  onChange={(e) => updateSetting('quickLinksTitle', e.target.value)}
                  className="mt-2"
                  placeholder="Quick Links"
                />
              </div>
              <div>
                <Label htmlFor="contactTitle">Contact Section Title</Label>
                <Input
                  id="contactTitle"
                  value={footerSettings.contactTitle}
                  onChange={(e) => updateSetting('contactTitle', e.target.value)}
                  className="mt-2"
                  placeholder="Contact Info"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="copyrightText">Copyright Text</Label>
              <Input
                id="copyrightText"
                value={footerSettings.copyrightText}
                onChange={(e) => updateSetting('copyrightText', e.target.value)}
                className="mt-2"
                placeholder="© 2024 Your Company. All rights reserved."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
                <Input
                  id="privacyUrl"
                  value={footerSettings.privacyPolicyUrl}
                  onChange={(e) => updateSetting('privacyPolicyUrl', e.target.value)}
                  className="mt-2"
                  placeholder="/privacy"
                />
              </div>
              <div>
                <Label htmlFor="termsUrl">Terms of Service URL</Label>
                <Input
                  id="termsUrl"
                  value={footerSettings.termsOfServiceUrl}
                  onChange={(e) => updateSetting('termsOfServiceUrl', e.target.value)}
                  className="mt-2"
                  placeholder="/terms"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Social Media Links</h4>
                <p className="text-sm text-gray-600">Manage your social media presence in the footer</p>
              </div>
              <Button onClick={addSocialLink} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </div>

            <div className="space-y-4">
              {footerSettings.socialLinks.map((link, index) => {
                const IconComponent = socialIconOptions.find(opt => opt.value === link.icon)?.icon || Facebook;
                return (
                  <Card key={link.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${link.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{link.name}</h5>
                            <p className="text-sm text-gray-500">{link.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) => updateSocialLink(index, 'enabled', checked)}
                          />
                          <Button
                            onClick={() => removeSocialLink(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Platform Name</Label>
                          <Input
                            value={link.name}
                            onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                            className="mt-2"
                            placeholder="Platform name"
                          />
                        </div>
                        <div>
                          <Label>Profile URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                            className="mt-2"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label>Icon</Label>
                          <Select
                            value={link.icon}
                            onValueChange={(value) => updateSocialLink(index, 'icon', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {socialIconOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center space-x-2">
                                    <option.icon className="h-4 w-4" />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Color</Label>
                          <Select
                            value={link.color}
                            onValueChange={(value) => updateSocialLink(index, 'color', value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {colorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center space-x-2">
                                    <div 
                                      className="w-4 h-4 rounded"
                                      style={{ backgroundColor: option.preview }}
                                    ></div>
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Quick Links</h4>
                <p className="text-sm text-gray-600">Manage navigation links in the footer</p>
              </div>
              <Button onClick={addQuickLink} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Quick Link
              </Button>
            </div>

            <div className="space-y-4">
              {footerSettings.quickLinks.map((link, index) => (
                <Card key={link.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900">{link.label}</h5>
                        <p className="text-sm text-gray-500">{link.url}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={link.enabled}
                          onCheckedChange={(checked) => updateQuickLink(index, 'enabled', checked)}
                        />
                        <Button
                          onClick={() => removeQuickLink(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Link Label</Label>
                        <Input
                          value={link.label}
                          onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                          className="mt-2"
                          placeholder="Link text"
                        />
                      </div>
                      <div>
                        <Label>Link URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                          className="mt-2"
                          placeholder="/page-url"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input
                    id="contactEmail"
                    value={footerSettings.contactInfo.email}
                    onChange={(e) => updateContactInfo('email', e.target.value)}
                    className="mt-2"
                    placeholder="info@yourcompany.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={footerSettings.contactInfo.phone}
                    onChange={(e) => updateContactInfo('phone', e.target.value)}
                    className="mt-2"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="contactAddress">Address</Label>
                  <Input
                    id="contactAddress"
                    value={footerSettings.contactInfo.address}
                    onChange={(e) => updateContactInfo('address', e.target.value)}
                    className="mt-2"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}