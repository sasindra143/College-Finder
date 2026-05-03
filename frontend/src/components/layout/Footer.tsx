'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/auth')) return null;

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        
        {/* Top Bar: Logo, Horizontal Links, Social Icons */}
        <div className={styles.topBar}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-black text-3xl tracking-tight text-white uppercase">
              CAREER<span className="text-gray-400 font-light">CAMPUS</span>
            </span>
          </Link>

          {/* Horizontal Links */}
          <div className={styles.horizontalLinks}>
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/colleges" className="hover:text-gray-300 transition-colors">Colleges</Link>
            <Link href="/medicine" className="hover:text-gray-300 transition-colors">Medical</Link>
            <Link href="/law" className="hover:text-gray-300 transition-colors">Law</Link>
            <Link href="/compare" className="hover:text-gray-300 transition-colors">Compare</Link>
            <Link href="/testimonials" className="hover:text-gray-300 transition-colors">Reviews</Link>
            <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
          </div>

          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <a href="#" className="w-10 h-10 flex items-center justify-center text-white rounded-md bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:opacity-90 transition-opacity">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center text-white rounded-md bg-[#FF0000] hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768C6.254 20 12 20 12 20s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center text-white rounded-md bg-[#1877F2] hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center text-white rounded-md bg-[#0A66C2] hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center text-white rounded-md bg-black border border-gray-700 hover:opacity-90 transition-opacity">
              <span className="font-bold text-lg">X</span>
            </a>
          </div>
        </div>

        {/* 4-Column Layout */}
        <div className={styles.columnsGrid}>
          
          {/* Column 1 */}
          <div>
            <h3 className={styles.columnHeader}>Top Streams</h3>
            <div className={styles.linkList}>
              <Link href="/engineering" className={styles.linkItem}>Engineering Colleges</Link>
              <Link href="/medicine" className={styles.linkItem}>Medical Colleges</Link>
              <Link href="/management" className={styles.linkItem}>Management (MBA)</Link>
              <Link href="/law" className={styles.linkItem}>Law Colleges</Link>
              <Link href="/design" className={styles.linkItem}>Design Institutes</Link>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className={styles.columnHeader}>Explore Colleges</h3>
            <div className={styles.linkList}>
              <Link href="/colleges" className={styles.linkItem}>All Top Colleges</Link>
              <Link href="/colleges?type=Government" className={styles.linkItem}>Government Colleges</Link>
              <Link href="/colleges?type=Private" className={styles.linkItem}>Private Colleges</Link>
              <Link href="/compare" className={styles.linkItem}>College Compare Tool</Link>
              <Link href="/testimonials" className={styles.linkItem}>Read Student Reviews</Link>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className={styles.columnHeader}>Your Account</h3>
            <div className={styles.linkList}>
              <Link href="/auth/login" className={styles.linkItem}>Student Login</Link>
              <Link href="/auth/signup" className={styles.linkItem}>Create New Account</Link>
              <Link href="/dashboard" className={styles.linkItem}>My Dashboard</Link>
              <Link href="/dashboard" className={styles.linkItem}>Saved Colleges</Link>
              <Link href="/dashboard" className={styles.linkItem}>Saved Comparisons</Link>
            </div>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className={styles.columnHeader}>Resources</h3>
            <div className={styles.linkList}>
              <Link href="/" className={styles.linkItem}>Home</Link>
              <Link href="/colleges" className={styles.linkItem}>Search Assistant</Link>
              <Link href="/engineering" className={styles.linkItem}>B.Tech Guide</Link>
              <Link href="/medicine" className={styles.linkItem}>MBBS Guide</Link>
              <Link href="/management" className={styles.linkItem}>MBA Prep</Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} CareerCampus. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
