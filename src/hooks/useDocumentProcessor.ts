// Create this as: src/hooks/useDocumentProcessor.ts

import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

interface ProcessedDocument {
  id: string;
  text: string;
  summary: string;
  keywords: string[];
  confidence: number;
  processingMethod: 'ocr' | 'pdf-parse' | 'text-extract' | 'api-extraction';
}

export const useDocumentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Enhanced OCR with better preprocessing
  const processImageWithOCR = async (imageUrl: string): Promise<string> => {
    const worker = await createWorker({
      logger: m => {
        if (m.status === 'recognizing text') {
          setProcessingProgress(Math.round(m.progress * 100));
        }
      }
    });

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      // Enhanced OCR settings for better accuracy
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:()[]{}"\'-+= \n\t',
        tessedit_pageseg_mode: '6', // Uniform block of text
        preserve_interword_spaces: '1',
      });

      const { data: { text, confidence } } = await worker.recognize(imageUrl);
      await worker.terminate();
      
      return text.trim();
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  };

  // Smart document processing that tries multiple methods
  const processDocument = async (media: any): Promise<ProcessedDocument> => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      let extractedText = '';
      let processingMethod: ProcessedDocument['processingMethod'] = 'text-extract';
      let confidence = 0;

      if (media.type === 'document') {
        const mimeType = media.url.split(';')[0].replace('data:', '');
        
        if (mimeType.includes('pdf')) {
          try {
            // For now, use OCR for PDFs (you can enhance this later)
            extractedText = await processImageWithOCR(media.url);
            processingMethod = 'ocr';
            confidence = 0.7;
          } catch (error) {
            console.warn('PDF processing failed:', error);
            throw error;
          }
        } else if (mimeType.startsWith('text/')) {
          // Plain text files
          extractedText = atob(media.url.split(',')[1]);
          processingMethod = 'text-extract';
          confidence = 1.0;
        }
      } else if (media.type === 'image') {
        // Enhanced image processing for scanned documents
        extractedText = await processImageWithOCR(media.url);
        processingMethod = 'ocr';
        confidence = 0.8;
      }

      // Post-process the extracted text
      const cleanedText = cleanExtractedText(extractedText);
      const summary = generateSummary(cleanedText);
      const keywords = extractKeywords(cleanedText);

      return {
        id: media.id,
        text: cleanedText,
        summary,
        keywords,
        confidence,
        processingMethod
      };

    } finally {
      setIsProcessing(false);
      setProcessingProgress(100);
    }
  };

  // Clean and improve extracted text
  const cleanExtractedText = (text: string): string => {
    return text
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/\s{3,}/g, ' ') // Remove excessive spaces
      .replace(/[^\w\s.,!?;:()\[\]{}'"+-=]/g, '') // Remove unusual characters
      .trim();
  };

  // Generate summary for AI context
  const generateSummary = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).join('. ').trim() + (sentences.length > 3 ? '...' : '');
  };

  // Extract keywords for better AI context
  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Simple frequency-based keyword extraction
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .filter(([, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  };

  return {
    processDocument,
    isProcessing,
    processingProgress,
    processImageWithOCR,
  };
};