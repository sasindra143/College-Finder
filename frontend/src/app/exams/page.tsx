'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Exam } from '@/lib/types';
import { toast } from '@/components/ui/Toaster';
import styles from './ExamsList.module.css';

const EXAM_STREAMS = ['All', 'Engineering', 'Medical', 'Management', 'Law', 'Design', 'Science'];
const EXAM_LEVELS = ['All Levels', 'National', 'State', 'University'];
const EXAM_MODES = ['All Modes', 'Online', 'Offline', 'Both'];

const STATIC_EXAMS = [
  { id: 's1', name: 'JEE Main 2025', slug: 'jee-main-2025', category: 'Engineering', level: 'National', mode: 'Online', regDate: 'Nov 2024', examDate: 'Jan & Apr 2025', fee: '₹1000', status: 'Active', description: 'Joint Entrance Examination for B.Tech admission to NITs, IIITs, CFTIs.', eligibility: '10+2 with PCM, 75% marks', conductedBy: 'NTA' },
  { id: 's2', name: 'NEET UG 2025', slug: 'neet-2025', category: 'Medical', level: 'National', mode: 'Offline', regDate: 'Feb 2025', examDate: 'May 2025', fee: '₹1700', status: 'Active', description: 'National Eligibility cum Entrance Test for MBBS/BDS/AYUSH admissions.', eligibility: '10+2 with PCB, 50% marks', conductedBy: 'NTA' },
  { id: 's3', name: 'CAT 2025', slug: 'cat-2025', category: 'Management', level: 'National', mode: 'Online', regDate: 'Aug 2025', examDate: 'Nov 2025', fee: '₹2400', status: 'Upcoming', description: 'Common Admission Test for MBA/PGDM programs at IIMs and top B-schools.', eligibility: "Bachelor's degree with 50% marks", conductedBy: 'IIMs' },
  { id: 's4', name: 'CLAT 2025', slug: 'clat-2025', category: 'Law', level: 'National', mode: 'Online', regDate: 'Jul 2024', examDate: 'Dec 2024', fee: '₹4000', status: 'Upcoming', description: 'Common Law Admission Test for admission to 22 NLUs across India.', eligibility: '10+2 with 45% marks', conductedBy: 'Consortium of NLUs' },
  { id: 's5', name: 'GATE 2025', slug: 'gate-2025', category: 'Engineering', level: 'National', mode: 'Online', regDate: 'Aug 2024', examDate: 'Feb 2025', fee: '₹1800', status: 'Active', description: 'Graduate Aptitude Test in Engineering for M.Tech and PSU recruitment.', eligibility: 'B.Tech/B.E. or equivalent', conductedBy: 'IIT Roorkee' },
  { id: 's6', name: 'BITSAT 2025', slug: 'bitsat-2025', category: 'Engineering', level: 'University', mode: 'Online', regDate: 'Jan 2025', examDate: 'May 2025', fee: '₹3400', status: 'Active', description: 'Birla Institute of Technology Science Admission Test for BITS campuses.', eligibility: '10+2 with PCM, 75% marks', conductedBy: 'BITS Pilani' },
  { id: 's7', name: 'WBJEE 2025', slug: 'wbjee-2025', category: 'Engineering', level: 'State', mode: 'Offline', regDate: 'Dec 2024', examDate: 'Apr 2025', fee: '₹700', status: 'Active', description: 'West Bengal Joint Entrance Exam for engineering/pharmacy in West Bengal.', eligibility: '10+2 with PCM', conductedBy: 'WBJEE Board' },
  { id: 's8', name: 'MHT-CET 2025', slug: 'mht-cet-2025', category: 'Engineering', level: 'State', mode: 'Online', regDate: 'Jan 2025', examDate: 'May 2025', fee: '₹800', status: 'Active', description: 'Maharashtra Common Entrance Test for engineering/pharmacy admissions.', eligibility: '10+2 with PCM', conductedBy: 'State CET Cell, Maharashtra' },
  { id: 's9', name: 'AIAPGET 2025', slug: 'aiapget-2025', category: 'Medical', level: 'National', mode: 'Online', regDate: 'Jun 2025', examDate: 'Aug 2025', fee: '₹2000', status: 'Upcoming', description: 'All India Ayush Post Graduate Entrance Test for PG Ayush courses.', eligibility: 'BAMS/BHMS/BUMS degree', conductedBy: 'NTA' },
  { id: 's10', name: 'XAT 2025', slug: 'xat-2025', category: 'Management', level: 'National', mode: 'Online', regDate: 'Jul 2024', examDate: 'Jan 2025', fee: '₹2100', status: 'Active', description: 'Xavier Aptitude Test for admission to XLRI, XIM and 160+ MBA institutes.', eligibility: "Bachelor's degree", conductedBy: 'XLRI Jamshedpur' },
  { id: 's11', name: 'SNAP 2025', slug: 'snap-2025', category: 'Management', level: 'University', mode: 'Online', regDate: 'Aug 2025', examDate: 'Dec 2025', fee: '₹1950', status: 'Upcoming', description: 'Symbiosis National Aptitude Test for Symbiosis institutes MBA programs.', eligibility: "Bachelor's degree with 50% marks", conductedBy: 'Symbiosis International University' },
  { id: 's12', name: 'CUCET 2025', slug: 'cucet-2025', category: 'Science', level: 'National', mode: 'Online', regDate: 'Mar 2025', examDate: 'May 2025', fee: '₹650', status: 'Active', description: 'Central Universities Common Entrance Test for admission to central universities.', eligibility: '10+2 pass', conductedBy: 'NTA' },
];

