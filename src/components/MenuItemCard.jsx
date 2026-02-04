import React, { useState } from 'react';
import MenuItemModal from './MenuItemModal';
import { useFavorites } from '../context/FavoritesContext';

// Category-based default images (high-quality Unsplash images)
const categoryImages = {
  Pizza: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
  ],
  Burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
  ],
  Pasta: [
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&h=300&fit=crop'
  ],
  Dessert: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=300&fit=crop'
  ],
  Drinks: [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=300&fit=crop'
  ],
  Appetizer: [
    'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop'
  ],
  'Main Course': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
  ],
  Salad: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop'
  ],
  default: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'
  ]
};

const MenuItemCard = ({ item, viewMode = 'grid', index = 0 }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavoriteItem, addFavoriteItem, removeFavoriteItem } = useFavorites();

  const handleCardClick = () => {
    if (!item.available) return;
    setShowModal(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavoriteItem(item._id)) {
      removeFavoriteItem(item._id);
    } else {
      addFavoriteItem(item._id);
    }
  };

  // Get images for the item (at least 3)
  const getItemImages = () => {
    // If item has imageGallery with multiple images, use them
    if (item.imageGallery && item.imageGallery.length >= 3) {
      return item.imageGallery.map(img => img.url || img);
    }
    
    // If item has single image, combine with category defaults
    const categoryDefaults = categoryImages[item.category] || categoryImages.default;
    
    if (item.image || item.imageUrl) {
      const mainImage = item.image || item.imageUrl;
      // Check if it's not a placeholder
      if (!mainImage.includes('placeholder')) {
        return [mainImage, ...categoryDefaults.slice(0, 2)];
      }
    }
    
    return categoryDefaults;
  };

  const images = getItemImages();
  
  // Get current image URL
  const getImageUrl = () => {
    if (imageError) return categoryImages.default[0];
    return images[currentImageIndex] || categoryImages.default[0];
  };

  // Image navigation
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Staggered animation delay based on index
  const animationDelay = `${index * 50}ms`;

  // List view
  if (viewMode === 'list') {
    return (
      <>
        <div 
          onClick={handleCardClick}
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group animate-slide-in-up ${
            item.available 
              ? 'hover:ring-2 hover:ring-orange-300' 
              : 'opacity-60'
          }`}
          style={{ animationDelay }}
        >
          <div className="flex items-center gap-4">
            {/* Food Image */}
            <div className="w-28 h-28 flex-shrink-0 overflow-hidden relative">
              <img 
                src={getImageUrl()}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
              {images.length > 1 && (
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {images.length} 📷
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-3">
              <div className="flex items-start justify-between gap-2 pr-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.category && (
                      <span className="text-xs text-orange-600 font-semibold bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    )}
                    {item.isVeg && (
                      <span className="text-xs text-green-600 font-semibold bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                        🌱 Veg
                      </span>
                    )}
                    {item.rating && (
                      <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ⭐ {item.rating}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className={`text-2xl transition-transform hover:scale-125 flex-shrink-0 ${isFavoriteItem(item._id) ? 'animate-heartbeat' : ''}`}
                >
                  {isFavoriteItem(item._id) ? '❤️' : '🤍'}
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mt-2 pr-4">{item.description}</p>
              
              {/* Price */}
              <div className="flex items-center justify-between mt-2 pr-4">
                <p className="text-xl font-black text-orange-600">₹{item.price}</p>
                <span className="text-xs text-orange-500 font-medium">
                  {item.available ? 'Tap to order →' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <MenuItemModal 
            item={{...item, imageGallery: images.map(url => ({ url }))}} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </>
    );
  }

  // Grid view (default) - With food images and gallery
  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer overflow-hidden group h-full flex flex-col animate-fade-in ${
          item.available 
            ? 'hover:ring-2 hover:ring-orange-300' 
            : 'opacity-60'
        }`}
        style={{ animationDelay }}
      >
        {/* Food Image with Gallery */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img 
            src={getImageUrl()}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          
          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Image Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex 
                        ? 'bg-white w-4' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {item.isVeg && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                🌱 Veg
              </span>
            )}
            {item.isSpicy && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                🌶️ Spicy
              </span>
            )}
            {item.discount > 0 && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
                {item.discount}% OFF
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-xl shadow-lg transition-all hover:scale-110 hover:bg-white dark:hover:bg-gray-800 ${isFavoriteItem(item._id) ? 'animate-heartbeat' : ''}`}
            title={isFavoriteItem(item._id) ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            {isFavoriteItem(item._id) ? '❤️' : '🤍'}
          </button>

          {/* Category tag */}
          {item.category && (
            <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              {item.category}
            </span>
          )}

          {/* Out of stock overlay */}
          {!item.available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-4 py-2 rounded-full font-bold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Name */}
          <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-orange-600 transition">
            {item.name}
          </h4>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2 flex-grow">
            {item.description}
          </p>

          {/* Rating & Time */}
          <div className="flex items-center gap-3 mb-3">
            {item.rating ? (
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="font-bold text-gray-800 dark:text-white text-sm">{item.rating}</span>
              </div>
            ) : null}
            {item.preparationTime && (
              <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
                🕐 {item.preparationTime} min
              </span>
            )}
            {images.length > 1 && (
              <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1">
                📷 {images.length}
              </span>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              {item.originalPrice && item.originalPrice > item.price ? (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-orange-600">₹{item.price}</p>
                  <p className="text-sm text-gray-400 line-through">₹{item.originalPrice}</p>
                </div>
              ) : (
                <p className="text-2xl font-black text-orange-600">₹{item.price}</p>
              )}
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              item.available
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white group-hover:shadow-lg group-hover:scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}>
              {item.available ? 'Add +' : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <MenuItemModal 
          item={{...item, imageGallery: images.map(url => ({ url }))}} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default MenuItemCard;
