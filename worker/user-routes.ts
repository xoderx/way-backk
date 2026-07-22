import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  InquiryEntity,
  TextSubscriberEntity,
  RsvpEntity,
  AnalyticsEntity,
  SystemConfigEntity,
  AdminUserEntity,
  VenueSettingsEntity,
  AuditLogEntity,
  CRMLeadEntity
} from "./entities";
import { ok, bad, isStr } from './core-utils';
import type { InquiryType, AdminRole } from "@shared/types";
async function logAction(c: any, action: string, details: string, entityId?: string) {
  // Simple extraction for demo: usually you'd verify JWT and get user from context
  const adminUsername = "admin"; 
  await AuditLogEntity.create(c.env, {
    id: crypto.randomUUID(),
    adminId: "admin",
    adminUsername,
    action: action.toUpperCase(),
    details: details,
    entityId,
    timestamp: Date.now()
  });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  if ((app as any)._userRoutesInitialized) return;
  (app as any)._userRoutesInitialized = true;
  // PUBLIC ENDPOINTS
  app.get('/api/setup-check', async (c) => {
    const setupConfig = new SystemConfigEntity(c.env, 'setup_complete');
    const maintenanceConfig = new SystemConfigEntity(c.env, 'maintenance_mode');
    const [setupState, maintenanceState] = await Promise.all([
      setupConfig.getState(),
      maintenanceConfig.getState()
    ]);
    return ok(c, {
      setupComplete: setupState.value === 'true',
      maintenanceMode: maintenanceState.value === 'true'
    });
  });
  app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();
    await AdminUserEntity.ensureSeed(c.env);
    await SystemConfigEntity.ensureSeed(c.env);
    const userEntity = new AdminUserEntity(c.env, username);
    const state = await userEntity.getState();
    if (state.username === username && state.passwordHash === password) {
      await userEntity.patch({ lastLogin: Date.now() });
      return ok(c, {
        token: 'wbw-admin-session-secure',
        user: { username: state.username, role: state.role }
      });
    }
    return bad(c, 'Invalid credentials');
  });
  app.post('/api/analytics', async (c) => {
    const body = await c.req.json();
    const event = await AnalyticsEntity.create(c.env, {
      ...body,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    });
    return ok(c, event);
  });
  app.post('/api/inquiries', async (c) => {
    try {
      const body = await c.req.json();
      const { name, email, phone, type, message } = body;
      if (!isStr(name) || !isStr(email) || !isStr(phone) || !isStr(type)) return bad(c, 'Missing fields');
      const inquiryId = crypto.randomUUID();
      const inquiry = await InquiryEntity.create(c.env, {
        id: inquiryId,
        type: type as InquiryType,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message?.trim() || "",
        createdAt: Date.now(),
        status: 'new',
        notes: '',
        tags: []
      });
      await CRMLeadEntity.create(c.env, {
        id: crypto.randomUUID(),
        sourceId: inquiryId,
        type: type as InquiryType,
        status: 'new',
        priority: 'medium',
        history: [{ timestamp: Date.now(), note: 'Inquiry received via website', adminId: 'system' }]
      });
      return ok(c, inquiry);
    } catch (e) { return bad(c, 'Process failed'); }
  });
  app.post('/api/text-signup', async (c) => {
    const { phone } = await c.req.json();
    if (!isStr(phone)) return bad(c, 'Phone required');
    const sub = await TextSubscriberEntity.create(c.env, {
      id: crypto.randomUUID(),
      phone: phone.trim(),
      createdAt: Date.now(),
      syncedToNeoM: false
    });
    return ok(c, sub);
  });
  app.post('/api/rsvps', async (c) => {
    try {
      const { name, email, phone, eventDate } = await c.req.json();
      const rsvp = await RsvpEntity.create(c.env, {
        id: crypto.randomUUID(),
        name, email, phone, eventDate, createdAt: Date.now(),
        status: 'confirmed',
        notes: ''
      });
      return ok(c, rsvp);
    } catch (e) { return bad(c, 'RSVP failed'); }
  });
  app.get('/api/config/:key', async (c) => {
    const key = c.req.param('key');
    const entity = new SystemConfigEntity(c.env, key);
    const state = await entity.getState();
    return ok(c, state);
  });
  // ADMIN MIDDLEWARE
  const authMiddleware = () => async (c: any, next: any) => {
    const auth = c.req.header('Authorization');
    if (auth !== 'Bearer wbw-admin-session-secure') return bad(c, 'Unauthorized');
    await next();
  };
  // ADMIN ROUTES
  app.get('/api/admin/submissions', authMiddleware(), async (c) => {
    const list = await InquiryEntity.list(c.env);
    return ok(c, list.items.sort((a,b) => b.createdAt - a.createdAt));
  });
  app.get('/api/admin/rsvps', authMiddleware(), async (c) => {
    const list = await RsvpEntity.list(c.env);
    return ok(c, list.items.sort((a,b) => b.createdAt - a.createdAt));
  });
  app.get('/api/admin/subscribers', authMiddleware(), async (c) => {
    const list = await TextSubscriberEntity.list(c.env);
    return ok(c, list.items.sort((a,b) => b.createdAt - a.createdAt));
  });
  app.patch('/api/admin/inquiries/:id', authMiddleware(), async (c) => {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const entity = new InquiryEntity(c.env, id);
    await entity.patch(updates);
    await logAction(c, 'INQUIRY_UPDATE', `Modified status/notes for lead ${id}`, id);
    return ok(c, await entity.getState());
  });
  app.patch('/api/admin/config/:key', authMiddleware(), async (c) => {
    const key = c.req.param('key');
    const body = await c.req.json();
    const entity = new SystemConfigEntity(c.env, key);
    await entity.patch(body);
    await logAction(c, 'CONFIG_UPDATE', `Updated key '${key}' to value '${body.value}'`, key);
    return ok(c, await entity.getState());
  });
  app.get('/api/admin/config/:key', authMiddleware(), async (c) => {
    const key = c.req.param('key');
    const entity = new SystemConfigEntity(c.env, key);
    const state = await entity.getState();
    return ok(c, state);
  });
  app.post('/api/admin/setup', authMiddleware(), async (c) => {
    const settings = await c.req.json();
    const venue = await VenueSettingsEntity.create(c.env, { ...settings, id: 'current', setupComplete: true });
    const setupComp = new SystemConfigEntity(c.env, 'setup_complete');
    await setupComp.save({ id: 'setup_complete', value: 'true' });
    const venueNameConf = new SystemConfigEntity(c.env, 'venue_name');
    await venueNameConf.save({ id: 'venue_name', value: settings.venueName });
    await logAction(c, 'SETUP_COMPLETE', 'Production system initialization wizard finished');
    return ok(c, venue);
  });
  app.get('/api/admin/audit-logs', authMiddleware(), async (c) => {
    const logs = await AuditLogEntity.list(c.env);
    return ok(c, logs.items.sort((a,b) => b.timestamp - a.timestamp));
  });
  app.get('/api/admin/stats', authMiddleware(), async (c) => {
    const [inquiries, rsvps, subs, analytics] = await Promise.all([
      InquiryEntity.list(c.env),
      RsvpEntity.list(c.env),
      TextSubscriberEntity.list(c.env),
      AnalyticsEntity.list(c.env)
    ]);
    const timeline: { date: string; inquiries: number; rsvps: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const startOfDay = new Date(dateStr).getTime();
      const endOfDay = startOfDay + 86400000;
      const dayInquiries = inquiries.items.filter(item => item.createdAt >= startOfDay && item.createdAt < endOfDay).length;
      const dayRsvps = rsvps.items.filter(item => item.createdAt >= startOfDay && item.createdAt < endOfDay).length;
      timeline.push({ date: dateStr, inquiries: dayInquiries, rsvps: dayRsvps });
    }
    return ok(c, {
      totalInquiries: inquiries.items.length,
      totalRsvps: rsvps.items.length,
      totalSubscribers: subs.items.length,
      totalAnalytics: analytics.items.length,
      timeline
    });
  });
}