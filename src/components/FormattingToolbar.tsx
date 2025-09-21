import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Palette, Type, Image, FileText, Link, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Plus } from 'lucide-react';
import { HighlightColor, TextColor } from '../types';

interface FormattingToolbarProps {
  selectedNodeId: string | null;
  onFormatText: (format: 'bold' | 'italic' | 'underline' | 'strikethrough') => void;
  onHighlightText: (color: HighlightColor) => void;
  onTextColor: (color: TextColor) => void;
  onFontSize: (size: 'small' | 'medium' | 'large' | 'xlarge') => void;
  onFontFamily: (family: 'default' | 'serif' | 'monospace' | 'cursive') => void;
  onTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;
  onAddMedia: (type: 'image' | 'document' | 'link') => void;
  currentFormatting: {
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

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  selectedNodeId,
  onFormatText,
  onHighlightText,
  onTextColor,
  onFontSize,
  onFontFamily,
  onTextAlign,
  onAddMedia,
  currentFormatting,
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = React.useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = React.useState(false);
  const [showFontFamilyPicker, setShowFontFamilyPicker] = React.useState(false);
  const [showTextAlignPicker, setShowTextAlignPicker] = React.useState(false);

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

  const fontSizes: { size: 'small' | 'medium' | 'large' | 'xlarge'; label: string; sizeClass: string }[] = [
    { size: 'small', label: 'Small', sizeClass: 'text-xs' },
    { size: 'medium', label: 'Medium', sizeClass: 'text-sm' },
    { size: 'large', label: 'Large', sizeClass: 'text-lg' },
    { size: 'xlarge', label: 'X-Large', sizeClass: 'text-xl' },
  ];

  const fontFamilies: { family: 'default' | 'serif' | 'monospace' | 'cursive'; label: string; fontClass: string }[] = [
    { family: 'default', label: 'Default', fontClass: 'font-sans' },
    { family: 'serif', label: 'Serif', fontClass: 'font-serif' },
    { family: 'monospace', label: 'Monospace', fontClass: 'font-mono' },
    { family: 'cursive', label: 'Cursive', fontClass: 'font-cursive' },
  ];

  const textAlignments: { align: 'left' | 'center' | 'right' | 'justify'; label: string; icon: React.ReactNode }[] = [
    { align: 'left', label: 'Left', icon: <AlignLeft className="w-3 h-3" /> },
    { align: 'center', label: 'Center', icon: <AlignCenter className="w-3 h-3" /> },
    { align: 'right', label: 'Right', icon: <AlignRight className="w-3 h-3" /> },
    { align: 'justify', label: 'Justify', icon: <AlignJustify className="w-3 h-3" /> },
  ];

  if (!selectedNodeId) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 sm:p-2 flex items-center gap-0.5 sm:gap-1 border border-gray-200 dark:border-gray-700 z-50 max-w-[calc(100vw-2rem)]">
      <button
        onClick={() => onFormatText('bold')}
        onTouchEnd={() => onFormatText('bold')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.bold ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        }`}
        title="Bold"
      >
        <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onFormatText('italic')}
        onTouchEnd={() => onFormatText('italic')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.italic ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        }`}
        title="Italic"
      >
        <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onFormatText('underline')}
        onTouchEnd={() => onFormatText('underline')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.underline ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        }`}
        title="Underline"
      >
        <Underline className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onFormatText('strikethrough')}
        onTouchEnd={() => onFormatText('strikethrough')}
        className={`p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          currentFormatting.strikethrough ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
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
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          title="Highlight"
        >
          <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        
        {showColorPicker && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 flex gap-1">
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
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          title="Text Color"
        >
          <Type className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        
        {showTextColorPicker && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 flex gap-1">
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
      
      {/* Font Size Picker */}
      <div className="relative">
        <button
          onClick={() => setShowFontSizePicker(!showFontSizePicker)}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          title="Font Size"
        >
          <span className="text-xs sm:text-sm font-bold">A</span>
        </button>
        
        {showFontSizePicker && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 flex flex-col gap-1">
            {fontSizes.map(({ size, label, sizeClass }) => (
              <button
                key={size}
                onClick={() => {
                  onFontSize(size);
                  setShowFontSizePicker(false);
                }}
                className={`px-2 py-1 rounded text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${sizeClass} ${
                  currentFormatting.fontSize === size ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : ''
                }`}
                title={label}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Font Family Picker */}
      <div className="relative">
        <button
          onClick={() => setShowFontFamilyPicker(!showFontFamilyPicker)}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          title="Font Family"
        >
          <span className="text-xs sm:text-sm font-bold">F</span>
        </button>
        
        {showFontFamilyPicker && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 flex flex-col gap-1">
            {fontFamilies.map(({ family, label, fontClass }) => (
              <button
                key={family}
                onClick={() => {
                  onFontFamily(family);
                  setShowFontFamilyPicker(false);
                }}
                className={`px-2 py-1 rounded text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${fontClass} ${
                  currentFormatting.fontFamily === family ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : ''
                }`}
                title={label}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Text Alignment Picker */}
      <div className="relative">
        <button
          onClick={() => setShowTextAlignPicker(!showTextAlignPicker)}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
          title="Text Alignment"
        >
          {textAlignments.find(a => a.align === currentFormatting.textAlign)?.icon || <AlignLeft className="w-3 h-3 sm:w-4 sm:h-4" />}
        </button>
        
        {showTextAlignPicker && (
          <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 flex gap-1">
            {textAlignments.map(({ align, label, icon }) => (
              <button
                key={align}
                onClick={() => {
                  onTextAlign(align);
                  setShowTextAlignPicker(false);
                }}
                className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentFormatting.textAlign === align ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`}
                title={label}
              >
                {icon}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-0.5 sm:mx-1" />
      
      <button
        onClick={() => onAddMedia('image')}
        className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
        title="Add Image"
      >
        <Image className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onAddMedia('document')}
        className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
        title="Add Document"
      >
        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      <button
        onClick={() => onAddMedia('link')}
        className="p-1.5 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
        title="Add Link (YouTube, Video, Audio)"
      >
        <Link className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};