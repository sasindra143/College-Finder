'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Exam } from '@/lib/types';
import { toast } from '@/components/ui/Toaster';
import styles from './ExamsList.module.css';

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Exams');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.getExams();
      setExams(res.data);
    } catch (err) {
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = filter === 'All Exams' 
    ? exams 
    : exams.filter(ex => (ex as any).category === filter);

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
        <div className={styles.contentLayout}>
          <div className={styles.leftCol}>
            <div className={styles.categoriesNav}>
              {['All Exams', 'Engineering', 'Medical', 'Management', 'Law'].map((cat) => (
                <button suppressHydrationWarning 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={`${styles.catBtn} ${filter === cat ? styles.catBtnActive : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No exams found for this category.</p>
                <button suppressHydrationWarning onClick={() => api.seedExams().then(() => fetchExams())} className={styles.seedBtn}>
                  Seed Default Exams
                </button>
              </div>
            ) : (
              <div className={styles.examsGrid}>
                {filteredExams.map(exam => (
                  <div key={exam.id} className={styles.examCard}>
                    <div className={styles.examHeader}>
                      <span className={styles.examCategory}>{(exam as any).category || 'National'}</span>
                      <span className={styles.examMode}>Online/Offline</span>
                    </div>
                    <h2 className={styles.examName}>{exam.name}</h2>
                    <p className={styles.examDesc}>{exam.description}</p>
                    
                    <div className={styles.examMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Latest Update</span>
                        <span className={styles.metaValue}>Registration Open</span>
                      </div>
                    </div>

                    <div className={styles.examActions}>
                      <Link href={`/exams/${exam.slug}`} className={styles.viewBtn}>Full Details</Link>
                      <button suppressHydrationWarning className={styles.syllabusBtn}>Syllabus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3>Featured Resources</h3>
              <ul className={styles.resourceList}>
                <li><span>&#128203;</span> JEE Main Question Papers</li>
                <li><span>&#128214;</span> NEET 2025 Study Plan</li>
                <li><span>&#128200;</span> Rank Predictor Tool</li>
                <li><span>&#128101;</span> Expert Counseling</li>
              </ul>
            </div>
            <div className={styles.sidebarCard}>
              <h3>Top Participating Colleges</h3>
              <div className={styles.miniCollegeList}>
                <div className={styles.miniCollege}>IIT Bombay</div>
                <div className={styles.miniCollege}>AIIMS Delhi</div>
                <div className={styles.miniCollege}>IIM Ahmedabad</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
