'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';



import { api } from '@/lib/api';
import type { College } from '@/lib/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('college');
  const [suggestions, setSuggestions] = useState<College[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Debounced search
  useEffect(() => {
    if (searchType !== 'college') {
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);

        try {
          const res: any = await api.getColleges({
            search: searchQuery,
            limit: 5,
          });

          setSuggestions(res?.data || res?.colleges || []);
          setShowDropdown(true);
        } catch (err) {
          console.error('❌ Search failed:', err);
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

  // ✅ Handle suggestion click
  const handleSuggestionClick = (slug: string) => {
    router.push(`/colleges/${slug}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  // ✅ Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    if (searchType === 'exam') {
      router.push(`/exams/${encodeURIComponent(query.replace(/\s+/g, '-'))}`);
    } else if (query.includes('engineering') && !query.includes('college')) {
      router.push('/engineering-colleges');
    } else {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070"
            alt="Campus"
            className={styles.heroBackgroundImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Your <span className={styles.highlightText}>Dream College</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Explore top colleges across India with real data.
          </p>

          {/* SEARCH */}
          <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">

            <form onSubmit={handleSearch} className={styles.searchBox}>
              <select
                className={styles.searchTypeSelect}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="college">Colleges</option>
                <option value="exam">Exams</option>
                <option value="course">Courses</option>
              </select>

              <input
                type="text"
                className={styles.heroSearchInput}
                placeholder="Search colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button type="submit" className={styles.searchBtn}>
                Search
              </button>
            </form>

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg z-50 rounded-md overflow-hidden">

                {isSearching && (
                  <div className="p-3 text-center text-gray-500">
                    Searching...
                  </div>
                )}

                {!isSearching && suggestions.length === 0 && (
                  <div className="p-3 text-center text-gray-400">
                    No results found
                  </div>
                )}

                {!isSearching &&
                  suggestions.map((college) => (
                    <div
                      key={college.id}
                      className="p-3 border-b cursor-pointer hover:bg-gray-100 transition"
                      onClick={() =>
                        handleSuggestionClick(college.slug || college.id)
                      }
                    >
                      <div className="font-semibold">
                        {college.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {college.city}, {college.state}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}