// =============================================================================
// src/app/models/api.model.ts
// =============================================================================
// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

// Pagination interface
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters for filtering and sorting
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
}

// File upload interface
export interface FileUpload {
  file: File;
  type: 'contract' | 'receipt' | 'document' | 'image';
  description?: string;
}
