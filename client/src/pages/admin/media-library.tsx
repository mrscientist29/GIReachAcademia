import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin-layout";
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Image as ImageIcon, 
  Video, 
  File, 
  Trash2, 
  Edit, 
  Copy,
  Download,
  Eye
} from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadDate: string;
  dimensions?: string;
}

function MediaLibraryContent() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document'>('all');

  // Mock media data
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'hero-background.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      size: '2.4 MB',
      uploadDate: '2024-12-15',
      dimensions: '1920x1080'
    },
    {
      id: '2',
      name: 'research-team.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      size: '1.8 MB',
      uploadDate: '2024-12-14',
      dimensions: '1600x900'
    },
    {
      id: '3',
      name: 'medical-research.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      size: '2.1 MB',
      uploadDate: '2024-12-13',
      dimensions: '1800x1200'
    },
    {
      id: '4',
      name: 'laboratory.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      size: '1.9 MB',
      uploadDate: '2024-12-12',
      dimensions: '1920x1280'
    },
    {
      id: '5',
      name: 'presentation-video.mp4',
      type: 'video',
      url: '#',
      size: '45.2 MB',
      uploadDate: '2024-12-11',
      dimensions: '1920x1080'
    },
    {
      id: '6',
      name: 'research-guidelines.pdf',
      type: 'document',
      url: '#',
      size: '3.2 MB',
      uploadDate: '2024-12-10'
    }
  ]);

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "File upload functionality would be implemented here.",
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Image URL has been copied to clipboard.",
    });
  };

  const handleDelete = (id: string, name: string) => {
    toast({
      title: "Delete Confirmation",
      description: `Are you sure you want to delete ${name}?`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'document':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-end">
            <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search media files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <Badge className={getTypeBadgeColor(item.type)}>
                        {item.type}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>{item.size} • {item.uploadDate}</p>
                      {item.dimensions && <p>{item.dimensions}</p>}
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleCopyUrl(item.url)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Size</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Dimensions</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Upload Date</th>
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {item.type === 'image' ? (
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                getTypeIcon(item.type)
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={getTypeBadgeColor(item.type)}>
                            {item.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{item.size}</td>
                        <td className="py-4 px-6 text-gray-600">{item.dimensions || '-'}</td>
                        <td className="py-4 px-6 text-gray-600">{item.uploadDate}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleCopyUrl(item.url)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(item.id, item.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredItems.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Media Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedType !== 'all' 
                  ? "No files match your current filters." 
                  : "Upload your first media file to get started."
                }
              </p>
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MediaLibrary() {
  return (
    <AdminLayout currentPage="media-library">
      <MediaLibraryContent />
    </AdminLayout>
  );
}