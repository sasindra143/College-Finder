'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { College } from '@/lib/api';

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);

  const addToCompare = useCallback((college: College) => {
    setCompareList(prev => {
      if (prev.length >= 3 || prev.find(c => c.id === college.id)) return prev;
      return [...prev, college];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);
  const isInCompare = useCallback((id: string) => compareList.some(c => c.id === id), [compareList]);

  return (
    <CompareContext.Provider value={{
      compareList, addToCompare, removeFromCompare,
      clearCompare, isInCompare, canAdd: compareList.length < 3,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  // Default fallback for SSR/Prerender safety
  if (!ctx) return {
    compareList: [],
    addToCompare: () => {},
    removeFromCompare: () => {},
    clearCompare: () => {},
    isInCompare: () => false,
    canAdd: true
  };
  return ctx;
};
