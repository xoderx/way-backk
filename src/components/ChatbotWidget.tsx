import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api-client'
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [embedCode, setEmbedCode] = useState<string>('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Yo! I am WBW-Bot. How can I help you elevate your Wednesday night?' }
  ])
  const [input, setInput] = useState('')
  const embedRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    api<{ value: string }>('/api/config/chatbot_embed')
      .then(res => {
        if (res.value && res.value.trim().length > 0) {
          setEmbedCode(res.value);
        }
      })
      .catch(() => {})
  }, [])
  // Handle external script injection for NeoM.ai embeds with cleanup
  useEffect(() => {
    const currentEmbedContainer = embedRef.current;
    if (isOpen && embedCode && currentEmbedContainer) {
      // Clear container
      currentEmbedContainer.innerHTML = embedCode;
      const injectedScripts: HTMLScriptElement[] = [];
      const scripts = currentEmbedContainer.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const originalScript = scripts[i];
        const scriptId = originalScript.src ? `wbw-script-${btoa(originalScript.src).substring(0, 16)}` : null;
        // Prevent duplicate execution if script with same ID exists
        if (scriptId && document.getElementById(scriptId)) continue;
        const script = document.createElement('script');
        if (originalScript.src) {
          script.src = originalScript.src;
          if (scriptId) script.id = scriptId;
        } else {
          script.innerHTML = originalScript.innerHTML;
        }
        script.async = true;
        document.body.appendChild(script);
        injectedScripts.push(script);
      }
      // Cleanup function to remove scripts and clear content
      return () => {
        injectedScripts.forEach(s => {
          if (document.body.contains(s)) {
            document.body.removeChild(s);
          }
        });
        if (currentEmbedContainer) {
          currentEmbedContainer.innerHTML = '';
        }
      };
    }
  }, [isOpen, embedCode]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setTimeout(() => {
      let reply = "I'm checking the archives... best bet is to check our DETAILS section or DM us on Instagram!"
      if (userMsg.toLowerCase().includes('time')) reply = "The party kicks off at 5:00 PM every Wednesday!"
      if (userMsg.toLowerCase().includes('where')) reply = "Moonrise Hotel Rooftop - 6177 Delmar Blvd!"
      if (userMsg.toLowerCase().includes('cost') || userMsg.toLowerCase().includes('cover')) reply = "Cover varies by night. RSVP early to save your spot!"
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    }, 1000)
  }
  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-background border-2 border-neon-purple shadow-extrude-purple overflow-hidden flex flex-col h-[450px]"
          >
            <div className="p-4 bg-neon-purple text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-black italic text-sm tracking-tighter uppercase">
                  {embedCode ? 'NEOM.AI ASSISTANT' : 'WBW ASSISTANT'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {embedCode ? (
              <div
                ref={embedRef}
                className="flex-1 w-full bg-white h-full overflow-auto"
                style={{ minHeight: '350px' }}
              />
            ) : (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-background">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 text-xs font-bold leading-tight border ${
                        m.role === 'user'
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-muted text-foreground border-foreground/10 border-l-4 border-l-neon-purple'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2 bg-background">
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="ASK A QUESTION..."
                    className="bg-muted border-border h-10 text-[10px] uppercase font-bold tracking-widest text-foreground focus-visible:ring-neon-purple"
                  />
                  <Button type="submit" size="icon" className="bg-neon-purple hover:bg-neon-purple/90 shrink-0 h-10 w-10 text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-neon-purple hover:bg-neon-purple/90 text-white shadow-glow-intense transition-all active:scale-90"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </Button>
    </div>
  )
}