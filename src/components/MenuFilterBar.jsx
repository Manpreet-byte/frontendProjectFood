import React, { useEffect, useState } from 'react';

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={() => onClick(label)}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-transform hover:scale-105 whitespace-nowrap ${active ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-700'}`}
  >
    {label}
  </button>
);

export default function MenuFilterBar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
  priceMaxLimit = 500,
  viewMode,
  onViewChange,
  favoritesOnly,
  onFavoritesToggle,
  onClear
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm || '');

  // debounce local search to avoid excessive parent updates
  useEffect(() => {
    const t = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(t);
  }, [localSearch]);

  useEffect(() => setLocalSearch(searchTerm || ''), [searchTerm]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            <input
              aria-label="Search dishes, ingredients, cuisines"
              type="search"
              placeholder="Search dishes, ingredients, cuisines..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">✕</button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white"
            aria-label="Sort dishes"
          >
            <option value="name-asc">Name A–Z</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Max Price</label>
            <input
              type="range"
              min="0"
              max={priceMaxLimit}
              value={maxPrice || 0}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-36"
            />
            <span className="text-sm font-bold text-orange-600">₹{maxPrice || 0}</span>
          </div>

          <button
            onClick={onFavoritesToggle}
            className={`px-3 py-2 rounded-lg border ${favoritesOnly ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-gray-200'}`}
            title="Toggle favorites"
          >
            {favoritesOnly ? '★ Favorites' : '☆ All Items'}
          </button>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <button onClick={() => onViewChange('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}>⊞</button>
            <button onClick={() => onViewChange('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}>☰</button>
          </div>

          <button onClick={onClear} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm">Clear</button>
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <Chip key={c} label={c} active={c === selectedCategory} onClick={onCategoryChange} />
        ))}
      </div>
    </div>
  );
}
