// =============================================================================
// src/app/models/billing.model.ts

import { Room } from "./room";

// =============================================================================
export interface BillingRecord {
  id: string;
  roomId: string;
  month: string;
  year: string;
  rent: number;
  water: number;
  wifi: number;
  electric: number;
  total: number;
  date: string; // ISO date string when bill was generated
  dueDate?: string; // When payment is due
  paidDate?: string; // When payment was received
  status: BillingStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  discounts?: BillingDiscount[];
  lateFees?: number;
  createdAt: string;
}

export type BillingStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'online' | 'card';

export interface BillingDiscount {
  type: 'percentage' | 'fixed';
  amount: number;
  description: string;
}

// Billing record creation interface
export interface CreateBillingRecordRequest {
  roomId: string;
  month: string;
  year: string;
  rent: number;
  water: number;
  wifi: number;
  electric: number;
  dueDate?: string;
  notes?: string;
  discounts?: BillingDiscount[];
}

// Billing record update interface
export interface UpdateBillingRecordRequest {
  status?: BillingStatus;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  lateFees?: number;
  discounts?: BillingDiscount[];
}

// Billing record with room and tenant details
export interface BillingRecordWithDetails extends BillingRecord {
  roomDetails?: Room;
  tenantDetails?: {
    name: string;
    email: string;
    phone: string;
  };
}

// Monthly billing summary
export interface MonthlyBillingSummary {
  month: string;
  year: string;
  totalBills: number;
  totalRevenue: number;
  paidBills: number;
  pendingBills: number;
  overdueBills: number;
  averageBillAmount: number;
}

// Billing analytics
export interface BillingAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  averageMonthlyRevenue: number;
  occupancyRate: number;
  collectionRate: number; // Percentage of bills paid on time
  topRevenueRoom: string;
  monthlyTrend: MonthlyRevenueTrend[];
}

export interface MonthlyRevenueTrend {
  month: string;
  year: string;
  revenue: number;
  billCount: number;
}
