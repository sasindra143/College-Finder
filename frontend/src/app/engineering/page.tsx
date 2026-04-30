'use client';
import Link from 'next/link';
import styles from './Engineering.module.css';

export default function EngineeringPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Top Engineering Colleges</h1>
        <p className={styles.subtitle}>Discover B.Tech, M.Tech, and Diploma courses across top institutes.</p>
      </div>

      <div className={styles.grid}>
        <Link href="/colleges?type=Government" className={styles.card}>
          <div className={styles.icon}>🏛️</div>
          <h2 className={styles.cardTitle}>Government Institutes</h2>
          <p className={styles.cardDesc}>IITs, NITs, and State Govt Colleges</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
        <Link href="/colleges?type=Private" className={styles.card}>
          <div className={styles.icon}>🏢</div>
          <h2 className={styles.cardTitle}>Private Institutes</h2>
          <p className={styles.cardDesc}>Top-ranked private engineering universities</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
        <Link href="/colleges" className={styles.card}>
          <div className={styles.icon}>🔍</div>
          <h2 className={styles.cardTitle}>View All Engineering</h2>
          <p className={styles.cardDesc}>Browse all 2000+ engineering colleges</p>
          <div className={styles.actionBtn}>View All</div>
        </Link>
      </div>
    </div>
  );
}
