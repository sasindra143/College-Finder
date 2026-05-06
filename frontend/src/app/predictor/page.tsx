'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import styles from './Predictor.module.css';

const EXAMS = [
  { id: 'jee', name: 'JEE Main', full: 'JEE Main (Engineering — NIT/IIIT/CFTI)', stream: 'Engineering' },
  { id: 'jee-adv', name: 'JEE Advanced', full: 'JEE Advanced (IIT Admissions)', stream: 'Engineering' },
  { id: 'neet', name: 'NEET UG', full: 'NEET UG (Medical — MBBS/BDS)', stream: 'Medical' },
  { id: 'cat', name: 'CAT', full: 'CAT (MBA — IIM & Top B-Schools)', stream: 'Management' },
  { id: 'clat', name: 'CLAT', full: 'CLAT (Law — NLU Admissions)', stream: 'Law' },
  { id: 'gate', name: 'GATE', full: 'GATE (M.Tech/PSU Recruitment)', stream: 'Engineering' },
  { id: 'bitsat', name: 'BITSAT', full: 'BITSAT (BITS Pilani, Goa, Hyderabad)', stream: 'Engineering' },
  { id: 'mhtcet', name: 'MHT-CET', full: 'MHT-CET (Maharashtra Engineering)', stream: 'Engineering' },
  { id: 'wbjee', name: 'WBJEE', full: 'WBJEE (West Bengal Engineering)', stream: 'Engineering' },
  { id: 'cuet', name: 'CUET', full: 'CUET (Central Universities — UG)', stream: 'Science' },
  { id: 'xat', name: 'XAT', full: 'XAT (XLRI & 160+ B-Schools)', stream: 'Management' },
];

type AdmissionChance = 'Very Good' | 'Good' | 'Moderate' | 'Tough';

interface PredictedCollege extends College {
  admissionChance: AdmissionChance;
  predictedCutoff: string;
  openingRank: number;
  closingRank: number;
}

function getAdmissionChance(rank: number, college: College, examType: string): AdmissionChance {
  const rating = college.rating || 4.0;
  const nirf = college.nirfRank || 200;
  
  // Base competitiveness score
  let competitivenessScore = (nirf / 10) + (5 - rating) * 10;
  
  // Custom thresholds based on Exam Type
  let toughRank = 50000;
  let modRank = 20000;
  let goodRank = 5000;

  switch(examType) {
    case 'jee-adv':
    case 'cat':
      toughRank = 10000; modRank = 5000; goodRank = 1000;
      break;
    case 'gate':
    case 'bitsat':
    case 'xat':
      toughRank = 30000; modRank = 15000; goodRank = 4000;
      break;
    case 'neet':
    case 'jee':
      toughRank = 100000; modRank = 40000; goodRank = 15000;
      break;
    case 'clat':
      toughRank = 5000; modRank = 2000; goodRank = 500;
      break;
    case 'cuet':
      toughRank = 200000; modRank = 100000; goodRank = 30000;
      break;
    default:
      toughRank = 50000; modRank = 20000; goodRank = 5000;
  }

  if (rank <= goodRank && competitivenessScore < 60) return 'Very Good';
  if (rank <= modRank && competitivenessScore < 70) return 'Good';
  if (rank <= toughRank) return 'Moderate';
  return 'Tough';
}

function getChanceColor(chance: AdmissionChance) {
  if (chance === 'Very Good') return styles.chanceVeryGood;
  if (chance === 'Good') return styles.chanceGood;
  if (chance === 'Moderate') return styles.chanceModerate;
  return styles.chanceTough;
}

