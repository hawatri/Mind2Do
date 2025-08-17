import React, { useRef } from 'react';
import { Download, Upload, Save } from 'lucide-react';
import { MindMapData, MindMapNode } from '../types';

interface FileOperationsProps {
  nodes: MindMapNode[];
  onLoadMindMap: (nodes: MindMapNode[]) => void;
  onSave: () => void;
}

export const FileOperations: React.FC<FileOperationsProps> = ({
  nodes,
  onLoadMindMap,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const mindMapData: MindMapData = {
      nodes,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmap-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const mindMapData: MindMapData = JSON.parse(content);
        
        if (mindMapData.nodes && Array.isArray(mindMapData.nodes)) {
          onLoadMindMap(mindMapData.nodes);
        } else {
          alert('Invalid mindmap file format');
        }
      } catch (error) {
        alert('Error reading file: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="fixed top-4 left-4 flex gap-2 z-50">
      <button
        onClick={onSave}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 text-green-600 hover:text-green-700"
        title="Save to browser storage"
      >
        <Save className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleDownload}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 text-blue-600 hover:text-blue-700"
        title="Download mindmap"
      >
        <Download className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleUpload}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 text-purple-600 hover:text-purple-700"
        title="Upload mindmap"
      >
        <Upload className="w-5 h-5" />
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};