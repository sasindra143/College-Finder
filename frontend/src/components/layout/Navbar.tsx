'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCompare } from '@/context/CompareContext';
import { useRouter, usePathname } from 'next/navigation';
import { api, College } from '@/lib/api';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { compareList } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<College[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => { 
    setMobileOpen(false); 
    setShowDropdown(false);
    setSearchQuery('');
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }, [pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const res: any = await api.getColleges({ search: searchQuery, limit: 6 });
          setSuggestions(res?.data || res?.colleges || []);
          setShowDropdown(true);
        } catch (err) {
          console.error('Search failed:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleMobile = () => {
    const newState = !mobileOpen;
    setMobileOpen(newState);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = newState ? 'hidden' : '';
    }
  };

  const categories = [
    { name: 'Home', path: '/' },
    { name: 'Engineering', path: '/engineering' },
    { name: 'Medical', path: '/medicine' },
    { name: 'Management', path: '/management' },
    { name: 'Law', path: '/law' },
    { name: 'Exams', path: '/exams/jee-main-2025' },
    { name: 'All Colleges', path: '/colleges' },
    { name: 'Predictor', path: '/predictor' },
    { name: 'Compare', path: '/compare' },
    { name: 'Q&A', path: '/qa' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
      setMobileOpen(false);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    router.push(`/colleges/${slug}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  if (pathname?.startsWith('/auth')) return null;

  return (
    <header className={styles.headerContainer}>
      {/* Top Utility Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div className="hidden sm:block">📞 Support: 9959732476</div>
          <div className={styles.topBarLinks}>
            <Link href="/about" className={styles.topBarLink}>About</Link>
            <Link href="/contact" className={styles.topBarLink}>Contact</Link>
            <Link href="/faq" className={styles.topBarLink}>FAQs</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoIcon}>CC</div>
          <div className={styles.logoText}>Career<span className={styles.logoHighlight}>Campus</span></div>
        </Link>

        {/* Desktop Search Bar */}
        <div className={styles.searchContainer} ref={searchRef}>
          <form onSubmit={handleSearch}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search Colleges, Courses & more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setShowDropdown(true)}
              suppressHydrationWarning
              readOnly // Make the navbar input just a trigger for the modal
            />
          </form>

          {/* Careers360-style Full Screen Search Modal */}
          {showDropdown && (
            <div className={styles.searchModalOverlay}>
              <div className={styles.searchModalContainer}>
                {/* Search Header */}
                <div className={styles.searchModalHeader}>
                  <form onSubmit={handleSearch} className={styles.searchModalForm}>
                    <svg className={styles.searchModalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                      type="text" 
                      className={styles.searchModalInput} 
                      placeholder="Search for Colleges, Exams, Courses..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      suppressHydrationWarning
                    />
                  </form>
                  <button onClick={() => setShowDropdown(false)} className={styles.searchModalClose}>
                    ✕
                  </button>
                </div>

                {/* Search Body (2 columns: Results | Banner) */}
                <div className={styles.searchModalBody}>
                  
                  {/* Left Column: Results List */}
                  <div className={styles.searchModalResults}>
                    {(suggestions || []).length > 0 ? (
                      suggestions.map((college) => (
                        <div 
                          key={college.id} 
                          className={styles.searchResultItem}
                          onClick={() => handleSuggestionClick(college.slug || college.id)}
                        >
                          <div className={styles.searchResultName}>{college.name}, {college.city}</div>
                          <div className={styles.searchResultType}>COLLEGE</div>
                        </div>
                      ))
                    ) : !isSearching && searchQuery.length > 1 ? (
                      <div className={styles.noResultsModal}>No colleges found matching "{searchQuery}"</div>
                    ) : null}
                    
                    {isSearching && <div className={styles.noResultsModal}>Searching...</div>}
                    {!searchQuery && (
                      <div className={styles.searchPromptModal}>
                        Start typing to search for top colleges, courses, and exams.
                      </div>
                    )}
                  </div>

                  {/* Right Column: Promotional Banner */}
                  <div className={styles.searchModalPromo}>
                    <div className={styles.promoBox}>
                      <h3 className={styles.promoTitle}>Scan and Download the App!</h3>
                      <p className={styles.promoSubtitle}>Search Faster, Smarter, Better</p>
                      <div className={styles.promoQrPlaceholder}>
                        <div className={styles.qrIcon}>📱</div>
                      </div>
                      <div className={styles.promoRating}>
                        Rated <strong>4.8★</strong> by 1M+ students
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Auth */}
        <div className={styles.authContainer}>
          {isAuthenticated ? (
             <div className="flex items-center gap-4">
               <Link href="/dashboard" className="flex items-center gap-2 group p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                 <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                   {user?.name?.charAt(0).toUpperCase() || 'U'}
                 </div>
                 <div className="hidden lg:block text-left">
                   <div className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{user?.name}</div>
                   <div className="text-[10px] font-medium text-gray-500 leading-tight">{user?.email}</div>
                 </div>
               </Link>
               <button onClick={logout} className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100">
                 Logout
               </button>
             </div>
          ) : (
            <>
              <Link href="/auth/login" className={styles.loginBtn}>Login</Link>
              <Link href="/auth/signup" className={styles.signupBtn}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`${styles.mobileMenuBtn} ${mobileOpen ? styles.hamburgerOpen : ''}`} 
          onClick={toggleMobile}
          aria-label="Toggle Menu"
          suppressHydrationWarning
        >
          <span className={`${styles.hamburger} ${styles.hamburgerTop}`}></span>
          <span className={`${styles.hamburger} ${styles.hamburgerMid}`}></span>
          <span className={`${styles.hamburger} ${styles.hamburgerBottom}`}></span>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.navMenu}>
        <div className={styles.navMenuContent}>
          {categories.map((cat) => (
            <Link 
              key={cat.path} 
              href={cat.path}
              className={`${styles.navItem} ${pathname === cat.path || (cat.path !== '/' && pathname?.startsWith(cat.path)) ? styles.navItemActive : ''}`}
            >
              {cat.name}
              {cat.name === 'Compare' && compareList.length > 0 && (
                <span className="ml-2 bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {compareList.length}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ''}`} 
        onClick={toggleMobile}
      />

      {/* Mobile Navigation Drawer */}
      <aside className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}>
        {/* Mobile Search */}
        <div className={styles.mobileSearch}>
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search Colleges..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </form>
        </div>

        {/* Mobile Links */}
        <div className={styles.mobileNav}>
          {categories.map(cat => (
            <Link 
              key={cat.path} 
              href={cat.path} 
              className={`${styles.mobileNavItem} ${pathname === cat.path ? styles.mobileNavItemActive : ''}`}
            >
              <span>{cat.name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>

        {/* Mobile Auth Actions */}
        <div className={styles.mobileAuth}>
          {isAuthenticated ? (
            <button onClick={() => { logout(); toggleMobile(); }} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm">Logout</button>
          ) : (
            <>
              <Link href="/auth/login" className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-center text-sm">Sign In</Link>
              <Link href="/auth/signup" className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold text-center text-sm shadow-lg shadow-brand-200">Create Account</Link>
            </>
          )}
        </div>
      </aside>
    </header>
  );
}
