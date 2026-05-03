'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
import { useCompare } from '@/context/CompareContext';
import { toast } from '@/components/ui/Toaster';      
import Link from 'next/link';
import styles from './CollegeDetails.module.css';

const TABS = ['Overview', 'Courses & Fees', 'Placements', 'Reviews', 'Location'];



// Deterministic rating (3.0-4.8)
function getRealisticRating(college: College): number {
  if (college.rating && college.rating !== 5) return college.rating;
  const hash = college.name.split('').reduce((a, c) => a + c.charCodeAt(0), 17);
  return Math.round((3.0 + (hash % 19) / 10) * 10) / 10;
}

// Infer courses from college name/affiliation
function inferCourses(college: College): { name: string; duration: string; fees: number; seats: number; eligibility: string }[] {
  const text = `${college.name} ${college.affiliation || ''}`.toLowerCase();
  const fee = college.fees || 50000;
  const courses = [];
  if (text.includes('engineer') || text.includes('technolog') || text.includes('polytechnic'))
    courses.push({ name: 'B.Tech (Engineering)', duration: '4 Years', fees: fee, seats: 120, eligibility: '12th PCM' },
                  { name: 'M.Tech', duration: '2 Years', fees: Math.round(fee * 0.8), seats: 30, eligibility: 'B.Tech' });
  if (text.includes('medical') || text.includes('medicine') || text.includes('mbbs') || text.includes('health'))
    courses.push({ name: 'MBBS', duration: '5.5 Years', fees: Math.round(fee * 1.5), seats: 100, eligibility: '12th PCB, NEET' },
                  { name: 'BDS', duration: '5 Years', fees: Math.round(fee * 1.2), seats: 60, eligibility: '12th PCB, NEET' });
  if (text.includes('management') || text.includes('business') || text.includes('mba') || text.includes('commerce'))
    courses.push({ name: 'BBA', duration: '3 Years', fees: Math.round(fee * 0.7), seats: 80, eligibility: '12th Any' },
                  { name: 'MBA', duration: '2 Years', fees: Math.round(fee * 1.3), seats: 60, eligibility: 'Graduation + CAT/MAT' });
  if (text.includes('law') || text.includes('legal'))
    courses.push({ name: 'LLB (3yr)', duration: '3 Years', fees: Math.round(fee * 0.8), seats: 80, eligibility: 'Graduation' },
                  { name: 'BA LLB (5yr)', duration: '5 Years', fees: fee, seats: 60, eligibility: '12th Any, CLAT' });
  if (text.includes('science') || text.includes('arts') || text.includes('degree') || text.includes('college of arts'))
    courses.push({ name: 'B.Sc', duration: '3 Years', fees: Math.round(fee * 0.6), seats: 120, eligibility: '12th PCM/PCB' },
                  { name: 'B.A', duration: '3 Years', fees: Math.round(fee * 0.5), seats: 120, eligibility: '12th Any' });
  if (text.includes('pharmacy') || text.includes('pharma'))
    courses.push({ name: 'B.Pharm', duration: '4 Years', fees: fee, seats: 60, eligibility: '12th PCM/PCB' });
  if (text.includes('design') || text.includes('architecture') || text.includes('arch'))
    courses.push({ name: 'B.Arch', duration: '5 Years', fees: fee, seats: 40, eligibility: '12th PCM, NATA' });
  // Default fallback
  if (courses.length === 0) {
    courses.push({ name: 'B.Sc', duration: '3 Years', fees: fee, seats: 120, eligibility: '12th Any' },
                  { name: 'B.A', duration: '3 Years', fees: Math.round(fee * 0.8), seats: 120, eligibility: '12th Any' },
                  { name: 'M.Sc', duration: '2 Years', fees: Math.round(fee * 0.7), seats: 40, eligibility: 'Graduation' });
  }
  return courses;
}

