// =============================================================================
// src/app/models/report.model.ts
// =============================================================================
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  parameters: ReportParameters;
  data: any[];
  generatedAt: string;
  format: ReportFormat;
}

export type ReportType = 
  | 'revenue_report'
  | 'occupancy_report'
  | 'payment_report'
  | 'contract_report'
  | 'utility_report'
  | 'tenant_report';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface ReportParameters {
  dateFrom: string;
  dateTo: string;
  roomIds?: string[];
  contractIds?: string[];
  includeDetails: boolean;
  groupBy?: 'room' | 'month' | 'tenant';
}
