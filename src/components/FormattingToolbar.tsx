import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Palette, Type, Image, FileText, Link } from 'lucide-react';
import { HighlightColor, TextColor } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface FormattingToolbarProps {
  selectedNodeId: string | null;
  onFormatText: (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => void;
  onHighlightText: (color: HighlightColor) => void;
  onTextColor: (color: TextColor) => void;
  onAddMedia: (type: 'image' | 'document' | 'link') => void;
  currentFormatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    highlight: string;
    textColor: string;
  };
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  selectedNodeId,
  onFormatText,
  onHighlightText,
  onTextColor,
  onAddMedia,
  currentFormatting,
}) => {
  const { themeStyle } = useTheme();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = React.useState(false);

  const highlightColors: { color: HighlightColor; label: string; bgClass: string }[] = [
    { color: 'none', label: 'None', bgClass: 'bg-transparent border-2 border-gray-300 dark:border-gray-600' },
    { color: 'yellow', label: 'Yellow', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { color: 'green', label: 'Green', bgClass: 'bg-green-50 dark:bg-green-900/20' },
    { color: 'blue', label: 'Blue', bgClass: 'bg-blue-50 dark:bg-blue-900/20' },
    { color: 'pink', label: 'Pink', bgClass: 'bg-pink-50 dark:bg-pink-900/20' },
    { color: 'purple', label: 'Purple', bgClass: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  const textColors: { color: TextColor; label: string; colorClass: string }[] = [
    { color: 'default', label: 'Default', colorClass: 'text-gray-900 dark:text-gray-100' },
    { color: 'red', label: 'Red', colorClass: 'text-red-700 dark:text-red-400' },
    { color: 'blue', label: 'Blue', colorClass: 'text-blue-700 dark:text-blue-400' },
    { color: 'green', label: 'Green', colorClass: 'text-green-700 dark:text-green-400' },
    { color: 'purple', label: 'Purple', colorClass: 'text-purple-700 dark:text-purple-400' },
    { color: 'orange', label: 'Orange', colorClass: 'text-orange-700 dark:text-orange-400' },
    { color: 'pink', label: 'Pink', colorClass: 'text-pink-700 dark:text-pink-400' },
  ];

  if (!selectedNodeId) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 rounded-2xl p-2 sm:p-3 flex items-center gap-1 sm:gap-2 z-50 max-w-[calc(100vw-2rem)] hover:scale-105 transition-all duration-300 ${
      themeStyle === 'modern' 
        ? 'glass-strong' 
        : 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700'
    }`}>
      <button
        onClick={() => onFormatText('bold')}
        onTouchEnd={() => onFormatText('bold')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.bold ? 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-lg' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Bold"
      >
        <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onFormatText('italic')}
        onTouchEnd={() => onFormatText('italic')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.italic ? 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-lg' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Italic"
      >
        <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onFormatText('underline')}
        onTouchEnd={() => onFormatText('underline')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.underline ? 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-lg' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Underline"
      >
        <Underline className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onFormatText('strikethrough')}
        onTouchEnd={() => onFormatText('strikethrough')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.strikethrough ? 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-lg' : 'text-gray-700 dark:text-gray-300'
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-0.5 sm:mx-1" />
      
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          onTouchEnd={() => setShowColorPicker(!showColorPicker)}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Highlight"
        >
          <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        
        {showColorPicker && (
          <div className={`absolute top-10 left-0 rounded-xl p-2 flex gap-1 shadow-xl ${
            themeStyle === 'modern' 
              ? 'glass-strong' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}>
            {highlightColors.map(({ color, label, bgClass }) => (
              <button
                key={color}
                onClick={() => {
                  onHighlightText(color);
                  setShowColorPicker(false);
                }}
                className={`w-6 h-6 rounded ${bgClass} hover:scale-110 transition-transform border`}
                title={label}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowTextColorPicker(!showTextColorPicker)}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Text Color"
        >
          <Type className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        
        {showTextColorPicker && (
          <div className={`absolute top-10 left-0 rounded-xl p-2 flex gap-1 shadow-xl ${
            themeStyle === 'modern' 
              ? 'glass-strong' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }`}>
            {textColors.map(({ color, label, colorClass }) => (
              <button
                key={color}
                onClick={() => {
                  onTextColor(color);
                  setShowTextColorPicker(false);
                }}
                className={`w-6 h-6 rounded border hover:scale-110 transition-transform flex items-center justify-center ${colorClass}`}
                title={label}
              >
                A
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-0.5 sm:mx-1" />
      
      <button
        onClick={() => onAddMedia('image')}
        className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        title="Add Image"
      >
        <Image className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onAddMedia('document')}
        className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        title="Add Document"
      >
        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onAddMedia('link')}
        className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        title="Add Link (YouTube, Video, Audio)"
      >
        <Link className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};