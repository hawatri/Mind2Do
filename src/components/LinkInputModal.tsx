// 4. Optional: Update LinkInputModal to show thumbnail preview
// Update your LinkInputModal.tsx to include thumbnail preview:

import React, { useState, useEffect } from 'react';
import { X, Link, Youtube, Music, Video } from 'lucide-react';
import { getVideoThumbnail, generateFallbackThumbnail } from '../utils/thumbnailUtils';

interface LinkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: (url: string, name: string, linkType: 'youtube' | 'video' | 'audio' | 'other') => void;
}

export const LinkInputModal: React.FC<LinkInputModalProps> = ({
  isOpen,
  onClose,
  onAddLink,
}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const detectLinkType = (url: string): 'youtube' | 'video' | 'audio' | 'other' => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'youtube';
    }
    
    if (lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.ogg') || 
        lowerUrl.includes('vimeo.com') || lowerUrl.includes('dailymotion.com')) {
      return 'video';
    }
    
    if (lowerUrl.includes('.mp3') || lowerUrl.includes('.wav') || lowerUrl.includes('.ogg') ||
        lowerUrl.includes('soundcloud.com') || lowerUrl.includes('spotify.com')) {
      return 'audio';
    }
    
    return 'other';
  };

  // Update thumbnail preview when URL changes
  useEffect(() => {
    if (url.trim()) {
      const linkType = detectLinkType(url);
      const thumbnail = getVideoThumbnail(url, linkType);
      if (thumbnail) {
        setThumbnailPreview(thumbnail);
      } else if (linkType !== 'other') {
        // Generate fallback for media types
        const fallback = generateFallbackThumbnail(linkType, name || 'Video Preview');
        setThumbnailPreview(fallback);
      } else {
        setThumbnailPreview(null);
      }
    } else {
      setThumbnailPreview(null);
    }
  }, [url, name]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (url.trim() && name.trim()) {
      const linkType = detectLinkType(url.trim());
      onAddLink(url.trim(), name.trim(), linkType);
      
      // Reset form
      setUrl('');
      setName('');
      setThumbnailPreview(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setUrl('');
    setName('');
    setThumbnailPreview(null);
    onClose();
  };

  const getIcon = () => {
    const linkType = detectLinkType(url);
    switch (linkType) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      default:
        return <Link className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Add Media Link
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Media URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supports YouTube, Vimeo, SoundCloud, direct video/audio links, and more
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Video/Audio"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Preview
                </label>
                <img
                  src={thumbnailPreview}
                  alt="Video thumbnail"
                  className="w-full aspect-video object-cover rounded border border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    // Hide preview if thumbnail fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {url && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  {getIcon()}
                  <span>
                    Detected as: <strong className="text-gray-900 dark:text-gray-100">
                      {detectLinkType(url).charAt(0).toUpperCase() + detectLinkType(url).slice(1)}
                    </strong>
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Link className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};