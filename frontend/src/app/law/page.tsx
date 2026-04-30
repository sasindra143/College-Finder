'use client';
import Link from 'next/link';
import styles from './Law.module.css';

export default function LawPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Top Law Colleges</h1>
        <p className={styles.subtitle}>Discover LLB, LLM, and BA LLB courses.</p>
      </div>

      <div className={styles.grid}>
        <Link href="/colleges?type=Government" className={styles.card}>
          <div className={styles.icon}>⚖️</div>
          <h2 className={styles.cardTitle}>NLUs & Govt Colleges</h2>
          <p className="text-gray-500">National Law Universities</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
        <Link href="/colleges?type=Private" className={styles.card}>
          <div className={styles.icon}>🏛️</div>
          <h2 className={styles.cardTitle}>Private Law Schools</h2>
          <p className="text-gray-500">Top-ranked private law colleges</p>
          <div className={styles.actionBtn}>View Colleges</div>
        </Link>
      </div>
    </div>
  );
}
