export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type AdminRole = 'super_admin' | 'admin' | 'staff';
export type CRMStatus = 'new' | 'contacted' | 'follow-up' | 'closed';
export type RSVPStatus = 'confirmed' | 'checked-in' | 'no-show' | 'cancelled';
export type InquiryType = 'reservation' | 'vendor' | 'sponsor' | 'loyalty';
export type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'archived';
export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  lastLogin?: number;
  status: 'active' | 'suspended';
}
export interface VenueSettings {
  id: string; // 'current'
  venueName: string;
  address: string;
  timezone: string;
  currency: string;
  capacity: number;
  stripeEnabled: boolean;
  neomEnabled: boolean;
  setupComplete: boolean;
}
export interface TableType {
  id: string;
  name: string;
  capacity: number;
  minimumSpend: number;
  description?: string;
}
export interface AuditLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  entityId?: string;
  entityType?: string;
  details: string;
  timestamp: number;
}
export interface EventInstance {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'cancelled';
  notes?: string;
}
export interface Campaign {
  id: string;
  name: string;
  type: 'sms' | 'email';
  status: CampaignStatus;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
  };
  createdAt: number;
}
export interface CRMLead {
  id: string;
  sourceId: string; // ID of the inquiry or RSVP
  type: InquiryType;
  status: CRMStatus;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string; // Admin ID
  history: { timestamp: number; note: string; adminId: string }[];
}
export interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: number;
  status?: CRMStatus;
  notes?: string;
  tags?: string[];
}
export interface TextSubscriber {
  id: string;
  phone: string;
  createdAt: number;
  syncedToNeoM?: boolean;
  neoMResponse?: any;
}
export interface RSVP {
  id: string;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  status?: RSVPStatus;
  notes?: string;
}
export type AnalyticsEventType = 'page_view' | 'form_submit' | 'click' | 'qr_scan';
export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  target: string;
  metadata?: Record<string, any>;
  sessionId?: string;
  timestamp: number;
}
export interface SystemConfig {
  id: string;
  value: string;
  updatedAt?: number;
}
export interface AuthResponse {
  token: string;
  user: {
    username: string;
    role: AdminRole;
  };
}
export interface AdminStats {
  totalInquiries: number;
  totalRsvps: number;
  totalSubscribers: number;
  totalAnalytics: number;
  timeline?: { date: string; inquiries: number; rsvps: number }[];
}