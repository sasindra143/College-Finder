'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

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
        const rawColleges = collegesRes?.data || collegesRes?.colleges || [];
        const formatted = rawColleges.map((c: any) => ({
          id: c.id || c.college?.id || crypto.randomUUID(),
          college: c.college || c
        }));

        setSavedColleges(formatted);
        setComparisons(compRes?.data || compRes?.comparisons || []);
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
    <div className={styles.dashboardContainer}>
      <div className={styles.contentWrapper}>
        
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeContent}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.welcomeText}>
              <h1>Welcome, {user?.name || 'User'}</h1>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Saved Colleges ({savedColleges.length})</h2>
            <Link href="/colleges" className={styles.browseLink}>Browse more →</Link>
          </div>
          
          {savedColleges.length > 0 ? (
            <div className={styles.grid}>
              {savedColleges.map(({ college }) => (
                <CollegeCard key={college.id} college={college} isSaved={true} onSaveToggle={() => {
                  setSavedColleges(prev => prev.filter(c => c.college.id !== college.id));
                }} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏫</div>
              <h3>No saved colleges</h3>
              <p>Save colleges you are interested in to view them later.</p>
              <Link href="/colleges" className={styles.emptyAction}>Browse Colleges</Link>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Saved Comparisons ({comparisons.length})</h2>
          </div>
          
          {comparisons.length > 0 ? (
            <div className={styles.grid}>
              {comparisons.map(comp => (
                <div key={comp.id} className={styles.comparisonCard}>
                  <div className={styles.comparisonInfo}>
                    <h3>{comp.name}</h3>
                    <p>{comp.collegeIds.length} colleges • {new Date(comp.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.comparisonActions}>
                    <Link href={`/compare?ids=${comp.collegeIds.join(',')}`} className={styles.viewBtn}>
                      View
                    </Link>
                    <button onClick={() => deleteComparison(comp.id)} className={styles.deleteBtn}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⚖️</div>
              <h3>No comparisons saved</h3>
              <p>Compare colleges and save the list to access it anytime.</p>
              <Link href="/compare" className={styles.emptyAction}>Go to Compare</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
