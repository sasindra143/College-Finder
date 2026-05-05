'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
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
  
  // Pending state (UI)
  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{
    location: string[];
    ownership: string[];
    course: string[];
    minRating: string;
    maxFees: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    page: number;
  }>({
    location: searchParams?.get('location') ? searchParams.get('location')!.split(',') : [],
    ownership: searchParams?.get('ownership') ? searchParams.get('ownership')!.split(',') : [],
    course: [],
    minRating: '',
    maxFees: '',
    sortBy: 'rating',
    sortOrder: 'desc',
    page: 1,
  });

  // Active state (API query)
  const [activeFilters, setActiveFilters] = useState(filters);
  const [activeSearch, setActiveSearch] = useState(search);

  // Apply button handler
  const applyFilters = useCallback((pageOverride?: number) => {
    setActiveFilters({
      ...filters,
      page: pageOverride ?? 1
    });
    if (pageOverride === undefined) {
      setFilters(prev => ({ ...prev, page: 1 }));
    }
    setActiveSearch(search);
    setMobileFiltersOpen(false);
  }, [filters, search]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.getColleges({
        search: activeSearch,
        location: activeFilters.location.join(','),
        ownership: activeFilters.ownership.join(','),
        course: activeFilters.course.join(','),
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
    } catch (err) {
      setError("Backend not reachable");
    } finally {
      setLoading(false);
    }
  }, [activeSearch, activeFilters]);

  // Fetch only when activeFilters change
  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'location' | 'ownership' | 'course', value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const clearAll = () => {
    const empty = { location: [], ownership: [], course: [], minRating: '', maxFees: '', sortBy: 'rating', sortOrder: 'desc' as const, page: 1 };
    setSearch('');
    setFilters(empty);
    setActiveSearch('');
    setActiveFilters(empty);
  };

  const removeChip = (chip: any) => {
    let newFilters = { ...activeFilters };
    let newSearch = activeSearch;
    if (chip.type === 'search') newSearch = '';
    else if (['location', 'ownership', 'course'].includes(chip.type)) {
      newFilters[chip.type as 'location'|'ownership'|'course'] = newFilters[chip.type as 'location'|'ownership'|'course'].filter(v => v !== chip.value);
    }
    else newFilters[chip.type as 'minRating'|'maxFees'] = '';

    newFilters.page = 1;
    setFilters(newFilters);
    setSearch(newSearch);
    setActiveFilters(newFilters);
    setActiveSearch(newSearch);
  };

  const activeChips = [
    ...(activeSearch ? [{ label: `"${activeSearch}"`, type: 'search', value: activeSearch }] : []),
    ...(activeFilters.location.map(loc => ({ label: loc, type: 'location', value: loc }))),
    ...(activeFilters.ownership.map(own => ({ label: own, type: 'ownership', value: own }))),
    ...(activeFilters.course.map(c => ({ label: POPULAR_COURSES.find(pc => pc.value === c)?.label || c, type: 'course', value: c }))),
    ...(activeFilters.minRating ? [{ label: `${activeFilters.minRating}★+`, type: 'minRating', value: activeFilters.minRating }] : []),
    ...(activeFilters.maxFees && Number(activeFilters.maxFees) < 3000000 ? [{ label: `Up to ₹${(Number(activeFilters.maxFees) / 100000).toFixed(0)}L`, type: 'maxFees', value: activeFilters.maxFees }] : []),
  ];

  const hasPendingChanges = 
    search !== activeSearch ||
    JSON.stringify(filters.location) !== JSON.stringify(activeFilters.location) ||
    JSON.stringify(filters.ownership) !== JSON.stringify(activeFilters.ownership) ||
    JSON.stringify(filters.course) !== JSON.stringify(activeFilters.course) ||
    filters.minRating !== activeFilters.minRating ||
    filters.maxFees !== activeFilters.maxFees ||
    filters.sortBy !== activeFilters.sortBy ||
    filters.sortOrder !== activeFilters.sortOrder;

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
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
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
            <button suppressHydrationWarning
              key={c.value}
              onClick={() => toggleArrayFilter('course', c.value)}
              className={`${styles.courseChip} ${filters.course.includes(c.value) ? styles.courseChipActive : ''}`}
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
          value=""
          onChange={e => {
            if (e.target.value && !filters.location.includes(e.target.value)) {
              toggleArrayFilter('location', e.target.value);
            }
          }}
          className={styles.filterSelect}
        >
          <option value="">Select States...</option>
          {INDIAN_STATES.filter(s => !filters.location.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className={styles.courseChips} style={{marginTop: '8px'}}>
          {filters.location.map(loc => (
            <button suppressHydrationWarning key={loc} onClick={() => toggleArrayFilter('location', loc)} className={`${styles.courseChip} ${styles.courseChipActive}`}>
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
            <button suppressHydrationWarning
              key={type}
              onClick={() => toggleArrayFilter('ownership', type)}
              className={`${styles.typeBtn} ${
                filters.ownership.includes(type)
                  ? styles.typeBtnActive
                  : styles.typeBtnDefault
              }`}
            >
              {type}
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
      </div>

      {/* APPLY FILTERS BUTTON */}
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => applyFilters()} 
          className={hasPendingChanges ? styles.applyFiltersBtn : styles.applyFiltersBtnDisabled}
          suppressHydrationWarning
          disabled={!hasPendingChanges}
        >
          {hasPendingChanges ? 'Apply Filters' : 'Filters Applied'}
        </button>
      </div>

    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>Colleges</span>
          </div>
          <h1 className={styles.pageTitle}>Top Colleges in India 2025</h1>
          <p className={styles.pageSubtitle}>
            Explore {pagination?.total?.toLocaleString() || '37,701+'} verified institutions across India
          </p>

          {activeChips.length > 0 && (
            <div className={styles.activeChips}>
              {activeChips.map((chip, idx) => (
                <button suppressHydrationWarning
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
        </div>

        <div className={styles.mobileFilterBar}>
          <button suppressHydrationWarning onClick={() => setMobileFiltersOpen(true)} className={styles.mobileFilterBtn}>
            Filters {activeChips.length > 0 && <span className={styles.filterBadge}>{activeChips.length}</span>}
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className={styles.mobileDrawerOverlay} onClick={() => setMobileFiltersOpen(false)}>
            <div className={styles.mobileDrawer} onClick={e => e.stopPropagation()}>
              <div className={styles.mobileDrawerHeader}>
                <h3>Filters</h3>
                <button suppressHydrationWarning onClick={() => setMobileFiltersOpen(false)} className={styles.mobileDrawerClose}>✕</button>
              </div>
              {filterContent}
            </div>
          </div>
        )}

        <div className={styles.layoutGrid}>
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <h2 className={styles.filterTitle}>Filters</h2>
                {(activeChips.length > 0 || hasPendingChanges) && (
                  <button suppressHydrationWarning onClick={clearAll} className={styles.clearBtn}>Clear All</button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          <main className={styles.mainContent}>
            <div className={styles.topBar}>
              <p className={styles.resultCount}>
                <span className={styles.resultCountHighlight}>{pagination?.total?.toLocaleString() || 0}</span> Institutions Found
              </p>
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={e => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  setFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
                  setActiveFilters(f => ({ ...f, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
                }}
                className={styles.sortSelect}
              >
                <option value="rating:desc">Top Rated</option>
                <option value="fees:asc">Fees: Low → High</option>
                <option value="fees:desc">Fees: High → Low</option>
                <option value="placementPercent:desc">Best Placements</option>
                <option value="name:asc">Name: A → Z</option>
              </select>
            </div>

            {loading ? (
              <div className={styles.gridContainer}>
                {[1,2,3,4,5,6].map(i => (
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
                <button suppressHydrationWarning onClick={fetchColleges} className={styles.emptyBtn}>Try Again</button>
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
                      <button suppressHydrationWarning
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
                          if (current > 3) { pages.push(1); if (current > 4) pages.push(-1); }
                          for (let p = Math.max(1, current - 2); p <= Math.min(total, current + 2); p++) pages.push(p);
                          if (current < total - 2) { if (current < total - 3) pages.push(-1); pages.push(total); }
                          return pages.map((p, i) => p === -1
                            ? <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
                            : (
                              <button suppressHydrationWarning
                                key={p}
                                onClick={() => applyFilters(p)}
                                className={`${styles.pageBtn} ${p === current ? styles.pageBtnActive : styles.pageBtnDefault}`}
                              >
                                {p}
                              </button>
                            )
                          );
                        })()}
                      </div>
                      <button suppressHydrationWarning
                        disabled={!pagination.hasNext}
                        onClick={() => applyFilters(activeFilters.page + 1)}
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
                <button suppressHydrationWarning onClick={clearAll} className={styles.emptyBtn}>Clear All Filters</button>
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