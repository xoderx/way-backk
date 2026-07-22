import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Music, Ticket, CheckCircle, Phone } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import { trackEvent } from '@/lib/analytics'
import { isWednesday, isBefore, startOfToday } from 'date-fns'
import { cn } from '@/lib/utils'
export function EventDetails() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [ticketUrl, setTicketUrl] = useState('https://eventbrite.com')
  const [contactPhone, setContactPhone] = useState('314-208-2050')
  useEffect(() => {
    Promise.all([
      api<{ value: string }>('/api/config/ticket_url').catch(() => ({ value: 'https://eventbrite.com' })),
      api<{ value: string }>('/api/config/contact_phone').catch(() => ({ value: '314-208-2050' }))
    ]).then(([ticket, phone]) => {
      setTicketUrl(ticket.value);
      setContactPhone(phone.value);
    });
  }, []);
  const details = [
    { icon: <CalendarIcon className="text-neon-cyan w-8 h-8" />, label: 'WHEN', value: 'Wednesdays' },
    { icon: <Clock className="text-neon-cyan w-8 h-8" />, label: 'TIME', value: '5:00 PM - 10:00 PM' },
    { icon: <MapPin className="text-neon-cyan w-8 h-8" />, label: 'WHERE', value: 'Moonrise Roof' },
    { icon: <Music className="text-neon-cyan w-8 h-8" />, label: 'SOUNDS', value: 'Way Back' },
    { icon: <Phone className="text-neon-cyan w-8 h-8" />, label: 'CONTACT', value: contactPhone },
  ]
  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return toast.error("SELECT A WEDNESDAY")
    setIsSubmitting(true)
    try {
      await api('/api/rsvps', {
        method: 'POST',
        body: JSON.stringify({ ...formData, eventDate: selectedDate.toISOString() })
      })
      trackEvent('form_submit', 'rsvp_calendar', { date: selectedDate.toISOString() })
      toast.success("RSVP ENCRYPTED")
      setIsSuccess(true)
    } catch (err) {
      toast.error("RSVP ERROR")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section id="details" className="relative py-32 bg-background overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-16">
            <h2 className="poster-headline text-6xl md:text-8xl flex flex-col items-start leading-none">
              <span className="logo-gold">REDEFINING</span>
              <span className="text-foreground chromatic-aberration">STL NIGHTS</span>
            </h2>
            <p className="text-foreground text-2xl font-black uppercase tracking-tight border-l-8 border-hot-pink pl-8">
              A neon sanctuary where the past and future collide under the STL skyline.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {details.map((item, idx) => (
                <div key={idx} className="space-y-4 group">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-black/40 border-2 border-neon-cyan shadow-glow-soft rounded-none group-hover:rotate-3 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black tracking-[0.4em] text-hot-pink uppercase">{item.label}</span>
                  </div>
                  {item.label === 'CONTACT' ? (
                    <a
                      href={`tel:${item.value.replace(/-/g, '')}`}
                      className="text-foreground font-black text-2xl tracking-tighter hover:text-neon-cyan transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-foreground font-black text-2xl tracking-tighter">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="p-10 glass-panel border-4 border-hot-pink shadow-extrude-purple bg-background/50">
              <div className="flex items-center gap-5 mb-8">
                <Ticket className="text-hot-pink w-10 h-10 bloom" />
                <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">OFFICIAL ACCESS</h3>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full h-20 border-4 border-hot-pink text-hot-pink font-black uppercase tracking-[0.3em] hover:bg-hot-pink hover:text-white transition-all text-xl rounded-none bg-transparent cursor-pointer"
              >
                <a href={ticketUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click', 'eventbrite_external')}>
                  SECURE TICKETS
                </a>
              </Button>
            </div>
          </div>
          <div id="rsvp" className="glass-panel p-10 md:p-14 border-8 border-neon-cyan/20 rounded-none shadow-extrude-gold relative bg-background/95 backdrop-blur-xl">
            <div className="absolute -top-6 -right-6 px-6 py-3 bg-hot-pink text-white font-black uppercase text-sm tracking-widest rotate-6 border-2 border-white/20 z-10 shadow-lg">
              21+ ONLY
            </div>
            <h3 className="poster-headline text-4xl mb-12 text-center flex justify-center gap-3">
              <span className="logo-gold">GUESTLIST</span>
              <span className="text-foreground">RSVP</span>
            </h3>
            <div className="space-y-10">
              {isSuccess ? (
                <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in">
                  <CheckCircle className="w-24 h-24 text-neon-cyan mx-auto bloom" />
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black text-foreground uppercase tracking-tighter">ACCESS GRANTED</h4>
                  </div>
                  <p className="text-foreground font-black uppercase text-lg">YOU ARE ON THE GUESTLIST FOR {selectedDate?.toLocaleDateString()}. SHOW YOUR ID AT THE DOOR.</p>
                  <Button onClick={() => { setIsSuccess(false); setFormData({name: '', email: '', phone: ''}); setSelectedDate(undefined); }} className="bg-neon-cyan text-black font-black uppercase tracking-widest w-full h-16 rounded-none">SUBMIT ANOTHER</Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center bg-secondary/80 border-4 border-foreground/20 p-6 rounded-none shadow-inner overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => !isWednesday(date) || isBefore(date, startOfToday())}
                      className={cn(
                        "bg-transparent text-foreground scale-105 md:scale-110 pointer-events-auto",
                        "[&_.rdp-day_selected]:bg-hot-pink [&_.rdp-day_selected]:text-white",
                        "[&_.rdp-day_today]:text-neon-cyan [&_.rdp-day_today]:font-black",
                        "[&_.rdp-button:hover]:bg-neon-cyan [&_.rdp-button:hover]:text-black"
                      )}
                    />
                  </div>
                  <form onSubmit={handleRsvp} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/90">IDENTITY VERIFICATION</label>
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="FULL NAME"
                        required
                        className="h-16 bg-black/40 border-2 border-foreground/20 text-foreground font-black rounded-none placeholder:text-foreground/40 focus:border-neon-cyan focus:ring-0 transition-colors text-lg"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/90">EMAIL UPLINK</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="EMAIL"
                          required
                          className="h-16 bg-black/40 border-2 border-foreground/20 text-foreground font-black rounded-none placeholder:text-foreground/40 focus:border-neon-cyan focus:ring-0 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/90">MOBILE ID</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          placeholder="PHONE"
                          required
                          className="h-16 bg-black/40 border-2 border-foreground/20 text-foreground font-black rounded-none placeholder:text-foreground/40 focus:border-neon-cyan focus:ring-0 transition-colors"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={!selectedDate || isSubmitting}
                      className="w-full h-20 bg-neon-cyan hover:bg-white hover:text-neon-cyan text-black font-black uppercase tracking-[0.5em] text-xl shadow-extrude-purple rounded-none transition-all border-2 border-white/10"
                    >
                      {isSubmitting ? 'UPLOADING...' : 'CONFIRM ACCESS'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}