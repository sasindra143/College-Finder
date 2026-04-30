'use client';
import { useState, useEffect, useCallback } from 'react';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

let listeners: ((t: Toast) => void)[] = [];

export const toast = {
  success: (message: string) => emit({ id: Math.random().toString(36).substr(2, 9) + Date.now(), message, type: 'success' }),
  error: (message: string) => emit({ id: Math.random().toString(36).substr(2, 9) + Date.now(), message, type: 'error' }),
  info: (message: string) => emit({ id: Math.random().toString(36).substr(2, 9) + Date.now(), message, type: 'info' }),
};

function emit(t: Toast) { listeners.forEach(l => l(t)); }

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
    };
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2 fade-in-up
            ${t.type === 'success' ? 'bg-emerald-600 text-white' :
              t.type === 'error' ? 'bg-red-600 text-white' :
              'bg-brand-600 text-white'}`}
        >
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'} {t.message}
        </div>
      ))}
    </div>
  );
}
