// =============================================================================
// src/app/models/dashboard.model.ts
// =============================================================================
export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  activeContracts: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  occupancyRate: number;
  collectionRate: number;
  pendingPayments: number;
  overduePayments: number;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  data: any;
  position: { x: number; y: number; width: number; height: number };
  visible: boolean;
}

export type WidgetType = 
  | 'revenue_chart'
  | 'occupancy_rate'
  | 'recent_payments'
  | 'upcoming_due_dates'
  | 'contract_expirations'
  | 'meter_readings'
  | 'room_status';
