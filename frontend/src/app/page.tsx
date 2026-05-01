'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { api } from '@/lib/api'
import type { College } from '@/lib/types'
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('college');
  const [suggestions, setSuggestions] = useState<College[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  // Debounced search logic for live dropdown
  useEffect(() => {
    if (searchType !== 'college') {
      setShowDropdown(false);
      return;
    }
    
    const timer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const res = await api.getColleges({ search: searchQuery, limit: 5 });
          setSuggestions(res.colleges);
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
  }, [searchQuery, searchType]);

  const handleSuggestionClick = (slug: string) => {
    router.push(`/colleges/${slug}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      if (searchType === 'exam') {
        router.push(`/exams/${encodeURIComponent(query.replace(/\s+/g, '-'))}`);
      } else if (query.includes('engineering') && !query.includes('college')) {
        router.push('/engineering-colleges');
      } else {
        router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070" alt="Campus" className={styles.heroBackgroundImage} />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} fade-in-up`}>
            Find Your <span className={styles.highlightText}>Dream College</span>
          </h1>
          <p className={`${styles.heroSubtitle} fade-in-up`} style={{ animationDelay: '0.1s' }}>
            Explore details on engineering, management, medicine and arts colleges across India.
          </p>

          <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className={`${styles.searchBox} fade-in-up`} style={{ animationDelay: '0.2s' }}>
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
                placeholder="Search for colleges, exams, courses and more..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchType === 'college' && searchQuery.length > 1 && setShowDropdown(true)}
              />
              <button type="submit" className={styles.searchBtn}>Search</button>
            </form>

            {/* Suggestions Dropdown for Home Page */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left">
                {suggestions.length > 0 ? (
                  suggestions.map((college) => (
                    <div 
                      key={college.id} 
                      className="p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors flex justify-between items-center"
                      onClick={() => handleSuggestionClick(college.slug)}
                    >
                      <div>
                        <div className="font-bold text-gray-900">{college.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{college.city}, {college.state}</div>
                      </div>
                      <div className="text-xs font-bold px-2 py-1 bg-brand-50 text-brand-600 rounded-lg whitespace-nowrap ml-4 uppercase tracking-wider">
                        {college.ownership}
                      </div>
                    </div>
                  ))
                ) : !isSearching && (
                  <div className="p-4 text-gray-500 text-center font-medium">No colleges found matching "{searchQuery}"</div>
                )}
                {isSearching && <div className="p-4 text-brand-600 text-center font-bold animate-pulse">Searching...</div>}
              </div>
            )}
          </div>

          <div className={`${styles.statsContainer} fade-in-up`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>5000+</span>
              <span className={styles.statLabel}>Colleges</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>200+</span>
              <span className={styles.statLabel}>Exams</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>2M+</span>
              <span className={styles.statLabel}>Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Streams Section */}
      <section className={styles.streamsSection}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black text-gray-900">Popular Streams</h2>
            <Link href="/colleges" className="text-brand-600 font-bold hover:underline">View All →</Link>
          </div>
          
          <div className={styles.streamsGrid}>
            {[
              { name: 'Engineering', icon: '⚙️', path: '/engineering', color: 'bg-blue-100 text-blue-600' },
              { name: 'Management', icon: '📊', path: '/management', color: 'bg-orange-100 text-orange-600' },
              { name: 'Medicine', icon: '⚕️', path: '/medicine', color: 'bg-red-100 text-red-600' },
              { name: 'Law', icon: '⚖️', path: '/law', color: 'bg-purple-100 text-purple-600' },
              { name: 'Design', icon: '🎨', path: '/design', color: 'bg-pink-100 text-pink-600' },
              { name: 'Science', icon: '🔬', path: '/colleges?ownership=Government', color: 'bg-emerald-100 text-emerald-600' },
              { name: 'Arts', icon: '🎭', path: '/colleges?ownership=Private', color: 'bg-indigo-100 text-indigo-600' },
              { name: 'Commerce', icon: '📈', path: '/colleges', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Pharmacy', icon: '💊', path: '/medicine', color: 'bg-teal-100 text-teal-600' },
              { name: 'Architecture', icon: '🏛️', path: '/engineering', color: 'bg-cyan-100 text-cyan-600' },
            ].map((stream, i) => (
              <Link key={i} href={stream.path} className={`${styles.streamCard} fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`${styles.streamIcon} ${stream.color}`}>
                  {stream.icon}
                </div>
                <h3 className={styles.streamName}>{stream.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Counselling Section */}
      <section className={styles.counsellingSection}>
        <div className={styles.counsellingContainer}>
          <div className={styles.counsellingText}>
            <h2>Confused about your career? <br/> Let us guide you!</h2>
            <p>
              We ease your biggest doubts with personalized Video Counselling from our Curated Experts. 
              Get clarity on course selection, college admissions, and career paths designed specifically for you.
            </p>
            <Link href="/contact" className={styles.counsellingBtn}>
              Book a Free Session
            </Link>
          </div>
          <div className={styles.counsellingImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800" 
              alt="Video Counselling" 
              className={styles.counsellingImage} 
            />
            <div className={styles.counsellingBadge}>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">✓</div>
              <div>
                <div className="font-bold text-gray-900 text-lg">10,000+</div>
                <div className="text-gray-500 text-sm font-medium">Students Counselled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why CareerCampus?</h2>
        <p className={styles.sectionSubtitle}>We provide the most accurate tools to make informed decisions.</p>

        <div className={styles.featuresGrid}>
          {[
            {
              title: 'Verified Information',
              desc: 'Access official fee structures, admission processes, and placement stats directly from institutions.',
              icon: '📋',
              color: 'bg-blue-50 text-blue-600 border border-blue-100'
            },
            {
              title: 'Intelligent Comparison',
              desc: 'Compare multiple colleges side-by-side across 20+ parameters to find your perfect match.',
              icon: '⚖️',
              color: 'bg-orange-50 text-orange-600 border border-orange-100'
            },
            {
              title: 'Student Reviews',
              desc: 'Read authentic reviews from alumni and current students about campus life and real placements.',
              icon: '⭐',
              color: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }
          ].map((feature, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* States Section */}
      <section className={styles.statesSection}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-3xl font-black text-gray-900">Explore Colleges by State</h2>
            <Link href="/colleges" className="text-brand-600 font-bold hover:underline">All States →</Link>
          </div>
          <p className="text-gray-500 font-medium mb-10">Discover top educational institutions in your preferred state.</p>
          
          <div className={styles.statesGrid}>
            {[
              { name: 'Maharashtra', icon: '🏰' },
              { name: 'Delhi', icon: '🏛️' },
              { name: 'Karnataka', icon: '🌳' },
              { name: 'Tamil Nadu', icon: '🛕' },
              { name: 'Telangana', icon: '💎' },
              { name: 'Andhra Pradesh', icon: '🌊' },
              { name: 'West Bengal', icon: '🐯' },
              { name: 'Uttar Pradesh', icon: '🏯' },
              { name: 'Gujarat', icon: '🦁' },
              { name: 'Punjab', icon: '🌾' },
              { name: 'Kerala', icon: '🌴' },
              { name: 'Rajasthan', icon: '🐪' },
            ].map((state, i) => (
              <Link key={i} href={`/colleges?location=${state.name}`} className={styles.stateCard}>
                <div className={styles.stateIcon}>{state.icon}</div>
                <span className={styles.stateName}>{state.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className={styles.citiesSection}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Top Educational Hubs</h2>
          <p className="text-gray-500 font-medium mb-10">Find colleges in India's most popular student cities.</p>
          
          <div className={styles.citiesGrid}>
            {[
              { name: 'Mumbai', count: '120+ Colleges', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800' },
              { name: 'Bangalore', count: '150+ Colleges', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a5cf?w=800' },
              { name: 'Delhi', count: '200+ Colleges', img: 'https://images.unsplash.com/photo-1587474260584-1f21d42a6008?w=800' },
              { name: 'Pune', count: '90+ Colleges', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800' },
            ].map((city, i) => (
              <Link key={i} href={`/colleges?search=${city.name}`} className={styles.cityCard}>
                <img src={city.img} alt={city.name} className={styles.cityImage} />
                <div className={styles.cityOverlay}>
                  <div className={styles.cityCount}>{city.count}</div>
                  <h3 className={styles.cityName}>{city.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>Student Success Stories</h2>
        <p className={styles.sectionSubtitle}>Hear what our users have to say about their experience with CareerCampus.</p>
        
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeTrack}>
            {[
              {
                name: 'Rahul Sharma',
                college: 'Joined IIT Delhi',
                text: 'CareerCampus made my college discovery process so simple. The side-by-side comparison feature helped me evaluate IITs vs NITs effectively.',
                color: 'bg-blue-500'
              },
              {
                name: 'Priya Patel',
                college: 'Joined IIM Ahmedabad',
                text: 'The video counselling session was a game changer. The expert cleared all my doubts regarding MBA specializations. Highly recommended!',
                color: 'bg-orange-500'
              },
              {
                name: 'Ankit Kumar',
                college: 'Joined AIIMS',
                text: 'Authentic reviews from current students gave me the real picture of campus life and academics. Thanks to CareerCampus for the transparency.',
                color: 'bg-emerald-500'
              },
              {
                name: 'Sneha Gupta',
                college: 'Joined NLU Delhi',
                text: 'Detailed placement reports and fee structures on CareerCampus helped me make an informed decision for my law career.',
                color: 'bg-purple-500'
              },
              {
                name: 'Vikram Singh',
                college: 'Joined NID Ahmedabad',
                text: 'The platform is super easy to use. I managed to connect with alumni through the reviews section and got valuable tips.',
                color: 'bg-pink-500'
              },
              {
                name: 'Karthik Reddy',
                college: 'Joined BITS Pilani',
                text: 'The interface is beautiful and extremely fast. Found the perfect engineering college without any hassle.',
                color: 'bg-indigo-500'
              },
              {
                name: 'Ayesha Khan',
                college: 'Joined CMC Vellore',
                text: 'I loved how accurate the medical cutoff predictions were. It saved me a lot of anxiety during counseling.',
                color: 'bg-red-500'
              },
              {
                name: 'Neha Sharma',
                college: 'Joined SRCC Delhi',
                text: 'The side-by-side comparison made it easy to choose the right commerce college for my career goals.',
                color: 'bg-teal-500'
              },
              {
                name: 'Rohan Mehta',
                college: 'Joined NALSAR Hyderabad',
                text: 'Best platform for law aspirants. The fee structures and placement stats are spot on.',
                color: 'bg-cyan-500'
              },
              {
                name: 'Aditi Verma',
                college: 'Joined Symbiosis Pune',
                text: 'I highly recommend CareerCampus to every student. The insights are verified and trustworthy.',
                color: 'bg-rose-500'
              }
            ].map((review, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
                <p className={styles.testimonialText}>"{review.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={`${styles.authorAvatar} ${review.color}`}>
                    {review.name.charAt(0)}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{review.name}</h4>
                    <p>{review.college}</p>
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
