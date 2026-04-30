'use client';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { api, College } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from '@/components/ui/Toaster';
import styles from './Compare.module.css';

const formatFees = (fees: number) =>
  fees >= 100000 ? `₹${(fees / 100000).toFixed(1)}L` : `₹${fees.toLocaleString()}`;

function getBestIdx(values: number[], higher = true): number {
  if (values.length === 0) return -1;
  let bestIdx = 0;
  for (let i = 1; i < values.length; i++) {
    if (higher ? values[i] > values[bestIdx] : values[i] < values[bestIdx]) bestIdx = i;
  }
  return bestIdx;
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [compareName, setCompareName] = useState('');

  if (compareList.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyCard}>
            <div className="text-7xl mb-6">⚖️</div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Compare Colleges</h1>
            <p className="text-gray-600 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              You haven&apos;t added any colleges to compare yet. Choose up to 3 colleges to see their placement, fees, and rankings side-by-side.
            </p>
            <Link href="/colleges" className="inline-flex items-center px-10 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-xl shadow-brand-100 text-lg">
              Browse Colleges →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please login to save comparisons');
    if (!compareName.trim()) return toast.error('Please enter a name');
    
    setSaving(true);
    try {
      await api.saveComparison({ name: compareName, collegeIds: compareList.map(c => c.id) });
      toast.success('Comparison saved!');
      setCompareName('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const bestRating = getBestIdx(compareList.map(c => c.rating || 0), true);
  const bestPlacement = getBestIdx(compareList.map(c => c.placementPercent || 0), true);
  const bestPackage = getBestIdx(compareList.map(c => c.avgPackage || 0), true);
  const bestFees = getBestIdx(compareList.map(c => c.fees || 0), false);

  const rows = [
    { label: '📍 Location', values: compareList.map(c => `${c.city}, ${c.state}`), bestIdx: -1 },
    { label: '🏢 Type', values: compareList.map(c => c.ownership || 'Private'), bestIdx: -1 },
    { label: '📅 Established', values: compareList.map(c => String(c.established || 'N/A')), bestIdx: -1 },
    { label: '💰 Annual Fees', values: compareList.map(c => formatFees(c.fees)), bestIdx: bestFees },
    { label: '⭐ Rating', values: compareList.map(c => `${c.rating || 4.0}/5 (${c.totalReviews || 0} reviews)`), bestIdx: bestRating },
    { label: '📊 Placement %', values: compareList.map(c => `${c.placementPercent || 0}%`), bestIdx: bestPlacement },
    { label: '💼 Avg Package', values: compareList.map(c => `₹${c.avgPackage || 0} LPA`), bestIdx: bestPackage },
    { label: '🏆 NIRF Rank', values: compareList.map(c => c.nirfRank ? `#${c.nirfRank}` : 'N/A'), bestIdx: -1 },
    { label: '🎓 Accreditation', values: compareList.map(c => c.accreditation || 'UGC'), bestIdx: -1 },
    { label: '📜 NAAC Grade', values: compareList.map(c => c.naacGrade || 'N/A'), bestIdx: -1 },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <header className={styles.headerSection}>
          <div>
            <h1 className={styles.title}>Compare Colleges</h1>
            <p className={styles.subtitle}>Comparing {compareList.length} top institutions side-by-side</p>
          </div>
          <div className={styles.actions}>
            {isAuthenticated && (
              <div className={styles.saveBox}>
                <input 
                  type="text" 
                  placeholder="Name this comparison..." 
                  value={compareName}
                  onChange={e => setCompareName(e.target.value)}
                  className={styles.saveInput}
                />
                <button 
                  onClick={handleSave} 
                  disabled={saving || !compareName.trim()}
                  className={styles.saveBtn}
                >
                  {saving ? '...' : 'Save comparison'}
                </button>
              </div>
            )}
            <button onClick={clearCompare} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        </header>

        {/* Comparison Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className="bg-gray-900">
                <th className={styles.featureCol} style={{ backgroundColor: '#0f172a', color: '#94a3b8' }}>Comparison Parameter</th>
                {compareList.map(college => (
                  <th key={college.id} className={styles.collegeCol} style={{ backgroundColor: '#0f172a' }}>
                    <div className={styles.collegeHeader}>
                      <div>
                        <Link href={`/colleges/${college.slug}`} className={styles.collegeName} style={{ color: 'white' }}>
                          {college.name}
                        </Link>
                        <div className="text-gray-400 text-xs font-bold mt-2 uppercase tracking-widest">{college.city}</div>
                      </div>
                      <button onClick={() => removeFromCompare(college.id)} className={styles.removeBtn}>
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className={styles.labelCell}>{row.label}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className={styles.valueCell}>
                      <div className="flex items-center justify-between">
                        <span className={row.bestIdx === j ? 'text-brand-600 font-extrabold' : ''}>{val}</span>
                        {row.bestIdx === j && (
                          <span className="text-[9px] font-black bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full uppercase">Top Value</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Actions */}
        <div className={styles.addMoreArea}>
          {compareList.length < 3 && (
            <Link href="/colleges" className={styles.addMoreBtn}>
              <span>+</span> Add Another College to Compare
            </Link>
          )}
          <div className="mt-6">
            <Link href="/colleges" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
              ← Back to college listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
