import { useState, useEffect } from 'react';

interface FilePath {
  id: string;
  path: string;
  name: string;
  type: 'image' | 'document';
  size?: number;
  lastModified?: number;
}

export const useFilePaths = () => {
  const [filePaths, setFilePaths] = useState<FilePath[]>(() => {
    try {
      const stored = localStorage.getItem('mindmap-file-paths');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load file paths:', error);
      return [];
    }
  });

  const [lastOpenedPdf, setLastOpenedPdf] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mindmap-last-pdf') || null;
    } catch (error) {
      console.error('Failed to load last PDF path:', error);
      return null;
    }
  });

  // Save file paths to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mindmap-file-paths', JSON.stringify(filePaths));
    } catch (error) {
      console.error('Failed to save file paths:', error);
    }
  }, [filePaths]);

  // Save last opened PDF to localStorage
  useEffect(() => {
    if (lastOpenedPdf) {
      try {
        localStorage.setItem('mindmap-last-pdf', lastOpenedPdf);
      } catch (error) {
        console.error('Failed to save last PDF path:', error);
      }
    }
  }, [lastOpenedPdf]);

  const addFilePath = (filePath: FilePath) => {
    setFilePaths(prev => {
      // Remove existing file with same ID if exists
      const filtered = prev.filter(fp => fp.id !== filePath.id);
      return [...filtered, filePath];
    });

    // If it's a PDF, remember it as last opened
    if (filePath.name.toLowerCase().endsWith('.pdf')) {
      setLastOpenedPdf(filePath.path);
    }
  };

  const removeFilePath = (id: string) => {
    setFilePaths(prev => prev.filter(fp => fp.id !== id));
  };

  const getFilePath = (id: string): FilePath | undefined => {
    return filePaths.find(fp => fp.id === id);
  };

  const openFile = async (filePath: string): Promise<boolean> => {
    try {
      // For Windows file paths, we need to handle them specially
      if (filePath.startsWith('C:\\') || filePath.startsWith('c:\\')) {
        // Try to open using the file:// protocol
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
        window.open(fileUrl, '_blank');
        return true;
      } else if (filePath.startsWith('file://')) {
        window.open(filePath, '_blank');
        return true;
      } else {
        // For relative paths or other protocols
        window.open(filePath, '_blank');
        return true;
      }
    } catch (error) {
      console.error('Failed to open file:', error);
      return false;
    }
  };

  const openBase64File = async (base64Data: string, fileName: string, mimeType: string): Promise<boolean> => {
    try {
      // Check if the base64 data is valid
      if (!base64Data || !base64Data.startsWith('data:')) {
        console.error('Invalid base64 data');
        return false;
      }

      // Extract the actual base64 content
      const base64Content = base64Data.split(',')[1];
      if (!base64Content) {
        console.error('Invalid base64 content');
        return false;
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Create blob with proper MIME type
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Create object URL
      const objectUrl = URL.createObjectURL(blob);
      
      // Open in new tab
      const newWindow = window.open(objectUrl, '_blank');
      
      if (newWindow) {
        // Clean up the object URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 1000);
        return true;
      } else {
        // If popup was blocked, try to download the file
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 1000);
        
        return true;
      }
    } catch (error) {
      console.error('Failed to open base64 file:', error);
      return false;
    }
  };

  const openLastPdf = async (): Promise<boolean> => {
    if (lastOpenedPdf) {
      return await openFile(lastOpenedPdf);
    }
    return false;
  };

  return {
    filePaths,
    lastOpenedPdf,
    addFilePath,
    removeFilePath,
    getFilePath,
    openFile,
    openBase64File,
    openLastPdf,
    setLastOpenedPdf
  };
};
