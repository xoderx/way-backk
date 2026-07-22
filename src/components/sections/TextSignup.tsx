import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import { MessageSquareText, Radio, CheckCircle } from 'lucide-react'
const phoneSchema = z.object({
  phone: z.string().min(10, 'Valid phone number required'),
})
type FormData = z.infer<typeof phoneSchema>
export function TextSignup() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(phoneSchema),
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [eventTime, setEventTime] = useState('5:00 PM - 10:00 PM')
  const [contactPhone, setContactPhone] = useState('314-208-2050')
  useEffect(() => {
    Promise.all([
      api<{ value: string }>('/api/config/event_time').catch(() => ({ value: '5:00 PM - 10:00 PM' })),
      api<{ value: string }>('/api/config/contact_phone').catch(() => ({ value: '314-208-2050' }))
    ]).then(([time, phone]) => {
      setEventTime(time.value);
      setContactPhone(phone.value);
    });
  }, []);
  const onSubmit = async (data: FormData) => {
    try {
      await api('/api/text-signup', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success('SIGNUP SUCCESSFUL')
      setIsSuccess(true)
    } catch (e) {
      toast.error('TRANSMISSION FAILED')
    }
  }
  return (
    <section id="text-signup" className="py-32 relative overflow-hidden scroll-mt-20 bg-background border-y-2 border-foreground/5">
      <div className="absolute inset-0 bg-gradient-to-r from-sunset-orange/5 to-transparent pointer-events-none" />
      <div className="absolute top-10 left-10 opacity-5 pointer-events-none"><Radio className="w-64 h-64 text-sunset-orange" /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel border-4 border-sunset-orange p-12 md:p-20 shadow-extrude-orange text-center md:text-left flex flex-col lg:flex-row items-center gap-16 rounded-none">
          <div className="flex-1 space-y-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="p-5 bg-sunset-orange/10 border-2 border-sunset-orange/40 rounded-none bloom">
                <MessageSquareText className="text-sunset-orange w-12 h-12" />
              </div>
              <div className="space-y-4">
                <h2 className="poster-headline text-5xl md:text-7xl !shadow-none text-foreground leading-none uppercase">DIRECT <span className="text-sunset-orange">ACCESS</span></h2>
                <div className="h-1 w-24 bg-sunset-orange mx-auto md:mx-0 shadow-glow-soft" />
              </div>
            </div>
            <p className="text-muted-foreground font-black uppercase text-xl md:text-2xl leading-tight tracking-tight max-w-2xl">
              Get the weekly secret menu and priority table alerts. Every Wednesday {eventTime}. Need help? Call <a href={`tel:${contactPhone.replace(/-/g, '')}`} className="text-sunset-orange underline">{contactPhone}</a>.
            </p>
            <div className="inline-flex items-center gap-4 bg-sunset-orange/10 px-6 py-3 border-2 border-sunset-orange/20">
              <span className="w-2 h-2 rounded-full bg-sunset-orange animate-pulse" />
              <span className="text-xs font-mono font-black text-sunset-orange tracking-[0.3em] uppercase">TEXT "WBW" TO 314-208-5050</span>
            </div>
          </div>
          {isSuccess ? (
            <div className="w-full lg:w-[400px] p-10 border-4 border-sunset-orange bg-sunset-orange/5 text-center space-y-6 animate-in zoom-in">
              <CheckCircle className="w-20 h-20 text-sunset-orange mx-auto bloom" />
              <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter">ENROLLED</h3>
              <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">CHECK YOUR MOBILE DEVICE FOR CONFIRMATION.</p>
              <Button onClick={() => setIsSuccess(false)} className="w-full h-16 bg-sunset-orange text-white font-black uppercase tracking-widest rounded-none">OK</Button>
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-[400px] space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sunset-orange">SUBSCRIBER TERMINAL</label>
              <Input
                {...register('phone')}
                placeholder="YOUR PHONE NUMBER"
                className="bg-background border-4 border-foreground/10 h-20 text-center tracking-[0.4em] font-black text-2xl focus:border-sunset-orange focus:ring-8 focus:ring-sunset-orange/10 transition-all rounded-none"
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-[10px] text-sunset-orange font-bold uppercase text-center">{errors.phone.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-20 bg-sunset-orange hover:bg-white hover:text-sunset-orange text-white font-black uppercase tracking-[0.5em] text-xl transition-all shadow-glow-soft active:scale-95 rounded-none border-2 border-white/20"
            >
              {isSubmitting ? 'UPLOADING...' : 'JOIN INNER CIRCLE'}
            </Button>
          </form>
          )}
        </div>
      </div>
    </section>
  )
}