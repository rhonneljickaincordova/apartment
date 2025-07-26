// =============================================================================
// src/app/models/validation.model.ts
// =============================================================================
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// Form validation state
export interface FormValidation {
  [key: string]: {
    isValid: boolean;
    errors: string[];
    touched: boolean;
  };
}
