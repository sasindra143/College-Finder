'use client';
import Link from 'next/link';
import styles from './Medicine.module.css';

export default function MedicinePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Top Medical Colleges</h1>
        <p className={styles.subtitle}>Discover MBBS, BDS, and PG Medical courses.</p>
      </div>

      <div className={styles.grid}>
        <Link href="/colleges?type=Government" className={styles.card}>
          <div className={styles.icon}>🏥</div>
          <h2 className={styles.cardTitle}>AIIMS & Govt Colleges</h2>
          <p className={styles.cardDesc}>Top-tier government medical institutions</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
        <Link href="/colleges?type=Private" className={styles.card}>
          <div className={styles.icon}>🔬</div>
          <h2 className={styles.cardTitle}>Private Medical Colleges</h2>
          <p className={styles.cardDesc}>Highly equipped private institutions</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
      </div>
    </div>
  );
}
