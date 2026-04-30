'use client';
import Link from 'next/link';
import styles from '../Stream.module.css';

export default function DesignPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Top Design Colleges</h1>
        <p className={styles.subtitle}>Discover B.Des, M.Des, and Fashion courses.</p>
      </div>

      <div className={styles.grid}>
        <Link href="/colleges?type=Government" className={styles.card}>
          <div className={styles.icon}>🎨</div>
          <h2 className={styles.cardTitle}>NID & NIFT</h2>
          <p className="text-gray-500">Premier government design institutes</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
        <Link href="/colleges?type=Private" className={styles.card}>
          <div className={styles.icon}>✨</div>
          <h2 className={styles.cardTitle}>Private Design Schools</h2>
          <p className="text-gray-500">Modern campuses with top facilities</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
      </div>
    </div>
  );
}
