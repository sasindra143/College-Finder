'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import styles from './Medicine.module.css';
import Link from 'next/link';

export default function MedicinePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        // Use the backend course filter directly for 37k records
        const res = await api.getColleges({ 
          course: 'Medical', 
          limit: 12, 
          sortBy: 'rating' 
        });
        setColleges(res?.data || res?.colleges || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load medical colleges:', err);
        setError('Could not connect to the database. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span className={styles.sep}>/</span> <span className={styles.current}>Medicine</span>
          </div>
          <h1 className={styles.title}>Top Medical Colleges in India 2025</h1>
          <p className={styles.subtitle}>
            Explore world-class MBBS, BDS, and Nursing institutions. Compare fees, rankings, and placement data for over 500+ verified medical colleges.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Colleges</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>1.2L+</span>
              <span className={styles.statLabel}>Seats</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>₹5L-80L</span>
              <span className={styles.statLabel}>Fee Range</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recommended Institutions</h2>
          <Link href="/colleges?course=Medical" className={styles.viewAll}>View All Medical Colleges →</Link>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>Try Again</button>
          </div>
        ) : colleges.length > 0 ? (
          <div className={styles.grid}>
            {colleges.map((college, idx) => (
              <div key={college.id} className={styles.animateIn} style={{ animationDelay: `${idx * 0.1}s` }}>
                <CollegeCard college={college} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No medical colleges found</h3>
            <p>We couldn't find any colleges matching this stream in our database.</p>
            <Link href="/colleges" className={styles.browseBtn}>Browse All Colleges</Link>
          </div>
        )}
      </div>

      {/* Quick Links Section */}
      <section className={styles.quickLinks}>
        <h2 className={styles.qTitle}>Popular Medical Specializations</h2>
        <div className={styles.qGrid}>
          {['MBBS', 'BDS', 'B.Sc Nursing', 'B.Pharm', 'BPT (Physiotherapy)', 'B.V.Sc'].map(spec => (
            <Link key={spec} href={`/colleges?search=${spec}`} className={styles.qCard}>
              {spec}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
