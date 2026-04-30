'use client';

interface SearchBarProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export default function SearchBar({ filters, setFilters }: SearchBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  return (
    <div className="relative mb-8 group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by college name, city or state..."
        value={filters.search || ''}
        onChange={handleSearchChange}
        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all outline-none text-gray-900 font-medium placeholder-gray-400"
      />
    </div>
  );
}
