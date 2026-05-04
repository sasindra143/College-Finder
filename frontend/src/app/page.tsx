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
  const [typingText, setTypingText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const words = ['Dream College', 'Future Career', 'Top University'];

  // Typing Effect Logic
  useEffect(() => {
    const currentWord = words[wordIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && typingText === currentWord) {
      typingSpeed = 2000; // Pause before deleting
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    }

    if (isDeleting && typingText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      typingSpeed = 500; // Pause before typing next word
      return;
    }

    const timer = setTimeout(() => {
      setTypingText(
        isDeleting
          ? currentWord.substring(0, typingText.length - 1)
          : currentWord.substring(0, typingText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typingText, isDeleting, wordIndex, words]);

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
    <div className={styles.pageContainer}>

      {/* HERO */}
      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img
            src="/images/hero_bg.png"
            alt="Campus"
            className={styles.heroBackgroundImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Find Your <span className={styles.highlightText}>{typingText}</span><span className={styles.cursor}>|</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Explore top colleges across India with real data.
          </p>

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

            {showDropdown && (
              <div className={styles.searchDropdown}>
                {isSearching && <div className={styles.searchMessage}>Searching...</div>}
                {!isSearching && suggestions.length === 0 && <div className={styles.searchMessage}>No results found</div>}
                {!isSearching && suggestions.map((college) => (
                  <div
                    key={college.id}
                    className={styles.searchResultItem}
                    onClick={() => handleSuggestionClick(college.slug || college.id)}
                  >
                    <div className={styles.searchResultName}>{college.name}</div>
                    <div className={styles.searchResultLocation}>{college.city}, {college.state}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STREAMS SECTION */}
      <section className={styles.streamsSection}>
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explore by <span className={styles.highlightText}>Stream</span></h2>
            <p className={styles.sectionSubtitle}>Choose your career path from top academic disciplines</p>
          </div>
          
          <div className={styles.streamsGrid}>
            {[
              { name: 'Engineering', icon: '⚙️', color: '#eff6ff', path: '/engineering' },
              { name: 'Management', icon: '💼', color: '#fff7ed', path: '/management' },
              { name: 'Medical', icon: '🩺', color: '#f0fdf4', path: '/medicine' },
              { name: 'Law', icon: '⚖️', color: '#fef2f2', path: '/law' },
              { name: 'Design', icon: '🎨', color: '#faf5ff', path: '/design' },
              { name: 'Pharmacy', icon: '💊', color: '#f0f9ff', path: '/pharmacy' },
              { name: 'Architecture', icon: '🏛️', color: '#fff1f2', path: '/architecture' },
              { name: 'Science', icon: '🔬', color: '#f0fdfa', path: '/science' }
            ].map((stream) => (
              <a key={stream.name} href={stream.path} className={styles.streamCard}>
                <div className={styles.streamIcon} style={{ backgroundColor: stream.color }}>{stream.icon}</div>
                <span className={styles.streamName}>{stream.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* COUNSELLING SECTION */}
      <section className={styles.counsellingSection}>
        <div className={styles.counsellingContainer}>
          <div className={styles.counsellingText}>
            <h2>Confused about <span className={styles.highlightText}>Admissions?</span></h2>
            <p>Get expert guidance on college selection, application processes, and career mapping from India's top education consultants.</p>
            <a href="/counselling" className={styles.counsellingBtn}>Book Free Session</a>
          </div>
          <div className={styles.counsellingImageWrapper}>
            <img 
              src="/images/counselling.png" 
              alt="Counselling" 
              className={styles.counsellingImage}
            />
            <div className={styles.counsellingBadge}>
              <div className={styles.counsellingBadgeIcon}>🎯</div>
              <div>
                <div className={styles.counsellingBadgeValue}>10k+ Students</div>
                <div className={styles.counsellingBadgeLabel}>Counselled Successfully</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionTitle}>Everything You Need in <span className={styles.highlightText}>One Place</span></h2>
          <p className={styles.sectionSubtitle}>We help you make the most important decision of your academic life.</p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{background: '#eff6ff'}}>🎓</div>
              <h3>37,000+ Colleges</h3>
              <p>Explore detailed information about thousands of verified institutions across India.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{background: '#f0fdf4'}}>📝</div>
              <h3>Entrance Exams</h3>
              <p>Get latest updates, patterns, and preparation tips for over 500+ entrance exams.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon} style={{background: '#fff7ed'}}>📊</div>
              <h3>College Predictor</h3>
              <p>Predict your chances of getting into your dream college based on your exam scores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.sectionTitle}>What <span className={styles.highlightText}>Students</span> Say</h2>
        </div>
        
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {[
              { name: 'Rahul Sharma', college: 'IIT Bombay', text: 'CareerCampus helped me find the perfect B.Tech program. The data is incredibly accurate and up-to-date.' },
              { name: 'Ananya Iyer', college: 'IIM Ahmedabad', text: 'The comparison tool is a lifesaver. It made my decision-making process so much easier and faster.' },
              { name: 'Vikram Singh', college: 'NLSIU Bangalore', text: 'Best platform for law aspirants. The entrance exam section provides everything you need to know.' },
              { name: 'Priya Verma', college: 'AIIMS Delhi', text: 'I found my dream medical college through the detailed listings here. Highly recommended!' },
              // Duplicate for seamless marquee
              { name: 'Rahul Sharma', college: 'IIT Bombay', text: 'CareerCampus helped me find the perfect B.Tech program. The data is incredibly accurate and up-to-date.' },
              { name: 'Ananya Iyer', college: 'IIM Ahmedabad', text: 'The comparison tool is a lifesaver. It made my decision-making process so much easier and faster.' },
              { name: 'Vikram Singh', college: 'NLSIU Bangalore', text: 'Best platform for law aspirants. The entrance exam section provides everything you need to know.' },
              { name: 'Priya Verma', college: 'AIIMS Delhi', text: 'I found my dream medical college through the detailed listings here. Highly recommended!' }
            ].map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar} style={{ background: i % 2 === 0 ? '#f97316' : '#2563eb' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{t.name}</h4>
                    <p>{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}