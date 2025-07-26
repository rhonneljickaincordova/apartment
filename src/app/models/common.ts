// =============================================================================
// src/app/models/common.model.ts
// =============================================================================
// Common enums and types used across the application

import { BillingRecord, BillingStatus, PaymentMethod } from "./billing";
import { Contract, ContractStatus, ContractType, CreateContractRequest } from "./contract";
import { MeterReading } from "./meter";
import { Room, CreateRoomRequest } from "./room";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: Address;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Currency {
  code: string; // e.g., 'USD', 'EUR', 'PHP'
  symbol: string; // e.g., '$', '€', '₱'
  name: string; // e.g., 'US Dollar', 'Euro', 'Philippine Peso'
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: string;
}

// Sort configuration
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Filter configuration
export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

// =============================================================================
// UTILITY TYPES AND TYPE GUARDS
// =============================================================================

// Helper type to make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Helper type to make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Helper type to omit certain properties
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Type guards for runtime type checking
export function isRoom(obj: any): obj is Room {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.rent === 'number' &&
         typeof obj.water === 'number' &&
         typeof obj.wifi === 'number' &&
         typeof obj.electric === 'number' &&
         typeof obj.occupants === 'number';
}

export function isContract(obj: any): obj is Contract {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.roomId === 'string' &&
         typeof obj.tenant === 'string' &&
         typeof obj.email === 'string' &&
         typeof obj.rent === 'number' &&
         ['active', 'terminated', 'expired', 'pending'].includes(obj.status);
}

export function isMeterReading(obj: any): obj is MeterReading {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.roomId === 'string' &&
         typeof obj.reading === 'number' &&
         typeof obj.date === 'string';
}

export function isBillingRecord(obj: any): obj is BillingRecord {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.roomId === 'string' &&
         typeof obj.total === 'number' &&
         ['pending', 'paid', 'overdue', 'cancelled'].includes(obj.status);
}

// =============================================================================
// CONSTANTS
// =============================================================================
export const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'PHP': '₱',
  'GBP': '£',
  'JPY': '¥',
  'CNY': '¥',
  'INR': '₹'
};

export const DATE_FORMATS = {
  'US': 'MM/DD/YYYY',
  'EU': 'DD/MM/YYYY',
  'ISO': 'YYYY-MM-DD'
};

export const CONTRACT_STATUSES: ContractStatus[] = ['active', 'terminated', 'expired', 'pending'];
export const CONTRACT_TYPES: ContractType[] = ['fixed-term', 'open-ended', 'month-to-month'];
export const BILLING_STATUSES: BillingStatus[] = ['pending', 'paid', 'overdue', 'cancelled'];
export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'bank_transfer', 'check', 'online', 'card'];

// =============================================================================
// EXAMPLE USAGE AND FACTORY FUNCTIONS
// =============================================================================

// Factory function to create a new room
export function createRoom(data: CreateRoomRequest): Omit<Room, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    rent: data.rent,
    water: data.water,
    wifi: data.wifi,
    electric: data.electric,
    occupants: data.occupants
  };
}

// Factory function to create a new contract
export function createContract(data: CreateContractRequest): Omit<Contract, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    roomId: data.roomId,
    tenant: data.tenant,
    email: data.email,
    phone: data.phone,
    emergencyContact: data.emergencyContact,
    startDate: data.startDate,
    endDate: data.endDate,
    rent: data.rent,
    deposit: data.deposit,
    status: 'pending',
    type: data.type,
    duration: data.duration,
    terminationNotice: data.terminationNotice || 30,
    landlordInfo: data.landlordInfo,
    additionalTerms: data.additionalTerms || []
  };
}

// Factory function to create a meter reading
export function createMeterReading(
  roomId: string, 
  reading: number, 
  previousReading: number,
  date: string = new Date().toISOString()
): Omit<MeterReading, 'id' | 'createdAt'> {
  const dateObj = new Date(date);
  return {
    roomId,
    reading,
    previousReading,
    consumption: reading - previousReading,
    date,
    month: (dateObj.getMonth() + 1).toString(),
    year: dateObj.getFullYear().toString()
  };
}

// Factory function to create a billing record
export function createBillingRecord(
  roomId: string,
  month: string,
  year: string,
  rent: number,
  water: number,
  wifi: number,
  electric: number
): Omit<BillingRecord, 'id' | 'createdAt'> {
  return {
    roomId,
    month,
    year,
    rent,
    water,
    wifi,
    electric,
    total: rent + water + wifi + electric,
    date: new Date().toISOString(),
    status: 'pending'
  };
}