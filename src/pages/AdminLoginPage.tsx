import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import type { AuthResponse } from '@shared/types';
export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem('adminToken', res.token);
      toast.success('ADMIN ACCESS GRANTED');
      navigate('/admin');
    } catch (err) {
      toast.error('INVALID AUTHENTICATION');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 scanlines pointer-events-none opacity-20" />
      <Card className="w-full max-w-md bg-background border-4 border-hot-pink shadow-extrude-purple relative z-10 rounded-none">
        <CardHeader className="text-center border-b-4 border-hot-pink/20 pb-8">
          <CardTitle className="poster-headline text-4xl">
            <span className="logo-gold">SYSTEM</span> <span className="text-foreground">LOGIN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">IDENTIFIER</label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USERNAME"
                className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black tracking-widest"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-hot-pink">PASSWORD KEY</label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 bg-black/40 border-2 border-foreground/20 rounded-none font-black tracking-widest"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-hot-pink hover:bg-white hover:text-hot-pink text-white font-black uppercase tracking-[0.3em] shadow-extrude-pink rounded-none border-2 border-white/20"
            >
              {isLoading ? 'UPLOADING...' : 'INITIALIZE SESSION'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
          WBW ADMINISTRATIVE TERMINAL v2.0
        </CardFooter>
      </Card>
    </div>
  );
}