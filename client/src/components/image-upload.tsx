import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useMediaLibrary } from '@/hooks/use-media-library';
import { Upload, ImageIcon, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string, imageData?: any) => void;
  currentImageUrl?: string;
  trigger?: React.ReactNode;
}

export function ImageUpload({ onImageSelect, currentImageUrl, trigger }: ImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upload' | 'library'>('upload');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploadMultipleImages, isUploading, progress } = useImageUpload();
  const { media, isLoading: isLoadingMedia, refreshMedia } = useMediaLibrary();

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;

    if (files.length === 1) {
      const uploadedImage = await uploadImage(files[0], { altText, description });
      if (uploadedImage) {
        onImageSelect(uploadedImage.fileUrl, uploadedImage);
        setIsOpen(false);
        setAltText('');
        setDescription('');
      }
    } else {
      const uploadedImages = await uploadMultipleImages(files);
      if (uploadedImages.length > 0) {
        // Select the first uploaded image
        onImageSelect(uploadedImages[0].fileUrl, uploadedImages[0]);
        setIsOpen(false);
      }
    }
    
    // Refresh media library
    await refreshMedia();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileSelect(files);
  };

  const handleMediaSelect = (mediaItem: any) => {
    onImageSelect(mediaItem.fileUrl, mediaItem);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                selectedTab === 'upload' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('upload')}
            >
              Upload New
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                selectedTab === 'library' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedTab('library')}
            >
              Media Library
            </button>
          </div>

          {/* Upload Tab */}
          {selectedTab === 'upload' && (
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
                    <p className="text-lg font-medium">Uploading...</p>
                    {progress && (
                      <div className="max-w-xs mx-auto">
                        <Progress value={progress.percentage} />
                        <p className="text-sm text-gray-500 mt-2">
                          {Math.round(progress.percentage)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Drop images here or click to browse</p>
                      <p className="text-sm text-gray-500">
                        Supports JPEG, PNG, GIF, WebP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="altText">Alt Text</Label>
                  <Input
                    id="altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Media Library Tab */}
          {selectedTab === 'library' && (
            <div className="flex-1 overflow-auto">
              {isLoadingMedia ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading media library...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageUrl === item.fileUrl
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleMediaSelect(item)}
                    >
                      <div className="aspect-square">
                        <img
                          src={item.fileUrl}
                          alt={item.altText || item.originalName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <p className="text-white text-xs truncate">
                          {item.originalName}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {media.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No images in your media library</p>
                      <p className="text-sm text-gray-400">Upload some images to get started</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}