'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import Link from 'next/link';
import styles from './CollegesPage.module.css';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
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

const FEE_RANGES = [
  { label: 'Under ₹1L', value: '100000' },
  { label: '₹1L – ₹3L', value: '300000' },
  { label: '₹3L – ₹5L', value: '500000' },
  { label: '₹5L – ₹10L', value: '1000000' },
  { label: '₹10L+', value: '3000000' },
];

function CollegesList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [heroSearch, setHeroSearch] = useState(searchParams?.get('search') || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{
    location: string[];
    ownership: string[];
    course: string[];
    exam: string[];
    minRating: string;
    maxFees: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
  }>({
    location: searchParams?.get('location') ? searchParams.get('location')!.split(',') : [],
    ownership: searchParams?.get('ownership') ? searchParams.get('ownership')!.split(',') : [],
    course: [],
    exam: searchParams?.get('exam') ? searchParams.get('exam')!.split(',') : [],
    minRating: '',
    maxFees: '',
    sortBy: 'rating',
    sortOrder: 'desc',
    page: 1,
  });

  const [activeFilters, setActiveFilters] = useState(filters);
  const [activeSearch, setActiveSearch] = useState(search);

  const applyFilters = useCallback(
    (pageOverride?: number) => {
      setActiveFilters({ ...filters, page: pageOverride ?? 1 });
      if (pageOverride === undefined) setFilters(prev => ({ ...prev, page: 1 }));
      setActiveSearch(search);
      setMobileFiltersOpen(false);
    },
    [filters, search],
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(heroSearch);
    setActiveSearch(heroSearch);
    setActiveFilters(prev => ({ ...prev, page: 1 }));
  };

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.getColleges({
        search: activeSearch,
        location: activeFilters.location.join(','),
        ownership: activeFilters.ownership.join(','),
        course: activeFilters.course.join(','),
        exam: activeFilters.exam.join(','),
        minRating: activeFilters.minRating ? Number(activeFilters.minRating) : undefined,
        maxFees: activeFilters.maxFees ? Number(activeFilters.maxFees) : undefined,
        sortBy: activeFilters.sortBy,
        sortOrder: activeFilters.sortOrder,
        page: activeFilters.page,
        limit: 12,
      });
      setColleges(res?.data || res?.colleges || []);
      setPagination(res?.pagination || null);
      setError(null);
    } catch {
      setError('Backend not reachable');
    } finally {
      setLoading(false);
    }
  }, [activeSearch, activeFilters]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const updateFilter = (key: string, value: any) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const toggleArrayFilter = (
    key: 'location' | 'ownership' | 'course' | 'exam',
    value: string,
  ) => {
    // Update the stored filters state
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
    // Immediately reflect the change in activeFilters to trigger fetch
    setActiveFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated, page: 1 };
    });
  };

  const clearAll = () => {
    const empty = {
      location: [],
      ownership: [],
      course: [],
      exam: [],
      minRating: '',
      maxFees: '',
      sortBy: 'rating',
      sortOrder: 'desc' as const,
      page: 1,
    };
    setSearch('');
    setHeroSearch('');
    setFilters(empty);
    setActiveSearch('');
    setActiveFilters(empty);
    router.push('/colleges');
  };

  const removeChip = (chip: any) => {
    const newFilters = { ...activeFilters };
    let newSearch = activeSearch;
    if (chip.type === 'search') {
      newSearch = '';
      setHeroSearch('');
    } else if (['location', 'ownership', 'course', 'exam'].includes(chip.type)) {
      (newFilters as any)[chip.type] = (newFilters as any)[chip.type].filter(
        (v: string) => v !== chip.value,
      );
    } else {
      (newFilters as any)[chip.type] = '';
    }
    newFilters.page = 1;
    setFilters(newFilters);
    setSearch(newSearch);
    setActiveFilters(newFilters);
    setActiveSearch(newSearch);
  };

  const activeChips = [
    ...(activeSearch ? [{ label: `"${activeSearch}"`, type: 'search', value: activeSearch }] : []),
    ...activeFilters.location.map(loc => ({ label: loc, type: 'location', value: loc })),
    ...activeFilters.ownership.map(own => ({ label: own, type: 'ownership', value: own })),
    ...activeFilters.course.map(c => ({
      label: POPULAR_COURSES.find(pc => pc.value === c)?.label || c,
      type: 'course',
      value: c,
    })),
    ...activeFilters.exam.map(e => ({ label: e, type: 'exam', value: e })),
    ...(activeFilters.minRating
      ? [{ label: `${activeFilters.minRating}★+`, type: 'minRating', value: activeFilters.minRating }]
      : []),
    ...(activeFilters.maxFees && Number(activeFilters.maxFees) < 3000000
      ? [
          {
            label: `Up to ₹${(Number(activeFilters.maxFees) / 100000).toFixed(0)}L`,
            type: 'maxFees',
            value: activeFilters.maxFees,
          },
        ]
      : []),
  ];

  const hasPendingChanges =
    search !== activeSearch ||
    JSON.stringify(filters.location) !== JSON.stringify(activeFilters.location) ||
    JSON.stringify(filters.ownership) !== JSON.stringify(activeFilters.ownership) ||
    JSON.stringify(filters.course) !== JSON.stringify(activeFilters.course) ||
    JSON.stringify(filters.exam) !== JSON.stringify(activeFilters.exam) ||
    filters.minRating !== activeFilters.minRating ||
    filters.maxFees !== activeFilters.maxFees ||
    filters.sortBy !== activeFilters.sortBy ||
    filters.sortOrder !== activeFilters.sortOrder;

  const filterContent = (
    <div className={styles.filterBody}>
      {/* Course */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Course / Stream</label>
        <div className={styles.courseChips}>
          {POPULAR_COURSES.map(c => (
            <button
              suppressHydrationWarning
              key={c.value}
              onClick={() => toggleArrayFilter('course', c.value)}
              className={`${styles.courseChip} ${filters.course.includes(c.value) ? styles.courseChipActive : ''}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fees */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Max Fees / Year</label>
        <div className={styles.courseChips}>
          {FEE_RANGES.map(f => (
            <button
              suppressHydrationWarning
              key={f.value}
              onClick={() => updateFilter('maxFees', filters.maxFees === f.value ? '' : f.value)}
              className={`${styles.courseChip} ${filters.maxFees === f.value ? styles.courseChipActive : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* State */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>State / Location</label>
        <select
          suppressHydrationWarning
          value=""
          onChange={e => {
            if (e.target.value && !filters.location.includes(e.target.value))
              toggleArrayFilter('location', e.target.value);
          }}
          className={styles.filterSelect}
        >
          <option value="">Select State...</option>
          {INDIAN_STATES.filter(s => !filters.location.includes(s)).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className={styles.courseChips} style={{ marginTop: '8px' }}>
          {filters.location.map(loc => (
            <button
              suppressHydrationWarning
              key={loc}
              onClick={() => toggleArrayFilter('location', loc)}
              className={`${styles.courseChip} ${styles.courseChipActive}`}
            >
              {loc} ×
            </button>
          ))}
        </div>
      </div>

      {/* Ownership */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>College Type</label>
        <div className={styles.typeButtonGroup}>
          {['Government', 'Private', 'Deemed'].map(type => (
            <button
              suppressHydrationWarning
              key={type}
              onClick={() => { toggleArrayFilter('ownership', type); applyFilters(); }}
              className={`${styles.typeBtn} ${filters.ownership.includes(type) ? styles.typeBtnActive : styles.typeBtnDefault}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Exam */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Entrance Exam</label>
        <select
          suppressHydrationWarning
          value=""
          onChange={e => {
            if (e.target.value && !filters.exam.includes(e.target.value))
              toggleArrayFilter('exam', e.target.value);
          }}
          className={styles.filterSelect}
        >
          <option value="">Select Exam...</option>
          {['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'CLAT', 'GATE', 'BITSAT', 'COMEDK', 'WBJEE', 'CUET']
            .filter(ex => !filters.exam.includes(ex))
            .map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
        </select>
        <div className={styles.courseChips} style={{ marginTop: '8px' }}>
          {filters.exam.map(ex => (
            <button
              suppressHydrationWarning
              key={ex}
              onClick={() => toggleArrayFilter('exam', ex)}
              className={`${styles.courseChip} ${styles.courseChipActive}`}
            >
              {ex} ×
            </button>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Minimum Rating</label>
        <div className={styles.ratingButtons}>
          {['3', '3.5', '4', '4.5'].map(r => (
            <button
              suppressHydrationWarning
              key={r}
              onClick={() => updateFilter('minRating', filters.minRating === r ? '' : r)}
              className={`${styles.ratingBtn} ${filters.minRating === r ? styles.ratingBtnActive : ''}`}
            >
              {r}★+
            </button>
          ))}
        </div>
      </div>

      {/* Apply */}
      <div style={{ marginTop: '2rem' }}>
        <button
          suppressHydrationWarning
          onClick={() => applyFilters()}
          className={hasPendingChanges ? styles.applyFiltersBtn : styles.applyFiltersBtnDisabled}
          disabled={!hasPendingChanges}
        >
          {hasPendingChanges ? 'Apply Filters' : 'Filters Applied ✓'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>

      {/* ── Hero Search Bar (Careers360-style) ── */}
      <div className={styles.heroBar}>
        <div className={styles.heroBarInner}>
          <h1 className={styles.heroTitle}>
            Find Your <span className={styles.heroTitleHighlight}>Perfect College</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Explore {pagination?.total?.toLocaleString() || '37,701+'} verified institutions across India
          </p>
          <form onSubmit={handleHeroSearch} className={styles.heroSearchForm}>
            <div className={styles.heroSearchInputWrap}>
              <svg className={styles.heroSearchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                suppressHydrationWarning
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search by college name, city, or course..."
                className={styles.heroSearchInput}
              />
              {heroSearch && (
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => { setHeroSearch(''); setSearch(''); }}
                  className={styles.heroClearBtn}
                >
                  ✕
                </button>
              )}
            </div>
            <button suppressHydrationWarning type="submit" className={styles.heroSearchBtn}>
              Search
            </button>
          </form>

          {/* Quick-filter pills */}
          <div className={styles.heroQuickFilters}>
            <span className={styles.heroQuickLabel}>Popular:</span>
            {POPULAR_COURSES.slice(0, 5).map(c => (
              <button
                suppressHydrationWarning
                key={c.value}
                onClick={() => {
                  const newCourse = activeFilters.course.includes(c.value)
                    ? activeFilters.course.filter(x => x !== c.value)
                    : [...activeFilters.course, c.value];
                  setFilters(prev => ({ ...prev, course: newCourse }));
                  setActiveFilters(prev => ({ ...prev, course: newCourse, page: 1 }));
                }}
                className={`${styles.heroQuickChip} ${activeFilters.course.includes(c.value) ? styles.heroQuickChipActive : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Ribbon ── */}
      <div className={styles.statsRibbon}>
        <div className={styles.statsRibbonInner}>
          <div className={styles.statRibbonItem}>
            <span className={styles.statRibbonNum}>{pagination?.total?.toLocaleString() || '37,701+'}</span>
            <span className={styles.statRibbonLabel}>Colleges</span>
          </div>
          <div className={styles.statRibbonDivider} />
          <div className={styles.statRibbonItem}>
            <span className={styles.statRibbonNum}>36</span>
            <span className={styles.statRibbonLabel}>States & UTs</span>
          </div>
          <div className={styles.statRibbonDivider} />
          <div className={styles.statRibbonItem}>
            <span className={styles.statRibbonNum}>9</span>
            <span className={styles.statRibbonLabel}>Streams</span>
          </div>
          <div className={styles.statRibbonDivider} />
          <div className={styles.statRibbonItem}>
            <span className={styles.statRibbonNum}>10+</span>
            <span className={styles.statRibbonLabel}>Exams</span>
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>All Colleges</span>
          {activeSearch && (
            <>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbCurrent}>"{activeSearch}"</span>
            </>
          )}
        </div>

        {/* Active Chips */}
        {activeChips.length > 0 && (
          <div className={styles.activeChips}>
            <span className={styles.activeChipsLabel}>Active filters:</span>
            {activeChips.map((chip, idx) => (
              <button
                suppressHydrationWarning
                key={`${chip.type}-${chip.value}-${idx}`}
                onClick={() => removeChip(chip)}
                className={styles.activeChip}
              >
                {chip.label}
                <span className={styles.chipRemove}>×</span>
              </button>
            ))}
            <button suppressHydrationWarning onClick={clearAll} className={styles.clearAllChip}>
              Clear All ×
            </button>
          </div>
        )}

        {/* Mobile Filter Bar */}
        <div className={styles.mobileFilterBar}>
          <button
            suppressHydrationWarning
            onClick={() => setMobileFiltersOpen(true)}
            className={styles.mobileFilterBtn}
          >
            ☰ Filters{' '}
            {activeChips.length > 0 && (
              <span className={styles.filterBadge}>{activeChips.length}</span>
            )}
          </button>
          <select
            suppressHydrationWarning
            value={`${activeFilters.sortBy}:${activeFilters.sortOrder}`}
            onChange={e => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              setFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
              setActiveFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
            }}
            className={styles.mobileSortSelect}
          >
            <option value="rating:desc">Top Rated</option>
            <option value="fees:asc">Fees: Low → High</option>
            <option value="fees:desc">Fees: High → Low</option>
            <option value="placementPercent:desc">Best Placements</option>
            <option value="name:asc">Name: A → Z</option>
          </select>
        </div>

        {/* Mobile Drawer */}
        {mobileFiltersOpen && (
          <div className={styles.mobileDrawerOverlay} onClick={() => setMobileFiltersOpen(false)}>
            <div className={styles.mobileDrawer} onClick={e => e.stopPropagation()}>
              <div className={styles.mobileDrawerHeader}>
                <h3>Filters</h3>
                <button
                  suppressHydrationWarning
                  onClick={() => setMobileFiltersOpen(false)}
                  className={styles.mobileDrawerClose}
                >
                  ✕
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}

        <div className={styles.layoutGrid}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <h2 className={styles.filterTitle}>🎯 Filters</h2>
                {(activeChips.length > 0 || hasPendingChanges) && (
                  <button suppressHydrationWarning onClick={clearAll} className={styles.clearBtn}>
                    Clear All
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Main */}
          <main className={styles.mainContent}>
            <div className={styles.topBar}>
              <p className={styles.resultCount}>
                Showing{' '}
                <span className={styles.resultCountHighlight}>
                  {pagination?.total?.toLocaleString() || 0}
                </span>{' '}
                colleges
                {activeSearch && (
                  <>
                    {' '}for "<em>{activeSearch}</em>"
                  </>
                )}
              </p>
              <div className={styles.topBarRight}>
                <span className={styles.sortLabel}>Sort by:</span>
                <select
                  suppressHydrationWarning
                  value={`${activeFilters.sortBy}:${activeFilters.sortOrder}`}
                  onChange={e => {
                    const [sortBy, sortOrder] = e.target.value.split(':');
                    setFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
                    setActiveFilters(f => ({
                      ...f,
                      sortBy,
                      sortOrder: sortOrder as 'asc' | 'desc',
                      page: 1,
                    }));
                  }}
                  className={styles.sortSelect}
                >
                  <option value="rating:desc">⭐ Top Rated</option>
                  <option value="fees:asc">₹ Fees: Low → High</option>
                  <option value="fees:desc">₹ Fees: High → Low</option>
                  <option value="placementPercent:desc">🏆 Best Placements</option>
                  <option value="name:asc">A→Z Name</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className={styles.gridContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <CollegeCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon} style={{ color: '#ef4444' }}>⚠️</div>
                <h3 className={styles.emptyTitle}>Connection Error</h3>
                <p className={styles.emptyText}>{error}</p>
                <button suppressHydrationWarning onClick={fetchColleges} className={styles.emptyBtn}>
                  Try Again
                </button>
              </div>
            ) : colleges.length > 0 ? (
              <>
                <div className={styles.gridContainer}>
                  {colleges.map(college => (
                    <CollegeCard key={college.id} college={college} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className={styles.paginationWrapper}>
                    <div className={styles.pagination}>
                      <button
                        suppressHydrationWarning
                        disabled={!pagination.hasPrev}
                        onClick={() => applyFilters(activeFilters.page - 1)}
                        className={styles.navBtn}
                      >
                        ← Prev
                      </button>
                      <div className={styles.pageNumbers}>
                        {(() => {
                          const pages: number[] = [];
                          const current = pagination.page;
                          const total = pagination.totalPages;
                          if (current > 3) {
                            pages.push(1);
                            if (current > 4) pages.push(-1);
                          }
                          for (
                            let p = Math.max(1, current - 2);
                            p <= Math.min(total, current + 2);
                            p++
                          )
                            pages.push(p);
                          if (current < total - 2) {
                            if (current < total - 3) pages.push(-1);
                            pages.push(total);
                          }
                          return pages.map((p, i) =>
                            p === -1 ? (
                              <span key={`ellipsis-${i}`} className={styles.ellipsis}>
                                …
                              </span>
                            ) : (
                              <button
                                suppressHydrationWarning
                                key={p}
                                onClick={() => applyFilters(p)}
                                className={`${styles.pageBtn} ${p === current ? styles.pageBtnActive : styles.pageBtnDefault}`}
                              >
                                {p}
                              </button>
                            ),
                          );
                        })()}
                      </div>
                      <button
                        suppressHydrationWarning
                        disabled={!pagination.hasNext}
                        onClick={() => applyFilters(activeFilters.page + 1)}
                        className={styles.navBtn}
                      >
                        Next →
                      </button>
                    </div>
                    <p className={styles.paginationInfo}>
                      Page {pagination.page} of {pagination.totalPages} ·{' '}
                      {pagination.total.toLocaleString()} results
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No colleges found</h3>
                <p className={styles.emptyText}>
                  Try removing some filters or searching for something else.
                </p>
                <button suppressHydrationWarning onClick={clearAll} className={styles.emptyBtn}>
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400 font-bold">
          Loading colleges...
        </div>
      }
    >
      <CollegesList />
    </Suspense>
  );
}