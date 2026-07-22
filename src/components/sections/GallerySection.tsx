import React from 'react'
export function GallerySection() {
  const images = [
    { url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' },
    { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-2' },
    { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600', span: 'col-span-2 row-span-1' },
    { url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' },
    { url: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' },
  ]
  return (
    <section id="gallery" className="bg-background py-32 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-4">
            <span className="text-hot-pink font-black text-xs tracking-[0.5em] uppercase bloom">#WAYBACKWEDNESDAY</span>
            <h2 className="poster-headline text-5xl md:text-8xl">GALLERY</h2>
          </div>
          <div className="poster-stamp w-24 h-24 border-neon-cyan text-neon-cyan -rotate-6 hidden md:flex">
             <span className="text-[10px] leading-tight">OFFICIAL<br/>ARCHIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group border-2 border-foreground/10 shadow-xl rounded-none ${img.span}`}
            >
              {i % 2 === 0 && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-6 tape-effect z-20" />
              )}
              <img
                src={img.url}
                alt="Event moment"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-300" />
              <div className="absolute inset-0 border-8 border-transparent group-hover:border-neon-cyan/20 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}