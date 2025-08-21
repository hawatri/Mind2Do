import React, { useState, useEffect } from 'react';
import { Play, Youtube, Video, Music, ExternalLink } from 'lucide-react';

// Simple thumbnail utility functions (inline)
const getVideoThumbnail = (url: string, linkType: string): string | null => {
  switch (linkType) {
    case 'youtube':
      return getYouTubeThumbnail(url);
    case 'video':
      if (url.includes('vimeo.com')) {
        return getVimeoThumbnailFromUrl(url);
      }
      return null;
    default:
      return null;
  }
};

const getYouTubeThumbnail = (url: string): string | null => {
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
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  return null;
};

const getVimeoThumbnailFromUrl = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match && match[1]) {
    return `https://vumbnail.com/${match[1]}.jpg`;
  }
  return null;
};

const generateFallbackThumbnail = (linkType: string, name: string): string => {
  const colors = {
    youtube: '#FF0000',
    video: '#3B82F6',
    audio: '#22C55E',
    other: '#6B7280'
  };
  
  const color = colors[linkType as keyof typeof colors] || colors.other;
  
  // Create SVG data URL for fallback thumbnail
  const svg = `
    <svg width="320" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">
        ${linkType.toUpperCase()}
      </text>
      <text x="50%" y="65%" text-anchor="middle" fill="white" font-family="Arial" font-size="12">
        ${name.length > 30 ? name.substring(0, 30) + '...' : name}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

interface VideoThumbnailProps {
  media: {
    type: 'link';
    url: string;
    name: string;
    id: string;
    linkType?: 'youtube' | 'video' | 'audio' | 'other';
  };
  onPlay?: () => void;
  onExternalLink?: () => void;
  className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  media,
  onPlay,
  onExternalLink,
  className = ''
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getThumbnail = async () => {
      if (media.linkType) {
        const thumbnail = getVideoThumbnail(media.url, media.linkType);
        if (thumbnail) {
          setThumbnailUrl(thumbnail);
        } else {
          // Generate fallback thumbnail
          const fallback = generateFallbackThumbnail(media.linkType, media.name);
          setThumbnailUrl(fallback);
        }
      }
    };

    getThumbnail();
  }, [media.url, media.linkType, media.name]);

  const getIcon = () => {
    switch (media.linkType) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      default:
        return <ExternalLink className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleImageError = () => {
    setImageError(true);
    // Generate fallback thumbnail when image fails to load
    if (media.linkType) {
      const fallback = generateFallbackThumbnail(media.linkType, media.name);
      setThumbnailUrl(fallback);
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={media.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
            {getIcon()}
          </div>
        )}

        {/* Overlay with Play Button */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transform transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Play className="w-6 h-6 text-gray-800 ml-0.5" fill="currentColor" />
          </button>
        </div>

        {/* Link Type Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
            {media.linkType === 'youtube' && <Youtube className="w-3 h-3" />}
            {media.linkType === 'video' && <Video className="w-3 h-3" />}
            {media.linkType === 'audio' && <Music className="w-3 h-3" />}
            <span className="uppercase">{media.linkType}</span>
          </div>
        </div>

        {/* External Link Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExternalLink?.();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onExternalLink?.();
            }}
            className={`bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-1.5 rounded transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-70'}`}
            title="Open externally"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {media.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {media.url}
        </p>
      </div>
    </div>
  );
};