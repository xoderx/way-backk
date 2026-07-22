import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { Check, Shield, Globe, MapPin, Building2, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
export function AdminSetupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    venueName: '',
    address: '',
    timezone: 'America/Chicago',
    currency: 'USD',
    capacity: 200,
    neomKey: '',
    stripeKey: ''
  });
  const navigate = useNavigate();
  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await api('/api/admin/setup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          stripeEnabled: !!formData.stripeKey,
          neomEnabled: !!formData.neomKey
        })
      });
      toast.success('SYSTEM INITIALIZED');
      navigate('/admin');
    } catch (err) {
      toast.error('SETUP FAILED');
    }
  };
  const steps = [
    { id: 1, label: 'Identity', icon: Building2 },
    { id: 2, label: 'Operations', icon: Globe },
    { id: 3, label: 'Integrations', icon: Shield }
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-24 max-w-3xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="poster-headline text-5xl md:text-7xl mb-4">
            <span className="logo-gold">SETUP</span> <span className="text-foreground">WIZARD</span>
          </h1>
          <div className="flex justify-center items-center gap-4">
            {steps.map((s) => (
              <React.Fragment key={s.id}>
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center border-2 transition-colors",
                  step >= s.id ? "border-hot-pink bg-hot-pink text-white" : "border-foreground/20 text-muted-foreground"
                )}>
                  <s.icon size={18} />
                </div>
                {s.id < steps.length && <div className="w-8 h-1 bg-foreground/10" />}
              </React.Fragment>
            ))}
          </div>
        </header>
        <Card className="bg-background border-4 border-hot-pink shadow-extrude-purple rounded-none overflow-hidden">
          <CardHeader className="border-b-2 border-hot-pink/20 pb-8 pt-10">
            <CardTitle className="text-xs font-black tracking-[0.4em] uppercase text-center">
              STEP {step} OF 3: {steps[step-1].label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">VENUE NAME</label>
                  <Input 
                    value={formData.venueName} 
                    onChange={e => setFormData({...formData, venueName: e.target.value})}
                    placeholder="MOONRISE ROOFTOP" 
                    className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">STREET ADDRESS</label>
                  <Input 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="6177 DELMAR BLVD, ST. LOUIS, MO" 
                    className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black"
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">TIMEZONE</label>
                    <Input 
                      value={formData.timezone} 
                      onChange={e => setFormData({...formData, timezone: e.target.value})}
                      className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">VENUE CAPACITY</label>
                    <Input 
                      type="number"
                      value={formData.capacity} 
                      onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black"
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">NEOM.AI API KEY</label>
                  <Input 
                    value={formData.neomKey} 
                    onChange={e => setFormData({...formData, neomKey: e.target.value})}
                    placeholder="pk_neom_..." 
                    className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">STRIPE SECRET KEY (LIVE)</label>
                  <Input 
                    type="password"
                    value={formData.stripeKey} 
                    onChange={e => setFormData({...formData, stripeKey: e.target.value})}
                    placeholder="sk_live_..." 
                    className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between mt-12 pt-8 border-t-2 border-foreground/5">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 1}
                className="font-black uppercase tracking-widest"
              >
                <ChevronLeft className="mr-2" /> BACK
              </Button>
              {step < 3 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-hot-pink text-white px-10 h-14 font-black uppercase tracking-widest shadow-extrude-pink rounded-none"
                >
                  NEXT <ChevronRight className="ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-neon-cyan text-black px-10 h-14 font-black uppercase tracking-widest shadow-extrude-gold rounded-none"
                >
                  INITIALIZE SYSTEM <Check className="ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}