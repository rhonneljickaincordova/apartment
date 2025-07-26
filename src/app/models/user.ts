// =============================================================================
// src/app/models/user.model.ts
// =============================================================================
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  language?: string;
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  paymentReminders: boolean;
  contractExpirations: boolean;
  overduePayments: boolean;
  meterReadingReminders: boolean;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  currency: string;
  timezone: string;
  defaultReminderDays: number;
  autoGenerateBills: boolean;
}
