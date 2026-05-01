'use client';
import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import styles from './CollegesPage.module.css';

// ✅ ADD THIS
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Puducherry',
].sort();

const POPULAR_COURSES = [
  { label: 'B.Tech / Engineering', value: 'Engineering' },
  { label: 'MBA / Management', value: 'Management' },
  { label: 'MBBS / Medical', value: 'Medical' },
  { label: 'Pharmacy', value: 'Pharmacy' },
  { label: 'Law / LLB', value: 'Law' },
  { label: 'Education / B.Ed', value: 'Education' },
  { label: 'Arts & Humanities', value: 'Arts' },
  { label: 'Commerce', value: 'Commerce' },
  { label: 'Science', value: 'Science' },
];

function CollegesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    ownership: searchParams.get('ownership') || '',
    course: '',
    minRating: '',
    maxFees: '',
    sortBy: 'rating',
    sortOrder: 'desc' as 'asc' | 'desc',
    page: 1,
  });

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.getColleges({
        search,
        location: filters.location,
        ownership: filters.ownership,
        course: filters.course,
        minRating: filters.minRating ? Number(filters.minRating) : undefined,
        maxFees: filters.maxFees ? Number(filters.maxFees) : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: filters.page,
        limit: 12,
      });

      console.log("🔥 API DATA:", res);

      setColleges(res?.data || res?.colleges || []);
      setPagination(res?.pagination || null);
      setError(null);
    } catch (err) {
      console.error("❌ Failed:", err);
      setError("Backend not reachable");
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    const timer = setTimeout(fetchColleges, 350);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearAll = () => {
    setSearch('');
    setFilters({ location: '', ownership: '', course: '', minRating: '', maxFees: '', sortBy: 'rating', sortOrder: 'desc', page: 1 });
  };

  const hasFilters = search || filters.location || filters.ownership || filters.course || filters.minRating || filters.maxFees;

  const activeChips = [
    ...(search ? [{ label: `"${search}"`, key: 'search' }] : []),
    ...(filters.location ? [{ label: filters.location, key: 'location' }] : []),
    ...(filters.ownership ? [{ label: filters.ownership, key: 'ownership' }] : []),
    ...(filters.course ? [{ label: POPULAR_COURSES.find(c => c.value === filters.course)?.label || filters.course, key: 'course' }] : []),
    ...(filters.minRating ? [{ label: `${filters.minRating}★+`, key: 'minRating' }] : []),
    ...(filters.maxFees && Number(filters.maxFees) < 3000000 ? [{ label: `Up to ₹${(Number(filters.maxFees) / 100000).toFixed(0)}L`, key: 'maxFees' }] : []),
  ];

  const removeChip = (key: string) => {
    if (key === 'search') setSearch('');
    else updateFilter(key, '');
  };

  const filterContent = (
    <div className={styles.filterBody}>
      {/* Search */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Search</label>
        <div className={styles.searchInputWrapper}>
          <svg className={styles.searchInputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setFilters(f => ({ ...f, page: 1 })); }}
            placeholder="College name, city..."
            className={styles.filterInputWithIcon}
            suppressHydrationWarning
          />
        </div>
      </div>

      {/* Course Filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Course / Stream</label>
        <div className={styles.courseChips}>
          {POPULAR_COURSES.map(c => (
            <button
              key={c.value}
              onClick={() => updateFilter('course', filters.course === c.value ? '' : c.value)}
              className={`${styles.courseChip} ${filters.course === c.value ? styles.courseChipActive : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* State */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>State</label>
        <select
          value={filters.location}
          onChange={e => updateFilter('location', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All States</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Ownership */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>College Type</label>
        <div className={styles.typeButtonGroup}>
          {['', 'Government', 'Private', 'Deemed'].map(type => (
            <button
              key={type}
              onClick={() => updateFilter('ownership', type)}
              className={`${styles.typeBtn} ${
                filters.ownership === type
                  ? styles.typeBtnActive
                  : styles.typeBtnDefault
              }`}
            >
              {type || 'All Types'}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Min Rating</label>
        <div className={styles.ratingButtons}>
          {['', '4.5', '4.0', '3.5', '3.0'].map(r => (
            <button
              key={r}
              onClick={() => updateFilter('minRating', r)}
              className={`${styles.ratingBtn} ${filters.minRating === r ? styles.ratingBtnActive : ''}`}
            >
              {r ? `${r}★+` : 'Any'}
            </button>
          ))}
        </div>
      </div>

      {/* Max Fees */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          Max Fees/Year
          {filters.maxFees && Number(filters.maxFees) < 3000000 && (
            <span className={styles.feesValue}> · ₹{(Number(filters.maxFees) / 100000).toFixed(0)}L</span>
          )}
        </label>
        <input
          type="range"
          min={50000}
          max={3000000}
          step={50000}
          value={filters.maxFees || 3000000}
          onChange={e => updateFilter('maxFees', e.target.value)}
          className={styles.rangeInput}
          suppressHydrationWarning
        />
        <div className={styles.rangeLabels}>
          <span>₹50K</span><span>₹30L</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>Colleges</span>
          </div>
          <h1 className={styles.pageTitle}>
            {search
              ? <>Results for <span className={styles.pageTitleHighlight}>"{search}"</span></>
              : filters.location
              ? <>Colleges in <span className={styles.pageTitleHighlight}>{filters.location}</span></>
              : filters.course
              ? <><span className={styles.pageTitleHighlight}>{POPULAR_COURSES.find(c => c.value === filters.course)?.label}</span> Colleges in India</>
              : 'Top Colleges in India 2025'}
          </h1>
          <p className={styles.pageSubtitle}>
            Explore {pagination?.total?.toLocaleString() || '37,701+'} verified institutions across India
          </p>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className={styles.activeChips}>
              {activeChips.map(chip => (
                <button
                  key={chip.key}
                  onClick={() => removeChip(chip.key)}
                  className={styles.activeChip}
                >
                  {chip.label}
                  <span className={styles.chipRemove}>×</span>
                </button>
              ))}
              <button onClick={clearAll} className={styles.clearAllChip}>
                Clear All ×
              </button>
            </div>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className={styles.mobileFilterBar}>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={styles.mobileFilterBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
            </svg>
            Filters {hasFilters && <span className={styles.filterBadge}>{activeChips.length}</span>}
          </button>
          <select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={e => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              setFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
            }}
            className={styles.sortSelect}
          >
            <option value="rating:desc">Top Rated</option>
            <option value="fees:asc">Fees: Low → High</option>
            <option value="fees:desc">Fees: High → Low</option>
            <option value="placementPercent:desc">Best Placements</option>
            <option value="name:asc">Name: A → Z</option>
            <option value="established:asc">Oldest First</option>
          </select>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className={styles.mobileDrawerOverlay} onClick={() => setMobileFiltersOpen(false)}>
            <div className={styles.mobileDrawer} onClick={e => e.stopPropagation()}>
              <div className={styles.mobileDrawerHeader}>
                <h3>Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className={styles.mobileDrawerClose}>✕</button>
              </div>
              {filterContent}
              <div className={styles.mobileDrawerActions}>
                <button onClick={clearAll} className={styles.mobileDrawerClear}>Clear All</button>
                <button onClick={() => setMobileFiltersOpen(false)} className={styles.mobileDrawerApply}>
                  View {pagination?.total?.toLocaleString() || ''} Results
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.layoutGrid}>

          {/* ── Sidebar Filters ── */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <h2 className={styles.filterTitle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{display:'inline',marginRight:'6px',verticalAlign:'middle'}}>
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                  </svg>
                  Filters
                </h2>
                {hasFilters && (
                  <button onClick={clearAll} className={styles.clearBtn}>
                    Clear All
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className={styles.mainContent}>
            {/* Count + Sort bar */}
            <div className={styles.topBar}>
              <p className={styles.resultCount}>
                <span className={styles.resultCountHighlight}>{pagination?.total?.toLocaleString() || 0}</span> Institutions Found
              </p>
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={e => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  setFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
                }}
                className={styles.sortSelect}
              >
                <option value="rating:desc">Sort: Top Rated</option>
                <option value="fees:asc">Sort: Fees (Low → High)</option>
                <option value="fees:desc">Sort: Fees (High → Low)</option>
                <option value="placementPercent:desc">Sort: Best Placements</option>
                <option value="name:asc">Sort: Name (A → Z)</option>
                <option value="established:asc">Sort: Oldest First</option>
              </select>
            </div>

            {loading ? (
              <div className={styles.gridContainer}>
                {[1,2,3,4,5,6,7,8,9].map(i => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImg} />
                    <div className={styles.skeletonBody}>
                      <div className={styles.skeletonLine} style={{width:'80%'}} />
                      <div className={styles.skeletonLine} style={{width:'50%', height:'10px'}} />
                      <div className={styles.skeletonStats} />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon} style={{color: '#ef4444'}}>⚠️</div>
                <h3 className={styles.emptyTitle}>Connection Error</h3>
                <p className={styles.emptyText}>{error}</p>
                <div className="flex gap-4 mt-6">
                  <button onClick={fetchColleges} className={styles.emptyBtn}>
                    Try Again
                  </button>
                  <button onClick={clearAll} className={styles.emptyBtn} style={{backgroundColor:'#f1f5f9', color:'#64748b', border:'1px solid #e2e8f0'}}>
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : colleges.length > 0 ? (
              <>
                <div className={styles.gridContainer}>
                  {colleges.map(college => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className={styles.paginationWrapper}>
                    <div className={styles.pagination}>
                      <button
                        disabled={!pagination.hasPrev}
                        onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                        className={styles.navBtn}
                      >
                        ← Prev
                      </button>
                      <div className={styles.pageNumbers}>
                        {(() => {
                          const pages: number[] = [];
                          const current = pagination.page;
                          const total = pagination.totalPages;
                          if (current > 3) { pages.push(1); if (current > 4) pages.push(-1); }
                          for (let p = Math.max(1, current - 2); p <= Math.min(total, current + 2); p++) pages.push(p);
                          if (current < total - 2) { if (current < total - 3) pages.push(-1); pages.push(total); }
                          return pages.map((p, i) => p === -1
                            ? <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
                            : (
                              <button
                                key={p}
                                onClick={() => setFilters(f => ({ ...f, page: p }))}
                                className={`${styles.pageBtn} ${p === current ? styles.pageBtnActive : styles.pageBtnDefault}`}
                              >
                                {p}
                              </button>
                            )
                          );
                        })()}
                      </div>
                      <button
                        disabled={!pagination.hasNext}
                        onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                        className={styles.navBtn}
                      >
                        Next →
                      </button>
                    </div>
                    <p className={styles.paginationInfo}>
                      Page {pagination.page} of {pagination.totalPages} · {pagination.total.toLocaleString()} results
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No colleges found</h3>
                <p className={styles.emptyText}>Try removing some filters or searching for something else.</p>
                <button onClick={clearAll} className={styles.emptyBtn}>
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">Loading colleges...</div>}>
      <CollegesList />
    </Suspense>
  );
}