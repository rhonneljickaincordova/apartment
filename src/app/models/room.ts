
// =============================================================================
// src/app/models/room.model.ts
// =============================================================================
export interface Room {
  id: string;
  rent: number;
  water: number;
  wifi: number;
  electric: number;
  occupants: number;
  createdAt?: string;
  updatedAt?: string;
}

// Room creation interface (without id and timestamps)
export interface CreateRoomRequest {
  rent: number;
  water: number;
  wifi: number;
  electric: number;
  occupants: number;
}

// Room update interface (partial updates)
export interface UpdateRoomRequest {
  rent?: number;
  water?: number;
  wifi?: number;
  electric?: number;
  occupants?: number;
}

// Room with calculated totals for display
export interface RoomWithTotals extends Room {
  waterTotal: number;
  fixedMonthlyTotal: number;
}
