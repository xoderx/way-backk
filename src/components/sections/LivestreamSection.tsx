import React, { useState, useEffect } from 'react'
import { Tv, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function LivestreamSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const nextWed = new Date()
      // Find the next Wednesday
      nextWed.setDate(now.getDate() + (3 + 7 - now.getDay()) % 7)
      // Set target to 5:00 PM (17:00)
      nextWed.setHours(17, 0, 0, 0)
      // If we are past 5 PM on Wednesday, target the next Wednesday
      if (now > nextWed) {
        nextWed.setDate(nextWed.getDate() + 7)
      }
      const diff = nextWed.getTime() - now.getTime()
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <section id="livestream" className="relative py-32 bg-background border-y border-foreground/5 scroll-mt-20 overflow-hidden">
      <div className="absolute top-20 -left-10 poster-stamp w-40 h-40 border-neon-cyan text-neon-cyan -rotate-12 opacity-10">
        <span className="text-xs">LIVE BROADCAST</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 w-full aspect-video glass-panel border-4 border-neon-cyan/40 relative group overflow-hidden shadow-extrude-purple bg-neutral-950">
            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-neutral-900 transition-colors">
              <Tv className="w-20 h-20 text-neon-cyan opacity-20 animate-pulse" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/90 px-4 py-2 border-2 border-white/20">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
              <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">OFFLINE • ARCHIVE MODE</span>
            </div>
          </div>
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <h2 className="poster-headline text-5xl md:text-7xl leading-tight py-2">
              LIVE FROM THE <span className="text-foreground chromatic-aberration">ROOFTOP</span>
            </h2>
            <p className="text-muted-foreground text-lg font-bold uppercase tracking-tight">
              Can't make it to the Moonrise? Join our weekly DJ broadcast. High-fidelity audio, multi-cam visuals, and the full vibe from home.
            </p>
            <div className="flex justify-center lg:justify-start gap-6">
              {[
                { val: timeLeft.hours, label: 'HRS' },
                { val: timeLeft.mins, label: 'MIN' },
                { val: timeLeft.secs, label: 'SEC' }
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center bg-background border-4 border-hot-pink p-4 shadow-extrude-pink w-24">
                  <span className="text-4xl font-black text-foreground italic leading-none mb-1">{unit.val.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-hot-pink font-black tracking-widest uppercase">{unit.label}</span>
                </div>
              ))}
            </div>
            <Button className="bg-neon-cyan hover:bg-foreground hover:text-background text-white font-black px-12 h-16 uppercase tracking-[0.4em] text-lg shadow-extrude-purple transition-all active:scale-95 mt-4 rounded-none border-2 border-white/10">
              WATCH ON TWITCH <ExternalLink className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}