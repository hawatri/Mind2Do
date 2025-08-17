import React from 'react';
import { Link, Link2Off as LinkOff } from 'lucide-react';

interface ConnectionToolbarProps {
  selectedNodes: string[];
  onCreateConnection: () => void;
  onClearSelection: () => void;
}

export const ConnectionToolbar: React.FC<ConnectionToolbarProps> = ({
  selectedNodes,
  onCreateConnection,
  onClearSelection,
}) => {
  if (selectedNodes.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 flex items-center gap-3 border border-gray-200 dark:border-gray-700 z-50">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {selectedNodes.length} node{selectedNodes.length > 1 ? 's' : ''} selected
      </div>
      
      {selectedNodes.length === 2 && (
        <button
          onClick={onCreateConnection}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2 text-sm"
        >
          <Link className="w-4 h-4" />
          Connect
        </button>
      )}
      
      <button
        onClick={onClearSelection}
        className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center gap-2 text-sm"
      >
        <LinkOff className="w-4 h-4" />
        Clear
      </button>
    </div>
  );
};