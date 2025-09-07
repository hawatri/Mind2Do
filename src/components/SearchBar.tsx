// Create: src/components/SearchBar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp, MapPin, FileText, Image, Link } from 'lucide-react';
import { MindMapNode } from '../types';

interface SearchResult {
  node: MindMapNode;
  matchType: 'title' | 'description' | 'media';
  matchText: string;
  score: number;
}

interface SearchBarProps {
  nodes: MindMapNode[];
  onNodeSelect: (nodeId: string) => void;
  onNodeCenter: (nodeId: string) => void;
  selectedNodeId: string | null;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  nodes,
  onNodeSelect,
  onNodeCenter,
  selectedNodeId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedResultIndex(0);
      return;
    }

    setIsSearching(true);
    
    // Debounce search
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery.trim());
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, nodes]);

  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

    nodes.forEach(node => {
      let totalScore = 0;
      let matchType: 'title' | 'description' | 'media' = 'title';
      let matchText = '';

      // Search in title (highest priority)
      const titleLower = node.title.toLowerCase();
      let titleScore = 0;
      searchTerms.forEach(term => {
        if (titleLower.includes(term)) {
          titleScore += titleLower === term ? 10 : titleLower.startsWith(term) ? 8 : 5;
        }
      });

      if (titleScore > 0) {
        totalScore += titleScore;
        matchType = 'title';
        matchText = node.title;
      }

      // Search in description (medium priority)
      const descriptionLower = node.description.toLowerCase();
      let descriptionScore = 0;
      searchTerms.forEach(term => {
        if (descriptionLower.includes(term)) {
          descriptionScore += descriptionLower.startsWith(term) ? 4 : 2;
        }
      });

      if (descriptionScore > 0 && descriptionScore > titleScore) {
        totalScore += descriptionScore;
        matchType = 'description';
        matchText = node.description;
      } else if (descriptionScore > 0) {
        totalScore += descriptionScore;
      }

      // Search in media names and extracted text (lower priority)
      let mediaScore = 0;
      let mediaMatch = '';
      node.media.forEach(media => {
        const mediaNameLower = media.name.toLowerCase();
        const extractedTextLower = (media.extractedText || '').toLowerCase();
        
        searchTerms.forEach(term => {
          if (mediaNameLower.includes(term)) {
            mediaScore += 1;
            mediaMatch = media.name;
          }
          if (extractedTextLower.includes(term)) {
            mediaScore += 0.5;
            if (!mediaMatch) mediaMatch = media.name;
          }
        });
      });

      if (mediaScore > 0 && mediaScore > Math.max(titleScore, descriptionScore)) {
        totalScore += mediaScore;
        matchType = 'media';
        matchText = mediaMatch;
      } else if (mediaScore > 0) {
        totalScore += mediaScore;
      }

      // Add to results if any match found
      if (totalScore > 0) {
        results.push({
          node,
          matchType,
          matchText,
          score: totalScore
        });
      }
    });

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    setSearchResults(results);
    setSelectedResultIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedResultIndex]) {
        handleSelectResult(searchResults[selectedResultIndex]);
      }
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onNodeSelect(result.node.id);
    onNodeCenter(result.node.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;
    
    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  const getMatchIcon = (matchType: 'title' | 'description' | 'media') => {
    switch (matchType) {
      case 'title':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'description':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'media':
        return <Image className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-20 p-3 rounded-xl glass hover:glass-strong transition-all duration-300 z-50 hover:scale-105 hover:rotate-3"
        title="Search nodes (Ctrl+K)"
      >
        <Search className="w-5 h-5 text-gray-700 dark:text-gray-300 drop-shadow-sm" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Search Container */}
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50">
            <div className="glass-strong rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/20 dark:border-gray-600/30">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search nodes by title, description, or media..."
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Results */}
              <div ref={resultsRef} className="max-h-96 overflow-y-auto">
                {isSearching && (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                )}

                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                    No nodes found matching "{searchQuery}"
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 bg-white/10 dark:bg-gray-700/30">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </div>
                    
                    {searchResults.map((result, index) => (
                      <div
                        key={result.node.id}
                        className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                          index === selectedResultIndex
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
                            : result.node.id === selectedNodeId
                            ? 'bg-green-50 dark:bg-green-900/30 border-green-500'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
                        }`}
                        onClick={() => handleSelectResult(result)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getMatchIcon(result.matchType)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 
                                className="font-medium text-gray-900 dark:text-gray-100 truncate"
                                dangerouslySetInnerHTML={{
                                  __html: result.matchType === 'title' 
                                    ? highlightMatch(result.node.title, searchQuery)
                                    : result.node.title
                                }}
                              />
                              {result.node.completed && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  ✓ Done
                                </span>
                              )}
                            </div>
                            
                            <p 
                              className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: result.matchType === 'description'
                                  ? highlightMatch(result.matchText, searchQuery)
                                  : result.matchType === 'media'
                                  ? `Media: ${highlightMatch(result.matchText, searchQuery)}`
                                  : result.node.description.length > 100
                                  ? result.node.description.substring(0, 100) + '...'
                                  : result.node.description
                              }}
                            />
                            
                            {/* Media count and match indicator */}
                            <div className="flex items-center gap-2 mt-2">
                              {result.node.media.length > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {result.node.media.length} media
                                </span>
                              )}
                              
                              <span className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                                Match in {result.matchType}
                              </span>
                              
                              <span className="text-xs text-gray-400">
                                Score: {result.score.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNodeCenter(result.node.id);
                              }}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                              title="Center on node"
                            >
                              <MapPin className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!searchQuery && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start typing to search through your mind map</p>
                    <p className="text-xs mt-1 opacity-75">
                      Use <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">↑</kbd> <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">↓</kbd> to navigate, <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Enter</kbd> to select
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with shortcuts */}
              {searchResults.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {selectedResultIndex + 1} of {searchResults.length}
                    </span>
                    <span>
                      <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">Enter</kbd> to select • 
                      <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded ml-1">Esc</kbd> to close
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};