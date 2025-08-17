import React from 'react';
import { MindMapNode } from '../types';

interface ConnectionLinesProps {
  nodes: MindMapNode[];
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodes }) => {
  // Memoize the node map for better performance
  const nodeMap = React.useMemo(() => 
    new Map(nodes.map(node => [node.id, node])), 
    [nodes]
  );
  
  // Memoize connections for better performance
  const connections = React.useMemo(() => {
    // Parent-child connections
    const parentChildConnections = nodes
      .filter(node => node.parentId)
      .map(node => {
        const parent = nodeMap.get(node.parentId!);
        if (!parent) return null;
        
        return {
          from: { x: parent.x + 120, y: parent.y + 60 },
          to: { x: node.x + 120, y: node.y + 60 },
          type: 'parent-child' as const,
        };
      })
      .filter(Boolean);

    // Custom connections
    const customConnections = nodes
      .flatMap(node => 
        node.connections.map(targetId => {
          const target = nodeMap.get(targetId);
          if (!target) return null;
          
          return {
            from: { x: node.x + 120, y: node.y + 60 },
            to: { x: target.x + 120, y: target.y + 60 },
            type: 'custom' as const,
          };
        })
      )
      .filter(Boolean);

    return [...parentChildConnections, ...customConnections];
  }, [nodes, nodeMap]);

  // Memoize bounds calculation - must be called before any early returns
  const bounds = React.useMemo(() => {
    if (connections.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
    
    const minX = Math.min(...connections.map(c => Math.min(c!.from.x, c!.to.x))) - 10;
    const minY = Math.min(...connections.map(c => Math.min(c!.from.y, c!.to.y))) - 10;
    const maxX = Math.max(...connections.map(c => Math.max(c!.from.x, c!.to.x))) + 10;
    const maxY = Math.max(...connections.map(c => Math.max(c!.from.y, c!.to.y))) + 10;
    return { minX, minY, maxX, maxY };
  }, [connections]);

  // Early return after all hooks have been called
  if (connections.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        left: bounds.minX,
        top: bounds.minY,
        width: bounds.maxX - bounds.minX,
        height: bounds.maxY - bounds.minY,
      }}
    >
      {connections.map((connection, index) => {
        if (!connection) return null;
        
        const adjustedFrom = { x: connection.from.x - bounds.minX, y: connection.from.y - bounds.minY };
        const adjustedTo = { x: connection.to.x - bounds.minX, y: connection.to.y - bounds.minY };
        
        const controlX1 = adjustedFrom.x + 50;
        const controlY1 = adjustedFrom.y;
        const controlX2 = adjustedTo.x - 50;
        const controlY2 = adjustedTo.y;

        return (
          <path
            key={index}
            d={`M ${adjustedFrom.x} ${adjustedFrom.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${adjustedTo.x} ${adjustedTo.y}`}
            stroke="currentColor"
            strokeWidth={connection.type === 'custom' ? "3" : "2"}
            strokeDasharray={connection.type === 'custom' ? "5,5" : "none"}
            fill="none"
            className={connection.type === 'custom' 
              ? "text-blue-400 dark:text-blue-500" 
              : "text-gray-300 dark:text-gray-600"
            }
          />
        );
      })}
    </svg>
  );
};