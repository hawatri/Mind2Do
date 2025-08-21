// 1. First, create an InlineVideoPlayer component
// src/components/InlineVideoPlayer.tsx

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';

interface InlineVideoPlayerProps {
  media: {
    type: 'link';
    url: string;
    name: string;
    id: string;
    linkType?: 'youtube' | 'video' | 'audio' | 'other';
  };
  onClose: () => void;
  onFullscreen?: () => void;
}

export const InlineVideoPlayer: React.FC<InlineVideoPlayerProps> = ({
  media,
  onClose,
  onFullscreen,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    }
    return url;
  };

  const getVimeoEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
    if (videoIdMatch) {
      return `https://player.vimeo.com/video/${videoIdMatch[1]}?title=0&byline=0&portrait=0`;
    }
    return url;
  };

  const renderInlinePlayer = () => {
    switch (media.linkType) {
      case 'youtube':
        return (
          <div className="relative w-full aspect-video bg-black rounded">
            <iframe
              src={getYouTubeEmbedUrl(media.url)}
              title={media.name}
              className="w-full h-full rounded"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      
      case 'video':
        if (media.url.includes('vimeo.com')) {
          return (
            <div className="relative w-full aspect-video bg-black rounded">
              <iframe
                src={getVimeoEmbedUrl(media.url)}
                title={media.name}
                className="w-full h-full rounded"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        } else {
          return (
            <div className="relative w-full aspect-video bg-black rounded">
              <video
                controls
                className="w-full h-full rounded"
                preload="metadata"
              >
                <source src={media.url} type="video/mp4" />
                <source src={media.url} type="video/webm" />
                <source src={media.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
      
      case 'audio':
        if (media.url.includes('soundcloud.com')) {
          return (
            <div className="w-full bg-orange-100 dark:bg-orange-900/20 rounded p-2">
              <iframe
                width="100%"
                height="120"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(media.url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`}
                className="rounded"
              />
            </div>
          );
        }
        return (
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded p-2">
            <audio
              controls
              className="w-full"
              preload="metadata"
            >
              <source src={media.url} type="audio/mpeg" />
              <source src={media.url} type="audio/wav" />
              <source src={media.url} type="audio/ogg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      
      default:
        return (
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Preview not available for this link type
            </p>
            <button
              onClick={() => window.open(media.url, '_blank')}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Open Link
            </button>
          </div>
        );
    }
  };

  return (
    <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {media.name}
          </div>
          <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-400">
            {media.linkType?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400"
              title="Fullscreen"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Video/Audio Player */}
      <div className="p-2">
        {renderInlinePlayer()}
      </div>
    </div>
  );
};