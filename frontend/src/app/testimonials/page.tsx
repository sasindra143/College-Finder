'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TestimonialsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    {
      name: 'Rahul Sharma',
      college: 'Joined IIT Delhi',
      stream: 'Engineering',
      text: 'CareerCampus made my college discovery process so simple. The side-by-side comparison feature helped me evaluate IITs vs NITs effectively, and I found the perfect match for my rank.',
      color: 'bg-blue-500',
      delay: '0.1s'
    },
    {
      name: 'Priya Patel',
      college: 'Joined IIM Ahmedabad',
      stream: 'Management',
      text: 'The video counselling session was an absolute game changer. The expert cleared all my doubts regarding MBA specializations and helped me prepare for the final interview rounds.',
      color: 'bg-orange-500',
      delay: '0.2s'
    },
    {
      name: 'Ankit Kumar',
      college: 'Joined AIIMS',
      stream: 'Medicine',
      text: 'Authentic reviews from current students gave me the real picture of campus life and academics. Thanks to CareerCampus for the transparency which other sites lack.',
      color: 'bg-emerald-500',
      delay: '0.3s'
    },
    {
      name: 'Sneha Gupta',
      college: 'Joined NLU Delhi',
      stream: 'Law',
      text: 'I was very confused about which NLU to target. The detailed placement reports and fee structures on CareerCampus helped my parents and me make an informed financial decision.',
      color: 'bg-purple-500',
      delay: '0.4s'
    },
    {
      name: 'Vikram Singh',
      college: 'Joined NID Ahmedabad',
      stream: 'Design',
      text: 'The platform is super easy to use. The design and layout itself inspired me! I managed to connect with alumni through the reviews section and got valuable portfolio tips.',
      color: 'bg-pink-500',
      delay: '0.5s'
    },
    {
      name: 'Riya Sen',
      college: 'Joined SRCC, Delhi',
      stream: 'Commerce',
      text: 'Accurate cutoff information and real-time updates on admission deadlines saved me from missing out on top Delhi University colleges.',
      color: 'bg-yellow-500',
      delay: '0.6s'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-12 md:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-block px-5 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-extrabold mb-6 shadow-sm tracking-wide uppercase">
            🌟 Real Stories, Real Success
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Student Testimonials</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Hear from thousands of students who found their dream college and launched successful careers with the help of CareerCampus.
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in-up relative overflow-hidden group"
              style={{ animationDelay: review.delay }}
            >
              {/* Decorative top border */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${review.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex text-yellow-400 text-xl tracking-widest">★★★★★</div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {review.stream}
                </span>
              </div>
              
              <p className="text-[1.05rem] text-gray-600 font-medium italic mb-8 leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50 mt-auto">
                <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center font-bold text-white text-lg shadow-inner`}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm font-medium text-gray-500">{review.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-white p-12 rounded-[2.5rem] border border-brand-100 shadow-2xl shadow-brand-500/10 fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to write your own success story?</h2>
          <p className="text-gray-600 font-medium mb-8 max-w-xl mx-auto">
            Join 2 Million+ students who use CareerCampus to discover, compare, and get admitted into top institutions.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/colleges" className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-1">
              Start Exploring
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
