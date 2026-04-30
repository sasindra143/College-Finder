'use client';
import { useState, useEffect } from 'react';
import { api, College } from '@/lib/api';
import { HorizontalCollegeCard } from '@/components/colleges/HorizontalCollegeCard';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import Link from 'next/link';

export default function EngineeringCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getColleges({ limit: 10, sortBy: 'nirfRank', sortOrder: 'asc' })
      .then(res => setColleges(res.colleges))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Careers360 Style Breadcrumbs */}
      <div className="bg-white pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex gap-2">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/colleges" className="hover:text-brand-600">Colleges In India</Link>
          <span>/</span>
          <span className="text-gray-900">Best Engineering Colleges In India</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Best Engineering Colleges in India</h1>
        
        {/* Article-like Description */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">
          <p className="text-gray-600 leading-relaxed font-medium mb-6">
            <strong>Best Engineering Colleges In India:</strong> There are over 9,000 engineering colleges in India. 
            Of these, approximately 6,000 are private and 3,000 are government establishments. 
            Among all the Indian engineering colleges, <strong>IIT Madras</strong> ranks top based on NIRF ranking. 
            The admission to these colleges is primarily done through national-level exams like JEE Main and GATE.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-lg">🎓</div>
            <div>
              <div className="text-sm font-black text-gray-900 uppercase">Education Expert</div>
              <div className="text-xs text-gray-400 font-bold">Updated on April 2026</div>
            </div>
          </div>
        </div>

        {/* Featured Colleges Slider (Simulated) */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Featured Colleges</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {colleges.slice(0, 4).map(c => (
              <div key={c.id} className="min-w-[300px] bg-white rounded-3xl p-6 shadow-sm border border-gray-100 group cursor-pointer hover:border-brand-500 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                    <img src={c.imageUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 leading-tight group-hover:text-brand-600">{c.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{c.city}, {c.state}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-[10px] font-bold">NIRF #{c.nirfRank}</span>
                  <span className="text-xs font-black text-gray-900">{c.rating} ★</span>
                </div>
                <button className="w-full py-3 bg-brand-50 text-brand-600 rounded-xl text-xs font-black group-hover:bg-brand-600 group-hover:text-white transition-all">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-6 border-b border-gray-50 pb-4">Sort By</h3>
              <div className="space-y-4">
                {['Careers360 Ranking', 'Alphabetically', 'Popularity', 'NIRF Ranking', 'Lowest to Highest Fees'].map(sort => (
                  <label key={sort} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-brand-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-brand-500 transition-all" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900">{sort}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Showing {colleges.length} Colleges</p>
            </div>
            
            {loading ? (
              <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-6">
                {colleges.map(c => <HorizontalCollegeCard key={c.id} college={c} />)}
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold">?</div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <FAQAccordion faqs={[
            { 
              question: "Which is the No. 1 engineering college in India?", 
              answer: "As per the NIRF (National Institutional Ranking Framework) 2024, Indian Institute of Technology (IIT) Madras is ranked as the No. 1 engineering college in India for the ninth consecutive year." 
            },
            { 
              question: "How many engineering colleges are there in India?", 
              answer: "There are approximately 9,212 engineering colleges in India. Of these, 6,854 are private institutions and 2,348 are government establishments." 
            },
            { 
              question: "What are the top entrance exams for engineering in India?", 
              answer: "The primary national-level entrance exams are JEE Main (for NITs/IIITs) and JEE Advanced (for IITs). Other major exams include GATE (for post-graduation), and state-level exams like KCET (Karnataka), MHT CET (Maharashtra), and AP EAMCET (Andhra Pradesh)." 
            },
            { 
              question: "What is the average fee for engineering in India?", 
              answer: "The tuition fee ranges significantly from ₹25,000 to over ₹10,00,000 per year, depending on the institution's ownership (Government vs Private) and infrastructure." 
            }
          ]} />
        </div>
      </div>
    </div>
  );
}
