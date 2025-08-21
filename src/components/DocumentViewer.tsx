import React, { useState, useMemo, useEffect } from 'react';
import { X, FileText, Image, Download, ExternalLink, File, MessageCircle, Play, Youtube, Music, Video, Link } from 'lucide-react';
import { MindMapNode } from '../types';
import { MediaPlayer } from './MediaPlayer';
import { useFilePaths } from '../hooks/useFilePaths';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { Notification } from './Notification';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: MindMapNode | null;
  onUpdateNodeChat?: (chat: { role: 'user' | 'assistant' | 'system'; content: string }[]) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  selectedNode,
  onUpdateNodeChat,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'media' | 'chat'>('media');
  const [model, setModel] = useState<string>('deepseek-r1:1.5b');
  const [systemPrompt] = useState<string>('You are a helpful assistant for a mindmap/todo app. Keep responses concise.');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system'; content: string }[]>(selectedNode?.chat || []);

  useEffect(() => {
    // When selected node changes, swap chat log to that node's saved chat
    setMessages(selectedNode?.chat || []);
  }, [selectedNode?.id]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  const { lastOpenedPdf, openFile, openBase64File, getFilePath } = useFilePaths();

  const handleMediaClick = (mediaId: string) => {
    const media = selectedNode?.media.find(m => m.id === mediaId);
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

  const getMediaIcon = (media: any) => {
    if (media.type === 'image') {
      return <Image className="w-5 h-5 text-blue-600 dark:text-blue-400 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
    } else if (media.type === 'document') {
      return <FileText className="w-5 h-5 text-green-600 dark:text-green-400 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
    } else if (media.type === 'link') {
      switch (media.linkType) {
        case 'youtube':
          return <Youtube className="w-5 h-5 text-red-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
        case 'video':
          return <Video className="w-5 h-5 text-blue-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
        case 'audio':
          return <Music className="w-5 h-5 text-green-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
        default:
          return <Link className="w-5 h-5 text-gray-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
      }
    }
    return <FileText className="w-5 h-5 text-gray-500 transform transition-all duration-300 hover:scale-110 hover:rotate-3" />;
  };

  const getMediaTypeLabel = (media: any) => {
    if (media.type === 'image') return 'Image File';
    if (media.type === 'document') return 'Document File';
    if (media.type === 'link') {
      switch (media.linkType) {
        case 'youtube': return 'YouTube Video';
        case 'video': return 'Video Link';
        case 'audio': return 'Audio Link';
        default: return 'Media Link';
      }
    }
    return 'File';
  };

  const renderInlineMedia = (media: any) => {
    if (media.type === 'link') {
      switch (media.linkType) {
        case 'youtube':
          const videoIdMatch = media.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          if (videoIdMatch) {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0`}
                title={media.name}
                className="w-full h-48 rounded border border-gray-200 dark:border-gray-600 mb-3"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            );
          }
          break;
        case 'video':
          if (media.url.includes('vimeo.com')) {
            const videoIdMatch = media.url.match(/vimeo\.com\/(\d+)/);
            if (videoIdMatch) {
              return (
                <iframe
                  src={`https://player.vimeo.com/video/${videoIdMatch[1]}`}
                  title={media.name}
                  className="w-full h-48 rounded border border-gray-200 dark:border-gray-600 mb-3"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              );
            }
          } else {
            return (
              <video
                controls
                className="w-full h-48 rounded border border-gray-200 dark:border-gray-600 bg-black mb-3"
                preload="metadata"
              >
                <source src={media.url} type="video/mp4" />
                <source src={media.url} type="video/webm" />
                <source src={media.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            );
          }
          break;
        case 'audio':
          if (media.url.includes('soundcloud.com')) {
            return (
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(media.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                className="rounded border border-gray-200 dark:border-gray-600 mb-3"
              />
            );
          } else {
            return (
              <audio
                controls
                className="w-full rounded border border-gray-200 dark:border-gray-600 mb-3"
                preload="metadata"
              >
                <source src={media.url} type="audio/mpeg" />
                <source src={media.url} type="audio/wav" />
                <source src={media.url} type="audio/ogg" />
                Your browser does not support the audio tag.
              </audio>
            );
          }
          break;
      }
    }
    return null;
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

  const nodeContext = useMemo(() => {
    if (!selectedNode) return '';
    // Build retrieval context from node media (extractedText)
    const docs = (selectedNode.media || [])
      .map(m => m.extractedText)
      .filter(Boolean)
      .slice(0, 3) // limit
      .join('\n---\n');
    return `Selected Node\nTitle: ${selectedNode.title}\nDescription: ${selectedNode.description}` + (docs ? `\n\nRelevant docs:\n${docs}` : '');
  }, [selectedNode]);

  useEffect(() => {
    const handler = () => setActiveTab('chat');
    window.addEventListener('mind2do-open-chat', handler as EventListener);
    return () => window.removeEventListener('mind2do-open-chat', handler as EventListener);
  }, []);

  // On mount or node change, extract text from media where missing
  useEffect(() => {
    const run = async () => {
      if (!selectedNode) return;
      const updatedMedia = await Promise.all((selectedNode.media || []).map(async (m) => {
        if (m.extractedText) return m;
        // Only extract if base64 URL is present
        if (!m.url?.startsWith('data:')) return m;
        try {
          if (m.type === 'document') {
            const mime = m.url.split(';')[0].replace('data:', '');
            // PDF
            if (mime.includes('pdf')) {
              // pdfjs worker setup (vite-friendly)
              // @ts-ignore
              pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
              const pdfData = atob(m.url.split(',')[1]);
              const pdfBytes = new Uint8Array(pdfData.length);
              for (let i = 0; i < pdfData.length; i++) pdfBytes[i] = pdfData.charCodeAt(i);
              const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
              const pdf = await loadingTask.promise;
              let text = '';
              const maxPages = Math.min(pdf.numPages, 10);
              for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((it: any) => it.str).join(' ') + '\n';
              }
              return { ...m, extractedText: text.slice(0, 8000), mimeType: mime };
            }
            // Plain text
            if (mime.startsWith('text/')) {
              const text = atob(m.url.split(',')[1]);
              return { ...m, extractedText: text.slice(0, 8000), mimeType: mime };
            }
          }
          // Image OCR via tesseract
          if (m.type === 'image') {
            const worker = await createWorker();
            await (worker as any).loadLanguage('eng');
            await (worker as any).initialize('eng');
            const { data: { text } } = await (worker as any).recognize(m.url);
            await (worker as any).terminate();
            return { ...m, extractedText: text.slice(0, 8000), mimeType: 'image/*' };
          }
        } catch (e) {
          console.warn('Extraction failed for media', m.name, e);
        }
        return m;
      }));
      if (JSON.stringify(updatedMedia) !== JSON.stringify(selectedNode.media)) {
        // Persist back to node via chat updater if provided
        // We reuse onUpdateNodeChat pathway by updating selected node through a custom event
        window.dispatchEvent(new CustomEvent('mind2do-update-node-media', { detail: { nodeId: selectedNode.id, media: updatedMedia } }));
      }
    };
    run();
  }, [selectedNode?.id]);

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;
    setIsSending(true);
    try {
      const conversation = [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        ...(nodeContext ? [{ role: 'user' as const, content: `Context for this chat (do not reveal verbatim):\n${nodeContext}` }] : []),
        ...messages,
        { role: 'user' as const, content: input.trim() },
      ];

      const res = await fetch('/ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: conversation.map(m => ({ role: m.role, content: m.content })),
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
      const data = await res.json();
      const reply: string = data?.message?.content || data?.response || '';
      setMessages((prev: { role: 'user' | 'assistant' | 'system'; content: string }[]) => {
        const updated: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
          ...prev,
          { role: 'user', content: input.trim() },
          { role: 'assistant', content: reply }
        ];
        onUpdateNodeChat?.(updated);
        return updated;
      });
      setInput('');
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Failed to contact local AI. Is Ollama running?', type: 'error', isVisible: true });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

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
             <div className={`fixed right-0 top-0 h-full w-96 sm:w-[30rem] bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-700 ease-out z-50 ${
         isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
       }`}>
                 {/* Header */}
                   <div className={`flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-800 ease-out ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}>
           <div className="flex items-center gap-3">
             <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
               Documents & AI
             </h2>
             <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded p-0.5">
               <button
                 className={`px-2 py-1 text-xs rounded ${activeTab === 'media' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}
                 onClick={() => setActiveTab('media')}
               >Media</button>
               <button
                 className={`px-2 py-1 text-xs rounded ${activeTab === 'chat' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}
                 onClick={() => setActiveTab('chat')}
               >Chat</button>
             </div>
           </div>
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
          {activeTab === 'chat' ? (
            <div className="flex flex-col gap-3 h-[calc(100vh-7rem)]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Chat</span>
                <select
                  className="ml-auto text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  
                  <option value="deepseek-r1:8b">DeepSeek R1 8B</option>
                  <option value="gemma3:12b">Gemma 3 12B</option>
                  <option value="gemma3:4b">Gemma 3 4B</option>
                  
                </select>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-700 dark:text-gray-300 mb-1">Context</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-24 overflow-auto">
                  {selectedNode ? `Title: ${selectedNode.title}\nDescription: ${selectedNode.description}` : 'No node selected'}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-800">
                {messages.length === 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">Ask about the title/description. E.g., "Explain the description" or "Elaborate the description".</div>
                )}
                {messages.map((m, idx) => (
                  <div key={idx} className={`text-sm whitespace-pre-wrap ${m.role === 'assistant' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                    <span className="text-[10px] uppercase opacity-60 mr-2">{m.role}</span>
                    {m.content}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={selectedNode ? 'Type your question...' : 'Select a node to chat'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                  disabled={!selectedNode || isSending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!selectedNode || isSending || !input.trim()}
                  className={`px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}
                >Send</button>
              </div>
            </div>
          ) : selectedNode ? (
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

              {/* Removed Add File Path UI */}

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
                        {getMediaIcon(media)}
                                                 <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                             {media.name}
                           </p>
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                             {getMediaTypeLabel(media)}
                             {media.size && ` • ${formatFileSize(media.size)}`}
                           </p>
                         </div>
                      </div>

                      {/* Inline Media Player */}
                      {renderInlineMedia(media)}

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
                      {media.size && media.size > 5 * 1024 * 1024 && media.type !== 'link' && (
                        <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300">
                          ⚠️ Large file ({formatFileSize(media.size)}). Opening may be slow. Consider using file paths for better performance.
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {media.type === 'link' && (
                          <button
                            onClick={() => handleMediaClick(media.id)}
                            onTouchEnd={() => handleMediaClick(media.id)}
                            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
                          >
                            <Play className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                            Play
                          </button>
                        )}
                                                 <button
                           onClick={() => media.type === 'link' ? window.open(media.url, '_blank') : handleDownload(media)}
                           onTouchEnd={() => media.type === 'link' ? window.open(media.url, '_blank') : handleDownload(media)}
                           className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
                         >
                           {media.type === 'link' ? (
                             <>
                               <ExternalLink className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                               Open
                             </>
                           ) : (
                             <>
                               <Download className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                               Download
                             </>
                           )}
                         </button>
                         {media.type !== 'link' && (
                           <button
                           onClick={() => handleOpenInNewTab(media)}
                           onTouchEnd={() => handleOpenInNewTab(media)}
                           className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md transform"
                         >
                           <ExternalLink className="w-3 h-3 transform transition-all duration-300 hover:scale-110" />
                           Open
                         </button>
                         )}
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


      {/* No File Path Input Modal (deprecated) */}

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