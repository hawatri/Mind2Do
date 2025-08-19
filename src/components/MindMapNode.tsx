import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Plus, Image, FileText, ExternalLink, Play, Link, Youtube, Music, Video } from 'lucide-react';
import { MindMapNode as NodeType } from '../types';
import { MediaPlayer } from './MediaPlayer';
import { useFilePaths } from '../hooks/useFilePaths';

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
  onRemoveMedia,
  isHandTool,
  zoom,
}) => {
  const { openFile, openBase64File, getFilePath } = useFilePaths();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedMediaForPlayer, setSelectedMediaForPlayer] = useState<any>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

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
    if (media.type === 'link') {
      setSelectedMediaForPlayer(media);
    } else {
      handleOpenMedia(media);
    }
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
          min-w-64 max-w-96 p-4 rounded-lg shadow-lg border-2 transition-all duration-200 pointer-events-auto
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
        
        <div className="flex items-start gap-3 mb-3">
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
          
          <div className="flex-1 node-handle">
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
                className={`${getTextColorClass(node.formatting.textColor)} break-words cursor-text font-semibold text-lg mb-2`}
                style={getTextStyle()}
                onDoubleClick={() => !isHandTool && setIsEditingTitle(true)}
                onTouchEnd={() => !isHandTool && setIsEditingTitle(true)}
              >
                {node.title}
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700/30">
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
                  className={`${getTextColorClass(node.formatting.textColor)} break-words cursor-text text-sm opacity-80 leading-relaxed`}
                  onDoubleClick={() => !isHandTool && setIsEditingDescription(true)}
                  onTouchEnd={() => !isHandTool && setIsEditingDescription(true)}
                >
                  {node.description}
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
          <div className="mb-3 space-y-2">
            {node.media.map((media) => (
              <div key={media.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded border">
                <div className="flex items-center gap-2">
                  {getMediaIcon(media)}
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                    {media.name}
                  </span>
                  {media.type === 'link' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMediaClick(media);
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        handleMediaClick(media);
                      }}
                      className="text-gray-500 hover:text-green-600 dark:hover:text-green-400"
                      title="Play media"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMediaClick(media);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      handleMediaClick(media);
                    }}
                    className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
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
                {media.type === 'image' && (
                  <img
                    src={media.url}
                    alt={media.name}
                    className="mt-2 max-w-full h-auto rounded max-h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-row items-center gap-2 mt-3">
 <button style={{ minWidth: '120px' }}
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
 className={`flex-1 py-2 rounded border-2 border-dashed border-gray-400 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 font-medium text-nowrap ${
 isHandTool ? 'pointer-events-none opacity-50' : ''
 }`}
 >
 <FileText className="w-3 h-3" /> {/* Using FileText icon for now */}
 <span className="text-sm font-semibold">AI Suggestion</span>
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
className={`flex-1 py-2 rounded border-2 border-dashed border-gray-400 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 font-medium ${
            isHandTool ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Add Child</span>
        </button>
        </div>
      </div>
      </div>

      {/* Media Player */}
      <MediaPlayer
        media={selectedMediaForPlayer}
        isOpen={!!selectedMediaForPlayer}
        onClose={() => setSelectedMediaForPlayer(null)}
      />
    </>
  );
};