import styles from './CollegeCard.module.css';

export default function CollegeCardSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonTextShort} />
        <div className={styles.skeletonStats}>
          <div className={styles.skeletonStat} />
          <div className={styles.skeletonStat} />
          <div className={styles.skeletonStat} />
        </div>
        <div className={styles.skeletonActions}>
          <div className={styles.skeletonBtn} />
          <div className={styles.skeletonBtn} />
        </div>
      </div>
    </div>
  );
}
