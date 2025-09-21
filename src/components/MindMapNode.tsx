import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Plus, Image, FileText, ExternalLink, Play, Link, Youtube, Music, Video } from 'lucide-react';
import { MindMapNode as NodeType } from '../types';
import { MediaPlayer } from './MediaPlayer';
import { useFilePaths } from '../hooks/useFilePaths';
import { InlineVideoPlayer } from './InlineVideoPlayer';
import { VideoThumbnail } from './VideoThumbnail';

interface MindMapNodeProps {
  node: NodeType;
  isSelected: boolean;
  isMultiSelected: boolean;
  onNodeSelect: (id: string) => void;
  onNodeMultiSelect: (id: string, isCtrlPressed: boolean) => void;
  onNodeUpdate: (id: string, updates: Partial<NodeType>) => void;
  onNodeDelete: (id: string) => void;
  onNodeCreate: (parentId: string, x: number, y: number) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeResize: (id: string, width: number, height: number) => void;
  onRemoveMedia: (nodeId: string, mediaId: string) => void;
  isHandTool: boolean;
  zoom: number;
}

export const MindMapNode: React.FC<MindMapNodeProps> = ({
  node,
  isSelected,
  isMultiSelected,
  onNodeSelect,
  onNodeMultiSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeCreate,
  onNodeMove,
  onNodeResize,
  onRemoveMedia,
  isHandTool,
  zoom,
}) => {
  const { openFile, openBase64File, getFilePath } = useFilePaths();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedMediaForPlayer, setSelectedMediaForPlayer] = useState<any>(null);
  const [editingTextElement, setEditingTextElement] = useState<{ type: 'title' | 'description', wordIndex: number } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);
  const [inlinePlayerMedia, setInlinePlayerMedia] = useState<any>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  useEffect(() => {
    if (editingTextElement && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [editingTextElement]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isHandTool) {
      e.stopPropagation();
      return;
    }
    
    if (e.target === nodeRef.current || (e.target as Element).closest('.node-handle')) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      const rect = nodeRef.current!.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      
      if (e.ctrlKey || e.metaKey) {
        onNodeMultiSelect(node.id, true);
      } else {
        onNodeSelect(node.id);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isHandTool) {
      e.stopPropagation();
      return;
    }
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (e.target === nodeRef.current || (e.target as Element).closest('.node-handle')) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        const rect = nodeRef.current!.getBoundingClientRect();
        setDragOffset({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
        
        onNodeSelect(node.id);
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const container = nodeRef.current!.parentElement!.getBoundingClientRect();
      // Account for zoom level in drag calculations
      const newX = (e.clientX - container.left - dragOffset.x) / zoom;
      const newY = (e.clientY - container.top - dragOffset.y) / zoom;
      onNodeMove(node.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const container = nodeRef.current!.parentElement!.getBoundingClientRect();
      // Account for zoom level in drag calculations
      const newX = (touch.clientX - container.left - dragOffset.x) / zoom;
      const newY = (touch.clientY - container.top - dragOffset.y) / zoom;
      onNodeMove(node.id, newX, newY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    if (isHandTool) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: node.width || 256,
      height: node.height || 200
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !resizeHandle) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    
    // Calculate new dimensions based on resize handle
    if (resizeHandle.includes('right')) {
      newWidth = Math.max(200, resizeStart.width + deltaX);
    }
    if (resizeHandle.includes('left')) {
      newWidth = Math.max(200, resizeStart.width - deltaX);
    }
    if (resizeHandle.includes('bottom')) {
      newHeight = Math.max(150, resizeStart.height + deltaY);
    }
    if (resizeHandle.includes('top')) {
      newHeight = Math.max(150, resizeStart.height - deltaY);
    }
    
    onNodeResize(node.id, newWidth, newHeight);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, resizeHandle, resizeStart]);

  const handleTitleSubmit = (title: string) => {
    if (title.trim()) {
      onNodeUpdate(node.id, { title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSubmit = (description: string) => {
    onNodeUpdate(node.id, { description: description.trim() || 'Click to edit description' });
    setIsEditingDescription(false);
  };

  // Inline text editing handlers
  const handleWordClick = (e: React.MouseEvent, type: 'title' | 'description', wordIndex: number) => {
    if (isHandTool) return;
    e.preventDefault();
    e.stopPropagation();
    setEditingTextElement({ type, wordIndex });
  };

  const handleInlineTextSubmit = (newText: string) => {
    if (!editingTextElement) return;
    
    const { type, wordIndex } = editingTextElement;
    const currentText = type === 'title' ? node.title : node.description;
    const words = currentText.split(' ');
    
    if (wordIndex >= 0 && wordIndex < words.length) {
      words[wordIndex] = newText;
      const updatedText = words.join(' ');
      
      if (type === 'title') {
        onNodeUpdate(node.id, { title: updatedText });
      } else {
        onNodeUpdate(node.id, { description: updatedText });
      }
    }
    
    setEditingTextElement(null);
  };

  const renderTextWithInlineEditing = (text: string, type: 'title' | 'description') => {
    const words = text.split(' ');
    
    return words.map((word, index) => {
      const isEditing = editingTextElement?.type === type && editingTextElement?.wordIndex === index;
      
      if (isEditing) {
        return (
          <input
            key={index}
            ref={inlineInputRef}
            type="text"
            defaultValue={word}
            className="inline bg-transparent border-b-2 border-blue-500 outline-none min-w-0"
            style={{ width: `${Math.max(word.length * 8, 20)}px` }}
            onBlur={(e) => handleInlineTextSubmit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInlineTextSubmit((e.target as HTMLInputElement).value);
              } else if (e.key === 'Escape') {
                setEditingTextElement(null);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        );
      }
      
      return (
        <span
          key={index}
          className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded px-1 transition-colors"
          onClick={(e) => handleWordClick(e, type, index)}
          title="Click to edit this word"
        >
          {word}
        </span>
      );
    });
  };

  const getHighlightClass = (highlight: string) => {
    switch (highlight) {
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'green': return 'bg-green-200 dark:bg-green-900/30';
      case 'blue': return 'bg-blue-200 dark:bg-blue-900/30';
      case 'pink': return 'bg-pink-200 dark:bg-pink-900/30';
      case 'purple': return 'bg-purple-200 dark:bg-purple-900/30';
      default: return '';
    }
  };

  const getTextColorClass = (textColor: string) => {
    switch (textColor) {
      case 'red': return 'text-red-700 dark:text-red-400';
      case 'blue': return 'text-blue-700 dark:text-blue-400';
      case 'green': return 'text-green-700 dark:text-green-400';
      case 'purple': return 'text-purple-700 dark:text-purple-400';
      case 'orange': return 'text-orange-700 dark:text-orange-400';
      case 'pink': return 'text-pink-700 dark:text-pink-400';
      default: return 'text-gray-900 dark:text-gray-100';
    }
  };

  const getTextStyle = () => {
    const { formatting } = node;
    return {
      fontWeight: formatting.bold ? 'bold' : 'normal',
      fontStyle: formatting.italic ? 'italic' : 'normal',
      textDecoration: `${formatting.underline ? 'underline' : ''} ${formatting.strikethrough ? 'line-through' : ''}`.trim() || 'none',
    };
  };

  const getFontSizeClass = (fontSize: string) => {
    switch (fontSize) {
      case 'small': return 'text-xs';
      case 'medium': return 'text-sm';
      case 'large': return 'text-lg';
      case 'xlarge': return 'text-xl';
      default: return 'text-sm';
    }
  };

  const getFontFamilyClass = (fontFamily: string) => {
    switch (fontFamily) {
      case 'serif': return 'font-serif';
      case 'monospace': return 'font-mono';
      case 'cursive': return 'font-cursive';
      default: return 'font-sans';
    }
  };

  const getTextAlignClass = (textAlign: string) => {
    switch (textAlign) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const handleOpenMedia = async (media: any) => {
    try {
      // First check if we have a file path stored in the media object
      if (media.filePath) {
        const success = await openFile(media.filePath);
        if (success) return;
      }
      
      // Then check if we have a file path in our file paths storage
      const filePath = getFilePath(media.id);
      
      if (filePath) {
        // Use the stored file path
        const success = await openFile(filePath.path);
        if (success) return;
      }

      // Fallback to the improved base64 method for data URLs
      if (media.url.startsWith('data:')) {
        // Extract MIME type from the data URL
        const mimeType = media.url.split(',')[0].split(':')[1].split(';')[0];
        
        // Use the improved base64 file opening method
        const success = await openBase64File(media.url, media.name, mimeType);
        if (success) return;
        
        // If that fails, show an error message
        alert('Failed to open file. The file may be too large or corrupted.');
      } else {
        // Fallback for regular URLs
        window.open(media.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open file. Please try again.');
    }
  };

  const getMediaIcon = (media: any) => {
    if (media.type === 'image') {
      return <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    } else if (media.type === 'document') {
      return <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />;
    } else if (media.type === 'link') {
      switch (media.linkType) {
        case 'youtube':
          return <Youtube className="w-4 h-4 text-red-500" />;
        case 'video':
          return <Video className="w-4 h-4 text-blue-500" />;
        case 'audio':
          return <Music className="w-4 h-4 text-green-500" />;
        default:
          return <Link className="w-4 h-4 text-gray-500" />;
      }
    }
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  const handleMediaClick = (media: any) => {
    handleOpenMedia(media);
  };

  const getVideoThumbnail = (media: any): string | null => {
    if (media.type !== 'link') return null;
    
    if (media.linkType === 'youtube') {
      // Extract YouTube video ID and get thumbnail
      const videoIdMatch = media.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (videoIdMatch) {
        return `https://img.youtube.com/vi/${videoIdMatch[1]}/mqdefault.jpg`;
      }
    }
    
    return null;
  };

  const renderInlineMedia = (media: any) => {
    if (media.type === 'link') {
      switch (media.linkType) {
        case 'youtube':
          const videoIdMatch = media.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          if (videoIdMatch) {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0`}
                title={media.name}
                className="w-full h-48 rounded border border-gray-200 dark:border-gray-600"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            );
          }
          break;
        case 'video':
          if (media.url.includes('vimeo.com')) {
            const videoIdMatch = media.url.match(/vimeo\.com\/(\d+)/);
            if (videoIdMatch) {
              return (
                <iframe
                  src={`https://player.vimeo.com/video/${videoIdMatch[1]}`}
                  title={media.name}
                  className="w-full h-48 rounded border border-gray-200 dark:border-gray-600"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              );
            }
          } else {
            return (
              <video
                controls
                className="w-full h-48 rounded border border-gray-200 dark:border-gray-600 bg-black"
                preload="metadata"
              >
                <source src={media.url} type="video/mp4" />
                <source src={media.url} type="video/webm" />
                <source src={media.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            );
          }
          break;
        case 'audio':
          if (media.url.includes('soundcloud.com')) {
            return (
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(media.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                className="rounded border border-gray-200 dark:border-gray-600"
              />
            );
          } else {
            return (
              <audio
                controls
                className="w-full rounded border border-gray-200 dark:border-gray-600"
                preload="metadata"
              >
                <source src={media.url} type="audio/mpeg" />
                <source src={media.url} type="audio/wav" />
                <source src={media.url} type="audio/ogg" />
                Your browser does not support the audio tag.
              </audio>
            );
          }
          break;
        default:
          // For other link types, show thumbnail if available
          const thumbnail = getVideoThumbnail(media);
          if (thumbnail) {
            return (
              <div className="relative">
                <img
                  src={thumbnail}
                  alt={media.name}
                  className="w-full h-32 object-cover rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(media.url, '_blank')}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-60 rounded-full p-3 hover:bg-opacity-80 transition-all cursor-pointer"
                       onClick={() => window.open(media.url, '_blank')}>
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          }
          return null;
      }
    }
    return null;
  };
  return (
    <>
      <div
      ref={nodeRef}
      className={`absolute select-none ${isDragging ? 'z-50' : 'z-30'} ${
        isHandTool ? 'pointer-events-none' : 'cursor-move'
      }`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className={`
          p-4 rounded-lg shadow-lg border-2 transition-all duration-300 pointer-events-auto
          ${isSelected 
            ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/50' 
            : isMultiSelected
            ? 'border-green-500 shadow-green-100 dark:shadow-green-900/50'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }
          ${node.completed 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-white dark:bg-gray-800'
          }
          ${getHighlightClass(node.formatting.highlight)}
          relative
        `}
        style={{
          width: node.width || 256,
          height: node.height || 200,
          minWidth: 200,
          minHeight: 150,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isHandTool) {
            return;
          }
          if (e.ctrlKey || e.metaKey) {
            onNodeMultiSelect(node.id, true);
          } else {
            onNodeSelect(node.id);
          }
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          if (isHandTool) {
            return;
          }
          onNodeSelect(node.id);
        }}
      >
        {/* Background overlay to hide connection lines */}
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg -z-10"></div>
        
        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 overflow-y-auto node-content-scroll p-1">
          <div className="flex items-start gap-3 mb-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNodeUpdate(node.id, { completed: !node.completed });
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onNodeUpdate(node.id, { completed: !node.completed });
            }}
            className={`
              flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
              ${node.completed 
                ? 'bg-green-600 border-green-600 text-white' 
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }
            `}
          >
            {node.completed && <Check className="w-3 h-3" />}
          </button>
          
          <div className="flex-1 node-handle min-w-0">
            {isEditingTitle ? (
                              <input
                  ref={titleInputRef}
                  type="text"
                  defaultValue={node.title}
                  className={`w-full bg-transparent border-none outline-none font-semibold text-lg ${getTextColorClass(node.formatting.textColor)}`}
                  onBlur={(e) => handleTitleSubmit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSubmit((e.target as HTMLInputElement).value);
                    } else if (e.key === 'Escape') {
                      setIsEditingTitle(false);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
            ) : (
              <div
                className={`${getTextColorClass(node.formatting.textColor)} ${getFontSizeClass(node.formatting.fontSize)} ${getFontFamilyClass(node.formatting.fontFamily)} ${getTextAlignClass(node.formatting.textAlign)} break-words cursor-text font-semibold mb-2`}
                style={getTextStyle()}
                onDoubleClick={() => !isHandTool && setIsEditingTitle(true)}
                onTouchEnd={() => !isHandTool && setIsEditingTitle(true)}
              >
                {renderTextWithInlineEditing(node.title, 'title')}
              </div>
            )}
            

<div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700/30 flex-1 min-h-0 overflow-hidden">
  {isEditingDescription ? (
    <textarea
      ref={descriptionInputRef}
      defaultValue={node.description}
      className={`w-full bg-transparent border-none outline-none resize-none text-sm ${getTextColorClass(node.formatting.textColor)} opacity-80`}
      rows={4}
      placeholder="Click to edit description..."
      onBlur={(e) => handleDescriptionSubmit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleDescriptionSubmit((e.target as HTMLTextAreaElement).value);
        } else if (e.key === 'Escape') {
          setIsEditingDescription(false);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    />
  ) : (
    <div
      className={`${getTextColorClass(node.formatting.textColor)} ${getFontSizeClass(node.formatting.fontSize)} ${getFontFamilyClass(node.formatting.fontFamily)} ${getTextAlignClass(node.formatting.textAlign)} break-words cursor-text opacity-80 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-full node-content-scroll`}
      onDoubleClick={() => !isHandTool && setIsEditingDescription(true)}
      onTouchEnd={() => !isHandTool && setIsEditingDescription(true)}
    >
      {renderTextWithInlineEditing(node.description, 'description')}
    </div>
  )}
</div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNodeDelete(node.id);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              onNodeDelete(node.id);
            }}
            className="flex-shrink-0 w-5 h-5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
          {node.media.length > 0 && (
            <div className="mb-3 space-y-2 flex-shrink-0 overflow-hidden">
              {node.media.map((media) => (
                <div key={media.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden max-w-full">
                  {/* Media Header */}
                  <div className="p-2 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      {getMediaIcon(media)}
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 min-w-0">
                        {media.name}
                      </span>
                      
                      {/* Play button for video/audio links */}
                      {media.type === 'link' && (media.linkType === 'youtube' || media.linkType === 'video' || media.linkType === 'audio') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (inlinePlayerMedia?.id === media.id) {
                              setInlinePlayerMedia(null);
                            } else {
                              setInlinePlayerMedia(media);
                            }
                          }}
                          onTouchEnd={(e) => {
                            e.stopPropagation();
                            if (inlinePlayerMedia?.id === media.id) {
                              setInlinePlayerMedia(null);
                            } else {
                              setInlinePlayerMedia(media);
                            }
                          }}
                          className={`text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors ${
                            inlinePlayerMedia?.id === media.id ? 'text-green-600 dark:text-green-400' : ''
                          }`}
                          title="Play inline"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                      
                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveMedia(node.id, media.id);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          onRemoveMedia(node.id, media.id);
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Video Thumbnail (for link media) */}
                  {media.type === 'link' && !inlinePlayerMedia && (
                    <div className="p-3">
                      <VideoThumbnail
                        media={media}
                        onPlay={() => setInlinePlayerMedia(media)}
                        onExternalLink={() => {
                          if (media.type === 'link') {
                            window.open(media.url, '_blank');
                          } else {
                            handleMediaClick(media);
                          }
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Inline Video Player */}
                  {inlinePlayerMedia?.id === media.id && media.type === 'link' && (
                    <InlineVideoPlayer
                      media={media}
                      onClose={() => setInlinePlayerMedia(null)}
                      onFullscreen={() => {
                        setSelectedMediaForPlayer(media);
                        setInlinePlayerMedia(null);
                      }}
                    />
                  )}
                  
                  {/* Image preview */}
                  {media.type === 'image' && (
                    <div className="p-2">
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-auto rounded max-h-32 object-cover cursor-pointer hover:opacity-90 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMediaClick(media);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          handleMediaClick(media);
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Document preview */}
                  {media.type === 'document' && (
                    <div className="p-2">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMediaClick(media);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          handleMediaClick(media);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {media.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Click to open document
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Fixed buttons at the bottom */}
        <div className="flex flex-row items-center gap-2 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3">
 <button
 onClick={(e) => {
 e.stopPropagation();
            const event = new Event('mind2do-open-chat');
            window.dispatchEvent(event);
 }}
 onTouchEnd={(e) => {
 e.stopPropagation();
            const event = new Event('mind2do-open-chat');
            window.dispatchEvent(event);
 }}
 className={`flex-1 py-2 rounded border-2 border-dashed border-gray-400 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1 font-medium min-w-0 ${
 isHandTool ? 'pointer-events-none opacity-50' : ''
 }`}
 >
 <FileText className="w-3 h-3 flex-shrink-0" />
 <span className="text-xs font-semibold truncate">AI Suggestion</span>
 </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isHandTool) {
              onNodeCreate(node.id, node.x + 250, node.y + 100);
            }
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            if (!isHandTool) {
              onNodeCreate(node.id, node.x + 250, node.y + 100);
            }
          }}
className={`flex-1 py-2 rounded border-2 border-dashed border-gray-400 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1 font-medium min-w-0 ${
            isHandTool ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <Plus className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs font-semibold truncate">Add Child</span>
        </button>
        </div>
        
        {/* Resize handles - only show when selected */}
        {isSelected && !isHandTool && (
          <>
            {/* Corner handles */}
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors"
              style={{ top: -6, left: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors"
              style={{ top: -6, right: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors"
              style={{ bottom: -6, left: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize hover:bg-blue-600 transition-colors"
              style={{ bottom: -6, right: -6 }}
              onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            />
            
            {/* Edge handles */}
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize hover:bg-blue-600 transition-colors"
              style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
              onMouseDown={(e) => handleResizeStart(e, 'top')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize hover:bg-blue-600 transition-colors"
              style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize hover:bg-blue-600 transition-colors"
              style={{ left: -6, top: '50%', transform: 'translateY(-50%)' }}
              onMouseDown={(e) => handleResizeStart(e, 'left')}
            />
            <div
              className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize hover:bg-blue-600 transition-colors"
              style={{ right: -6, top: '50%', transform: 'translateY(-50%)' }}
              onMouseDown={(e) => handleResizeStart(e, 'right')}
            />
          </>
        )}
      </div>
      </div>

    </>
  );
};