'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import styles from './Engineering.module.css';
import Link from 'next/link';

export default function EngineeringPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const res = await api.getColleges({ 
          course: 'Engineering', 
          limit: 12, 
          sortBy: 'rating' 
        });
        setColleges(res?.data || res?.colleges || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load engineering colleges:', err);
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
            <Link href="/">Home</Link> <span className={styles.sep}>/</span> <span className={styles.current}>Engineering</span>
          </div>
          <h1 className={styles.title}>Best Engineering Colleges in India 2025</h1>
          <p className={styles.subtitle}>
            From IITs to premier private institutes, find the perfect place for your B.Tech or M.Tech. Filter by branch, placement, and entrance exams.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>3500+</span>
              <span className={styles.statLabel}>Institutes</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>15L+</span>
              <span className={styles.statLabel}>Students</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>JEE Main</span>
              <span className={styles.statLabel}>Target Exam</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Top-Rated Engineering Colleges</h2>
          <Link href="/colleges?course=Engineering" className={styles.viewAll}>View All Engineering Colleges →</Link>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3,4,5,6].map(i => <div key={i} className={styles.skeletonCard} />)}
          </div>
        ) : error ? (
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚙️</div>
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
            <h3>No colleges found</h3>
            <Link href="/colleges" className={styles.browseBtn}>Browse All Colleges</Link>
          </div>
        )}
      </div>

      <section className={styles.quickLinks}>
        <h2 className={styles.qTitle}>Popular Engineering Branches</h2>
        <div className={styles.qGrid}>
          {['B.Tech', 'M.Tech', 'Diploma', 'Engineering', 'Technology', 'Polytechnic'].map(spec => (
            <Link key={spec} href={`/colleges?search=${spec}`} className={styles.qCard}>
              {spec}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
