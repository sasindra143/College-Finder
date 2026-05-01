'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [savedColleges, setSavedColleges] = useState<{id: string, college: College}[]>([]);
  const [comparisons, setComparisons] = useState<{id: string, name: string, collegeIds: string[], createdAt: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        api.getSavedColleges(),
        api.getSavedComparisons()
      ])
      .then(([collegesRes, compRes]) => {
        setSavedColleges(collegesRes.data);
        setComparisons(compRes.data);
      })
      .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  if (!isAuthenticated) return null;

  const deleteComparison = async (id: string) => {
    await api.deleteComparison(id);
    setComparisons(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12" style={{ paddingTop: '180px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 fade-in-up">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-2xl flex items-center justify-center font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-gray-500 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-12 fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Saved Colleges ({savedColleges.length})</h2>
            <Link href="/colleges" className="text-brand-600 font-bold hover:text-brand-700">Browse more →</Link>
          </div>
          
          {savedColleges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedColleges.map(({ college }) => (
                <CollegeCard key={college.id} college={college} isSaved={true} onSaveToggle={() => {
                  setSavedColleges(prev => prev.filter(c => c.college.id !== college.id));
                }} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No saved colleges</h3>
              <p className="text-gray-500 font-medium mb-6">Save colleges you are interested in to view them later.</p>
              <Link href="/colleges" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold transition-all hover:shadow-md">Browse Colleges</Link>
            </div>
          )}
        </div>

        <div className="fade-in-up" style={{animationDelay: '0.2s'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Comparisons ({comparisons.length})</h2>
          
          {comparisons.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {comparisons.map(comp => (
                <div key={comp.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{comp.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{comp.collegeIds.length} colleges • {new Date(comp.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/compare?ids=${comp.collegeIds.join(',')}`} className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg font-bold text-sm hover:bg-brand-100 transition-colors">
                      View
                    </Link>
                    <button onClick={() => deleteComparison(comp.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No comparisons saved</h3>
              <p className="text-gray-500 font-medium mb-6">Compare colleges and save the list to access it anytime.</p>
              <Link href="/compare" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold transition-all hover:shadow-md">Go to Compare</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