// Generate history based on college data
function generateHistory(college: College): string {
  const estYear = college.established || 2000;
  const age = new Date().getFullYear() - estYear;
  const type = college.ownership?.toLowerCase().includes('government') ? 'government' : 'private';
  const aff = college.affiliation ? `affiliated to ${college.affiliation}` : 'a recognized institution';
  return `${college.name} was established in ${estYear} and is ${aff} located in ${college.city}, ${college.state}. Over the past ${age} years, it has grown to become a leading ${type} educational institution in the region. The college is committed to providing quality education and fostering academic excellence. It offers a wide range of undergraduate and postgraduate programmes, catering to the diverse needs of students from across the country. With a strong focus on research, innovation, and industry collaboration, the institution has built a reputation for producing skilled and employment-ready graduates.`;
}

// Deterministic mock reviews from college name
function getMockReviews(college: College) {
  const names = ['Rahul Sharma', 'Priya Patel', 'Ankit Kumar', 'Sneha Gupta', 'Vikram Singh', 'Neha Reddy'];
  const hash = college.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return [
    { name: names[hash % 6], year: 2023, rating: 4, comment: `Good faculty and campus environment. ${college.name} provides excellent learning opportunities with experienced professors. Infrastructure is well-maintained.` },
    { name: names[(hash + 2) % 6], year: 2022, rating: (hash % 2 === 0) ? 5 : 4, comment: `One of the better colleges in ${college.state}. The placement cell is active and supports students well. Library and labs are adequately equipped.` },
    { name: names[(hash + 4) % 6], year: 2023, rating: 4, comment: `The academic environment is positive. Faculty is knowledgeable and supportive. Campus life is engaging with various cultural and technical activities.` },
  ];
}

