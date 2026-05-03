'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Exam } from '@/lib/types';
import { toast } from '@/components/ui/Toaster';
import styles from './Exams.module.css';

export default function ExamDetail() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.getExam(slug as string)
        .then(res => setExam(res?.data || res?.exam))
        .catch(() => toast.error('Failed to load exam details'))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold text-lg">
            Fetching latest exam updates...
          </p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className={styles.pageContainer}>
        <div className="text-center p-20 font-bold">
          Exam not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>

      {/* Header Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroFlex}>
            <div className={styles.iconBox}>📝</div>

            <div className="flex-1">
              <div className={styles.badgeStack}>
                <span className={`${styles.badge} ${styles.badgeBrand}`}>
                  {/* ✅ FIX: safe fallback */}
                  {(exam as any).category || 'Exam'}
                </span>

                <span className={`${styles.badge} ${styles.badgeEmerald}`}>
                  Live Updates
                </span>
              </div>

              <h1 className={styles.title}>
                {exam.name}
              </h1>

              <p className={styles.description}>
                {exam.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>

        {/* Main Content */}
        <div className={styles.contentCard}>

          {/* ✅ FIX: prevent undefined crash */}
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{
              __html: exam.content || ''
            }}
          />

          {/* Eligibility */}
          <div id="eligibility" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Eligibility Criteria
            </h2>

            <div className={styles.eligibilityBox}>
              {exam.eligibility || 'Not specified'}
            </div>
          </div>

          {/* Syllabus */}
          <div id="syllabus" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Exam Syllabus
            </h2>

            <div className={styles.syllabusBox}>
              {exam.syllabus || 'Not available'}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.stickyWidget}>

            <div className={styles.widgetCard}>
              <h3 className={styles.widgetTitle}>
                Quick Links
              </h3>

              <nav className={styles.quickLinks}>
                {[
                  'Overview',
                  'Important Dates',
                  'Eligibility',
                  'Syllabus',
                  'Preparation Tips',
                  'Result'
                ].map(link => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className={styles.quickLink}
                  >
                    {link}
                  </a>
                ))}
              </nav>

              {/* ✅ FIX: safe dates handling */}
              <div id="important-dates" className={styles.dateList}>
                <h3 className={styles.widgetTitle}>
                  Important Dates
                </h3>

                <div className="space-y-3">
                  {(exam as any).dates?.length ? (
                    (exam as any).dates.map((date: any) => (
                      <div key={date.id} className={styles.dateItem}>
                        <span className={styles.eventLabel}>
                          {date.event}
                        </span>
                        <span className={styles.eventDate}>
                          {date.date}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No dates available
                    </p>
                  )}
                </div>
              </div>

              <button className={styles.downloadBtn}>
                Download Brochure (PDF)
              </button>
            </div>

            {/* Related News */}
            <div className={`${styles.widgetCard} mt-6`}>
              <h3 className={styles.widgetTitle}>
                Related News
              </h3>

              <div className={styles.newsList}>
                {[
                  'How to prepare for exams in 3 months?',
                  'Best books for preparation',
                  'Top colleges placement report'
                ].map(news => (
                  <div key={news} className={styles.newsItem}>
                    <p className={styles.newsTitle}>
                      {news}
                    </p>
                    <div className={styles.newsDivider} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}