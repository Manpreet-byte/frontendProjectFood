import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import MenuItemCard from '../components/MenuItemCard';
import MenuFilterBar from '../components/MenuFilterBar';
import { useNavigate } from 'react-router-dom';
import dataService from '../data/dataService';

function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/.test(url);
}

function Lightbox({ images = [], start = null, onClose }) {
  const [idx, setIdx] = useState(start ? images.indexOf(start) : 0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <button 
        onClick={onClose} 
        className="absolute right-6 top-6 text-white text-3xl hover:text-orange-400 transition-colors"
      >
        ✕
      </button>
      <button 
        onClick={prev} 
        className="absolute left-6 text-white text-5xl hover:text-orange-400 transition-colors"
      >
        ‹
      </button>
      <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
        <img 
          src={images[idx]} 
          alt={`lightbox-${idx}`} 
          className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl" 
          loading="lazy" 
        />
      </div>
      <button 
        onClick={next} 
        className="absolute right-6 text-white text-5xl hover:text-orange-400 transition-colors"
      >
        ›
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

export default function Restaurant() {
  const { isFavoriteRestaurant, addFavoriteRestaurant, removeFavoriteRestaurant, isFavoriteItem } = useFavorites();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  // Menu UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [maxPrice, setMaxPrice] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurants = await dataService.getRestaurants();
        setRestaurant(restaurants[0] || null);
      } catch (err) {
        setError('Unable to load restaurant info');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  // derive categories and price range
  const { allCategories, computedMaxPrice } = useMemo(() => {
    const cats = new Set();
    let maxP = 0;
    if (restaurant && restaurant.sections) {
      restaurant.sections.forEach((s) => {
        (s.items || []).forEach((it) => {
          if (it.category) cats.add(it.category);
          const price = Number(it.price || it.price === 0 ? it.price : 0);
          if (price > maxP) maxP = price;
        });
      });
    }
    return { allCategories: ['All', ...Array.from(cats)], computedMaxPrice: maxP || 500 };
  }, [restaurant]);

  useEffect(() => {
    if (computedMaxPrice && maxPrice == null) setMaxPrice(computedMaxPrice);
  }, [computedMaxPrice]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-xl text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-xl text-gray-600 font-semibold">No restaurant configured yet.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden group">
        {/* Floating decorative emojis to add motion and personality */}
        <motion.div
          className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2 text-3xl pointer-events-none"
          initial={{ x: 0 }}
          animate={{ x: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <span className="drop-shadow-lg">🍕</span>
          <span className="drop-shadow-lg">🍔</span>
          <span className="drop-shadow-lg">🍰</span>
        </motion.div>
        {restaurant.coverImage ? (
          <img 
            src={restaurant.coverImage} 
            alt={restaurant.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-7xl mb-4">🍽️</div>
              <p className="text-4xl font-black">{restaurant.name}</p>
            </div>
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

        {/* Restaurant Header Info + Favorite Button */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white flex items-center justify-between">
          <div className="container mx-auto flex items-center gap-4">
            <div>
              <h1 className="text-5xl font-black mb-2">{restaurant.name}</h1>
              <p className="text-xl opacity-90 max-w-2xl">{restaurant.description}</p>
            </div>
            {/* Favorite Button */}
            <button
              aria-label={isFavoriteRestaurant(restaurant._id) ? 'Unfavorite restaurant' : 'Favorite restaurant'}
              onClick={() => {
                isFavoriteRestaurant(restaurant._id)
                  ? removeFavoriteRestaurant(restaurant._id)
                  : addFavoriteRestaurant(restaurant._id);
              }}
              className={`ml-6 text-4xl focus:outline-none transition-transform hover:scale-110 ${isFavoriteRestaurant(restaurant._id) ? 'text-red-400' : 'text-white opacity-70 hover:text-red-400'}`}
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {isFavoriteRestaurant(restaurant._id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Key Metrics - Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 -mt-24 relative z-10">
          {/* Rating */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">⭐</div>
              <span className="text-sm font-bold text-gray-500">RATING</span>
            </div>
            <p className="text-4xl font-black text-orange-600 mb-2">{restaurant.rating || '4.8'}</p>
            <p className="text-sm text-gray-600">out of 5 stars</p>
          </div>

          {/* Delivery Time */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">⚡</div>
              <span className="text-sm font-bold text-gray-500">DELIVERY</span>
            </div>
            <p className="text-3xl font-black text-blue-600 mb-2">{restaurant.deliveryTime || '30-45'}</p>
            <p className="text-sm text-gray-600">minutes</p>
          </div>

          {/* Minimum Order */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">💰</div>
              <span className="text-sm font-bold text-gray-500">MIN ORDER</span>
            </div>
            <p className="text-3xl font-black text-green-600 mb-2">₹{restaurant.minOrder || '300'}</p>
            <p className="text-sm text-gray-600">free delivery above</p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl">✅</div>
              <span className="text-sm font-bold text-gray-500">STATUS</span>
            </div>
            <p className="text-2xl font-black text-purple-600 mb-2">Open Now</p>
            <p className="text-sm text-gray-600">{restaurant.hours || '24/7'}</p>
          </div>
        </div>

        {/* Contact & Specialties Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-black mb-8 text-gray-900">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="text-4xl flex-shrink-0">📍</div>
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">ADDRESS</p>
                  <p className="text-lg text-gray-900 font-semibold">{restaurant.address}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-4xl flex-shrink-0">📞</div>
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">PHONE</p>
                  <a href={`tel:${restaurant.phone}`} className="text-lg text-orange-600 font-semibold hover:text-orange-700 transition">
                    {restaurant.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-4xl flex-shrink-0">⏰</div>
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">OPENING HOURS</p>
                  <p className="text-lg text-gray-900 font-semibold">{restaurant.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-black mb-6 text-gray-900">Specialties</h2>
            <div className="flex flex-wrap gap-3">
              {restaurant.specialties && restaurant.specialties.length > 0 ? (
                restaurant.specialties.map((s, i) => (
                  <span 
                    key={i} 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-110"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No specialties listed</p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-4xl font-black mb-6 text-gray-900">About {restaurant.name}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {restaurant.longDescription || restaurant.description || 'Welcome to our restaurant! We pride ourselves on delivering the finest dining experience.'}
          </p>
          
          {/* Founder & History Section */}
          {(restaurant.history || restaurant.founderName) && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">📜</span> Our Story
              </h3>
              {restaurant.history && (
                <p className="text-gray-600 leading-relaxed mb-6">{restaurant.history}</p>
              )}
              
              {/* Founder Card */}
              {restaurant.founderName && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-3xl text-white shadow-lg flex-shrink-0">
                    👨‍🍳
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-semibold mb-1">FOUNDED BY</p>
                    <p className="text-xl font-bold text-gray-900">{restaurant.founderName}</p>
                    {restaurant.foundedYear && (
                      <p className="text-gray-600">Est. {restaurant.foundedYear}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Awards Section */}
          {restaurant.awards && restaurant.awards.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span> Awards & Recognition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.awards.map((award, i) => (
                  <div key={i} className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="text-4xl">🏅</div>
                    <div>
                      <p className="font-bold text-gray-900">{award.title}</p>
                      <p className="text-sm text-gray-600">{award.organization} • {award.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {restaurant.certifications && restaurant.certifications.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Certifications</h4>
              <div className="flex flex-wrap gap-3">
                {restaurant.certifications.map((cert, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <span>✓</span> {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Why Choose Us */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-10 pt-8 border-t border-gray-200">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">🍽️</div>
              <h4 className="font-bold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-sm text-gray-700">We use only the freshest ingredients sourced from trusted local suppliers.</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-bold text-gray-900 mb-2">Super Fast</h4>
              <p className="text-sm text-gray-700">Enjoy quick and reliable delivery right to your doorstep in 30-45 minutes.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">❤️</div>
              <h4 className="font-bold text-gray-900 mb-2">Customer Care</h4>
              <p className="text-sm text-gray-700">Your satisfaction is our priority, guaranteed or your money back.</p>
            </div>
          </div>
        </div>

        {/* Restaurant Images Gallery */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-gray-900">Our Restaurant</h2>
          
          {restaurant.gallery && restaurant.gallery.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl mb-6 group cursor-zoom-in">
                <img
                  src={restaurant.gallery[mainIndex]}
                  alt={`${restaurant.name}-photo-${mainIndex}`}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onClick={() => setPreviewImage(restaurant.gallery[mainIndex])}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-4">
                {restaurant.gallery.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainIndex(idx)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden ring-4 transition-all transform hover:scale-105 ${
                      idx === mainIndex ? 'ring-orange-500 shadow-lg' : 'ring-gray-200 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Show photo ${idx + 1}`}
                  >
                    <img src={g} alt={`thumb-${idx}`} className="h-24 w-36 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Default gallery if none exists */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-lg col-span-2 row-span-2">
                <img 
                  src={restaurant.coverImage || restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400" 
                  alt="Restaurant interior"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400" 
                  alt="Restaurant ambiance"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        {restaurant.features && restaurant.features.length > 0 && (
          <div className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <h2 className="text-3xl font-black mb-6 text-gray-900">Restaurant Features</h2>
            <div className="flex flex-wrap gap-4">
              {restaurant.features.map((feature, i) => (
                <span key={i} className="bg-white px-5 py-3 rounded-full shadow-md text-gray-800 font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                  <span className="text-orange-500">✓</span> {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section - Keep existing for backwards compatibility */}
        {restaurant.gallery && restaurant.gallery.length > 0 && (
          <div className="mb-16 hidden">
            <h2 className="text-4xl font-black mb-8 text-gray-900">Our Gallery</h2>
            
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl mb-6 group cursor-zoom-in">
              <img
                src={restaurant.gallery[mainIndex]}
                alt={`${restaurant.name}-photo-${mainIndex}`}
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onClick={() => setPreviewImage(restaurant.gallery[mainIndex])}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-4">
              {restaurant.gallery.map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainIndex(idx)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden ring-4 transition-all transform hover:scale-105 ${
                    idx === mainIndex ? 'ring-orange-500 shadow-lg' : 'ring-gray-200 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Show photo ${idx + 1}`}
                >
                  <img src={g} alt={`thumb-${idx}`} className="h-24 w-32 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {restaurant.videos && restaurant.videos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-black mb-8 text-gray-900">Watch Our Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurant.videos.map((v, i) => (
                <div key={i} className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
                  {isYouTubeUrl(v) ? (
                    <iframe
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      src={v.includes('embed') ? v : v.replace('watch?v=', 'embed/')}
                      title={`video-${i}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={v} controls className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Sections with Filters */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-6 text-gray-900">Our Menu</h2>

          <MenuFilterBar
            categories={allCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={(c) => setSelectedCategory(c)}
            searchTerm={searchTerm}
            onSearchChange={(s) => setSearchTerm(s)}
            sortBy={sortBy}
            onSortChange={(s) => setSortBy(s)}
            maxPrice={maxPrice}
            onMaxPriceChange={(p) => setMaxPrice(p)}
            priceMaxLimit={computedMaxPrice}
            viewMode={viewMode}
            onViewChange={(v) => setViewMode(v)}
            favoritesOnly={favoritesOnly}
            onFavoritesToggle={() => setFavoritesOnly((s) => !s)}
            onClear={() => { setSearchTerm(''); setSelectedCategory('All'); setSortBy('name-asc'); setMaxPrice(computedMaxPrice); setViewMode('grid'); setFavoritesOnly(false); }}
          />

          {restaurant.sections && restaurant.sections.length > 0 ? (
            <div className="space-y-12">
              {restaurant.sections.map((section) => {
                // filter and sort items for this section
                const items = section.items || [];
                const filtered = items.filter((it) => {
                  if (selectedCategory && selectedCategory !== 'All' && it.category !== selectedCategory) return false;
                  if (typeof maxPrice === 'number' && maxPrice > 0 && Number(it.price || 0) > Number(maxPrice)) return false;
                  if (favoritesOnly && !isFavoriteItem(it._id)) return false;
                  const q = searchTerm.trim().toLowerCase();
                  if (!q) return true;
                  const haystack = [it.name, it.description, (it.ingredients || []).join(' '), it.cuisine, it.category].filter(Boolean).join(' ').toLowerCase();
                  return haystack.includes(q);
                });

                const sorted = filtered.sort((a, b) => {
                  if (sortBy === 'price-asc') return (Number(a.price || 0) - Number(b.price || 0));
                  if (sortBy === 'price-desc') return (Number(b.price || 0) - Number(a.price || 0));
                  // default name-asc
                  return String(a.name || '').localeCompare(String(b.name || ''));
                });

                if (sorted.length === 0) return null;

                return (
                  <div key={section.title}>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h3>
                        {section.description && <p className="text-gray-600">{section.description}</p>}
                      </div>
                      <div className="text-sm text-gray-500">{sorted.length} items</div>
                    </div>

                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                      {sorted.map((it, idx) => (
                        <MenuItemCard key={it._id || `${section.title}-${idx}`} item={it} viewMode={viewMode} index={idx} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">No menu sections configured for this restaurant.</div>
          )}
        </div>

        {/* Offers & Promotions Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-gray-900">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Offer 1 */}
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 right-0 text-7xl opacity-20">🎉</div>
              <div className="relative z-10">
                <div className="text-4xl font-black mb-2">50% OFF</div>
                <p className="text-lg font-semibold mb-2">First Order Discount</p>
                <p className="text-sm opacity-90 mb-4">Use code: FIRST50</p>
                <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                  Claim Now
                </button>
              </div>
            </div>

            {/* Offer 2 */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 right-0 text-7xl opacity-20">🎁</div>
              <div className="relative z-10">
                <div className="text-4xl font-black mb-2">FREE</div>
                <p className="text-lg font-semibold mb-2">Dessert on Orders Above ₹500</p>
                <p className="text-sm opacity-90 mb-4">Limited time offer</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                  Order Now
                </button>
              </div>
            </div>

            {/* Offer 3 */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 overflow-hidden relative">
              <div className="absolute top-0 right-0 text-7xl opacity-20">⚡</div>
              <div className="relative z-10">
                <div className="text-4xl font-black mb-2">20 MIN</div>
                <p className="text-lg font-semibold mb-2">Express Delivery</p>
                <p className="text-sm opacity-90 mb-4">Super quick delivery guaranteed</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all">
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Food Tags & Dietary Preferences */}
        <div className="mb-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-black mb-8 text-gray-900">Dietary Preferences</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '🥬', label: 'Vegan' },
              { icon: '🌾', label: 'Gluten Free' },
              { icon: '🧂', label: 'Low Salt' },
              { icon: '🥛', label: 'Dairy Free' },
              { icon: '🌶️', label: 'Spicy' },
              { icon: '💪', label: 'High Protein' }
            ].map((tag, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all transform hover:scale-105 group">
                <span className="text-4xl mb-2">{tag.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery & Preparation Info */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-l-4 border-blue-500">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-700">Free delivery on orders above ₹500. Super fast delivery in 30-45 minutes.</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-l-4 border-purple-500">
            <div className="text-5xl mb-4">👨‍🍳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Fresh & Hygienic</h3>
            <p className="text-gray-700">All food is freshly prepared in our hygienic kitchen with highest food safety standards.</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 border-l-4 border-pink-500">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">100% Safe Payment</h3>
            <p className="text-gray-700">Multiple payment options available. Your payment is completely secure and encrypted.</p>
          </div>
        </div>

        {/* Quick Popular Items */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-8 text-gray-900">Most Popular</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Butter Chicken', price: 380, rating: 4.8, orders: '2.5K+' },
              { name: 'Garlic Naan', price: 60, rating: 4.9, orders: '3.1K+' },
              { name: 'Paneer Tikka', price: 280, rating: 4.7, orders: '2.8K+' },
              { name: 'Biryani Special', price: 320, rating: 4.8, orders: '2.2K+' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-40 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center text-5xl">
                  🍛
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-orange-600 font-bold">₹{item.price}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-semibold text-gray-800">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{item.orders} orders</p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-bold text-sm hover:shadow-lg transition-all transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Stats */}
        <div className="mb-16 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-black mb-12 text-center">We're Trusted By Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { stat: '50K+', label: 'Orders Delivered', icon: '📦' },
              { stat: '12K+', label: 'Happy Customers', icon: '😊' },
              { stat: '4.8⭐', label: 'Customer Rating', icon: '⭐' },
              { stat: '30 mins', label: 'Avg. Delivery', icon: '⚡' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-3">{item.icon}</div>
                <div className="text-4xl font-black mb-2">{item.stat}</div>
                <p className="text-lg opacity-90">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-12 text-gray-900">What Customers Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-4 italic font-medium">"Amazing food quality and lightning-fast delivery. This is my go-to restaurant now!"</p>
              <div>
                <p className="font-bold text-gray-900">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Verified Customer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-4 italic font-medium">"Best restaurant in town! Fresh ingredients and exceptional service every single time."</p>
              <div>
                <p className="font-bold text-gray-900">Mike Chen</p>
                <p className="text-sm text-gray-600">Verified Customer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border-2 border-yellow-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-gray-800 text-lg mb-4 italic font-medium">"Consistently excellent! Every order is perfect. Value for money is unbeatable!"</p>
              <div>
                <p className="font-bold text-gray-900">Emma Davis</p>
                <p className="text-sm text-gray-600">Verified Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-4xl font-black mb-12 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is your minimum order value?',
                a: 'The minimum order value is ₹300. Free delivery on orders above ₹500.'
              },
              {
                q: 'How long does delivery take?',
                a: 'Average delivery time is 30-45 minutes depending on your location and traffic conditions.'
              },
              {
                q: 'Do you deliver outside the city?',
                a: 'Currently, we deliver within city limits. Check our delivery area in the app for exact coverage.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept Credit Card, Debit Card, UPI, Wallets, and Cash on Delivery.'
              },
              {
                q: 'Can I cancel my order?',
                a: 'You can cancel orders within 2 minutes of placing them. After that, you can contact support.'
              }
            ].map((item, i) => (
              <details key={i} className="group border-b border-gray-200 pb-4">
                <summary className="flex items-center justify-between cursor-pointer py-2 hover:text-orange-600 transition">
                  <span className="font-bold text-lg text-gray-900 group-hover:text-orange-600">{item.q}</span>
                  <span className="text-2xl text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 pt-4 pl-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Social Links & Follow */}
        <div className="mb-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4 text-gray-900">Follow Us on Social Media</h2>
          <p className="text-gray-600 mb-8 text-lg">Stay updated with our latest offers and menu updates</p>
          <div className="flex justify-center gap-6 flex-wrap">
            {[
              { icon: '📘', label: 'Facebook', color: 'hover:text-blue-600' },
              { icon: '📷', label: 'Instagram', color: 'hover:text-pink-600' },
              { icon: '🐦', label: 'Twitter', color: 'hover:text-blue-400' },
              { icon: '▶️', label: 'YouTube', color: 'hover:text-red-600' }
            ].map((social, i) => (
              <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all transform hover:scale-110 ${social.color}`}>
                <span className="text-4xl">{social.icon}</span>
                <span className="font-semibold text-gray-700">{social.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-10 pt-10 border-t border-gray-300">
            <p className="text-gray-600 mb-4">Subscribe to our newsletter for exclusive deals</p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500" />
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl font-black mb-6">Ready to Order?</h2>
            <p className="text-2xl mb-10 opacity-90">Experience exceptional taste and service today</p>
                <button
                  onClick={() => {
                    // send users to the menu page (login protected)
                    navigate('/menu');
                  }}
                  className="bg-white text-orange-600 px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 shadow-2xl"
                >
                  View Full Menu
                </button>
          </div>
        </div>
      </div>

      {/* Image preview lightbox */}
      {previewImage && (
        <Lightbox images={restaurant.gallery} start={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
}
