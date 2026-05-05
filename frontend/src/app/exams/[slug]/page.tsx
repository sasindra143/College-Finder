'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Exam } from '@/lib/types';
import { toast } from '@/components/ui/Toaster';
import Link from 'next/link';
import styles from './Exams.module.css';

const navItems = [
  'Overview', 'Eligibility', 'Application', 'Result', 'Preparation Tips', 
  'Mock Test', 'Question Paper', 'Admit Card', 'Cutoff', 'Counselling', 'Syllabus'
];

export default function ExamDetail() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

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
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold text-lg">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className={styles.pageContainer}>
        <div className="text-center p-20 font-bold text-2xl">Exam not found</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span className={styles.separator}>›</span>
          <Link href="/exams">Exams</Link>
          <span className={styles.separator}>›</span>
          <span className={styles.currentCrumb}>{exam.name}</span>
        </div>

        {/* Hero Header */}
        <div className={styles.heroHeader}>
          <div className={styles.heroTitleArea}>
            <h1 className={styles.heroTitle}>{exam.name} - Important Dates, Eligibility, Syllabus & Application</h1>
            <div className={styles.heroTags}>
              <span className={styles.hashtag}>#{exam.name.split(' ')[0]}</span>
              <span className={styles.hashtag}>#{((exam as any).category || 'Exam').replace(/\s/g, '')}</span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button suppressHydrationWarning className={styles.btnPrimary}>Download PDF</button>
            <button suppressHydrationWarning className={styles.btnSecondary}>
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Brochure
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className={styles.navBarWrapper}>
          <div className={styles.navBar}>
            {navItems.map(item => (
              <button suppressHydrationWarning
                key={item}
                onClick={() => setActiveTab(item)}
                className={`${styles.navItem} ${activeTab === item ? styles.navItemActive : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
          <button suppressHydrationWarning className={styles.navScrollRight}>›</button>
        </div>

        {/* Main Layout Grid */}
        <div className={styles.layoutGrid}>
          
          {/* Left Column - Content */}
          <div className={styles.mainContent}>
            
            {/* Author / Info snippet */}
            <div className={styles.authorSnippet}>
              <div className={styles.authorAvatar}>ED</div>
              <div>
                <div className={styles.authorName}>Education Desk</div>
                <div className={styles.authorDate}>Updated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>

            <div className={styles.contentCard}>
              <h2 className={styles.sectionTitle}>{activeTab}</h2>
              
              {activeTab === 'Overview' && (
                <>
                  <p className={styles.description}>{exam.description || 'No description available for this exam.'}</p>
                  <div
                    className={styles.htmlContent}
                    dangerouslySetInnerHTML={{ __html: exam.content || '' }}
                  />
                </>
              )}

              {activeTab === 'Eligibility' && (
                <div className={styles.infoBox}>
                  {exam.eligibility || 'Eligibility criteria not specified yet.'}
                </div>
              )}

              {activeTab === 'Syllabus' && (
                <div className={styles.infoBox}>
                  {exam.syllabus || 'Syllabus not available.'}
                </div>
              )}

              {['Application', 'Result', 'Preparation Tips', 'Mock Test', 'Question Paper', 'Admit Card', 'Cutoff', 'Counselling'].includes(activeTab) && (
                <div className={styles.infoBox}>
                  Detailed information for {activeTab} will be updated soon. Bookmark this page for the latest updates on {exam.name}.
                </div>
              )}
            </div>

            {/* In-content Banners */}
            <div className={styles.bannerAd}>
              <div className={styles.bannerAdContent}>
                <h3>Prepare for {exam.name}</h3>
                <p>Get exclusive mock tests and study materials.</p>
              </div>
              <button suppressHydrationWarning className={styles.btnPrimary}>Start Prep</button>
            </div>

          </div>

          {/* Right Column - Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyWidget}>
              
              <div className={styles.widgetCard}>
                <h3 className={styles.widgetTitle}>Important Dates</h3>
                <div className={styles.dateList}>
                  {(exam as any).dates?.length ? (
                    (exam as any).dates.map((date: any, idx: number) => (
                      <div key={idx} className={styles.dateItem}>
                        <div className={styles.dateLabel}>{date.event}</div>
                        <div className={styles.dateValue}>{date.date}</div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.dateItem}>
                      <div className={styles.dateLabel}>Application Start</div>
                      <div className={styles.dateValue}>To be announced</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Predictor Widget */}
              <div className={`${styles.widgetCard} ${styles.widgetPredictor}`}>
                <h3 className={styles.widgetTitleWhite}>College Predictors</h3>
                <p className={styles.widgetTextWhite}>Know your admission chances in top engineering colleges based on your rank.</p>
                <button suppressHydrationWarning className={styles.btnWhite}>Use Predictor →</button>
              </div>

              {/* Latest News */}
              <div className={styles.widgetCard}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={styles.widgetTitle} style={{marginBottom: 0}}>Latest News</h3>
                  <a href="#" className="text-orange-500 text-sm font-bold">View All</a>
                </div>
                <div className={styles.newsList}>
                  {[
                    `${exam.name} 2025 registration expected to begin next week.`,
                    `NTA releases new guidelines for ${exam.name} aspirants.`,
                    'Top 10 preparation strategies by previous year toppers.'
                  ].map((news, i) => (
                    <div key={i} className={styles.newsItem}>
                      <p>{news}</p>
                      <span className={styles.newsTime}>{new Date().toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}