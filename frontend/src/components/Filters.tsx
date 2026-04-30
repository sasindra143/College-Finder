'use client';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

interface FiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <h2 className="text-xl font-black text-gray-900 mb-4">Filters</h2>
      
      {/* State Filter */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">State Location</label>
        <select 
          value={filters.location || ''}
          onChange={e => updateFilter('location', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all outline-none"
        >
          <option value="">All States</option>
          {INDIAN_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Ownership Filter */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ownership</label>
        <select 
          value={filters.ownership || ''}
          onChange={e => updateFilter('ownership', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all outline-none"
        >
          <option value="">All Types</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
          <option value="Deemed">Deemed</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Min Rating</label>
        <select 
          value={filters.minRating || ''}
          onChange={e => updateFilter('minRating', e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 transition-all outline-none"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ ★</option>
          <option value="4.0">4.0+ ★</option>
          <option value="3.5">3.5+ ★</option>
          <option value="3.0">3.0+ ★</option>
        </select>
      </div>

      {/* Fees Range */}
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Max Fees (₹/year)</label>
        <input 
          type="range"
          min="50000"
          max="3000000"
          step="50000"
          value={filters.maxFees || 3000000}
          onChange={e => updateFilter('maxFees', e.target.value)}
          className="w-full accent-brand-600 cursor-pointer"
        />
        <div className="text-xs font-bold text-brand-600">
          {filters.maxFees && Number(filters.maxFees) < 3000000 
            ? `Up to ₹${(Number(filters.maxFees) / 100000).toFixed(1)} Lakhs` 
            : 'Any Amount'}
        </div>
      </div>
    </div>
  );
}
