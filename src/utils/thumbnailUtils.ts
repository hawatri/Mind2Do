// 1. Create utility functions for getting video thumbnails
// Create: src/utils/thumbnailUtils.ts

export const getVideoThumbnail = (url: string, linkType: string): string | null => {
    switch (linkType) {
      case 'youtube':
        return getYouTubeThumbnail(url);
      case 'vimeo':
        // Vimeo thumbnails require API calls, so we'll return null for now
        // You can implement Vimeo API integration later if needed
        return null;
      case 'video':
        if (url.includes('vimeo.com')) {
          return getVimeoThumbnailFromUrl(url);
        }
        // For direct video URLs, we can't get thumbnails without loading the video
        return null;
      default:
        return null;
    }
  };
  
  export const getYouTubeThumbnail = (url: string): string | null => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
      /(?:youtube\.com\/v\/)([^&\n?#]+)/
    ];
  
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const videoId = match[1];
        // YouTube provides several thumbnail qualities
        // maxresdefault.jpg - highest quality (may not exist for all videos)
        // hqdefault.jpg - high quality
        // mqdefault.jpg - medium quality
        // sddefault.jpg - standard definition
        // default.jpg - default quality (always available)
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return null;
  };
  
  export const getVimeoThumbnailFromUrl = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      // For Vimeo, we'll use a placeholder or you can implement Vimeo API
      // Vimeo requires API calls to get thumbnails
      return `https://vumbnail.com/${match[1]}.jpg`; // Third-party service
    }
    return null;
  };
  
  // Fallback thumbnail generator for when no thumbnail is available
  export const generateFallbackThumbnail = (linkType: string, name: string): string => {
    // You can create a simple colored placeholder or use a service
    const colors = {
      youtube: 'rgb(255, 0, 0)',
      video: 'rgb(59, 130, 246)',
      audio: 'rgb(34, 197, 94)',
      other: 'rgb(107, 114, 128)'
    };
    
    const color = colors[linkType as keyof typeof colors] || colors.other;
    
    // Create a data URL for a simple colored rectangle with text
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw link type
      ctx.fillText(linkType.toUpperCase(), canvas.width / 2, canvas.height / 2 - 10);
      
      // Draw truncated name
      const truncatedName = name.length > 30 ? name.substring(0, 30) + '...' : name;
      ctx.font = '12px Arial';
      ctx.fillText(truncatedName, canvas.width / 2, canvas.height / 2 + 15);
    }
    
    return canvas.toDataURL();
  };