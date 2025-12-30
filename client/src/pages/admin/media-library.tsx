import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMediaLibrary } from "@/hooks/use-media-library";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImageUpload } from "@/components/image-upload";
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

function MediaLibraryContent() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'document'>('all');

  const { media, isLoading, error, refreshMedia, deleteMedia, updateMedia } = useMediaLibrary();
  const { uploadMultipleImages } = useImageUpload();

  const filteredItems = media.filter(item => {
    const matchesSearch = item.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.fileType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    // This will be handled by the ImageUpload component
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "The media URL has been copied to your clipboard.",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteMedia(id);
      if (success) {
        await refreshMedia();
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6 text-gray-400" />;
      case 'video':
        return <Video className="h-6 w-6 text-gray-400" />;
      case 'document':
        return <File className="h-6 w-6 text-gray-400" />;
      default:
        return <File className="h-6 w-6 text-gray-400" />;
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="media-library">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading media library...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout currentPage="media-library">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading media library: {error}</p>
          <Button onClick={refreshMedia}>Try Again</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
              <p className="text-gray-600 mt-2">Manage your uploaded images, videos, and documents</p>
            </div>
            <ImageUpload
              onImageSelect={async (imageUrl, imageData) => {
                await refreshMedia();
                toast({
                  title: "Image uploaded",
                  description: "Your image has been added to the media library.",
                });
              }}
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              }
            />
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
                    {item.fileType === 'image' ? (
                      <img
                        src={item.fileUrl}
                        alt={item.altText || item.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(item.fileType)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{item.originalName}</h3>
                      <Badge className={getTypeBadgeColor(item.fileType)}>
                        {item.fileType}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>{formatFileSize(item.fileSize)} • {formatDate(item.createdAt)}</p>
                      {item.description && <p className="truncate">{item.description}</p>}
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => handleCopyUrl(item.fileUrl)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(item.fileUrl, '_blank')}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(item.fileUrl, '_blank')}>
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(item.id, item.originalName)}
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
                      <th className="text-left py-3 px-6 font-medium text-gray-900">Description</th>
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
                              {item.fileType === 'image' ? (
                                <img
                                  src={item.fileUrl}
                                  alt={item.altText || item.originalName}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                getTypeIcon(item.fileType)
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{item.originalName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={getTypeBadgeColor(item.fileType)}>
                            {item.fileType}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{formatFileSize(item.fileSize)}</td>
                        <td className="py-4 px-6 text-gray-600">{item.description || '-'}</td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(item.createdAt)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleCopyUrl(item.fileUrl)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => window.open(item.fileUrl, '_blank')}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => window.open(item.fileUrl, '_blank')}>
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(item.id, item.originalName)}
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
              <ImageUpload
                onImageSelect={async (imageUrl, imageData) => {
                  await refreshMedia();
                  toast({
                    title: "Image uploaded",
                    description: "Your image has been added to the media library.",
                  });
                }}
                trigger={
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                }
              />
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