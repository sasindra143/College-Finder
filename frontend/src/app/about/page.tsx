import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.heroIcon}>🎓</div>
        <h1 className={styles.title}>About CareerCampus</h1>
        <p className={styles.description}>
          CareerCampus is India's leading education portal designed to help students discover, compare, and choose the best colleges for their future. 
        </p>
        
        <div className={styles.missionCard}>
          <h2 className={styles.missionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            We believe that choosing a college is one of the most important decisions in a student's life. Our mission is to democratize education data by providing transparent access to fees, placement records, and verified student reviews.
          </p>
          
          <div className={styles.statsGrid}>
            <div className={`${styles.statItem} ${styles.bgBrand}`}>
              <div className={styles.statValue}>10k+</div>
              <div className={styles.statLabel}>Colleges Listed</div>
            </div>
            <div className={`${styles.statItem} ${styles.bgEmerald}`}>
              <div className={styles.statValue}>50k+</div>
              <div className={styles.statLabel}>Student Reviews</div>
            </div>
            <div className={`${styles.statItem} ${styles.bgBlue}`}>
              <div className={styles.statValue}>1M+</div>
              <div className={styles.statLabel}>Monthly Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
