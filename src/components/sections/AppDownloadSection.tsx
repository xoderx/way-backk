import React from 'react'
import { Smartphone, Apple, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
export function AppDownloadSection() {
  return (
    <section id="downloads" className="py-32 bg-background border-t border-border scroll-mt-20 overflow-hidden relative">
      <div className="absolute bottom-10 right-10 poster-stamp w-32 h-32 border-hot-pink text-hot-pink rotate-12 opacity-10 hidden md:flex">
        <span className="text-[10px]">VERSION<br/>2.0.25</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="poster-headline text-5xl md:text-[6rem] leading-[0.85] py-2">
              TAKE THE <br/> <span className="text-foreground chromatic-aberration">EXPERIENCE</span> <br /> MOBILE
            </h2>
            <p className="text-vivid-lavender text-xl font-bold uppercase tracking-tight leading-relaxed opacity-80">
              Order drinks ahead, check rooftop capacity in real-time, and earn points on every purchase. The Way Back app is your ultimate companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button variant="outline" className="h-20 border-4 border-foreground/10 bg-transparent hover:bg-foreground hover:text-background font-black uppercase tracking-[0.3em] flex-1 text-lg shadow-xl transition-all rounded-none">
                <Apple className="mr-3 w-8 h-8" /> APP STORE
              </Button>
              <Button variant="outline" className="h-20 border-4 border-foreground/10 bg-transparent hover:bg-foreground hover:text-background font-black uppercase tracking-[0.3em] flex-1 text-lg shadow-xl transition-all rounded-none">
                <Play className="mr-3 w-8 h-8 fill-current" /> GOOGLE PLAY
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center gap-8 md:gap-16">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-hot-pink to-neon-cyan rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-background/50 backdrop-blur-md p-8 border-4 border-foreground/20 shadow-extrude-purple group-hover:scale-105 transition-transform">
                <div className="w-40 h-40 md:w-56 md:h-56 bg-white p-2 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://wbw.app')] bg-contain bg-center bg-no-repeat grayscale hover:grayscale-0 transition-all duration-500"></div>
                <p className="mt-6 text-[10px] font-black text-foreground text-center tracking-[0.5em] uppercase italic bloom">SCAN TO SYNC</p>
              </div>
            </div>
            <div className="hidden lg:block opacity-10">
              <Smartphone className="w-64 h-64 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}