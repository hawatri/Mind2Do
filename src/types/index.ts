export interface MindMapNode {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  width?: number; // Node width for resizing
  height?: number; // Node height for resizing
  completed: boolean;
  parentId: string | null;
  children: string[];
  connections: string[];
  media: {
    type: 'image' | 'document' | 'link';
    url: string;
    name: string;
    id: string;
    size?: number;
    lastModified?: number;
    filePath?: string; // Optional file path for better performance
    mimeType?: string;
    extractedText?: string;
    linkType?: 'youtube' | 'video' | 'audio' | 'other'; // For link media types
  }[];
  chat?: { role: 'user' | 'assistant' | 'system'; content: string }[];
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    highlight: string;
    textColor: string;
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    fontFamily: 'default' | 'serif' | 'monospace' | 'cursive';
    textAlign: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface Connection {
  from: string;
  to: string;
}

export type HighlightColor = 'none' | 'yellow' | 'green' | 'blue' | 'pink' | 'purple';
export type TextColor = 'default' | 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'pink';

export interface MindMapData {
  nodes: MindMapNode[];
  version: string;
  createdAt: string;
  updatedAt: string;
}