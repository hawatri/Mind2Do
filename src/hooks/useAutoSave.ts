import { useEffect, useCallback } from 'react';
import { MindMapNode, MindMapData } from '../types';

const STORAGE_KEY = 'mindmap-autosave';
const AUTOSAVE_INTERVAL = 5000; // 5 seconds

export const useAutoSave = (nodes: MindMapNode[]) => {
  const saveToStorage = useCallback(() => {
    try {
      const mindMapData: MindMapData = {
        nodes,
        version: '1.0.0',
        createdAt: localStorage.getItem(STORAGE_KEY) 
          ? JSON.parse(localStorage.getItem(STORAGE_KEY)!).createdAt 
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mindMapData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [nodes]);

  const loadFromStorage = useCallback((): MindMapNode[] | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const mindMapData: MindMapData = JSON.parse(stored);
        return mindMapData.nodes || null;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  }, []);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(saveToStorage, AUTOSAVE_INTERVAL);
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

  return {
    saveToStorage,
    loadFromStorage,
    clearStorage,
  };
};