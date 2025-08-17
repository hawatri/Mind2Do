import React, { useState } from 'react';
import { X, FileText, Image, Download, ExternalLink } from 'lucide-react';
import { MindMapNode } from '../types';

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

  if (!isOpen) return null;

  const handleMediaClick = (mediaId: string) => {
    setSelectedMedia(selectedMedia === mediaId ? null : mediaId);
  };

  const handleDownload = (media: any) => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = (media: any) => {
    window.open(media.url, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-700 ease-out z-40 ${
          isOpen ? 'bg-opacity-50 backdrop-blur-sm' : 'bg-opacity-0 pointer-events-none backdrop-blur-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slide-out menu */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-700 ease-out z-50 ${
        isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}>
                 {/* Header */}
         <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-800 ease-out ${
           isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
         }`}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Documents & Media
          </h2>
                     <button
             onClick={onClose}
             className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 hover:rotate-12"
           >
            <X className="w-5 h-5" />
          </button>
        </div>

                 {/* Content */}
         <div className={`flex-1 overflow-y-auto p-4 transition-all duration-700 ease-out ${
           isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
         }`}>
          {selectedNode ? (
            <div>
                             {/* Node Info */}
               <div className={`mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-md ${
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

              {/* Media Files */}
              {selectedNode.media.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Attachments ({selectedNode.media.length})
                  </h4>
                  
                                     {selectedNode.media.map((media, index) => (
                     <div 
                       key={media.id} 
                       className={`border border-gray-200 dark:border-gray-600 rounded-lg p-3 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 ${
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
                           />
                         </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                                                 <button
                           onClick={() => handleDownload(media)}
                           className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
                         >
                           <Download className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                           Download
                         </button>
                         <button
                           onClick={() => handleOpenInNewTab(media)}
                           className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
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
    </>
  );
};
