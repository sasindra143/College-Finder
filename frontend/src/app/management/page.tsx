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
        const res = await api.getColleges({ limit: 50, sortBy: 'rating' });
        const managementColleges = res.data.filter(c => 
          c.name.toLowerCase().includes('management') || 
          c.name.toLowerCase().includes('business') ||
          c.name.toLowerCase().includes('iim') ||
          c.name.toLowerCase().includes('mba') ||
          (c.degrees && c.degrees.some(d => d.toLowerCase().includes('mba') || d.toLowerCase().includes('bba') || d.toLowerCase().includes('pgdm')))
        );
        setColleges(managementColleges);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[400px] bg-gray-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm mt-12">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-500 font-medium mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold transition-all hover:shadow-md">
            Try Again
          </button>
        </div>
      ) : colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {colleges.map(college => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-gray-900">No management colleges found.</h3>
          <Link href="/colleges" className="text-brand-600 font-bold hover:underline mt-4 inline-block">View all colleges instead</Link>
        </div>
      )}
    </div>
  );
}
