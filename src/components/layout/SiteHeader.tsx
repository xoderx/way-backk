import React, { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { trackEvent } from '@/lib/analytics'
import { api } from '@/lib/api-client'
export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [phone, setPhone] = useState('314-208-2050')
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    api<{ value: string }>('/api/config/contact_phone')
      .then(res => setPhone(res.value))
      .catch(() => {})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const navLinks = [
    { name: 'HOME', href: '#home' },
    { name: 'DETAILS', href: '#details' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'RESERVE', href: '#action-hub' },
    { name: 'LIVE', href: '#livestream' },
    { name: 'LOYALTY', href: '#loyalty' },
    { name: 'SOCIAL', href: '#social' },
    { name: 'GALLERY', href: '#gallery' },
  ]
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    trackEvent('click', 'nav_logo_home')
  }
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "h-16 md:h-20 glass-nav shadow-glow-soft py-2 z-[110]" : "h-20 md:h-24 bg-transparent py-4 z-[110]"
    )}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-full">
        <div className="flex justify-between items-center h-full">
          <div
            className="flex-shrink-0 flex flex-col md:flex-row md:items-center gap-0 md:gap-3 group cursor-pointer"
            onClick={handleHomeClick}
          >
            <div className="poster-headline text-xl sm:text-2xl lg:text-3xl transition-transform duration-300 group-hover:scale-[1.02] flex flex-wrap items-center">
              <span className="logo-gold mr-2">WAY BACK</span>
              <span className="logo-pink">WEDNESDAYS</span>
            </div>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => trackEvent('click', `nav_${link.name.toLowerCase()}`)}
                className={cn(
                  "relative text-[8px] lg:text-[9px] xl:text-[10px] font-black tracking-[0.2em] lg:tracking-[0.3em] xl:tracking-[0.4em] text-foreground hover:text-neon-cyan transition-all duration-300 uppercase group whitespace-nowrap",
                  link.name === 'RSVP' && "text-hot-pink bloom"
                )}
              >
                {link.name}
                <span className="absolute -bottom-1 lg:-bottom-2 left-0 w-0 h-[2px] bg-neon-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link
              to="/admin/login"
              className="text-[8px] lg:text-[9px] xl:text-[10px] font-black tracking-[0.2em] text-muted-foreground hover:text-hot-pink transition-colors uppercase whitespace-nowrap pl-2 border-l border-foreground/10"
            >
              ADMIN
            </Link>
            <a
              href={`tel:${phone.replace(/-/g, '')}`}
              className="hidden lg:flex items-center gap-2 text-neon-cyan font-black text-[9px] xl:text-[10px] tracking-widest hover:brightness-125 transition-all ml-2"
              aria-label={`Call us at ${phone}`}
            >
              <Phone size={10} />
              {phone}
            </a>
            <div className="flex items-center gap-2 lg:gap-4 ml-2">
              <ThemeToggle className="relative top-0 right-0" />
            </div>
          </nav>
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle className="relative top-0 right-0" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neon-cyan p-2 bg-black/20 border-2 border-neon-cyan/40 hover:bg-neon-cyan hover:text-black transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav Overlay */}
      <div className={cn(
        "fixed inset-0 top-0 bg-background/98 backdrop-blur-[40px] z-[60] transition-all duration-500 md:hidden flex flex-col items-center justify-center p-10",
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-neon-cyan p-2 border-2 border-neon-cyan/20">
          <X size={32} />
        </button>
        <nav className="flex flex-col items-center space-y-4 w-full">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black italic uppercase tracking-tighter text-foreground hover:text-hot-pink transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setIsOpen(false)}
            className="text-lg font-black text-muted-foreground hover:text-hot-pink transition-colors uppercase tracking-widest pt-4"
          >
            ADMIN ACCESS
          </Link>
          <a
            href={`tel:${phone.replace(/-/g, '')}`}
            className="flex items-center gap-3 text-neon-cyan font-black text-xl tracking-widest mt-4"
          >
            <Phone size={20} />
            {phone}
          </a>
        </nav>
      </div>
    </header>
  )
}