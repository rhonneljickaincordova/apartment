// =============================================================================
// src/app/models/meter.model.ts
// =============================================================================
export interface MeterReading {
  id: string;
  roomId: string;
  reading: number;
  previousReading: number;
  consumption: number; // Current reading - previous reading
  date: string; // ISO date string
  month: string;
  year: string;
  rate?: number; // Electricity rate at time of reading
  cost?: number; // Calculated cost (consumption × rate)
  notes?: string;
  createdAt: string;
}

// Meter reading creation interface
export interface CreateMeterReadingRequest {
  roomId: string;
  reading: number;
  date: string;
  notes?: string;
}

// Meter reading update interface
export interface UpdateMeterReadingRequest {
  reading?: number;
  date?: string;
  notes?: string;
}

// Meter reading with calculations for display
export interface MeterReadingWithCalculations extends MeterReading {
  consumptionFormatted: string;
  costFormatted: string;
  dateFormatted: string;
}

// Monthly meter summary
export interface MonthlyMeterSummary {
  roomId: string;
  month: string;
  year: string;
  totalConsumption: number;
  totalCost: number;
  averageDailyConsumption: number;
}

// Meter reading validation result
export interface MeterReadingValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
