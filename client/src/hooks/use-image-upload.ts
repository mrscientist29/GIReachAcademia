import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadedImage {
  id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  fileSize: number;
  mimeType: string;
}

interface UseImageUploadReturn {
  uploadImage: (file: File, options?: { altText?: string; description?: string }) => Promise<UploadedImage | null>;
  uploadMultipleImages: (files: File[]) => Promise<UploadedImage[]>;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadImage = async (
    file: File, 
    options: { altText?: string; description?: string } = {}
  ): Promise<UploadedImage | null> => {
    setIsUploading(true);
    setError(null);
    setProgress(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      if (options.altText) formData.append('altText', options.altText);
      if (options.description) formData.append('description', options.description);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const uploadedImage = await response.json();
      
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} has been uploaded to your media library.`,
      });

      return uploadedImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<UploadedImage[]> => {
    setIsUploading(true);
    setError(null);
    setProgress(null);

    try {
      // Validate files
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          });
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 10MB`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        throw new Error('No valid image files selected');
      }

      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/admin/media/bulk', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bulk upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "Images uploaded successfully",
        description: result.message,
      });

      return result.media || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bulk upload failed';
      setError(errorMessage);
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });

      return [];
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    progress,
    error,
  };
}