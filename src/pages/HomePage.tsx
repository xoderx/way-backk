import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { HeroSection } from '@/components/sections/HeroSection'
import { EventDetails } from '@/components/sections/EventDetails'
import { ActionHub } from '@/components/sections/ActionHub'
import { LivestreamSection } from '@/components/sections/LivestreamSection'
import { SocialMediaCenter } from '@/components/sections/SocialMediaCenter'
import { TextSignup } from '@/components/sections/TextSignup'
import { LoyaltyPromo } from '@/components/sections/LoyaltyPromo'
import { GallerySection } from '@/components/sections/GallerySection'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ChatbotWidget } from '@/components/ChatbotWidget'
import { initPageView } from '@/lib/analytics'
import { api } from '@/lib/api-client'
import { Loader2, Shield } from 'lucide-react'
export function HomePage() {
  const [status, setStatus] = useState<{ setupComplete: boolean; maintenanceMode: boolean } | null>(null);
  useEffect(() => {
    initPageView('homepage_v18_production');
    api<{ setupComplete: boolean; maintenanceMode: boolean }>('/api/setup-check')
      .then(res => setStatus(res))
      .catch(() => setStatus({ setupComplete: false, maintenanceMode: true }));
  }, []);
  if (status === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-hot-pink animate-spin mb-4" />
        <span className="font-black uppercase tracking-[0.4em] text-xs">UPLINKING...</span>
      </div>
    );
  }
  // Public users only see the site if maintenance mode is OFF
  if (status.maintenanceMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed inset-0 noise-bg pointer-events-none opacity-10" />
        <div className="fixed inset-0 scanlines pointer-events-none opacity-20" />
        <div className="text-center space-y-12 relative z-10">
          <div className="poster-headline text-6xl md:text-[10rem] flex flex-col items-center">
            <span className="logo-gold">COMING</span>
            <span className="text-foreground chromatic-aberration">SOON</span>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xl md:text-3xl font-black uppercase tracking-tight italic">The skyline is preparing for its premier Wednesday ritual.</p>
            <div className="h-1 w-24 bg-hot-pink mx-auto shadow-glow-soft" />
            <p className="text-muted-foreground text-xs font-black tracking-widest uppercase">WBW PRODUCTION TERMINAL • OFFLINE</p>
          </div>
          {/* Subtle Admin Entrance */}
          <div className="pt-12">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-2 text-[10px] font-mono font-black text-foreground/20 hover:text-hot-pink transition-colors uppercase tracking-[0.3em] group"
            >
              <Shield size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              TERMINAL ACCESS
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative min-h-screen bg-background transition-colors duration-500 overflow-hidden">
      <div className="fixed inset-0 noise-bg pointer-events-none z-[100]" />
      <div className="fixed inset-0 scanlines pointer-events-none z-[101]" />
      <div className="fixed inset-0 vignette pointer-events-none z-[102]" />
      <SiteHeader />
      <main className="flex flex-col w-full relative z-10">
        <HeroSection />
        <EventDetails />
        <ActionHub />
        <LivestreamSection />
        <LoyaltyPromo />
        <TextSignup />
        <SocialMediaCenter />
        <GallerySection />
      </main>
      <SiteFooter />
      <ChatbotWidget />
      <Toaster richColors position="bottom-center" />
    </div>
  )
}