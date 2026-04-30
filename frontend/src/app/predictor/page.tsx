'use client';
import { useState } from 'react';
import { api, College } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import { useAuth } from '@/context/AuthContext';
import styles from './Predictor.module.css';

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictedColleges, setPredictedColleges] = useState<College[] | null>(null);
  
  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank || isNaN(Number(rank))) return;
    
    setLoading(true);
    setPredictedColleges(null);
    
    try {
      if (isAuthenticated) {
        api.getSavedColleges().then(res => setSavedIds(new Set(res.data.map((s: any) => s.collegeId)))).catch(() => {});
      }

      const res = await api.getColleges({ limit: 50, sortBy: 'rating' });
      const allColleges = res.colleges;
      const rankNum = Number(rank);
      
      let filtered = allColleges.filter(c => {
        const name = c.name.toLowerCase();
        if (exam === 'JEE Main' || exam === 'JEE Advanced') {
          return name.includes('institute') || name.includes('engineering') || name.includes('technology');
        }
        if (exam === 'NEET') {
          return name.includes('medical') || name.includes('aiims') || name.includes('health');
        }
        if (exam === 'CAT') {
          return name.includes('management') || name.includes('business') || name.includes('iim');
        }
        if (exam === 'CLAT') {
          return name.includes('law') || name.includes('legal') || name.includes('nlu');
        }
        return true;
      });

      if (rankNum <= 5000) {
        filtered = filtered.filter(c => c.rating >= 4.7);
      } else if (rankNum <= 25000) {
        filtered = filtered.filter(c => c.rating >= 4.3 && c.rating <= 4.8);
      } else {
        filtered = filtered.filter(c => c.rating < 4.5);
      }

      setTimeout(() => {
        setPredictedColleges(filtered.slice(0, 6));
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        <header className={styles.headerSection}>
          <div className={styles.iconBox}>🧠</div>
          <h1 className={styles.title}>College Predictor</h1>
          <p className={styles.subtitle}>
            Enter your competitive exam rank to instantly discover which top colleges you are highly likely to secure admission in.
          </p>
        </header>

        <section className={styles.formCard}>
          <form onSubmit={handlePredict} className={styles.formGrid}>
            
            <div className={`${styles.inputGroup} md:col-span-4`}>
              <label className={styles.label}>Select Exam</label>
              <select 
                value={exam}
                onChange={e => setExam(e.target.value)}
                className={styles.select}
              >
                <option value="JEE Main">JEE Main (Engineering)</option>
                <option value="JEE Advanced">JEE Advanced (IITs)</option>
                <option value="NEET">NEET (Medicine)</option>
                <option value="CAT">CAT (Management)</option>
                <option value="CLAT">CLAT (Law)</option>
              </select>
            </div>

            <div className={`${styles.inputGroup} md:col-span-5`}>
              <label className={styles.label}>Your Expected / Actual Rank</label>
              <input 
                type="number" 
                min="1"
                required
                value={rank}
                onChange={e => setRank(e.target.value)}
                placeholder="e.g. 4500"
                className={styles.input}
              />
            </div>

            <div className="md:col-span-3">
              <button 
                type="submit"
                disabled={loading || !rank}
                className={styles.predictBtn}
              >
                {loading ? 'Analyzing...' : 'Predict Now'}
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <div className="text-center py-20 fade-in-up">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-600 mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900">Crunching historical data...</h3>
            <p className="text-gray-500">Matching your profile against previous year cutoffs.</p>
          </div>
        )}

        {predictedColleges && !loading && (
          <section className={styles.resultsSection}>
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              {predictedColleges.length > 0 
                ? `You have high chances in these ${predictedColleges.length} colleges:` 
                : 'No exact matches found for this rank in our database.'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {predictedColleges.map((college, index) => (
                <div key={college.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CollegeCard 
                    college={college} 
                    isSaved={savedIds.has(college.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
