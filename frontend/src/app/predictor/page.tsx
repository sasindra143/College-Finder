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
  const [loadingMessage, setLoadingMessage] = useState('Analyzing...');
  const [results, setResults] = useState<College[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const loadingMessages = [
    'Scanning 100,000+ institution records...',
    'Analyzing historical cutoff trends...',
    'Calculating your eligibility...',
    'Finding best-fit matches for you...',
    'Finalizing results...'
  ];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !rank) return;

    setLoading(true);
    setHasSearched(true);
    
    // Cycle through loading messages
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[msgIdx]);
    }, 1500);

    try {
      const selectedExam = EXAMS.find(ex => ex.id === exam);
      
      // Map exam IDs to actual names used in DB
      const examNameMap: Record<string, string> = {
        'jee': 'JEE Main',
        'neet': 'NEET',
        'cat': 'CAT',
        'clat': 'CLAT',
        'cuet': 'CUET'
      };

      // Fetch colleges based on the exam and rank
      const res = await api.getColleges({ 
        exam: examNameMap[exam] || selectedExam?.name,
        rank: rank ? parseInt(rank) : 0,
        limit: 12,
        sortBy: 'rating'
      });

      // The backend returns results in res.data
      setResults(res.data || []);
    } catch (err) {
      console.error('Prediction failed:', err);
      setResults([]);
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>College Predictor 2025</h1>
        <p className={styles.subtitle}>Our AI-powered engine analyzes your rank against millions of data points to find your perfect institution.</p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.formCard}>
          <form onSubmit={handlePredict} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Entrance Exam</label>
                <select value={exam} onChange={e => setExam(e.target.value)} required>
                  <option value="">-- Select Exam --</option>
                  {EXAMS.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Your Category</label>
                <select defaultValue="General" required>
                  <option value="General">General</option>
                  <option value="OBC">OBC-NCL</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Home State</label>
                <select defaultValue="Delhi">
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>All India Rank</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5240" 
                  value={rank} 
                  onChange={e => setRank(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className={styles.predictBtn}>
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  {loadingMessage}
                </>
              ) : 'Predict My Colleges'}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className={styles.resultsSection}>
            <h2 className={styles.resultsTitle}>
              {loading ? loadingMessage : `Your Recommended Colleges (${results?.length || 0})`}
            </h2>
            
            {loading ? (
              <div className={styles.grid}>
                {[1,2,3,4,5,6].map(i => <div key={i} className={styles.skeleton} />)}
              </div>
            ) : (results?.length || 0) > 0 ? (
              <div className={styles.grid}>
                {results?.map((college, idx) => (
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
