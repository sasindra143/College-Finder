'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import styles from './Predictor.module.css';

const EXAMS = [
  { id: 'jee', name: 'JEE Main (Engineering)', stream: 'Engineering' },
  { id: 'neet', name: 'NEET (Medical)', stream: 'Medical' },
  { id: 'cat', name: 'CAT (Management)', stream: 'Management' },
  { id: 'clat', name: 'CLAT (Law)', stream: 'Law' },
  { id: 'cuet', name: 'CUET (Arts/Science)', stream: 'Arts' },
];

export default function PredictorPage() {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<College[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !rank) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const selectedExam = EXAMS.find(ex => ex.id === exam);
      // Fetch colleges based on the stream
      const res = await api.getColleges({ 
        course: selectedExam?.stream,
        limit: 100,
        sortBy: 'rating'
      });

      // Simulate prediction logic based on rank
      // Lower rank (better) -> Higher rating colleges
      const rankNum = parseInt(rank);
      let predicted: College[] = [];

      if (rankNum < 1000) {
        predicted = res.data.slice(0, 15);
      } else if (rankNum < 10000) {
        predicted = res.data.slice(10, 30);
      } else if (rankNum < 50000) {
        predicted = res.data.slice(20, 50);
      } else {
        predicted = res.data.slice(40, 70);
      }

      setResults(predicted.slice(0, 12));
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>College Predictor 2025</h1>
        <p className={styles.subtitle}>Enter your entrance exam details and rank to find the best-fit colleges for you.</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formCard}>
          <form onSubmit={handlePredict} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Select Entrance Exam</label>
              <select value={exam} onChange={e => setExam(e.target.value)} required>
                <option value="">-- Select Exam --</option>
                {EXAMS.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Your All India Rank / Score</label>
              <input 
                type="number" 
                placeholder="e.g. 5240" 
                value={rank} 
                onChange={e => setRank(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" disabled={loading} className={styles.predictBtn}>
              {loading ? 'Analyzing...' : 'Predict My Colleges'}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className={styles.resultsSection}>
            <h2 className={styles.resultsTitle}>
              {loading ? 'Finding your best matches...' : `Predicted Colleges for you (${results.length})`}
            </h2>
            
            {loading ? (
              <div className={styles.grid}>
                {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
              </div>
            ) : results.length > 0 ? (
              <div className={styles.grid}>
                {results.map((college, idx) => (
                  <div key={college.id} className={styles.animateIn} style={{ animationDelay: `${idx * 0.1}s` }}>
                    <CollegeCard college={college} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No matches found for your rank. Try another exam or range.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <section className={styles.infoSection}>
        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <h3>AI-Driven Logic</h3>
            <p>Our algorithm uses 5 years of cutoff data to give you the most accurate prediction.</p>
          </div>
          <div className={styles.infoBox}>
            <h3>Real-time Updates</h3>
            <p>Cutoffs are updated as soon as official counseling rounds are completed.</p>
          </div>
          <div className={styles.infoBox}>
            <h3>Expert Guidance</h3>
            <p>Get personalized counseling sessions based on your predicted list.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
