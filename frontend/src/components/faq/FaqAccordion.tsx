'use client';

import { useState } from 'react';
import styles from './FaqAccordion.module.css';

interface FAQ {
  question: string;
  answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordionContainer}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div 
            key={index} 
            className={`${styles.faqItem} ${isOpen ? styles.faqItemActive : ''}`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className={styles.faqHeader}
            >
              <h3 className={`${styles.faqQuestion} ${isOpen ? styles.faqQuestionActive : ''}`}>
                <span className={styles.qPrefix}>Q.</span> 
                {faq.question}
              </h3>
              <div className={`${styles.iconWrapper} ${isOpen ? styles.iconWrapperActive : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </button>
            
            <div 
              className={styles.faqContentWrapper}
              style={{ maxHeight: isOpen ? '500px' : '0', opacity: isOpen ? 1 : 0 }}
            >
              <div className={styles.faqContent}>
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