export default function ExamsList() {
  const [exams, setExams] = useState<any[]>(STATIC_EXAMS);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [mode, setMode] = useState('All Modes');
  const [search, setSearch] = useState('');
  const [apiExams, setApiExams] = useState<any[]>([]);

  useEffect(() => {
    api.getExams().then(res => {
      if (res?.data?.length > 0) setApiExams(res.data);
    }).catch(() => {});
  }, []);

  const allExams = [...STATIC_EXAMS, ...apiExams.filter(a => !STATIC_EXAMS.find(s => s.slug === a.slug))];

  const filtered = allExams.filter(ex => {
    if (stream !== 'All' && ex.category !== stream) return false;
    if (level !== 'All Levels' && ex.level !== level) return false;
    if (mode !== 'All Modes' && ex.mode !== mode) return false;
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Active') return styles.statusActive;
    if (status === 'Upcoming') return styles.statusUpcoming;
    return styles.statusClosed;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBreadcrumb}><a href="/">Home</a> › Exams</div>
          <h1 className={styles.title}>Entrance Exams in India 2025</h1>
          <p className={styles.subtitle}>Latest updates on {allExams.length}+ entrance exams — dates, syllabus, eligibility & results</p>
          <div className={styles.searchBox}>
            <svg width="18" height="18" fill="none" stroke="#666" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input suppressHydrationWarning type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams e.g. JEE Main, NEET, CAT..." className={styles.searchInput} />
            {search && <button onClick={() => setSearch('')} className={styles.searchClear}>✕</button>}
          </div>
          <div className={styles.heroStats}>
            <span>📝 {allExams.length}+ Exams Listed</span>
            <span>🔥 {allExams.filter(e => e.status === 'Active').length} Currently Active</span>
            <span>🏛️ National & State Level</span>
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Stream</label>
            <div className={styles.filterTabs}>
              {EXAM_STREAMS.map(s => (
                <button suppressHydrationWarning key={s} onClick={() => setStream(s)}
                  className={`${styles.filterTab} ${stream === s ? styles.filterTabActive : ''}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className={styles.filterRight}>
            <select suppressHydrationWarning value={level} onChange={e => setLevel(e.target.value)} className={styles.filterSelect}>
              {EXAM_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select suppressHydrationWarning value={mode} onChange={e => setMode(e.target.value)} className={styles.filterSelect}>
              {EXAM_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.contentLayout}>
          {/* Main Exam List */}
          <div className={styles.leftCol}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}><strong>{filtered.length}</strong> Exams Found</span>
              {(stream !== 'All' || search) && (
                <button suppressHydrationWarning onClick={() => { setStream('All'); setSearch(''); setLevel('All Levels'); setMode('All Modes'); }} className={styles.clearFilters}>Clear Filters ✕</button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📋</div>
                <p>No exams found. Try changing your filters.</p>
                <button suppressHydrationWarning onClick={() => { setStream('All'); setSearch(''); }} className={styles.seedBtn}>Show All Exams</button>
              </div>
            ) : (
              <div className={styles.examsList}>
                {filtered.map(exam => (
                  <div key={exam.id || exam.slug} className={styles.examCard}>
                    <div className={styles.examCardLeft}>
                      <div className={styles.examTopRow}>
                        <span className={`${styles.examCategory} ${styles[`cat${exam.category?.replace(/\s/g,'')}`] || ''}`}>{exam.category}</span>
                        <span className={`${styles.examStatus} ${getStatusColor(exam.status || 'Active')}`}>{exam.status || 'Active'}</span>
                        {exam.level && <span className={styles.examLevel}>{exam.level}</span>}
                      </div>
                      <h2 className={styles.examName}><Link href={`/exams/${exam.slug}`}>{exam.name}</Link></h2>
                      <p className={styles.examDesc}>{exam.description}</p>

                      <div className={styles.examMetaGrid}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaIcon}>📅</span>
                          <div>
                            <div className={styles.metaLabel}>Exam Date</div>
                            <div className={styles.metaValue}>{exam.examDate || exam.dates?.[0]?.date || 'To be announced'}</div>
                          </div>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaIcon}>📝</span>
                          <div>
                            <div className={styles.metaLabel}>Registration</div>
                            <div className={styles.metaValue}>{exam.regDate || 'Check Official Site'}</div>
                          </div>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaIcon}>💻</span>
                          <div>
                            <div className={styles.metaLabel}>Mode</div>
                            <div className={styles.metaValue}>{exam.mode || 'Online'}</div>
                          </div>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaIcon}>💰</span>
                          <div>
                            <div className={styles.metaLabel}>App. Fee</div>
                            <div className={styles.metaValue}>{exam.fee || 'Varies'}</div>
                          </div>
                        </div>
                      </div>

                      {exam.eligibility && (
                        <div className={styles.eligibilityRow}>
                          <span className={styles.eligibilityLabel}>Eligibility:</span>
                          <span className={styles.eligibilityText}>{exam.eligibility}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.examCardRight}>
                      {exam.conductedBy && (
                        <div className={styles.conductedBy}>
                          <div className={styles.conductedLabel}>Conducted By</div>
                          <div className={styles.conductedValue}>{exam.conductedBy}</div>
                        </div>
                      )}
                      <div className={styles.examActions}>
                        <Link href={`/exams/${exam.slug}`} className={styles.viewBtn}>Full Details →</Link>
                        <Link href="/predictor" className={styles.predictBtn}>Predict Colleges</Link>
                      </div>
                      <div className={styles.examQuickLinks}>
                        <span>📄 Syllabus</span>
                        <span>📋 Question Papers</span>
                        <span>📊 Cutoff</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3>🎯 Quick Links</h3>
              <ul className={styles.quickLinkList}>
                <li><Link href="/predictor">🏫 College Predictor</Link></li>
                <li><Link href="/colleges">🔍 Explore Colleges</Link></li>
                <li><Link href="/compare">⚖️ Compare Colleges</Link></li>
                <li><Link href="/qa">💬 Ask an Expert</Link></li>
              </ul>
            </div>
            <div className={styles.sidebarCard}>
              <h3>📅 Upcoming Deadlines</h3>
              <ul className={styles.deadlineList}>
                <li><span className={styles.deadlineExam}>JEE Main</span><span className={styles.deadlineDate}>Jan 2025</span></li>
                <li><span className={styles.deadlineExam}>NEET UG</span><span className={styles.deadlineDate}>May 2025</span></li>
                <li><span className={styles.deadlineExam}>CAT</span><span className={styles.deadlineDate}>Nov 2025</span></li>
                <li><span className={styles.deadlineExam}>GATE</span><span className={styles.deadlineDate}>Feb 2025</span></li>
              </ul>
            </div>
            <div className={styles.sidebarCard}>
              <h3>🏆 Top Colleges</h3>
              <div className={styles.topCollegeList}>
                {['IIT Bombay', 'AIIMS Delhi', 'IIM Ahmedabad', 'NLS Bangalore', 'BITS Pilani'].map((c, i) => (
                  <div key={c} className={styles.topCollegeItem}>
                    <span className={styles.topCollegeRank}>#{i+1}</span>
                    <span className={styles.topCollegeName}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
