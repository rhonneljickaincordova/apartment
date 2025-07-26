// =============================================================================
// src/app/models/notification.model.ts
// =============================================================================
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any; // Additional data related to the notification
  read: boolean;
  priority: NotificationPriority;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'payment_due' 
  | 'payment_overdue' 
  | 'contract_expiring' 
  | 'meter_reading_due'
  | 'new_tenant'
  | 'system_update'
  | 'data_backup';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
