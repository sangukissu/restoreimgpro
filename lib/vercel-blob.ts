import { put, del } from '@vercel/blob';

/**
 * Upload a video file to Vercel Blob storage
 * @param videoBuffer - The video file buffer
 * @param filename - The filename for the video
 * @param userId - The user ID for organizing files
 * @returns Promise with the blob URL
 */
export async function uploadVideoToBlob(
  videoBuffer: Buffer,
  filename: string,
  userId: string
): Promise<string> {
  try {
    // Create a unique filename with user ID prefix
    const uniqueFilename = `videos/${userId}/${Date.now()}-${filename}`;
    
    const blob = await put(uniqueFilename, videoBuffer, {
      access: 'public',
      contentType: 'video/mp4',
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading video to Vercel Blob:', error);
    throw new Error('Failed to upload video to storage');
  }
}

/**
 * Download a video from a URL and return as buffer
 * @param videoUrl - The URL of the video to download
 * @returns Promise with the video buffer
 */
export async function downloadVideoFromUrl(videoUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error('Failed to download video');
  }
}

/**
 * Delete a video from Vercel Blob storage
 * @param blobUrl - The Vercel Blob URL to delete
 * @returns Promise<void>
 */
export async function deleteVideoFromBlob(blobUrl: string): Promise<void> {
  try {
    await del(blobUrl);
  } catch (error) {
    console.error('Error deleting video from Vercel Blob:', error);
    throw new Error('Failed to delete video from storage');
  }
}

/**
 * Extract filename from Vercel Blob URL
 * @param blobUrl - The Vercel Blob URL
 * @returns The filename
 */
export function extractFilenameFromBlobUrl(blobUrl: string): string {
  try {
    const url = new URL(blobUrl);
    const pathname = url.pathname;
    return pathname.split('/').pop() || 'video.mp4';
  } catch (error) {
    console.error('Error extracting filename from blob URL:', error);
    return 'video.mp4';
  }
}

/**
 * Validate video file size and type
 * @param buffer - The video buffer
 * @param maxSizeInMB - Maximum file size in MB (default: 100MB)
 * @returns Validation result
 */
export function validateVideoFile(
  buffer: Buffer,
  maxSizeInMB: number = 100
): { valid: boolean; error?: string } {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (buffer.length > maxSizeInBytes) {
    return {
      valid: false,
      error: `Video file too large. Maximum size is ${maxSizeInMB}MB`
    };
  }
  
  return { valid: true };
}