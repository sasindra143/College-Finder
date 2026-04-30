'use client';
import Link from 'next/link';
import { College } from '@/lib/api';
import { useCompare } from '@/context/CompareContext';
import { toast } from '@/components/ui/Toaster';

interface Props { college: College; }

export function HorizontalCollegeCard({ college }: Props) {
  const { addToCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(college.id);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo/Image */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          <img 
            src={college.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200'} 
            alt={college.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-1 hover:text-brand-600 cursor-pointer">
                <Link href={`/colleges/${college.slug}`}>{college.name}</Link>
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 font-medium mb-3">
                <span className="flex items-center gap-1">🏛️ Ownership: {college.ownership}</span>
                <span className="flex items-center gap-1">📍 {college.city}, {college.state}</span>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-accent-50 text-accent-700 rounded-lg font-bold text-xs">
                  {college.rating} ★ <span className="text-gray-400 font-medium ml-1">({college.totalReviews} Reviews)</span>
                </div>
                {college.nirfRank && (
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    NIRF Ranking: <span className="text-gray-900">#{college.nirfRank}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full md:w-32">
              {college.website && (
                <a 
                  href={college.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-brand-50 text-brand-600 rounded-lg text-xs font-black text-center border border-brand-200 hover:bg-brand-100 transition-all"
                >
                  Official Site
                </a>
              )}
              <button className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-black transition-all">
                Brochure
              </button>
              <button className="w-full py-2 bg-white border border-brand-200 text-brand-600 rounded-lg text-xs font-black hover:bg-brand-50 transition-all">
                Enquire
              </button>
              <button 
                onClick={() => !inCompare && addToCompare(college)}
                className={`w-full py-2 rounded-lg text-xs font-black transition-all border
                  ${inCompare ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-600 hover:border-brand-500'}`}
              >
                {inCompare ? '✓ Compare' : 'Compare'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer / Courses Tag */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-4 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest whitespace-nowrap">B.Tech Courses:</span>
        {['Computer Science', 'Electrical', 'Mechanical', 'Civil'].map(course => (
          <span key={course} className="text-[10px] font-bold text-gray-400 whitespace-nowrap hover:text-brand-500 cursor-pointer">{course}</span>
        ))}
      </div>
    </div>
  );
}
