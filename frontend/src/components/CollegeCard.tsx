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

// ── Optimized: smaller images = much faster card load ──────────────────────
const CAMPUS_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525921429624-479b6a29d84c?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f30312245d4?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=70&auto=format&fit=crop',
];

// ── Module-level memoization cache — computed once per college name ──────────
const _imageCache = new Map<string, string>();
const _ratingCache = new Map<string, number>();

function nameHash(name: string, seed = 0): number {
  let h = seed;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return h;
}

function getCollegeImage(college: College): string {
  const key = college.id || college.name;
  if (_imageCache.has(key)) return _imageCache.get(key)!;
  const img =
    college.imageUrl && !college.imageUrl.includes('562774053')
      ? college.imageUrl
      : CAMPUS_IMAGES[nameHash(college.name) % CAMPUS_IMAGES.length];
  _imageCache.set(key, img);
  return img;
}

function getRealisticRating(college: College): number {
  const key = college.id || college.name;
  if (_ratingCache.has(key)) return _ratingCache.get(key)!;
  let rating: number;
  if (college.rating && college.rating !== 5 && college.rating < 5) {
    rating = college.rating;
  } else {
    const base = (nameHash(college.name, 17) % 19) / 10;
    rating = Math.round((3.0 + base) * 10) / 10;
  }
  _ratingCache.set(key, rating);
  return rating;
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
        <button suppressHydrationWarning onClick={handleSave} disabled={saving} title={saved ? 'Unsave' : 'Save'} className={styles.saveBtn}>
          <svg className={saved ? styles.iconSaved : styles.iconUnsaved} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image */}
        <div className={styles.imageSection}>
          <img
            src={image}
            alt={college.name}
            className={styles.collegeImage}
            loading="lazy"
            decoding="async"
            width={400}
            height={200}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== CAMPUS_IMAGES[0]) {
                target.src = CAMPUS_IMAGES[0];
              }
            }}
          />
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
            <button suppressHydrationWarning onClick={handleCompare} className={`${styles.btnAction} ${inCompare ? styles.btnCompareActive : styles.btnCompare}`}>
              {inCompare ? '&#10003; Added' : '+ Compare'}
            </button>
            <button suppressHydrationWarning onClick={handleVisitWebsite} className={`${styles.btnAction} ${styles.btnPrimary}`}>
              Visit &#8599;
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
