import { IndexedEntity } from "./core-utils";
import type {
  Inquiry,
  TextSubscriber,
  RSVP,
  AnalyticsEvent,
  SystemConfig,
  AdminUser,
  VenueSettings,
  TableType,
  AuditLog,
  EventInstance,
  Campaign,
  CRMLead
} from "@shared/types";
export class InquiryEntity extends IndexedEntity<Inquiry> {
  static readonly entityName = "inquiry";
  static readonly indexName = "inquiries";
  static readonly initialState: Inquiry = {
    id: "",
    type: "reservation",
    name: "",
    email: "",
    phone: "",
    message: "",
    createdAt: 0,
    status: "new",
    notes: "",
    tags: [],
  };
}
export class TextSubscriberEntity extends IndexedEntity<TextSubscriber> {
  static readonly entityName = "text-subscriber";
  static readonly indexName = "text-subscribers";
  static readonly initialState: TextSubscriber = {
    id: "",
    phone: "",
    createdAt: 0,
    syncedToNeoM: false,
  };
}
export class RsvpEntity extends IndexedEntity<RSVP> {
  static readonly entityName = "rsvp";
  static readonly indexName = "rsvps";
  static readonly initialState: RSVP = {
    id: "",
    eventDate: "",
    name: "",
    email: "",
    phone: "",
    createdAt: 0,
    status: "confirmed",
    notes: "",
  };
}
export class AnalyticsEntity extends IndexedEntity<AnalyticsEvent> {
  static readonly entityName = "analytics-event";
  static readonly indexName = "analytics-events";
  static readonly initialState: AnalyticsEvent = {
    id: "",
    type: "page_view",
    target: "",
    timestamp: 0,
  };
}
export class SystemConfigEntity extends IndexedEntity<SystemConfig> {
  static readonly entityName = "system-config";
  static readonly indexName = "system-configs";
  static readonly initialState: SystemConfig = {
    id: "",
    value: "",
  };
  static seedData = [
    { id: 'setup_complete', value: 'false' },
    { id: 'maintenance_mode', value: 'true' },
    { id: 'ticket_url', value: 'https://www.eventbrite.com' },
    { id: 'event_time', value: '5:00 PM - 10:00 PM' },
    { id: 'insta_url', value: 'https://instagram.com/waybackwednesdays' },
    { id: 'twitter_url', value: 'https://twitter.com/waybackwednesdays' },
    { id: 'contact_phone', value: '314-208-2050' },
    { id: 'contact_email', value: 'vip@waybackwednesdays.com' },
    { id: 'chatbot_embed', value: '' },
    { id: 'neom_api_key', value: '' },
    { id: 'neom_webhook_url', value: '' },
    { id: 'venue_name', value: 'Moonrise Hotel Rooftop' },
    { id: 'venue_address', value: '6177 Delmar Blvd, St. Louis, MO 63112' }
  ];
}
export class AdminUserEntity extends IndexedEntity<AdminUser> {
  static readonly entityName = "admin-user";
  static readonly indexName = "admin-users";
  static readonly initialState: AdminUser = {
    id: "",
    username: "",
    passwordHash: "",
    role: "admin",
    status: "active"
  };
  static seedData = [
    { id: 'admin', username: 'admin', passwordHash: 'admin123', role: 'super_admin' as const, status: 'active' as const }
  ] as const;
}
export class VenueSettingsEntity extends IndexedEntity<VenueSettings> {
  static readonly entityName = "venue-settings";
  static readonly indexName = "venue-settings-idx";
  static readonly initialState: VenueSettings = {
    id: "current",
    venueName: "",
    address: "",
    timezone: "America/Chicago",
    currency: "USD",
    capacity: 0,
    stripeEnabled: false,
    neomEnabled: false,
    setupComplete: false
  };
}
export class TableTypeEntity extends IndexedEntity<TableType> {
  static readonly entityName = "table-type";
  static readonly indexName = "table-types";
  static readonly initialState: TableType = {
    id: "",
    name: "",
    capacity: 0,
    minimumSpend: 0
  };
}
export class AuditLogEntity extends IndexedEntity<AuditLog> {
  static readonly entityName = "audit-log";
  static readonly indexName = "audit-logs";
  static readonly initialState: AuditLog = {
    id: "",
    adminId: "",
    adminUsername: "",
    action: "",
    details: "",
    timestamp: 0
  };
}
export class EventInstanceEntity extends IndexedEntity<EventInstance> {
  static readonly entityName = "event-instance";
  static readonly indexName = "event-instances";
  static readonly initialState: EventInstance = {
    id: "",
    date: "",
    startTime: "17:00",
    endTime: "22:00",
    status: "active"
  };
}
export class CampaignEntity extends IndexedEntity<Campaign> {
  static readonly entityName = "campaign";
  static readonly indexName = "campaigns";
  static readonly initialState: Campaign = {
    id: "",
    name: "",
    type: "sms",
    status: "draft",
    metrics: { sent: 0, opened: 0, clicked: 0 },
    createdAt: 0
  };
}
export class CRMLeadEntity extends IndexedEntity<CRMLead> {
  static readonly entityName = "crm-lead";
  static readonly indexName = "crm-leads";
  static readonly initialState: CRMLead = {
    id: "",
    sourceId: "",
    type: "reservation",
    status: "new",
    priority: "medium",
    history: []
  };
}