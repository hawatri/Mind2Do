import React, { useState } from 'react';
import { X, FileText, Image, Download, ExternalLink, File, Plus } from 'lucide-react';
import { MindMapNode } from '../types';
import { useFilePaths } from '../hooks/useFilePaths';
import { FilePathInput } from './FilePathInput';
import { Notification } from './Notification';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: MindMapNode | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  selectedNode,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isFilePathInputOpen, setIsFilePathInputOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  const { filePaths, lastOpenedPdf, openFile, openBase64File, openLastPdf, getFilePath } = useFilePaths();

  if (!isOpen) return null;

  const handleMediaClick = (mediaId: string) => {
    setSelectedMedia(selectedMedia === mediaId ? null : mediaId);
  };

  const handleDownload = (media: any) => {
    // For base64 data URLs, we need to convert them back to a blob for download
    if (media.url.startsWith('data:')) {
      // Convert base64 to blob
      const byteString = atob(media.url.split(',')[1]);
      const mimeString = media.url.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = media.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      // Fallback for regular URLs
      const link = document.createElement('a');
      link.href = media.url;
      link.download = media.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOpenInNewTab = async (media: any) => {
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
        setNotification({
          message: 'Failed to open file. The file may be too large or corrupted.',
          type: 'error',
          isVisible: true
        });
      } else {
        // Fallback for regular URLs
        window.open(media.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      setNotification({
        message: 'Failed to open file. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleOpenLastPdf = async () => {
    if (lastOpenedPdf) {
      await openFile(lastOpenedPdf);
    }
  };

  return (
    <>
      {/* Backdrop */}
             <div 
         className={`fixed inset-0 bg-black transition-all duration-700 ease-out z-40 ${
           isOpen ? 'bg-opacity-50 backdrop-blur-sm' : 'bg-opacity-0 pointer-events-none backdrop-blur-none'
         }`}
         onClick={onClose}
         onTouchEnd={onClose}
       />
      
      {/* Slide-out menu */}
             <div className={`fixed right-0 top-0 h-full w-80 sm:w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-700 ease-out z-50 ${
         isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
       }`}>
                 {/* Header */}
                   <div className={`flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-800 ease-out ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}>
           <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
             Documents & Media
           </h2>
                                 <button
              onClick={onClose}
              onTouchEnd={onClose}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
             <X className="w-4 h-4 sm:w-5 sm:h-5" />
           </button>
        </div>

                 {/* Content */}
                   <div className={`flex-1 overflow-y-auto p-3 sm:p-4 transition-all duration-700 ease-out ${
            isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}>
          {selectedNode ? (
            <div>
                             {/* Node Info */}
                               <div className={`mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-md ${
                  isOpen ? 'animate-slideInFromBottom opacity-100' : 'opacity-0 translate-y-4'
                }`}
               style={{
                 animationDelay: '200ms',
                 animation: isOpen ? 'slideInFromBottom 0.6s ease-out forwards' : 'none'
               }}>
                 <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transform transition-all duration-300 hover:translate-x-1">
                   {selectedNode.title}
                 </h3>
                 <p className="text-sm text-gray-600 dark:text-gray-400 transform transition-all duration-300 hover:translate-x-1">
                   {selectedNode.description}
                 </p>
               </div>

              {/* Last Opened PDF Quick Access */}
              {lastOpenedPdf && (
                <div className={`mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-md ${
                  isOpen ? 'animate-slideInFromBottom opacity-100' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  animationDelay: '300ms',
                  animation: isOpen ? 'slideInFromBottom 0.6s ease-out forwards' : 'none'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Last Opened PDF
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-2 truncate">
                    {lastOpenedPdf.split('\\').pop() || lastOpenedPdf.split('/').pop()}
                  </p>
                  <button
                    onClick={handleOpenLastPdf}
                    className="w-full px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-md transition-all duration-300 hover:scale-105"
                  >
                    Open Last PDF
                  </button>
                </div>
              )}

              {/* Add File Path Button */}
              <div className={`mb-4 transform transition-all duration-500 hover:scale-[1.02] ${
                isOpen ? 'animate-slideInFromBottom opacity-100' : 'opacity-0 translate-y-4'
              }`}
              style={{
                animationDelay: '350ms',
                animation: isOpen ? 'slideInFromBottom 0.6s ease-out forwards' : 'none'
              }}>
                <button
                  onClick={() => setIsFilePathInputOpen(true)}
                  className="w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Add File Path
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  💡 Tip: Use file paths for large files to avoid white screen issues
                </p>
              </div>

              {/* Media Files */}
              {selectedNode.media.length > 0 ? (
                <div
                className="space-y-3 media-list"
                style={{
                overflowY: 'auto',
                                  maxHeight: '350px', // Adjust this value as needed
                                  // Inline styles to re-enable scrollbars
                                  WebkitOverflowScrolling: 'touch',
                }}>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Attachments ({selectedNode.media.length})
                  </h4>
                  
                                     {selectedNode.media.map((media, index) => (
                                           <div 
                        key={media.id} 
                        className={`border border-gray-200 dark:border-gray-600 rounded-lg p-2 sm:p-3 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 ${
                          isOpen ? 'animate-slideInFromRight opacity-100' : 'opacity-0 translate-x-8'
                        }`}
                       style={{
                         animationDelay: `${400 + (index * 150)}ms`,
                         animation: isOpen ? 'slideInFromRight 0.8s ease-out forwards' : 'none'
                       }}
                     >
                      {/* Media Header */}
                      <div className="flex items-center gap-3 mb-3">
                                                 {media.type === 'image' ? (
                           <Image className="w-5 h-5 text-blue-600 dark:text-blue-400 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />
                         ) : (
                           <FileText className="w-5 h-5 text-green-600 dark:text-green-400 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />
                         )}
                                                 <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                             {media.name}
                           </p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                             {media.type === 'image' ? 'Image File' : 'Document File'}
                             {media.size && ` • ${formatFileSize(media.size)}`}
                           </p>
                         </div>
                      </div>

                      {/* Media Preview/Content */}
                      {media.type === 'image' && (
                                                 <div className="mb-3 transform transition-all duration-300 hover:scale-[1.02]">
                           <img
                             src={media.url}
                             alt={media.name}
                             className="w-full h-32 object-cover rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500"
                             onClick={() => handleMediaClick(media.id)}
                             onTouchEnd={() => handleMediaClick(media.id)}
                           />
                         </div>
                      )}

                      {/* File Size Warning */}
                      {media.size && media.size > 5 * 1024 * 1024 && (
                        <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300">
                          ⚠️ Large file ({formatFileSize(media.size)}). Opening may be slow. Consider using file paths for better performance.
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                                                 <button
                           onClick={() => handleDownload(media)}
                           onTouchEnd={() => handleDownload(media)}
                           className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
                         >
                           <Download className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                           Download
                         </button>
                         <button
                           onClick={() => handleOpenInNewTab(media)}
                           onTouchEnd={() => handleOpenInNewTab(media)}
                           className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
                         >
                           <ExternalLink className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                           Open
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                                 <div className="text-center py-8 text-gray-500 dark:text-gray-400 transform transition-all duration-500 hover:scale-105">
                   <FileText className="w-12 h-12 mx-auto mb-3 opacity-50 transform transition-all duration-500 hover:scale-110 hover:opacity-75" />
                   <p className="transform transition-all duration-300 hover:translate-y-1">No documents or media attached to this node.</p>
                 </div>
              )}
            </div>
          ) : (
                         <div className="text-center py-8 text-gray-500 dark:text-gray-400 transform transition-all duration-500 hover:scale-105">
               <FileText className="w-12 h-12 mx-auto mb-3 opacity-50 transform transition-all duration-500 hover:scale-110 hover:opacity-75" />
               <p className="transform transition-all duration-300 hover:translate-y-1">Select a node to view its documents and media.</p>
             </div>
          )}
        </div>
      </div>

      {/* Full-size Media Viewer */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative max-w-4xl max-h-full">
                         <button
               onClick={() => setSelectedMedia(null)}
               onTouchEnd={() => setSelectedMedia(null)}
               className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors z-10"
             >
              <X className="w-6 h-6" />
            </button>
            
            {selectedNode?.media.find(m => m.id === selectedMedia)?.type === 'image' && (
              <img
                src={selectedNode.media.find(m => m.id === selectedMedia)?.url}
                alt={selectedNode.media.find(m => m.id === selectedMedia)?.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      {/* File Path Input Modal */}
      <FilePathInput
        isOpen={isFilePathInputOpen}
        onClose={() => setIsFilePathInputOpen(false)}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  );
};
