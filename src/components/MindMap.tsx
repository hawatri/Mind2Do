import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Hand, Move, FileText } from 'lucide-react';
import { MindMapNode, HighlightColor, TextColor } from '../types';
import { MindMapNode as NodeComponent } from './MindMapNode';
import { ConnectionLines } from './ConnectionLines';
import { FormattingToolbar } from './FormattingToolbar';
import { FileOperations } from './FileOperations';
import { ConnectionToolbar } from './ConnectionToolbar';
import { DocumentViewer } from './DocumentViewer';
import { useFilePaths } from '../hooks/useFilePaths';


const createDefaultNode = (): MindMapNode => ({
  id: '1',
  title: 'My Mindmap Todo',
  description: 'Click to edit description',
  x: 400,
  y: 200,
  completed: false,
  parentId: null,
  children: [],
  connections: [],
  media: [],
  formatting: {
    bold: true,
    italic: false,
    underline: false,
    strikethrough: false,
    highlight: 'none',
    textColor: 'default',
  },
});

export const MindMap: React.FC = () => {
  const { addFilePath, removeFilePath } = useFilePaths();
  
  // Initialize with default node first
  const [nodes, setNodes] = useState<MindMapNode[]>(() => {
    try {
      const stored = localStorage.getItem('mindmap-autosave');
      if (stored) {
        const mindMapData = JSON.parse(stored);
        if (mindMapData.nodes && mindMapData.nodes.length > 0) {
          const loadedNodes = mindMapData.nodes.map((node: any) => ({ 
            ...node, 
            connections: node.connections || [],
            media: node.media || [],
            title: node.title || 'Untitled',
            description: node.description || 'Click to edit description'
          }));
          
          // Restore file paths for media that have them
          loadedNodes.forEach((node: any) => {
            node.media.forEach((media: any) => {
              if (media.filePath) {
                addFilePath({
                  id: media.id,
                  path: media.filePath,
                  name: media.name,
                  type: media.type,
                  size: media.size,
                  lastModified: media.lastModified
                });
              }
            });
          });
          
          return loadedNodes;
        }
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
    return [createDefaultNode()];
  });
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem('mindmap-autosave');
      if (stored) {
        const mindMapData = JSON.parse(stored);
        if (mindMapData.nodes && mindMapData.nodes.length > 0) {
          return mindMapData.nodes[0].id;
        }
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
    return '1';
  });

  const [multiSelectedNodes, setMultiSelectedNodes] = useState<string[]>([]);

  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isHandTool, setIsHandTool] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  // Manual save function
  const saveToStorage = useCallback(() => {
    try {
      const mindMapData = {
        nodes,
        version: '1.0.0',
        createdAt: localStorage.getItem('mindmap-autosave') 
          ? JSON.parse(localStorage.getItem('mindmap-autosave')!).createdAt 
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('mindmap-autosave', JSON.stringify(mindMapData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [nodes]);

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(saveToStorage, 5000); // Auto-save every 5 seconds
    return () => clearInterval(interval);
  }, [saveToStorage]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToStorage]);

  // Global wheel event prevention for the entire mind map area
  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      // Only prevent scroll if we're over the mind map area
      const target = e.target as Element;
      if (target && target.closest('.mindmap-container')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Use passive: false to ensure we can prevent default
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, []);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.round((prev + 0.1) * 10) / 10; // Exact 10% increase
      return Math.min(newZoom, 3); // Max zoom 3x
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.round((prev - 0.1) * 10) / 10; // Exact 10% decrease
      return Math.max(newZoom, 0.3); // Min zoom 0.3x
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setCanvasOffset({ x: 0, y: 0 });
  }, []);

  // Center on content
  const handleCenterOnContent = useCallback(() => {
    if (nodes.length > 0) {
      // Calculate the center of all nodes
      const minX = Math.min(...nodes.map(node => node.x));
      const maxX = Math.max(...nodes.map(node => node.x));
      const minY = Math.min(...nodes.map(node => node.y));
      const maxY = Math.max(...nodes.map(node => node.y));
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      // Calculate offset to center the content
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      setCanvasOffset({
        x: viewportWidth / 2 - centerX * zoom,
        y: viewportHeight / 2 - centerY * zoom
      });
    }
  }, [nodes, zoom]);

  // Handle scroll wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); // Prevent default scroll
    e.stopPropagation(); // Stop event bubbling
    
    // Exact 10% zoom change
    if (e.deltaY > 0) {
      setZoom(prev => {
        const newZoom = Math.round((prev - 0.1) * 10) / 10;
        return Math.max(newZoom, 0.3);
      });
    } else {
      setZoom(prev => {
        const newZoom = Math.round((prev + 0.1) * 10) / 10;
        return Math.min(newZoom, 3);
      });
    }
    
    return false; // Additional prevention
  }, []);

  const handleLoadMindMap = useCallback((newNodes: MindMapNode[]) => {
    if (!newNodes || !Array.isArray(newNodes)) {
      console.error('Invalid nodes data:', newNodes);
      return;
    }
    
    const nodesWithConnections = newNodes.map(node => ({ 
      ...node, 
      connections: node.connections || [],
      media: node.media || [],
      title: node.title || 'Untitled',
      description: node.description || 'Click to edit description'
    }));
    
    // Restore file paths for media that have them
    nodesWithConnections.forEach(node => {
      node.media.forEach(media => {
        if (media.filePath) {
          addFilePath({
            id: media.id,
            path: media.filePath,
            name: media.name,
            type: media.type,
            size: media.size,
            lastModified: media.lastModified
          });
        }
      });
    });
    
    setNodes(nodesWithConnections);
    setSelectedNodeId(newNodes.length > 0 ? newNodes[0].id : null);
    setMultiSelectedNodes([]);
  }, [addFilePath]);

  const handleManualSave = useCallback(() => {
    saveToStorage();
    // Show a brief success indicator
    const button = document.querySelector('[title="Save to browser storage"]');
    if (button) {
      const originalTitle = button.getAttribute('title');
      button.setAttribute('title', 'Saved!');
      setTimeout(() => {
        button.setAttribute('title', originalTitle || 'Save to browser storage');
      }, 2000);
    }
  }, [saveToStorage]);

  const handleNodeSelect = useCallback((id: string) => {
    setSelectedNodeId(id);
    setMultiSelectedNodes([]);
  }, []);

  const handleNodeMultiSelect = useCallback((id: string, isCtrlPressed: boolean) => {
    if (isCtrlPressed) {
      setMultiSelectedNodes(prev => {
        if (prev.includes(id)) {
          return prev.filter(nodeId => nodeId !== id);
        } else {
          return [...prev, id];
        }
      });
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(id);
      setMultiSelectedNodes([]);
    }
  }, []);

  const handleCreateConnection = useCallback(() => {
    if (multiSelectedNodes.length === 2) {
      const [fromId, toId] = multiSelectedNodes;
      setNodes(prev => prev.map(node => 
        node.id === fromId 
          ? { ...node, connections: [...node.connections, toId] }
          : node
      ));
      setMultiSelectedNodes([]);
    }
  }, [multiSelectedNodes]);

  const handleClearSelection = useCallback(() => {
    setMultiSelectedNodes([]);
    setSelectedNodeId(null);
  }, []);

  const handleNodeUpdate = useCallback((id: string, updates: Partial<MindMapNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  }, []);

  const handleNodeDelete = useCallback((id: string) => {
    if (nodes.length === 1) return; // Don't delete the last node
    
    setNodes(prev => {
      const nodeToDelete = prev.find(n => n.id === id);
      if (!nodeToDelete) return prev;
      
      // Remove the node and all its descendants
      const deleteDescendants = (nodeId: string): string[] => {
        const node = prev.find(n => n.id === nodeId);
        if (!node) return [];
        
        const descendants = [nodeId];
        node.children.forEach(childId => {
          descendants.push(...deleteDescendants(childId));
        });
        return descendants;
      };
      
      const toDelete = deleteDescendants(id);
      
      // Update parent's children array and remove connections
      const updatedNodes = prev
        .filter(node => !toDelete.includes(node.id))
        .map(node => ({
          ...node,
          children: node.children.filter(childId => !toDelete.includes(childId)),
          connections: node.connections.filter(connId => !toDelete.includes(connId))
        }));
      
      return updatedNodes;
    });
    
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
    setMultiSelectedNodes(prev => prev.filter(nodeId => nodeId !== id));
  }, [nodes.length, selectedNodeId]);

  const handleNodeCreate = useCallback((parentId: string, x: number, y: number) => {
    const newId = Date.now().toString();
    const newNode: MindMapNode = {
      id: newId,
      title: 'New Task',
      description: 'Click to edit description',
      x,
      y,
      completed: false,
      parentId,
      children: [],
      connections: [],
      media: [],
      formatting: {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        highlight: 'none',
        textColor: 'default',
      },
    };
    
    setNodes(prev => prev.map(node => 
      node.id === parentId 
        ? { ...node, children: [...node.children, newId] }
        : node
    ).concat(newNode));
    
    setSelectedNodeId(newId);
  }, []);

  const handleNodeMove = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  }, []);

  const handleFormatText = useCallback((format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    if (!selectedNodeId) return;
    
    setNodes(prev => prev.map(node => 
      node.id === selectedNodeId 
        ? { 
            ...node, 
            formatting: { 
              ...node.formatting, 
              [format]: !node.formatting[format] 
            } 
          }
        : node
    ));
  }, [selectedNodeId]);

  const handleHighlightText = useCallback((color: HighlightColor) => {
    if (!selectedNodeId) return;
    
    setNodes(prev => prev.map(node => 
      node.id === selectedNodeId 
        ? { 
            ...node, 
            formatting: { 
              ...node.formatting, 
              highlight: color 
            } 
          }
        : node
    ));
  }, [selectedNodeId]);

  const handleTextColor = useCallback((color: TextColor) => {
    if (!selectedNodeId) return;
    
    setNodes(prev => prev.map(node => 
      node.id === selectedNodeId 
        ? { 
            ...node, 
            formatting: { 
              ...node.formatting, 
              textColor: color 
            } 
          }
        : node
    ));
  }, [selectedNodeId]);

  const handleAddMedia = useCallback((type: 'image' | 'document') => {
    if (!selectedNodeId) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = type === 'image' ? 'image/*' : '*/*';
    
    input.onchange = async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        // Check file sizes (limit to 10MB per file to avoid localStorage issues)
        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
          alert(`Some files are too large (max 10MB each):\n${oversizedFiles.map(f => f.name).join('\n')}\n\nFor better performance, consider using file paths instead of uploading large files.`);
          return;
        }
        
        const newMedia = await Promise.all(files.map(async (file) => {
          const mediaId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          
          // Store the file path for better performance (if available)
          const fileWithPath = file as File & { path?: string };
          if (fileWithPath.path) {
            addFilePath({
              id: mediaId,
              path: fileWithPath.path,
              name: file.name,
              type,
              size: file.size,
              lastModified: file.lastModified
            });
          }
          
          // Convert file to base64 for persistent storage (fallback)
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
          
          return {
            type,
            url: base64, // Store as base64 data URL as fallback
            name: file.name,
            id: mediaId,
            size: file.size,
            lastModified: file.lastModified,
            filePath: fileWithPath.path // Store file path in the media object too
          };
        }));
        
        setNodes(prev => prev.map(node => 
          node.id === selectedNodeId 
            ? { 
                ...node, 
                media: [...node.media, ...newMedia]
              }
            : node
        ));
      }
    };
    
    input.click();
  }, [selectedNodeId, addFilePath]);

  const handleRemoveMedia = useCallback((nodeId: string, mediaId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            media: node.media.filter(m => m.id !== mediaId)
          }
        : node
    ));
    
    // Also remove the file path from storage
    removeFilePath(mediaId);
  }, [removeFilePath]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (isHandTool) {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      e.preventDefault();
    } else if (e.target === e.currentTarget) {
      setSelectedNodeId(null);
      setMultiSelectedNodes([]);
    }
  }, [isHandTool, canvasOffset]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      e.preventDefault();
      setCanvasOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDraggingCanvas, dragStart]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDraggingCanvas(false);
  }, []);

  // Touch event handlers for mobile devices
  const handleCanvasTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isHandTool) {
        setIsDraggingCanvas(true);
        setDragStart({ x: touch.clientX - canvasOffset.x, y: touch.clientY - canvasOffset.y });
        e.preventDefault();
      } else if (e.target === e.currentTarget) {
        setSelectedNodeId(null);
        setMultiSelectedNodes([]);
      }
    }
  }, [isHandTool, canvasOffset]);

  const handleCanvasTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDraggingCanvas && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setCanvasOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  }, [isDraggingCanvas, dragStart]);

  const handleCanvasTouchEnd = useCallback(() => {
    setIsDraggingCanvas(false);
  }, []);


  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <FileOperations
        nodes={nodes}
        onLoadMindMap={handleLoadMindMap}
        onSave={handleManualSave}
      />
      
      <FormattingToolbar
        selectedNodeId={selectedNodeId}
        onFormatText={handleFormatText}
        onHighlightText={handleHighlightText}
        onTextColor={handleTextColor}
        onAddMedia={handleAddMedia}
        currentFormatting={selectedNode?.formatting || {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          highlight: 'none',
          textColor: 'default',
        }}
      />
      
      <ConnectionToolbar
        selectedNodes={multiSelectedNodes}
        onCreateConnection={handleCreateConnection}
        onClearSelection={handleClearSelection}
      />
      
      <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 flex items-center gap-1 sm:gap-2 border border-gray-200 dark:border-gray-700 z-50 max-w-[calc(100vw-2rem)]">
        <button
          onClick={() => setIsHandTool(!isHandTool)}
          onTouchEnd={() => setIsHandTool(!isHandTool)}
          className={`p-1.5 sm:p-2 rounded transition-colors ${
            isHandTool 
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isHandTool ? "Switch to select mode" : "Switch to hand tool"}
        >
          {isHandTool ? <Hand className="w-3 h-3 sm:w-4 sm:h-4" /> : <Move className="w-3 h-3 sm:w-4 sm:h-4" />}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
          {isHandTool ? "Hand Tool" : "Select Tool"}
        </span>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <button
          onClick={handleZoomIn}
          onTouchEnd={handleZoomIn}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Zoom In (Scroll Up)"
        >
          <span className="text-xs sm:text-sm font-bold">+</span>
        </button>
        
        <button
          onClick={handleZoomOut}
          onTouchEnd={handleZoomOut}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Zoom Out (Scroll Down)"
        >
          <span className="text-xs sm:text-sm font-bold">−</span>
        </button>
        
        <button
          onClick={handleResetZoom}
          onTouchEnd={handleResetZoom}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Reset Zoom"
        >
          <span className="text-xs hidden sm:inline">Reset</span>
          <span className="text-xs sm:hidden">R</span>
        </button>

        <button
          onClick={handleCenterOnContent}
          onTouchEnd={handleCenterOnContent}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title="Center on Content"
        >
          <span className="text-xs hidden sm:inline">Center</span>
          <span className="text-xs sm:hidden">C</span>
        </button>
        
        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 hidden sm:inline">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Document Viewer Button */}
      <button
        onClick={() => setIsDocumentViewerOpen(true)}
        onTouchEnd={() => setIsDocumentViewerOpen(true)}
        className="fixed top-20 right-0 p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:translate-x-1 flex items-center gap-1 sm:gap-2 z-40 group"
        title="View Documents & Media"
      >
        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Documents
        </span>
        <div className="absolute right-0 top-0 w-1 h-full bg-blue-400 rounded-l-full transition-all duration-300 group-hover:w-2"></div>
      </button>
      
              <div
          className={`mindmap-container relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden ${
            isHandTool ? 'cursor-grab' : 'cursor-default'
          } ${isDraggingCanvas ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
          onWheel={handleWheel}
          onWheelCapture={handleWheel}
          style={{ 
            minHeight: '100vh', 
            width: '200vw', 
            height: '200vh',
            overflow: 'hidden',
            touchAction: 'none'
          }}
        >
        <div
          className="relative"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
            transformOrigin: 'center',
            width: '200vw',
            height: '200vh'
          }}
          onMouseDown={(e) => {
            if (!isHandTool && e.target === e.currentTarget) {
              setSelectedNodeId(null);
              setMultiSelectedNodes([]);
            }
          }}
          onTouchStart={(e) => {
            if (!isHandTool && e.target === e.currentTarget) {
              setSelectedNodeId(null);
              setMultiSelectedNodes([]);
            }
          }}
        >
          <ConnectionLines nodes={nodes} />
          
          {nodes.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isMultiSelected={multiSelectedNodes.includes(node.id)}
              onNodeSelect={handleNodeSelect}
              onNodeMultiSelect={handleNodeMultiSelect}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onNodeCreate={handleNodeCreate}
              onNodeMove={handleNodeMove}
              onRemoveMedia={handleRemoveMedia}
              isHandTool={isHandTool}
              zoom={zoom}
            />
          ))}
        </div>
        
        <button
          onClick={() => {
            const newId = Date.now().toString();
            const newNode: MindMapNode = {
              id: newId,
              title: 'New Task',
              description: 'Click to edit description',
              x: 100,
              y: 100,
              completed: false,
              parentId: null,
              children: [],
              connections: [],
              media: [],
              formatting: {
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
                highlight: 'none',
                textColor: 'default',
              },
            };
            setNodes(prev => [...prev, newNode]);
            setSelectedNodeId(newId);
          }}
          onTouchEnd={() => {
            const newId = Date.now().toString();
            const newNode: MindMapNode = {
              id: newId,
              title: 'New Task',
              description: 'Click to edit description',
              x: 100,
              y: 100,
              completed: false,
              parentId: null,
              children: [],
              connections: [],
              media: [],
              formatting: {
                bold: false,
                italic: false,
                underline: false,
                strikethrough: false,
                highlight: 'none',
                textColor: 'default',
              },
            };
            setNodes(prev => [...prev, newNode]);
            setSelectedNodeId(newId);
          }}
          className="fixed bottom-8 right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
          title="Add new root task"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={() => {
            // Clear everything and create new mindmap
            const defaultNode = createDefaultNode();
            setNodes([defaultNode]);
            setSelectedNodeId(defaultNode.id);
            setMultiSelectedNodes([]);
            setCanvasOffset({ x: 0, y: 0 });
            
            // Clear localStorage
            try {
              localStorage.removeItem('mindmap-autosave');
            } catch (error) {
              console.error('Failed to clear storage:', error);
            }
          }}
          onTouchEnd={() => {
            // Clear everything and create new mindmap
            const defaultNode = createDefaultNode();
            setNodes([defaultNode]);
            setSelectedNodeId(defaultNode.id);
            setMultiSelectedNodes([]);
            setCanvasOffset({ x: 0, y: 0 });
            
            // Clear localStorage
            try {
              localStorage.removeItem('mindmap-autosave');
            } catch (error) {
              console.error('Failed to clear storage:', error);
            }
          }}
          className="fixed bottom-20 right-4 sm:bottom-8 sm:right-24 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
          title="Create new mindmap (clears everything)"
        >
          <span className="text-xs sm:text-sm font-semibold">New</span>
        </button>
        
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
          Hold Ctrl/Cmd + Click to select multiple nodes
        </div>
      </div>

      {/* Document Viewer */}
      <DocumentViewer
        isOpen={isDocumentViewerOpen}
        onClose={() => setIsDocumentViewerOpen(false)}
        selectedNode={selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null}
      />
    </div>
  );
};