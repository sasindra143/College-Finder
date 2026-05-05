'use client';
import Link from 'next/link';
import styles from './ExamsList.module.css';

const EXAMS_DATA = [
  { id: 'jee-main', name: 'JEE Main 2025', category: 'Engineering', date: 'April 4, 2025', participants: '12 Lakhs+', mode: 'Online (CBT)', status: 'Registration Open' },
  { id: 'neet', name: 'NEET UG 2025', category: 'Medical', date: 'May 5, 2025', participants: '20 Lakhs+', mode: 'Offline', status: 'Upcoming' },
  { id: 'cat', name: 'CAT 2025', category: 'Management', date: 'Nov 24, 2025', participants: '3 Lakhs+', mode: 'Online', status: 'Announced' },
  { id: 'clat', name: 'CLAT 2025', category: 'Law', date: 'Dec 1, 2025', participants: '60,000+', mode: 'Offline', status: 'Results Declared' },
  { id: 'gate', name: 'GATE 2025', category: 'Engineering', date: 'Feb 1, 2025', participants: '8 Lakhs+', mode: 'Online (CBT)', status: 'Admit Card Released' },
  { id: 'bitsat', name: 'BITSAT 2025', category: 'Engineering', date: 'May 19, 2025', participants: '3 Lakhs+', mode: 'Online (CBT)', status: 'Registration Open' },
];

export default function ExamsList() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Top Entrance Exams in India</h1>
          <p className={styles.subtitle}>Get the latest updates on exam dates, syllabus, eligibility, and application forms for Engineering, Medical, Management, and Law.</p>
          
          <div className={styles.searchBox}>
            <input suppressHydrationWarning type="text" placeholder="Search exams (e.g., JEE Main, NEET)" className={styles.searchInput} />
            <button suppressHydrationWarning className={styles.searchBtn}>Search</button>
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.categoriesNav}>
          {['All Exams', 'Engineering', 'Medical', 'Management', 'Law', 'Design'].map((cat, i) => (
            <button suppressHydrationWarning key={cat} className={`${styles.catBtn} ${i === 0 ? styles.catBtnActive : ''}`}>{cat}</button>
          ))}
        </div>

        <div className={styles.examsGrid}>
          {EXAMS_DATA.map(exam => (
            <div key={exam.id} className={styles.examCard}>
              <div className={styles.examHeader}>
                <span className={styles.examCategory}>{exam.category}</span>
                <span className={`${styles.examStatus} ${exam.status.includes('Open') || exam.status.includes('Released') ? styles.statusGreen : ''}`}>{exam.status}</span>
              </div>
              <h2 className={styles.examName}>{exam.name}</h2>
              
              <div className={styles.examDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Exam Date</span>
                  <span className={styles.detailValue}>{exam.date}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mode</span>
                  <span className={styles.detailValue}>{exam.mode}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Participants</span>
                  <span className={styles.detailValue}>{exam.participants}</span>
                </div>
              </div>

              <div className={styles.examActions}>
                <Link href={`/exams/${exam.id}`} className={styles.viewBtn}>View Details</Link>
                <button suppressHydrationWarning className={styles.trackBtn}>+ Track Exam</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
