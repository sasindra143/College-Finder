import Link from 'next/link';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import { faqs } from '@/data/faqs';
import styles from './FAQ.module.css';

export default function FAQPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        <header className={styles.headerSection}>
          <span className={styles.badge}>HELP CENTER</span>
          <h1 className={styles.title}>
            Frequently Asked <span className={styles.titleHighlight}>Questions</span>
          </h1>
          <p className={styles.subtitle}>
            Everything you need to know about navigating CareerCampus and making the right college decision.
          </p>
        </header>

        <section className={styles.accordionWrapper}>
          <FaqAccordion faqs={faqs} />
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaIcon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <h3 className={styles.ctaTitle}>Still have questions?</h3>
          <p className={styles.ctaDescription}>
            Can't find what you're looking for? Head over to our discussion forum and ask the community!
          </p>
          <Link href="/qa" className={styles.ctaButton}>
            Go to Q&A Forum
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </section>

      </div>
    </div>
  );
}
