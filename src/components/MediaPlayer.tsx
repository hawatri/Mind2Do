import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ExternalLink, X } from 'lucide-react';

interface MediaPlayerProps {
  media: {
    type: 'image' | 'document' | 'link';
    url: string;
    name: string;
    id: string;
    linkType?: 'youtube' | 'video' | 'audio' | 'other';
  };
  isOpen: boolean;
  onClose: () => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  media,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen || media.type !== 'link') return null;

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&rel=0`;
    }
    return url;
  };

  const getVimeoEmbedUrl = (url: string): string => {
    const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
    if (videoIdMatch) {
      return `https://player.vimeo.com/video/${videoIdMatch[1]}`;
    }
    return url;
  };

  const renderPlayer = () => {
    switch (media.linkType) {
      case 'youtube':
        return (
          <iframe
            src={getYouTubeEmbedUrl(media.url)}
            title={media.name}
            className="w-full h-48 sm:h-64 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      
      case 'video':
        if (media.url.includes('vimeo.com')) {
          return (
            <iframe
              src={getVimeoEmbedUrl(media.url)}
              title={media.name}
              className="w-full h-64 sm:h-80 rounded-lg"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          );
        } else {
          return (
            <video
              controls
              className="w-full h-64 sm:h-80 rounded-lg bg-black"
              preload="metadata"
            >
              <source src={media.url} type="video/mp4" />
              <source src={media.url} type="video/webm" />
              <source src={media.url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          );
        }
      
      case 'audio':
        if (media.url.includes('soundcloud.com')) {
          const trackIdMatch = media.url.match(/soundcloud\.com\/[^\/]+\/([^\/\?]+)/);
          if (trackIdMatch) {
            return (
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(media.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                className="rounded-lg"
              />
            );
          }
        }
        return (
          <audio
            controls
            className="w-full h-48 sm:h-64 rounded-lg bg-black"
            preload="metadata"
          >
            <source src={media.url} type="audio/mpeg" />
            <source src={media.url} type="audio/wav" />
            <source src={media.url} type="audio/ogg" />
            Your browser does not support the audio tag.
          </audio>
        );
      
      default:
        return (
          <div className="w-full h-48 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ExternalLink className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This link type is not supported for embedded playback
              </p>
              <button
                onClick={() => window.open(media.url, '_blank')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Player Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {media.name}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open(media.url, '_blank')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Player */}
          <div className="p-3">
            {renderPlayer()}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="capitalize">{media.linkType}</span> • {media.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 truncate max-w-48">
                {media.url}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};