'use client';
import { useState } from 'react';

interface FAQ { question: string; answer: string; }

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all shadow-sm">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-bold text-gray-900 leading-tight">{faq.question}</span>
            <span className={`text-brand-600 text-xl font-bold transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              ⌄
            </span>
          </button>
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'pb-6 opacity-100 max-h-96' : 'max-h-0 opacity-0'}`}
          >
            <div className="text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-4">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
