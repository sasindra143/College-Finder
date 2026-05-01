'use client';
import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import styles from './CollegesPage.module.css';

// ✅ Pagination type (correct)
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

// ✅ API response type (NEW FIX)
interface ApiResponse {
  success: boolean;
  data: College[];
  pagination: PaginationInfo;
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

  // ✅ FIXED API CALL
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getColleges({
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
      }) as ApiResponse;

      console.log("🔥 API DATA:", res);

      // ✅ CRITICAL FIX
      setColleges(res.data || []);
      setPagination(res.pagination || null);
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
    setFilters({
      location: '',
      ownership: '',
      course: '',
      minRating: '',
      maxFees: '',
      sortBy: 'rating',
      sortOrder: 'desc',
      page: 1
    });
  };

  const hasFilters =
    search || filters.location || filters.ownership ||
    filters.course || filters.minRating || filters.maxFees;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>

        <h1>Top Colleges</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div className={styles.gridContainer}>
              {colleges.map(college => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>

            {/* ✅ Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className={styles.paginationWrapper}>
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() =>
                    setFilters(f => ({ ...f, page: f.page - 1 }))
                  }
                >
                  Prev
                </button>

                <span>
                  Page {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  disabled={!pagination.hasNext}
                  onClick={() =>
                    setFilters(f => ({ ...f, page: f.page + 1 }))
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div>Loading colleges...</div>}>
      <CollegesList />
    </Suspense>
  );
}