import React, { useState, useCallback } from 'react';
import { Plus, Hand, Move } from 'lucide-react';
import { MindMapNode, HighlightColor, TextColor } from '../types';
import { MindMapNode as NodeComponent } from './MindMapNode';
import { ConnectionLines } from './ConnectionLines';
import { FormattingToolbar } from './FormattingToolbar';
import { FileOperations } from './FileOperations';
import { ConnectionToolbar } from './ConnectionToolbar';
import { useAutoSave } from '../hooks/useAutoSave';

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
  // Initialize with default node first
  const [nodes, setNodes] = useState<MindMapNode[]>(() => {
    try {
      const stored = localStorage.getItem('mindmap-autosave');
      if (stored) {
        const mindMapData = JSON.parse(stored);
        if (mindMapData.nodes && mindMapData.nodes.length > 0) {
          return mindMapData.nodes.map((node: any) => ({ 
            ...node, 
            connections: node.connections || [],
            media: node.media || [],
            title: node.title || 'Untitled',
            description: node.description || 'Click to edit description'
          }));
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
  const [isHandTool, setIsHandTool] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Auto-save hook - initialize after state
  const { saveToStorage } = useAutoSave(nodes);

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
    setNodes(nodesWithConnections);
    setSelectedNodeId(newNodes.length > 0 ? newNodes[0].id : null);
    setMultiSelectedNodes([]);
  }, []);

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
    
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        const newMedia = files.map(file => ({
          type,
          url: URL.createObjectURL(file),
          name: file.name,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
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
  }, [selectedNodeId]);

  const handleRemoveMedia = useCallback((nodeId: string, mediaId: string) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            media: node.media.filter(m => m.id !== mediaId)
          }
        : node
    ));
  }, []);

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
      
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 ml-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700 z-50">
        <button
          onClick={() => setIsHandTool(!isHandTool)}
          className={`p-2 rounded transition-colors ${
            isHandTool 
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={isHandTool ? "Switch to select mode" : "Switch to hand tool"}
        >
          {isHandTool ? <Hand className="w-4 h-4" /> : <Move className="w-4 h-4" />}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isHandTool ? "Hand Tool" : "Select Tool"}
        </span>
      </div>
      
      <div
        className={`relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden ${
          isHandTool ? 'cursor-grab' : 'cursor-default'
        } ${isDraggingCanvas ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ minHeight: '100vh', width: '200vw', height: '200vh' }}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            width: '200vw',
            height: '200vh'
          }}
          onMouseDown={(e) => {
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
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
          title="Add new root task"
        >
          <Plus className="w-6 h-6" />
        </button>
        
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
          Hold Ctrl/Cmd + Click to select multiple nodes
        </div>
      </div>
    </div>
  );
};