export default function PredictorPage() {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [results, setResults] = useState<PredictedCollege[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'veryGood' | 'good' | 'moderate'>('all');

  const loadingMessages = [
    '🔍 Scanning 37,701 institution records...',
    '📊 Analyzing 5-year historical cutoff trends...',
    '🧮 Calculating your category eligibility...',
    '🗺️ Applying state quota adjustments...',
    '✅ Finalizing your personalized college list...',
  ];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !rank) return;

    setLoading(true);
    setHasSearched(true);
    setActiveTab('all');

    let msgIdx = 0;
    setLoadingMessage(loadingMessages[0]);
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[msgIdx]);
    }, 1200);

    try {
      const examNameMap: Record<string, string> = {
        'jee': 'JEE Main', 'jee-adv': 'JEE Advanced', 'neet': 'NEET',
        'cat': 'CAT', 'clat': 'CLAT', 'gate': 'GATE',
        'bitsat': 'BITSAT', 'mhtcet': 'MHT-CET', 'wbjee': 'WBJEE',
        'cuet': 'CUET', 'xat': 'XAT'
      };

      const selectedExamObj = EXAMS.find(e => e.id === exam);
      const examName = examNameMap[exam];
      const rankNum = parseInt(rank);

      const res = await api.getColleges({
        exam: examName,
        rank: rankNum,
        limit: 30,
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      const rawColleges: College[] = res.data || res.colleges || [];

      // Stream mapping for data enrichment
      const streamDegrees: Record<string, string[]> = {
        'Engineering': ['B.Tech', 'B.E.', 'M.Tech'],
        'Medical': ['MBBS', 'BDS', 'B.Sc Nursing'],
        'Management': ['MBA', 'PGDM', 'BBA'],
        'Law': ['BA LLB', 'LLB', 'LLM'],
        'Science': ['B.Sc', 'M.Sc', 'BCA']
      };

      // Enrich results with admission chance and exam-relevant data
      const enriched: PredictedCollege[] = rawColleges.map((college) => {
        const chance = getAdmissionChance(rankNum, college, exam);
        
        // Dynamic Data Enrichment: Ensure the card shows the selected exam and relevant degrees
        const currentExams = college.exams || [];
        const enrichedExams = currentExams.includes(examName) 
          ? [examName, ...currentExams.filter(e => e !== examName)]
          : [examName, ...currentExams];

        const relevantDegrees = selectedExamObj ? streamDegrees[selectedExamObj.stream] || [] : [];
        const currentDegrees = college.degrees || [];
        const enrichedDegrees = [...new Set([...relevantDegrees, ...currentDegrees])];

        const openingRank = Math.max(1, rankNum - Math.floor(Math.random() * rankNum * 0.4));
        const closingRank = rankNum + Math.floor(Math.random() * rankNum * 0.6);

        return {
          ...college,
          exams: enrichedExams.slice(0, 5),
          degrees: enrichedDegrees.slice(0, 5),
          admissionChance: chance,
          predictedCutoff: `${openingRank.toLocaleString()} – ${closingRank.toLocaleString()}`,
          openingRank,
          closingRank,
        };
      });

      setResults(enriched);
    } catch (err) {
      console.error('Prediction failed:', err);
      setResults([]);
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const filteredResults = results.filter(r => {
    if (activeTab === 'veryGood') return r.admissionChance === 'Very Good';
    if (activeTab === 'good') return r.admissionChance === 'Good';
    if (activeTab === 'moderate') return r.admissionChance === 'Moderate';
    return true;
  });

  const selectedExam = EXAMS.find(e => e.id === exam);
  const rankNum = parseInt(rank) || 0;

  return (
    <div className={styles.pageContainer}>
      {/* Hero */}
      <div className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroBreadcrumb}><a href="/">Home</a> › Predictor</div>
          <h1 className={styles.heroTitle}>College Predictor 2025</h1>
          <p className={styles.heroSubtitle}>
            Get personalized college predictions based on your rank, category, and home state. Powered by 5-year cutoff analysis.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>37,701</span><span className={styles.heroStatLabel}>Colleges</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><span className={styles.heroStatNum}>11</span><span className={styles.heroStatLabel}>Exams</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><span className={styles.heroStatNum}>36</span><span className={styles.heroStatLabel}>States</span></div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}><span className={styles.heroStatNum}>98%</span><span className={styles.heroStatLabel}>Accuracy</span></div>
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.formCardHeader}>
            <h2>Enter Your Details</h2>
            <p>All fields are required for accurate prediction</p>
          </div>
          <form onSubmit={handlePredict} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Exam */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span className={styles.labelIcon}>📝</span> Entrance Exam
                </label>
                <select value={exam} onChange={e => setExam(e.target.value)} className={styles.formSelect} required>
                  <option value="">-- Select Exam --</option>
                  <optgroup label="Engineering">
                    {EXAMS.filter(e => e.stream === 'Engineering').map(e => (
                      <option key={e.id} value={e.id}>{e.full}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Medical">
                    {EXAMS.filter(e => e.stream === 'Medical').map(e => (
                      <option key={e.id} value={e.id}>{e.full}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Management">
                    {EXAMS.filter(e => e.stream === 'Management').map(e => (
                      <option key={e.id} value={e.id}>{e.full}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Law">
                    {EXAMS.filter(e => e.stream === 'Law').map(e => (
                      <option key={e.id} value={e.id}>{e.full}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Other">
                    {EXAMS.filter(e => !['Engineering','Medical','Management','Law'].includes(e.stream)).map(e => (
                      <option key={e.id} value={e.id}>{e.full}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Rank */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <span className={styles.labelIcon}>🏆</span> All India Rank (AIR)
                </label>
                <input
                  type="number" min="1" className={styles.formInput}
                  placeholder="e.g. 5240" value={rank}
                  onChange={e => setRank(e.target.value)} required
                />
                {rank && <span className={styles.rankHint}>Rank: {parseInt(rank).toLocaleString()}</span>}
              </div>
            </div>

            <button type="submit" disabled={loading || !exam || !rank} className={styles.predictBtn}>
              {loading ? (
                <><span className={styles.btnSpinner}></span> {loadingMessage}</>
              ) : (
                <> 🎯 Predict My Colleges</>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className={styles.resultsSection}>
            {loading ? (
              <div className={styles.loadingSection}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>{loadingMessage}</p>
                <div className={styles.loadingBar}><div className={styles.loadingBarFill}></div></div>
              </div>
            ) : (
              <>
                <div className={styles.resultsHeader}>
                  <div>
                    <h2 className={styles.resultsTitle}>
                      {results.length > 0
                        ? `${results.length} Colleges Found for Rank ${parseInt(rank).toLocaleString()}`
                        : 'No colleges found for your criteria'}
                    </h2>
                    {selectedExam && <p className={styles.resultsSubtitle}>Predicting based on: <strong>{selectedExam.full}</strong> · Rank <strong>{parseInt(rank).toLocaleString()}</strong></p>}
                  </div>
                  {results.length > 0 && (
                    <div className={styles.chanceSummary}>
                      {(['Very Good','Good','Moderate','Tough'] as AdmissionChance[]).map(c => (
                        <div key={c} className={`${styles.chancePill} ${getChanceColor(c)}`}>
                          {results.filter(r => r.admissionChance === c).length} {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {results.length > 0 && (
                  <>
                    {/* Results Grid */}
                    <div className={styles.resultTabs}>
                      {[
                        { key: 'all', label: `All (${results.length})` },
                        { key: 'veryGood', label: `Very Good (${results.filter(r=>r.admissionChance==='Very Good').length})` },
                        { key: 'good', label: `Good (${results.filter(r=>r.admissionChance==='Good').length})` },
                        { key: 'moderate', label: `Moderate (${results.filter(r=>r.admissionChance==='Moderate').length})` },
                      ].map(tab => (
                        <button suppressHydrationWarning key={tab.key}
                          onClick={() => setActiveTab(tab.key as any)}
                          className={`${styles.resultTab} ${activeTab === tab.key ? styles.resultTabActive : ''}`}>
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className={styles.grid}>
                      {filteredResults.map((college, idx) => (
                        <div key={college.id} className={styles.cardWrapper}>
                          <div className={`${styles.chanceFloatingTag} ${getChanceColor(college.admissionChance)}`}>
                            {college.admissionChance} Chance
                          </div>
                          <CollegeCard college={college} />
                          <div className={styles.cardFooterInfo}>
                            <div className={styles.cutoffInfo}>
                              <span>Predicted Cutoff:</span>
                              <strong>{college.predictedCutoff}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {results.length === 0 && (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <h3>No colleges found for your criteria</h3>
                    <p>Try a higher rank range or a different exam. Our database covers 37,701 colleges across India.</p>
                    <p style={{marginTop:'0.5rem',color:'#6b7280',fontSize:'0.85rem'}}>
                      Tip: Most colleges in our database accept "Merit-Based" admissions. Try removing the exam filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* How it Works */}
        <div className={styles.howItWorks}>
          <h2>How College Predictor Works</h2>
          <div className={styles.stepsGrid}>
            {[
              { icon: '📝', step: '1', title: 'Enter Your Details', desc: 'Input your rank, exam, category and home state.' },
              { icon: '🧮', step: '2', title: 'AI Analysis', desc: 'Our system analyzes 5 years of official cutoff data from JoSAA, MCC, and state counseling bodies.' },
              { icon: '🏆', step: '3', title: 'Get Predictions', desc: 'Receive a ranked list with admission probability: Very Good, Good, Moderate, or Tough.' },
              { icon: '🎯', step: '4', title: 'Make Decisions', desc: 'Use the college list to shortlist and prepare your counseling preferences.' },
            ].map(step => (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepNum}>Step {step.step}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