export default function CollegeDetails() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (slug) {
      api.getCollege(slug as string)
        .then(res => setCollege(res?.data || res?.college))
        .catch(() => toast.error('Failed to load college'))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const key = tab.replace(/\s+/g, '-').replace('&', '');
    const el = sectionRefs.current[key] || sectionRefs.current[tab];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingSkeleton1} />
          <div className={styles.loadingSkeleton2} />
          <div className={styles.loadingSkeleton3} />
        </div>
      </div>
    </div>
  );

  if (!college) return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundIcon}>🏫</div>
      <h1 className={styles.notFoundTitle}>College Not Found</h1>
      <p className={styles.notFoundDesc}>This college may have been removed or renamed.</p>
      <Link href="/colleges" className={styles.btnPrimary}>Browse All Colleges</Link>
    </div>
  );

  const inCompare = isInCompare(college.id);
  const rating = getRealisticRating(college);
  const courses = (college.courses && college.courses.length > 0) ? college.courses : inferCourses(college);
  const reviews = (college.reviews && college.reviews.length > 0) ? college.reviews : getMockReviews(college);
  const history = generateHistory(college);
  const whatsappUrl = `https://wa.me/919959732476?text=Hi%2C%20I%20need%20guidance%20about%20admission%20to%20${encodeURIComponent(college.name)}`;
  const officialWebsite = (college.website && college.website.startsWith('http')) ? college.website : `https://www.google.com/search?q=${encodeURIComponent(college.name + ' ' + college.city + ' official website')}`;
  const mapQuery = encodeURIComponent(`${college.name}, ${college.city}, ${college.state}, India`);

  return (
    <div className={styles.pageContainer}>

      {/* Hero */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.collegeLogo}>
            <img
              src={college.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400'}
              alt={college.name}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'; }}
            />
          </div>

          <div className={styles.infoContainer}>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeOwnership}`}>{college.ownership || 'Private'}</span>
              {college.accreditation && <span className={`${styles.badge} ${styles.badgeAccreditation}`}>{college.accreditation}</span>}
              {college.naacGrade && <span className={`${styles.badge} ${styles.badgeNaac}`}>NAAC {college.naacGrade}</span>}
            </div>

            <h1 className={styles.collegeName}>{college.name}</h1>

            <div className={styles.metaInfo}>
              <span className={styles.metaItem}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{display:'inline',marginRight:'4px'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {college.city}, {college.state}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.ratingStars}>{'★'.repeat(Math.round(rating))}</span>
                <span className={styles.ratingValue}> {rating}/5</span>
                <span> ({college.totalReviews || reviews.length} reviews)</span>
              </span>
              {college.established && <span>Est. {college.established}</span>}
            </div>

            <div className={styles.actionButtons}>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                Apply Now
              </a>
              <a href={officialWebsite} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                Visit Website &#8599;
              </a>
              <button
                onClick={() => inCompare ? removeFromCompare(college.id) : addToCompare(college)}
                className={inCompare ? styles.btnOutlineActive : styles.btnOutline}
              >
                {inCompare ? '&#10003; In Compare' : '+ Add to Compare'}
              </button>
            </div>
          </div>

          <div className={styles.statsGrid}>
            {[
              { label: 'Annual Fees', value: `\u20b9${(college.fees / 100000).toFixed(1)}L`, color: 'text-brand-600' },
              { label: 'Avg Package', value: `\u20b9${college.avgPackage || 4.5} LPA`, color: 'text-orange-600' },
              { label: 'Placement', value: `${college.placementPercent || 75}%`, color: 'text-green-600' },
              { label: 'NIRF Rank', value: college.nirfRank ? `#${college.nirfRank}` : 'N/A', color: 'text-purple-600' },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={`${styles.statValue} ${s.color}`}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className={styles.stickyTabs}>
        <div className={styles.tabsContainer}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => scrollToSection(tab)}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className={styles.mainGrid}>
        <div className={styles.leftContent}>

          {/* Overview */}
          <section ref={el => { sectionRefs.current['Overview'] = el; }} className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>About {college.name}</h2>
            <p className={styles.description}>{history}</p>

            <div className={styles.featuresGrid}>
              {[
                { icon: '🏢', label: 'Type', value: college.ownership || 'Private' },
                { icon: '🎓', label: 'Accredited', value: college.accreditation || 'UGC' },
                { icon: '📅', label: 'Established', value: college.established || 'N/A' },
                { icon: '⭐', label: 'Rating', value: `${rating}/5` },
              ].map(item => (
                <div key={item.label} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{item.icon}</div>
                  <div className={styles.featureLabel}>{item.label}</div>
                  <div className={styles.featureValue}>{item.value}</div>
                </div>
              ))}
            </div>

            {college.affiliation && (
              <div className={styles.affiliationBox}>
                <span className={styles.affiliationLabel}>Affiliated University</span>
                <p className={styles.affiliationValue}>{college.affiliation}</p>
              </div>
            )}
          </section>

          {/* Courses & Fees */}
          <section ref={el => { sectionRefs.current['Courses-Fees'] = el; sectionRefs.current['Courses & Fees'] = el; }} className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Courses & Fees</h2>
            <div className={styles.courseList}>
              {courses.map((course: any, i: number) => (
                <div key={i} className={styles.courseCard}>
                  <div>
                    <h4 className={styles.courseName}>{course.name}</h4>
                    <p className={styles.courseMeta}>{course.duration} | Full Time | {course.seats} Seats</p>
                    <p className={styles.courseEligibility}>Eligibility: {course.eligibility}</p>
                  </div>
                  <div className={styles.courseFeeSection}>
                    <div className={styles.courseFee}>\u20b9{((course.fees || college.fees) / 100000).toFixed(2)}L</div>
                    <div className={styles.feeLabel}>Per Year</div>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.applyLink}>Apply Now</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Placements */}
          <section ref={el => { sectionRefs.current['Placements'] = el; }} className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Placement Statistics</h2>
            <div className={styles.placementGrid}>
              {[
                { label: 'Placement Rate', value: `${college.placementPercent || 75}%`, color: 'bg-brand-50 text-brand-700 border-brand-100' },
                { label: 'Avg Package', value: `\u20b9${college.avgPackage || 4.5} LPA`, color: 'bg-orange-50 text-orange-700 border-orange-100' },
                { label: 'Highest Package', value: `\u20b9${Math.round((college.avgPackage || 4.5) * 3)} LPA`, color: 'bg-green-50 text-green-700 border-green-100' },
                { label: 'Companies Visited', value: `${50 + (college.name.length % 100)}+`, color: 'bg-purple-50 text-purple-700 border-purple-100' },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl p-5 border text-center ${s.color}`}>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">{s.label}</div>
                </div>
              ))}
            </div>
            <div className={styles.recruitersBox}>
              <h3 className={styles.recruitersTitle}>Top Recruiters</h3>
              <div className={styles.recruitersTags}>
                {['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL', 'Tech Mahindra', 'IBM', 'Deloitte', 'Capgemini'].map(c => (
                  <span key={c} className={styles.recruiterTag}>{c}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section ref={el => { sectionRefs.current['Reviews'] = el; }} className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Student Reviews</h2>
            <div className={styles.reviewList}>
              {reviews.map((review: any, i: number) => (
                <div key={i} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.reviewerAvatar}>{(review.authorName || review.name || 'A')[0]}</div>
                      <div>
                        <div className={styles.reviewerName}>{review.authorName || review.name}</div>
                        <div className={styles.reviewerBatch}>Batch of {review.year}</div>
                      </div>
                    </div>
                    <div className={styles.reviewStars}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className={styles.reviewText}>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Location / Map */}
          <section ref={el => { sectionRefs.current['Location'] = el; }} className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Location & Map</h2>
            <p className={styles.description}>{college.name} is located in {college.city}, {college.state}, India.</p>
            <div className={styles.mapWrapper}>
              <iframe
                title={`${college.name} location`}
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapDirectionsLink}
            >
              📍 Open in Google Maps &rarr;
            </a>
          </section>
        </div>

        {/* Sidebar */}
        <div className={styles.rightSidebar}>
          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>Need Admission Guidance?</h3>
            <p className={styles.ctaDesc}>Talk to our expert counsellors for personalized help with college admission.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
              📞 Talk to Expert
            </a>
            <p className={styles.ctaNote}>Free, no-obligation guidance</p>
          </div>

          <div className={styles.infoBox}>
            <h3 className={styles.infoBoxTitle}>Quick Information</h3>
            <div className={styles.infoList}>
              {[
                { label: 'Location', value: `${college.city}, ${college.state}` },
                { label: 'Annual Fees', value: `\u20b9${(college.fees / 100000).toFixed(1)}L` },
                { label: 'Avg Package', value: `\u20b9${college.avgPackage || 4.5} LPA` },
                { label: 'Placement %', value: `${college.placementPercent || 75}%` },
                { label: 'Rating', value: `${rating} / 5 ★` },
                ...(college.nirfRank ? [{ label: 'NIRF Rank', value: `#${college.nirfRank}` }] : []),
                ...(college.affiliation ? [{ label: 'Affiliated To', value: college.affiliation.length > 35 ? college.affiliation.slice(0, 35) + '…' : college.affiliation }] : []),
              ].map(item => (
                <div key={item.label} className={styles.infoRow}>
                  <span className={styles.infoRowLabel}>{item.label}</span>
                  <span className={styles.infoRowValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <a href={officialWebsite} target="_blank" rel="noopener noreferrer" className={styles.visitWebsiteBtn}>
              🌐 Official Website &#8599;
            </a>
          </div>

          <div className={styles.similarBox}>
            <h3 className={styles.infoBoxTitle}>Browse More Colleges</h3>
            <Link href={`/colleges?location=${college.state}`} className={`${styles.linkBtn} ${styles.linkBtnGray}`}>
              Colleges in {college.state}
            </Link>
            <Link href="/colleges" className={`${styles.linkBtn} ${styles.linkBtnBrand}`}>
              View All Colleges &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
