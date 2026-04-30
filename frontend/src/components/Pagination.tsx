'use client';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, hasNext, hasPrev, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 pb-8">
      <button
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
      >
        Previous
      </button>
      
      <span className="text-sm font-black text-gray-900 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
        {page} <span className="text-gray-400 mx-1">/</span> {totalPages}
      </span>
      
      <button
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
      >
        Next
      </button>
    </div>
  );
}
