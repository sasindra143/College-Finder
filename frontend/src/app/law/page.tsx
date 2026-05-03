'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import styles from './Law.module.css';
import Link from 'next/link';

export default function LawPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const res = await api.getColleges({ 
          course: 'Law', 
          limit: 12, 
          sortBy: 'rating' 
        });
        setColleges(res?.data || res?.colleges || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load law colleges:', err);
        setError('Could not connect to the database.');
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
            <Link href="/">Home</Link> <span className={styles.sep}>/</span> <span className={styles.current}>Law</span>
          </div>
          <h1 className={styles.title}>Top Law Colleges in India 2025</h1>
          <p className={styles.subtitle}>
            Pursue excellence in legal education at India's premier NLUs and private law schools. Discover verified LLB, LLM, and Integrated Law programs.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>250+</span>
              <span className={styles.statLabel}>Law Schools</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>26</span>
              <span className={styles.statLabel}>NLUs</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>CLAT/AILET</span>
              <span className={styles.statLabel}>Top Exams</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Law Schools</h2>
          <Link href="/colleges?course=Law" className={styles.viewAll}>Explore All Law Colleges →</Link>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚖️</div>
            <h3>Unable to load data</h3>
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
            <h3>No law colleges found</h3>
            <p>Try browsing our full list of institutions.</p>
            <Link href="/colleges" className={styles.browseBtn}>View All Colleges</Link>
          </div>
        )}
      </div>

      <section className={styles.quickLinks}>
        <h2 className={styles.qTitle}>Popular Law Programs</h2>
        <div className={styles.qGrid}>
          {['LLB', 'BA LLB', 'LLM', 'Law', 'Legal', 'Jurisprudence'].map(spec => (
            <Link key={spec} href={`/colleges?search=${spec}`} className={styles.qCard}>
              {spec}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
