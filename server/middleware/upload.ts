import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { Request } from 'express';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
const imagesDir = path.join(uploadsDir, 'images');

async function ensureDirectories() {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  
  try {
    await fs.access(imagesDir);
  } catch {
    await fs.mkdir(imagesDir, { recursive: true });
  }
}

// Initialize directories
ensureDirectories();

// Configure multer for memory storage (we'll process with sharp)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Image processing function
export async function processImage(
  buffer: Buffer,
  filename: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<{ filename: string; path: string; url: string; size: number; dimensions: { width: number; height: number } }> {
  const {
    width = 1920,
    height = 1080,
    quality = 85,
    format = 'jpeg'
  } = options;

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const processedFilename = `${timestamp}-${randomString}.${format}`;
  const filePath = path.join(imagesDir, processedFilename);

  // Process image with sharp
  const processedBuffer = await sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: format === 'jpeg' ? quality : undefined })
    .png({ quality: format === 'png' ? quality : undefined })
    .webp({ quality: format === 'webp' ? quality : undefined })
    .toBuffer();

  // Get image metadata
  const metadata = await sharp(processedBuffer).metadata();

  // Save processed image
  await fs.writeFile(filePath, processedBuffer);

  return {
    filename: processedFilename,
    path: filePath,
    url: `/uploads/images/${processedFilename}`,
    size: processedBuffer.length,
    dimensions: {
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  };
}

// Generate thumbnail
export async function generateThumbnail(
  buffer: Buffer,
  filename: string
): Promise<{ filename: string; path: string; url: string }> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const thumbnailFilename = `thumb-${timestamp}-${randomString}.jpeg`;
  const thumbnailPath = path.join(imagesDir, thumbnailFilename);

  const thumbnailBuffer = await sharp(buffer)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  await fs.writeFile(thumbnailPath, thumbnailBuffer);

  return {
    filename: thumbnailFilename,
    path: thumbnailPath,
    url: `/uploads/images/${thumbnailFilename}`
  };
}