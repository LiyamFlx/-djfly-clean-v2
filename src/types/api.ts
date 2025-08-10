// API-related types and interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  rateLimitDelay: number;
}

// Spotify API types
export interface SpotifyApiConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

// OpenAI API types  
export interface OpenAIApiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
}

// LastFM API types
export interface LastFMApiConfig {
  apiKey: string;
  secret: string;
  baseUrl: string;
}