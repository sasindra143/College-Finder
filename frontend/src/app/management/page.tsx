'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import styles from './Management.module.css';
import Link from 'next/link';

export default function ManagementPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res: any = await api.getColleges({ course: 'Management', limit: 12, sortBy: 'rating' });
        setColleges(res?.data || res?.colleges || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load management colleges:', err);
        setError('Could not connect to the database. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <span>Management</span>
        </div>
        <h1 className={styles.title}>Top Management Colleges in India</h1>
        <p className={styles.subtitle}>Discover premier IIMs and B-Schools offering MBA, PGDM, and BBA programs with high placement records.</p>
      </div>

      {loading ? (
        <div className={styles.gridContainer}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Connection Error</h3>
          <p className={styles.errorText}>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.tryAgainBtn}>
            Try Again
          </button>
        </div>
      ) : colleges.length > 0 ? (
        <div className={styles.gridContainer}>
          {colleges.map(college => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No management colleges found.</h3>
          <Link href="/colleges" className={styles.emptyLink}>View all colleges instead</Link>
        </div>
      )}
    </div>
  );
}
