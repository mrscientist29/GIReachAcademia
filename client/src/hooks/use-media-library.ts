import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  altText?: string;
  description?: string;
  uploadedById?: string;
  createdAt: string;
}

interface UseMediaLibraryReturn {
  media: MediaItem[];
  isLoading: boolean;
  error: string | null;
  refreshMedia: () => Promise<void>;
  deleteMedia: (id: string) => Promise<boolean>;
  updateMedia: (id: string, updates: Partial<MediaItem>) => Promise<MediaItem | null>;
}

export function useMediaLibrary(): UseMediaLibraryReturn {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/media', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media library');
      }

      const mediaData = await response.json();
      setMedia(mediaData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load media';
      setError(errorMessage);
      console.error('Media library fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMedia = async () => {
    await fetchMedia();
  };

  const deleteMedia = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete media item');
      }

      // Remove from local state
      setMedia(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Media deleted",
        description: "The media item has been deleted successfully.",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete media';
      toast({
        title: "Delete failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateMedia = async (id: string, updates: Partial<MediaItem>): Promise<MediaItem | null> => {
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update media item');
      }

      const updatedMedia = await response.json();
      
      // Update local state
      setMedia(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedMedia } : item
      ));

      toast({
        title: "Media updated",
        description: "The media item has been updated successfully.",
      });

      return updatedMedia;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update media';
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return {
    media,
    isLoading,
    error,
    refreshMedia,
    deleteMedia,
    updateMedia,
  };
}