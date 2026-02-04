import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import dataService from '../data/dataService';
import MenuItemCard from '../components/MenuItemCard';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const { itemFavorites, isFavoriteItem } = useFavorites();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFavorites, setShowFavorites] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const items = await dataService.getMenuItems();
      setMenuItems(items);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu:', err);
      const errorMsg = err.message || 'Failed to load menu items';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get unique, sorted, non-empty categories
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category).filter(Boolean))).sort()];

  // Calculate min and max price for slider
  const prices = menuItems.map(item => item.price || 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 1000;
  
  useEffect(() => {
    if (prices.length && (priceRange[0] === 0 && priceRange[1] === 1000)) {
      setPriceRange([minPrice, maxPrice]);
    }
    // eslint-disable-next-line
  }, [menuItems]);

  // Filter and sort menu items
  let filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesPrice = (item.price >= priceRange[0] && item.price <= priceRange[1]);
      const matchesFavorite = !showFavorites || isFavoriteItem(item._id);
      return matchesSearch && matchesCategory && matchesPrice && matchesFavorite && item.available;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading delicious menu...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch the freshest items</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-xl text-red-600 mb-2 font-semibold">Error Loading Menu</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchMenu}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-16 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-orange-200 text-lg font-semibold mb-2 uppercase tracking-wider">Premium Selection</p>
              <h1 className="text-5xl md:text-6xl font-black mb-3">Our Menu</h1>
              <p className="text-xl opacity-90 max-w-3xl">
                Discover {menuItems.length} handpicked dishes crafted by our expert chefs using the finest ingredients
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/20">
            <div>
              <p className="text-orange-200 text-sm font-semibold">Total Items</p>
              <p className="text-3xl font-black">{menuItems.length}</p>
            </div>
            <div>
              <p className="text-orange-200 text-sm font-semibold">Categories</p>
              <p className="text-3xl font-black">{categories.length - 1}</p>
            </div>
            <div>
              <p className="text-orange-200 text-sm font-semibold">Favorites</p>
              <p className="text-3xl font-black">{itemFavorites.length}</p>
            </div>
            <div>
              <p className="text-orange-200 text-sm font-semibold">Avg Rating</p>
              <p className="text-3xl font-black">⭐ 4.8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search Bar - Premium */}
        <div className="mb-10">
          <div className="relative group">
            <input
              type="text"
              placeholder="🔍 Search dishes, ingredients, cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-8 py-5 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 text-lg font-medium transition shadow-lg group-hover:shadow-xl group-hover:border-orange-300"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Advanced Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-l-4 border-orange-500">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">⚙️</span> Filter & Sort
            </h3>
            <p className="text-gray-600 mt-2">Customize your search to find exactly what you want</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Category Filter */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Category</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 font-semibold appearance-none cursor-pointer bg-white transition hover:border-orange-300"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 font-semibold appearance-none cursor-pointer bg-white transition hover:border-orange-300"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price Low-High</option>
                  <option value="price-high">Price High-Low</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Max Price</label>
              <div className="relative">
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  max={maxPrice}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 font-semibold transition hover:border-orange-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold">₹</span>
              </div>
            </div>

            {/* View Mode */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">View</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-3 rounded-lg font-bold transition border-2 ${
                    viewMode === 'grid'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-orange-300'
                  }`}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-3 rounded-lg font-bold transition border-2 ${
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-orange-300'
                  }`}
                >
                  ☰ List
                </button>
              </div>
            </div>

            {/* Favorites Filter */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Favorites</label>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`w-full py-3 px-4 rounded-lg font-bold transition border-2 ${
                  showFavorites
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-red-300'
                }`}
              >
                {showFavorites ? '❤️ Only' : '🤍 All Items'}
              </button>
            </div>

            {/* Clear Filters */}
            <div className="lg:col-span-1 flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSortBy('name');
                  setPriceRange([minPrice, maxPrice]);
                  setShowFavorites(false);
                }}
                className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition transform hover:scale-105"
              >
                ✕ Clear All
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedCategory !== 'All' || showFavorites) && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2 flex-wrap items-center">
              <span className="text-sm font-semibold text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-blue-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-purple-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              {showFavorites && (
                <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  Favorites Only
                  <button
                    onClick={() => setShowFavorites(false)}
                    className="hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setShowFavorites(false);
                  setPriceRange([minPrice, maxPrice]);
                }}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm ml-auto"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        
        {/* Results Section */}
        <div>
          {/* Results Header */}
          <div className="mb-10 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-l-4 border-orange-500">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">Menu Results</p>
              <h3 className="text-3xl font-black text-gray-900">
                {filteredItems.length}
                <span className="text-gray-600 font-bold text-xl ml-2">
                  {filteredItems.length === 1 ? 'Dish Found' : 'Dishes Found'}
                </span>
              </h3>
            </div>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex flex-col items-center justify-center">
              <div className="text-8xl mb-6 filter opacity-50">🍽️</div>
              <h3 className="text-4xl font-black text-gray-900 mb-3">No Dishes Match Your Search</h3>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                We couldn't find any dishes matching your criteria. Try adjusting your filters or search term to discover more delicious options.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSortBy('name');
                    setPriceRange([minPrice, maxPrice]);
                    setShowFavorites(false);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-10 py-4 rounded-xl font-bold text-lg transition-all"
                >
                  View All Menu
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Grid/List */}
              <div className={viewMode === 'grid' ? 
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max' : 
                'space-y-4'
              }>
                {filteredItems.map((item, index) => (
                  <MenuItemCard key={item._id} item={item} viewMode={viewMode} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
