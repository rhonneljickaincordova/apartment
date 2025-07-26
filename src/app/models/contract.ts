import { Room } from "./room";

export interface Contract {
  id: string;
  roomId: string;
  tenant: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  startDate: string;
  endDate?: string; // Optional for open-ended leases
  rent: number;
  deposit: number;
  status: ContractStatus;
  type: ContractType;
  duration?: number; // Duration in months (for fixed-term contracts)
  terminationNotice?: number; // Notice period in days
  landlordInfo?: LandlordInfo;
  additionalTerms?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus = 'active' | 'terminated' | 'expired' | 'pending';
export type ContractType = 'fixed-term' | 'open-ended' | 'month-to-month';

export interface LandlordInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Contract creation interface
export interface CreateContractRequest {
  roomId: string;
  tenant: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  startDate: string;
  endDate?: string;
  rent: number;
  deposit: number;
  type: ContractType;
  duration?: number;
  terminationNotice?: number;
  landlordInfo?: LandlordInfo;
  additionalTerms?: string[];
}

// Contract update interface
export interface UpdateContractRequest {
  tenant?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  endDate?: string;
  rent?: number;
  deposit?: number;
  status?: ContractStatus;
  terminationNotice?: number;
  additionalTerms?: string[];
}

// Contract with room details for display
export interface ContractWithRoom extends Contract {
  roomDetails?: Room;
}

// Contract renewal request
export interface RenewContractRequest {
  contractId: string;
  newStartDate: string;
  newEndDate?: string;
  newRent?: number;
  newDeposit?: number;
  duration?: number;
}

// Contract termination request
export interface TerminateContractRequest {
  contractId: string;
  terminationDate: string;
  reason?: string;
  refundDeposit?: boolean;
  finalBillAmount?: number;
}