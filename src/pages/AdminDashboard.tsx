import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, patch } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  LogOut, RefreshCcw, Activity, ShieldAlert, Layers, Users, Search,
  CheckCircle, MessageSquare, Clock, Filter, Eye, EyeOff, Radio, ExternalLink, AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Inquiry, RSVP, AdminStats, AuditLog, TextSubscriber, SystemConfig } from '@shared/types';
import { cn } from '@/lib/utils';
export function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [subscribers, setSubscribers] = useState<TextSubscriber[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');
    try {
      setLoading(true);
      const headers = { 'Authorization': `Bearer ${token}` };
      const check = await api<{ setupComplete: boolean }>('/api/setup-check');
      if (!check.setupComplete) return navigate('/admin/setup');
      const [s, i, r, logs, subs, m] = await Promise.all([
        api<AdminStats>('/api/admin/stats', { headers }),
        api<Inquiry[]>('/api/admin/submissions', { headers }),
        api<RSVP[]>('/api/admin/rsvps', { headers }),
        api<AuditLog[]>('/api/admin/audit-logs', { headers }),
        api<TextSubscriber[]>('/api/admin/subscribers', { headers }),
        api<SystemConfig>('/api/admin/config/maintenance_mode', { headers })
      ]);
      setStats(s);
      setInquiries(i);
      setRsvps(r);
      setAuditLogs(logs);
      setSubscribers(subs);
      setMaintenanceMode(m.value === 'true');
    } catch (err) {
      toast.error('SESSION EXPIRED');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const toggleMaintenance = async () => {
    const token = localStorage.getItem('adminToken');
    const newValue = !maintenanceMode;
    try {
      await patch(`/api/admin/config/maintenance_mode`,
        { value: String(newValue) },
        { 'Authorization': `Bearer ${token}` }
      );
      setMaintenanceMode(newValue);
      toast.success(newValue ? 'MAINTENANCE ACTIVATED' : 'SITE IS LIVE');
    } catch (err) {
      toast.error('STATE CHANGE FAILED');
    }
  };
  const updateInquiryStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      await patch(`/api/admin/inquiries/${id}`, { status }, { 'Authorization': `Bearer ${token}` });
      toast.success('STATUS UPDATED');
      fetchData();
    } catch (err) {
      toast.error('UPDATE FAILED');
    }
  };
  const filteredInquiries = inquiries.filter(i =>
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const chartConfig = {
    inquiries: { label: "Inquiries", color: "#FF59D6" },
    rsvps: { label: "RSVPs", color: "#00B8D9" },
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12 space-y-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-4 border-hot-pink pb-8">
          <div>
            <h1 className="poster-headline text-5xl md:text-7xl">
              <span className="logo-gold">ADMIN</span> <span className="text-foreground">OS</span>
            </h1>
            <p className="text-xs font-black tracking-widest text-muted-foreground uppercase mt-2">PRODUCTION EVENT CONTROLS • ACTIVE</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline" className="border-2 border-foreground text-foreground font-black rounded-none h-12">
              <Link to="/"><ExternalLink className="mr-2 h-4 w-4" /> VIEW SITE</Link>
            </Button>
            <Button onClick={fetchData} variant="outline" className="border-2 border-neon-cyan text-neon-cyan font-black rounded-none h-12">
              <RefreshCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} /> REFRESH
            </Button>
            <Button onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin/login'); }} variant="outline" className="border-2 border-hot-pink text-hot-pink font-black rounded-none h-12">
              <LogOut className="mr-2 h-4 w-4" /> LOGOUT
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className={cn(
            "col-span-1 lg:col-span-1 bg-background border-2 rounded-none p-6 flex flex-col justify-between transition-colors",
            maintenanceMode ? "border-yellow-500/50" : "border-green-500/50 shadow-glow-soft"
          )}>
             <div className="flex items-center gap-3 mb-2">
               {maintenanceMode ? <EyeOff className="text-yellow-500 w-4 h-4" /> : <Eye className="text-green-500 w-4 h-4" />}
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SITE STATUS</span>
             </div>
             <p className={cn("text-xl font-black uppercase", maintenanceMode ? "text-yellow-500" : "text-green-500")}>
               {maintenanceMode ? "MAINTENANCE" : "LIVE"}
             </p>
          </Card>
          <Card className="bg-background border-2 border-foreground/10 rounded-none p-6">
             <div className="flex items-center gap-3 mb-2">
               <Activity className="text-neon-cyan w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">HEALTH</span>
             </div>
             <p className="text-xl font-black text-foreground">OPTIMAL</p>
          </Card>
          <Card className="bg-background border-2 border-foreground/10 rounded-none p-6">
             <div className="flex items-center gap-3 mb-2">
               <Users className="text-hot-pink w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">RSVPs</span>
             </div>
             <p className="text-xl font-black text-foreground">{rsvps.length}</p>
          </Card>
          <Card className="bg-background border-2 border-foreground/10 rounded-none p-6">
             <div className="flex items-center gap-3 mb-2">
               <MessageSquare className="text-vivid-lavender w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SMS</span>
             </div>
             <p className="text-xl font-black text-foreground">{subscribers.length}</p>
          </Card>
          <Card className="bg-background border-2 border-foreground/10 rounded-none p-6">
             <div className="flex items-center gap-3 mb-2">
               <ShieldAlert className="text-white w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ROLE</span>
             </div>
             <p className="text-xl font-black text-foreground uppercase">ADMIN</p>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-black/20 border-2 border-foreground/10 h-auto p-1 rounded-none mb-8 grid grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview" className="py-4 font-black uppercase tracking-widest text-xs">OVERVIEW</TabsTrigger>
            <TabsTrigger value="crm" className="py-4 font-black uppercase tracking-widest text-xs">CRM</TabsTrigger>
            <TabsTrigger value="subscribers" className="py-4 font-black uppercase tracking-widest text-xs">SMS LIST</TabsTrigger>
            <TabsTrigger value="audit" className="py-4 font-black uppercase tracking-widest text-xs">LOGS</TabsTrigger>
            <TabsTrigger value="system" className="py-4 font-black uppercase tracking-widest text-xs">SYSTEM</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                 <Card className="bg-background border-2 border-foreground/10 rounded-none p-8">
                   <h3 className="text-xs font-black tracking-widest uppercase mb-8">EVENT PERFORMANCE</h3>
                   <ChartContainer config={chartConfig} className="h-[350px] w-full">
                     <LineChart data={stats?.timeline ?? []}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                       <XAxis 
                         dataKey="date" 
                         stroke="rgba(255,255,255,0.5)" 
                         fontSize={10} 
                         tickFormatter={(val) => val.split('-').slice(1).join('/')}
                       />
                       <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
                       <ChartTooltip content={<ChartTooltipContent />} />
                       <Line type="monotone" dataKey="inquiries" stroke="#FF59D6" strokeWidth={3} dot={{ r: 4, fill: '#FF59D6' }} activeDot={{ r: 6 }} />
                       <Line type="monotone" dataKey="rsvps" stroke="#00B8D9" strokeWidth={3} dot={{ r: 4, fill: '#00B8D9' }} activeDot={{ r: 6 }} />
                     </LineChart>
                   </ChartContainer>
                 </Card>
               </div>
               <div className="space-y-8">
                 <Card className={cn(
                   "p-8 border-4 rounded-none h-full flex flex-col justify-between",
                   maintenanceMode ? "border-yellow-500 bg-yellow-500/5 shadow-inner" : "border-neon-cyan bg-neon-cyan/5 shadow-glow-soft"
                 )}>
                   <div>
                     <div className="flex items-center gap-3 mb-4">
                       <AlertTriangle className={cn(maintenanceMode ? "text-yellow-500" : "text-neon-cyan")} />
                       <h3 className="poster-headline text-3xl">SITE CONTROL</h3>
                     </div>
                     <p className="text-[11px] font-black uppercase tracking-tight text-foreground mb-4">
                       {maintenanceMode 
                        ? "CRITICAL: MAINTENANCE MODE IS ACTIVE. PUBLIC USERS ARE SEEING THE 'COMING SOON' GATEWAY." 
                        : "SYSTEM STATUS: LIVE. THE FULL ROOFTOP EXPERIENCE IS CURRENTLY ACCESSIBLE TO PUBLIC USERS."}
                     </p>
                     <p className="text-[10px] text-muted-foreground uppercase leading-tight italic">
                        Toggle this switch to push configuration changes to the global production environment.
                     </p>
                   </div>
                   <Button
                    onClick={toggleMaintenance}
                    className={cn(
                      "w-full h-20 font-black uppercase tracking-[0.2em] text-lg rounded-none border-2 border-white/20 shadow-extrude-purple transition-all active:scale-95 mt-8",
                      maintenanceMode ? "bg-neon-cyan text-black hover:bg-white" : "bg-yellow-500 text-black hover:bg-white"
                    )}
                   >
                     {maintenanceMode ? (
                       <><Radio className="mr-3 animate-pulse" /> DEPLOY LIVE</>
                     ) : (
                       <><EyeOff className="mr-3" /> ENTER MAINTENANCE</>
                     )}
                   </Button>
                 </Card>
               </div>
             </div>
          </TabsContent>
          <TabsContent value="crm">
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="SEARCH LEADS BY NAME OR EMAIL..."
                    className="pl-10 h-12 bg-black/40 border-2 border-foreground/10 rounded-none uppercase font-black text-xs tracking-widest"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-2 border-foreground/10 h-12 rounded-none px-6 font-black"><Filter className="mr-2 h-4 w-4" /> FILTER</Button>
              </div>
              <Card className="bg-background border-4 border-foreground/20 rounded-none overflow-hidden">
                <Table>
                  <TableHeader className="bg-black/40">
                    <TableRow className="border-b-2 border-foreground/10">
                      <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">LEAD IDENTITY</TableHead>
                      <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">TYPE</TableHead>
                      <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">STATUS</TableHead>
                      <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-20 opacity-30 uppercase font-black tracking-[0.5em] text-xs">NO LEADS RECORDED IN DATABASE</TableCell></TableRow>
                    ) : (
                      filteredInquiries.map(inq => (
                        <TableRow key={inq.id} className="border-b border-foreground/5 hover:bg-white/[0.02]">
                          <TableCell>
                            <div className="font-black text-xs uppercase tracking-tight">{inq.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{inq.email}</div>
                          </TableCell>
                          <TableCell className="text-[10px] font-black uppercase text-neon-cyan tracking-widest">{inq.type}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "px-2 py-1 text-[8px] font-black uppercase rounded-none border-2",
                              inq.status === 'new' ? "border-hot-pink text-hot-pink" : "border-neon-cyan text-neon-cyan"
                            )}>
                              {inq.status ?? 'NEW'}
                            </span>
                          </TableCell>
                          <TableCell className="flex gap-2">
                             <Button
                              onClick={() => updateInquiryStatus(inq.id, 'contacted')}
                              size="sm" className="h-8 bg-neon-cyan text-black font-black text-[8px] rounded-none hover:bg-white">CONTACTED</Button>
                             <Button
                              onClick={() => updateInquiryStatus(inq.id, 'closed')}
                              size="sm" className="h-8 bg-white text-black font-black text-[8px] rounded-none hover:bg-hot-pink hover:text-white">ARCHIVE</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="subscribers">
            <Card className="bg-background border-4 border-foreground/20 rounded-none overflow-hidden">
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="border-b-2 border-foreground/10">
                    <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">MOBILE FREQUENCY</TableHead>
                    <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">ENROLLED</TableHead>
                    <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">SYNC STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 opacity-30 uppercase font-black tracking-[0.5em] text-xs">LIST EMPTY</TableCell></TableRow>
                  ) : (
                    subscribers.map(sub => (
                      <TableRow key={sub.id} className="border-b border-foreground/5">
                        <TableCell className="font-black text-xs tracking-widest">{sub.phone}</TableCell>
                        <TableCell className="text-[10px] font-mono opacity-50">{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {sub.syncedToNeoM ? <CheckCircle className="text-green-500 w-4 h-4" /> : <Clock className="text-yellow-500 w-4 h-4" />}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="audit">
            <Card className="bg-background border-4 border-foreground/20 rounded-none overflow-hidden">
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="border-b-2 border-foreground/10">
                    <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">TIMESTAMP</TableHead>
                    <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">TERMINAL</TableHead>
                    <TableHead className="text-white font-black text-[10px] tracking-widest h-14 uppercase">LOG ENTRY</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 opacity-30 uppercase font-black tracking-[0.5em] text-xs">LOGS CLEAR</TableCell></TableRow>
                  ) : (
                    auditLogs.slice(0, 50).map(log => (
                      <TableRow key={log.id} className="border-b border-foreground/5">
                        <TableCell className="text-[10px] opacity-50 font-mono">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-black text-xs uppercase text-neon-cyan tracking-tighter">{log.adminUsername}</TableCell>
                        <TableCell className="text-[10px] uppercase font-bold text-foreground/80">{log.action}: {log.details}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card className="bg-background border-4 border-foreground/10 p-10 space-y-6 rounded-none relative">
                <div className="absolute top-4 right-4 text-hot-pink/20"><ShieldAlert size={40} /></div>
                <h3 className="poster-headline text-3xl">SYSTEM CONFIG</h3>
                <p className="text-[11px] text-muted-foreground uppercase font-black tracking-tight leading-relaxed">
                  MODIFICATION OF GLOBAL SYSTEM PARAMETERS, API ENDPOINTS, AND VENUE SETTINGS.
                </p>
                <Button onClick={() => navigate('/admin/setup')} className="w-full h-16 bg-hot-pink text-white font-black uppercase tracking-widest rounded-none shadow-extrude-pink border-2 border-white/10">LAUNCH WIZARD</Button>
              </Card>
              <Card className="bg-background border-4 border-foreground/10 p-10 space-y-6 rounded-none relative">
                <div className="absolute top-4 right-4 text-neon-cyan/20"><Layers size={40} /></div>
                <h3 className="poster-headline text-3xl">DB STORAGE</h3>
                <p className="text-[11px] text-muted-foreground uppercase font-black tracking-tight leading-relaxed">
                  MAINTENANCE OF DURABLE OBJECT STORAGE. COMPRESSION AND ARCHIVING OF HISTORICAL ANALYTICS.
                </p>
                <Button variant="outline" className="w-full h-16 border-4 border-neon-cyan text-neon-cyan font-black uppercase tracking-widest rounded-none hover:bg-neon-cyan hover:text-black">PURGE CACHE</Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}