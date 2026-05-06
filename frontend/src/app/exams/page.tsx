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
        <div className={styles.categoriesNav}>
          {['All Exams', 'Engineering', 'Medical', 'Management', 'Law', 'Design'].map((cat) => (
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
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center p-20">
            <p className="text-gray-500 text-lg">No exams found for this category.</p>
            <button suppressHydrationWarning onClick={() => api.seedExams().then(() => fetchExams())} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold">
              Seed Default Exams
            </button>
          </div>
        ) : (
          <div className={styles.examsGrid}>
            {filteredExams.map(exam => (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examHeader}>
                  <span className={styles.examCategory}>{(exam as any).category || 'General'}</span>
                  <span className={styles.examStatus}>Open</span>
                </div>
                <h2 className={styles.examName}>{exam.name}</h2>
                
                <div className={styles.examDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Slug</span>
                    <span className={styles.detailValue}>{exam.slug}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Description</span>
                    <span className={styles.detailValue} style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{exam.description}</span>
                  </div>
                </div>

                <div className={styles.examActions}>
                  <Link href={`/exams/${exam.slug}`} className={styles.viewBtn}>View Details</Link>
                  <button suppressHydrationWarning className={styles.trackBtn}>+ Track Exam</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
