import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { api } from '@/lib/api-client'
export function HeroSection() {
  const [phone, setPhone] = useState('314-208-2050')
  useEffect(() => {
    api<{ value: string }>('/api/config/contact_phone')
      .then(res => setPhone(res.value))
      .catch(() => {})
  }, [])
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background px-4 py-16 md:py-20">
      {/* Structural Poster Frame */}
      <div className="absolute inset-4 md:inset-8 border-12 md:border-16 border-foreground/[0.08] pointer-events-none z-30" />
      {/* Corner Tapes */}
      <div className="absolute top-4 left-4 w-28 h-10 tape-effect z-40 rotate-[-42deg]" />
      <div className="absolute top-4 right-4 w-28 h-10 tape-effect z-40 rotate-[42deg]" />
      <div className="absolute bottom-4 left-4 w-28 h-10 tape-effect z-40 rotate-[42deg]" />
      <div className="absolute bottom-4 right-4 w-28 h-10 tape-effect z-40 rotate-[-42deg]" />
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-hot-pink/40 blur-[180px] animate-bloom" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-neon-cyan/40 blur-[200px] animate-bloom delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-retro-gold/30 blur-[150px] animate-pulse-glow" />
      {/* Retro Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[450px] overflow-hidden opacity-[0.2] [perspective:1000px]">
        <div className="absolute top-0 left-[-50%] w-[200%] h-full bg-[linear-gradient(to_right,rgba(176,38,255,0.6)_2px,transparent_2px),linear-gradient(to_bottom,rgba(176,38,255,0.6)_2px,transparent_2px)] bg-[size:80px_80px] [transform:rotateX(60deg)] animate-jitter pointer-events-none" />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto text-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 md:space-y-10"
        >
          <div className="inline-block px-6 md:px-8 py-2 md:py-3 border-4 border-hot-pink text-hot-pink font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] uppercase mb-4 md:mb-4 bg-background/90 backdrop-blur-sm shadow-glow-soft">
            SEASON 2 • MOONRISE ROOFTOP • 5PM - 10PM
          </div>
          <h1 className="text-[13vw] sm:text-[12vw] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] poster-headline leading-[0.75] py-2 scale-105 md:scale-100 transition-transform duration-700 hover:scale-[1.02] flex flex-col items-center max-h-[35vh] md:max-h-none will-change-transform">
            <span className="logo-gold drop-shadow-lg">WAY BACK</span>
            <span className="text-foreground chromatic-aberration !-mt-2 md:!-mt-2">WEDNESDAYS</span>
          </h1>
          <p className="max-w-4xl mx-auto text-foreground text-lg md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-tight px-4">
            The premier rooftop nightlife event returns <br className="hidden md:block"/> to the STL skyline.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 md:gap-10 pt-8 md:pt-16">
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 w-full justify-center">
              <motion.a
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)', rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                href="#action-hub"
                className="w-full sm:w-auto px-10 md:px-16 py-6 md:py-8 bg-gradient-to-br from-hot-pink via-vivid-lavender to-neon-purple text-white font-black tracking-[0.4em] md:tracking-[0.5em] uppercase shadow-extrude-purple text-lg md:text-xl transition-all border-4 border-foreground/20"
              >
                BOOK A TABLE
              </motion.a>
              <a
                href="#details"
                className="group flex items-center gap-4 text-neon-cyan font-black tracking-[0.4em] uppercase hover:text-foreground transition-all text-lg md:text-xl"
              >
                EXPLORE SCENE <ArrowRight className="group-hover:translate-x-3 transition-transform w-5 h-5 md:w-6 md:h-6" />
              </a>
            </div>
            <a 
              href={`tel:${phone.replace(/-/g, '')}`} 
              className="flex items-center gap-4 text-retro-gold font-black tracking-[0.4em] uppercase hover:scale-110 transition-all text-sm md:text-lg animate-pulse"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" /> CALL ROOFTOP: {phone}
            </a>
          </div>
        </motion.div>
      </div>
      {/* Side Titles */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden 2xl:block pointer-events-none">
        <div className="font-black text-2xl text-foreground/10 -rotate-90 origin-center whitespace-nowrap uppercase tracking-[0.5em]">AUTHENTIC VINTAGE VIBES</div>
      </div>
      <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden 2xl:block pointer-events-none">
        <div className="font-black text-2xl text-foreground/10 rotate-90 origin-center whitespace-nowrap uppercase tracking-[0.5em]">ST. LOUIS SKYLINE PREMIERE</div>
      </div>
    </section>
  )
}