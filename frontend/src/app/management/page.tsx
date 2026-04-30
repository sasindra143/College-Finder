'use client';
import Link from 'next/link';
import styles from './Management.module.css';

export default function ManagementPage() {
  const categories = [
    {
      title: 'IIMs & Premier Govt B-Schools',
      desc: 'Access official data for Indian Institutes of Management and top government business schools across India.',
      icon: '🏛️',
      path: '/colleges?ownership=Government',
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Top Ranked Private B-Schools',
      desc: 'Explore XLRI, ISB, SPJIMR and other leading private management institutions with verified placement stats.',
      icon: '💼',
      path: '/colleges?ownership=Private',
      color: 'from-orange-500 to-orange-700'
    },
    {
      title: 'Specialized PGDM Programs',
      desc: 'Discover industry-aligned PGDM courses offering specialization in FinTech, Data Science, and AI.',
      icon: '📊',
      path: '/colleges?search=PGDM',
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      title: 'Undergraduate BBA/BMS',
      desc: 'Find the best foundation for your business career with top-rated undergraduate management colleges.',
      icon: '🎓',
      path: '/colleges?search=BBA',
      color: 'from-purple-600 to-purple-800'
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className={styles.categoryBadge}>Management Category</div>
        <h1 className={styles.mainTitle}>Master Your <span className="text-brand-600">Business Future</span></h1>
        <p className={styles.mainSubtitle}>
          Compare the best MBA and PGDM programs in India. We provide verified data on CAT/XAT cutoffs, fee structures, and audited placement reports.
        </p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat, i) => (
          <Link key={i} href={cat.path} className={styles.card}>
            <div className={`${styles.cardIcon} bg-gradient-to-br ${cat.color}`}>
              {cat.icon}
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{cat.title}</h2>
              <p className={styles.cardDesc}>{cat.desc}</p>
              <div className={styles.cardFooter}>
                <span className={styles.viewLink}>Explore Colleges →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className={styles.infoSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>💡</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Pro Tip for MBA Aspirants</h3>
            <p className="text-sm text-gray-600">Don't just look at the average package. Check the median package and the list of recruiting companies to understand the real ROI of your management degree.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
