import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Star, ShieldCheck, Gem } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
export function LoyaltyPromo() {
  const perks = [
    { icon: <Zap className="w-8 h-8 text-hot-pink" />, text: "20% OFF ALL BEVERAGES" },
    { icon: <Star className="w-8 h-8 text-retro-gold" />, text: "PRIORITY EXPRESS ENTRY" },
    { icon: <ShieldCheck className="w-8 h-8 text-neon-cyan" />, text: "PREFERRED PARTNER ACCESS" },
    { icon: <Gem className="w-8 h-8 text-vivid-lavender" />, text: "EXCLUSIVE SECRET MENU" },
  ]
  const handleInitiate = () => {
    trackEvent('click', 'loyalty_membership_initiate');
  };
  return (
    <section id="loyalty" className="py-48 bg-background border-y-[12px] border-foreground/[0.05] relative overflow-hidden scroll-mt-24 px-6">
      <div className="absolute top-24 right-24 poster-stamp w-48 h-48 border-hot-pink text-hot-pink -rotate-15 opacity-25 hidden lg:flex bg-background shadow-xl">
        <span className="text-lg font-black italic">LIMITED<br/>EDITION</span>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-32">
          <div className="flex-1 order-2 lg:order-1 w-full flex justify-center perspective-[1200px]">
            <motion.div
              whileHover={{ rotateY: 15, rotateX: -5, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="relative w-full max-w-xl aspect-[1.58/1] bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 border-4 border-foreground/20 rounded-none p-12 shadow-extrude-purple overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-hot-pink/30 blur-[120px] group-hover:bg-hot-pink/50 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-cyan/20 blur-[120px]" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start text-white">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black italic tracking-tighter uppercase leading-none">WAY <span className="text-hot-pink">BACK</span></span>
                    <span className="text-xs font-black tracking-[0.6em] text-white/50 uppercase mt-2">LOYALTY ELITE CARD</span>
                  </div>
                  <Gem className="text-white/20 w-14 h-14 group-hover:text-retro-gold group-hover:scale-110 transition-all duration-500" />
                </div>
                <div className="space-y-8">
                  <div className="w-20 h-14 bg-gradient-to-br from-retro-gold via-yellow-100 to-retro-gold rounded-sm shadow-glow-intense border-2 border-white/10"></div>
                  <div>
                    <p className="font-mono text-3xl tracking-[0.3em] text-white/90 shadow-lg">**** **** **** 2026</p>
                    <div className="flex justify-between items-end mt-6">
                      <p className="text-[11px] font-black text-white/40 tracking-[0.5em] uppercase">PREFERRED MEMBER PROTOCOL</p>
                      <span className="text-[11px] font-black text-hot-pink/80 uppercase">SINCE 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="flex-1 space-y-16 text-center lg:text-left order-1 lg:order-2">
            <h2 className="poster-headline text-6xl md:text-[8rem] leading-[0.85] py-6">
              KEY TO THE <br />
              <span className="text-foreground chromatic-aberration drop-shadow-neon-cyan">STL SKYLINE</span>
            </h2>
            <p className="text-foreground text-2xl leading-tight font-black uppercase tracking-tight opacity-100 border-l-[12px] border-neon-cyan pl-10">
              Elevate your status. The Way Back Loyalty Card grants elite privileges at Moonrise Rooftop and exclusive venues city-wide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left max-w-2xl mx-auto lg:mx-0">
              {perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-6 text-foreground font-black tracking-[0.3em] text-sm uppercase group">
                  <div className="p-4 bg-background/40 border-2 border-foreground/20 group-hover:border-hot-pink group-hover:bg-hot-pink/5 group-hover:scale-110 transition-all shadow-sm">
                    {perk.icon}
                  </div>
                  <span className="text-foreground leading-none">{perk.text}</span>
                </div>
              ))}
            </div>
            <div className="pt-12">
              <a href="#loyalty-apply" onClick={handleInitiate}>
                <Button className="bg-hot-pink hover:bg-foreground hover:text-background text-white font-black px-20 h-24 uppercase tracking-[0.6em] text-2xl shadow-extrude-pink active:scale-95 transition-all rounded-none border-4 border-foreground/10 w-full md:w-auto">
                  INITIATE MEMBERSHIP
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}