'use client';
import Link from 'next/link';
import { College } from '@/lib/api';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useState } from 'react';
import { toast } from '@/components/ui/Toaster';
import styles from './CollegeCard.module.css';

interface Props { college: College; isSaved?: boolean; onSaveToggle?: () => void; }

const CAMPUS_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&q=80',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80',
];

// deterministic image based on college name so it's consistent
function getCollegeImage(college: College): string {
  if (college.imageUrl && !college.imageUrl.includes('562774053')) return college.imageUrl;
  const hash = college.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CAMPUS_IMAGES[hash % CAMPUS_IMAGES.length];
}

// Deterministic realistic rating (3.0 – 4.8)
function getRealisticRating(college: College): number {
  if (college.rating && college.rating !== 5 && college.rating < 5) return college.rating;
  const hash = college.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 17);
  const base = (hash % 19) / 10; // 0.0 – 1.8
  return Math.round((3.0 + base) * 10) / 10; // 3.0 – 4.8
}

const getOwnershipClass = (type?: string) => {
  if (!type) return styles.badgePrivate;
  if (type.toLowerCase().includes('government') || type.toLowerCase().includes('public')) return styles.badgeGovt;
  if (type.toLowerCase().includes('deemed')) return styles.badgeDeemed;
  return styles.badgePrivate;
};

export default function CollegeCard({ college, isSaved = false, onSaveToggle }: Props) {
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const inCompare = isInCompare(college.id);
  const rating = getRealisticRating(college);
  const image = getCollegeImage(college);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inCompare) { removeFromCompare(college.id); toast.info('Removed from compare'); }
    else if (!canAdd) { toast.error('Max 3 colleges for comparison'); }
    else { addToCompare(college); toast.success('Added to compare'); }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to save colleges'); return; }
    setSaving(true);
    try {
      if (saved) { await api.unsaveCollege(college.id); setSaved(false); toast.info('Removed from saved'); }
      else { await api.saveCollege(college.id); setSaved(true); toast.success('College saved!'); }
      onSaveToggle?.();
    } catch (err: any) { toast.error(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (college.website && college.website.startsWith('http')) {
      window.open(college.website, '_blank', 'noopener,noreferrer');
    } else {
      const q = encodeURIComponent(`${college.name} ${college.city} official website`);
      window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer');
    }
  };

  const formatFees = (fees: number) =>
    fees >= 100000 ? `\u20b9${(fees / 100000).toFixed(1)}L/yr` : `\u20b9${fees.toLocaleString()}/yr`;

  const topDegrees = (college.degrees || []).slice(0, 2);

  return (
    <Link href={`/colleges/${college.slug}`} className={styles.cardLink}>
      <div className={styles.cardContainer}>
        {/* Save Button */}
        <button onClick={handleSave} disabled={saving} title={saved ? 'Unsave' : 'Save'} className={styles.saveBtn}>
          <svg className={saved ? styles.iconSaved : styles.iconUnsaved} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image */}
        <div className={styles.imageSection}>
          <img src={image} alt={college.name} className={styles.collegeImage}
            onError={(e) => { (e.target as HTMLImageElement).src = CAMPUS_IMAGES[0]; }} />
          <div className={styles.imageOverlay} />
          <div className={styles.badgeContainer}>
            {college.nirfRank && <span className={`${styles.badge} ${styles.badgeNirf}`}>NIRF #{college.nirfRank}</span>}
            <span className={`${styles.badge} ${getOwnershipClass(college.ownership)}`}>{college.ownership || 'Private'}</span>
            {college.naacGrade && <span className={`${styles.badge} ${styles.badgeNaac}`}>NAAC {college.naacGrade}</span>}
          </div>
        </div>

        {/* Body */}
        <div className={styles.cardBody}>
          <h3 className={styles.collegeName}>{college.name}</h3>

          <p className={styles.locationText}>
            <svg className={styles.locationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {college.city}, {college.state}
          </p>

          {topDegrees.length > 0 && (
            <div className={styles.degreeTags}>
              {topDegrees.map((deg, i) => <span key={i} className={styles.degreeTag}>{deg}</span>)}
              {(college.degrees?.length || 0) > 2 && (
                <span className={styles.degreeTagMore}>+{(college.degrees?.length || 0) - 2}</span>
              )}
            </div>
          )}

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{formatFees(college.fees)}</div>
              <div className={styles.statLabel}>Fees/yr</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{rating}<span className={styles.starIcon}>&#9733;</span></div>
              <div className={styles.statLabel}>Rating</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{college.placementPercent || 75}%</div>
              <div className={styles.statLabel}>Placed</div>
            </div>
          </div>

          {college.affiliation && (
            <p className={styles.affiliationText}>&#127891; {college.affiliation}</p>
          )}

          <div className={styles.actionRow} onClick={e => e.preventDefault()}>
            <button onClick={handleCompare} className={`${styles.btnAction} ${inCompare ? styles.btnCompareActive : styles.btnCompare}`}>
              {inCompare ? '&#10003; Added' : '+ Compare'}
            </button>
            <button onClick={handleVisitWebsite} className={`${styles.btnAction} ${styles.btnPrimary}`}>
              Visit &#8599;
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
