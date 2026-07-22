import React from 'react'
import { Camera, Play } from 'lucide-react'
import { Card } from '@/components/ui/card'
export function SocialMediaCenter() {
  const posts = [
    { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600', views: '12K' },
    { url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=600', views: '8.4K' },
    { url: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=600', views: '24K' },
    { url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=600', views: '15.2K' },
    { url: 'https://images.unsplash.com/photo-1574391884720-bbe3740057d3?auto=format&fit=crop&q=80&w=600', views: '9.1K' },
    { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=600', views: '11.5K' },
  ]
  return (
    <section id="social" className="py-32 bg-background scroll-mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 mb-16">
          <Camera className="text-hot-pink w-10 h-10 bloom" />
          <h2 className="poster-headline text-5xl md:text-7xl leading-none">RETRO <span className="text-foreground chromatic-aberration">REELS</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {posts.map((post, i) => (
            <Card key={i} className="group relative aspect-[9/16] bg-card border-2 border-foreground/5 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 rounded-none">
              <img src={post.url} alt="Social post" className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-hot-pink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center bg-white/20 bloom">
                   <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="poster-stamp px-2 py-0.5 border-primary-foreground text-primary-foreground text-[8px] bg-hot-pink/90 scale-75 -rotate-12">LIVE</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-1">
                <span className="text-[10px] font-black text-white tracking-widest uppercase bg-black/60 px-2 py-1">{post.views} VIEWS</span>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <a href="#" className="inline-block px-10 py-4 border-2 border-hot-pink text-hot-pink font-black text-sm tracking-[0.3em] uppercase hover:bg-hot-pink hover:text-white transition-all shadow-extrude-pink">
            FOLLOW @WAYBACKWEDNESDAYS
          </a>
        </div>
      </div>
    </section>
  )
}