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
  Edit
} from "lucide-react";

interface PageContent {
  id: string;
  type: 'text' | 'image' | 'hero' | 'section';
  title: string;
  content: string;
  imageUrl?: string;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
  };
}

function PageEditorContent() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pages = [
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

  const loadPageContent = (pageId: string) => {
    // Simulate loading page content - in real app, this would fetch from API
    const mockContent: Record<string, PageContent[]> = {
      home: [
        {
          id: "hero-1",
          type: "hero",
          title: "Hero Section",
          content: "Academic Growth Through Research Excellence",
          imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          styles: {
            backgroundColor: "#3b82f6",
            textColor: "#ffffff",
            fontSize: "48px"
          }
        },
        {
          id: "stats-1",
          type: "section",
          title: "Statistics Section",
          content: "500+ Research Papers | 200+ Active Researchers | 50+ Partner Institutions",
          styles: {
            backgroundColor: "#f8fafc",
            textColor: "#1e293b"
          }
        },
        {
          id: "services-1",
          type: "section",
          title: "Services Section",
          content: "Our comprehensive research support services including mentorship, publication support, and collaborative opportunities.",
          styles: {
            backgroundColor: "#ffffff",
            textColor: "#374151"
          }
        }
      ],
      about: [
        {
          id: "about-hero",
          type: "hero",
          title: "About Hero",
          content: "About GI REACH - Pakistan's premier gastroenterology research organization",
          imageUrl: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        }
      ]
    };

    setPageContent(mockContent[pageId] || []);
  };

  const handleSaveContent = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save content
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Content Saved",
        description: `${pages.find(p => p.id === selectedPage)?.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = (id: string, field: string, value: string) => {
    setPageContent(prev => prev.map(item => 
      item.id === id 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const updateStyles = (id: string, styleField: string, value: string) => {
    setPageContent(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            styles: { 
              ...item.styles, 
              [styleField]: value 
            }
          }
        : item
    ));
  };

  const addNewSection = () => {
    const newSection: PageContent = {
      id: `section-${Date.now()}`,
      type: "section",
      title: "New Section",
      content: "Enter your content here...",
      styles: {
        backgroundColor: "#ffffff",
        textColor: "#374151"
      }
    };
    setPageContent(prev => [...prev, newSection]);
  };

  const deleteSection = (id: string) => {
    setPageContent(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-end">
            <div className="flex space-x-4">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveContent} disabled={isLoading}>
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
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Editing: {pages.find(p => p.id === selectedPage)?.name}
                  </h3>
                  <Button onClick={addNewSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>

                <div className="space-y-6">
                  {pageContent.map((section) => (
                    <Card key={section.id} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {section.type === "hero" && <Layout className="h-4 w-4 text-blue-600" />}
                            {section.type === "section" && <Type className="h-4 w-4 text-green-600" />}
                            {section.type === "image" && <ImageIcon className="h-4 w-4 text-purple-600" />}
                            <span className="font-medium text-gray-900">{section.title}</span>
                          </div>
                          <Button
                            onClick={() => deleteSection(section.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Tabs defaultValue="content" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="image">Image</TabsTrigger>
                            <TabsTrigger value="style">Style</TabsTrigger>
                          </TabsList>

                          <TabsContent value="content" className="space-y-4">
                            <div>
                              <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                              <Input
                                id={`title-${section.id}`}
                                value={section.title}
                                onChange={(e) => updateContent(section.id, "title", e.target.value)}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`content-${section.id}`}>Content</Label>
                              <Textarea
                                id={`content-${section.id}`}
                                value={section.content}
                                onChange={(e) => updateContent(section.id, "content", e.target.value)}
                                rows={4}
                                className="mt-2"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="image" className="space-y-4">
                            <div>
                              <Label htmlFor={`image-${section.id}`}>Image URL</Label>
                              <Input
                                id={`image-${section.id}`}
                                value={section.imageUrl || ""}
                                onChange={(e) => updateContent(section.id, "imageUrl", e.target.value)}
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

                          <TabsContent value="style" className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`bg-color-${section.id}`}>Background Color</Label>
                                <div className="flex space-x-2 mt-2">
                                  <Input
                                    id={`bg-color-${section.id}`}
                                    type="color"
                                    value={section.styles?.backgroundColor || "#ffffff"}
                                    onChange={(e) => updateStyles(section.id, "backgroundColor", e.target.value)}
                                    className="w-16 h-10 p-1 border rounded"
                                  />
                                  <Input
                                    value={section.styles?.backgroundColor || "#ffffff"}
                                    onChange={(e) => updateStyles(section.id, "backgroundColor", e.target.value)}
                                    placeholder="#ffffff"
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`text-color-${section.id}`}>Text Color</Label>
                                <div className="flex space-x-2 mt-2">
                                  <Input
                                    id={`text-color-${section.id}`}
                                    type="color"
                                    value={section.styles?.textColor || "#000000"}
                                    onChange={(e) => updateStyles(section.id, "textColor", e.target.value)}
                                    className="w-16 h-10 p-1 border rounded"
                                  />
                                  <Input
                                    value={section.styles?.textColor || "#000000"}
                                    onChange={(e) => updateStyles(section.id, "textColor", e.target.value)}
                                    placeholder="#000000"
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`font-size-${section.id}`}>Font Size</Label>
                              <Select
                                value={section.styles?.fontSize || "16px"}
                                onValueChange={(value) => updateStyles(section.id, "fontSize", value)}
                              >
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="12px">Small (12px)</SelectItem>
                                  <SelectItem value="16px">Normal (16px)</SelectItem>
                                  <SelectItem value="20px">Large (20px)</SelectItem>
                                  <SelectItem value="24px">X-Large (24px)</SelectItem>
                                  <SelectItem value="32px">XX-Large (32px)</SelectItem>
                                  <SelectItem value="48px">Huge (48px)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}

                  {pageContent.length === 0 && (
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageEditor() {
  return (
    <AdminLayout currentPage="page-editor">
      <PageEditorContent />
    </AdminLayout>
  );
}