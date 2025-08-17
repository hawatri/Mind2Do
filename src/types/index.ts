export interface MindMapNode {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  completed: boolean;
  parentId: string | null;
  children: string[];
  connections: string[];
  media: {
    type: 'image' | 'document';
    url: string;
    name: string;
    id: string;
    size?: number;
    lastModified?: number;
    filePath?: string; // Optional file path for better performance
  }[];
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    highlight: string;
    textColor: string;
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