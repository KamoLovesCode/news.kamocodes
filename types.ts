import { ReactNode } from 'react';

// Represents a block of content within an article for rich formatting
export interface ContentBlock {
  type: 'paragraph' | 'subheading' | 'quote';
  content: string;
}

export interface Article {
  id: string; // Added for unique identification
  title:string;
  summary: string;
  fullContent: ContentBlock[]; // Changed from string to support rich content
  category: string;
  imageUrl: string;
  sourceUrl: string; // Changed from sources to a simple URL
  sourceName: string; // Changed from sources to a simple name
  groundingUrls?: string[]; // Add optional property for Google Search Grounding URLs
}

// Fix: Add missing EngagingArticle type.
// EngagingArticle extends Article with a short, catchy headline for display on cards.
export interface EngagingArticle extends Article {
  shortHeadline: string;
}

// Fix: Add missing Book type.
// Represents a children's story or book.
export interface Book {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  coverImageUrl: string;
}

// Fix: Add missing GalleryImage type.
// Represents an image in the AI-generated gallery.
export interface GalleryImage {
  imageUrl: string;
  prompt: string;
}

// Fix: Add missing Course types.
export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  imageUrl: string;
}

// Fix: Add missing Quote type.
// Represents the daily quote.
export interface Quote {
  text: string;
  author: string;
}

// Add Weather type for the weather component.
export interface Weather {
  current: {
    city: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: string;
  };
  forecast: {
    dayOfWeek: string;
    highTemp: number;
    lowTemp: number;
    condition: string;
  }[];
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

export interface StockData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
}
