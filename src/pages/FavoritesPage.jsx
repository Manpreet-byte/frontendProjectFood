import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import dataService from '../data/dataService';
import MenuItemCard from '../components/MenuItemCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoritesPage() {
  const { itemFavorites } = useFavorites();
  const [favMenuItems, setFavMenuItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allItems = await dataService.getMenuItems();
      setFavMenuItems(allItems.filter(item => itemFavorites.includes(item._id)));
    }
    fetchData();
  }, [itemFavorites]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, type: 'spring', stiffness: 120 } })
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen relative overflow-x-hidden">
      {/* Animated floating hearts */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-pink-400 text-3xl select-none"
            style={{ left: `${10 + i * 10}%`, top: `${10 + (i % 4) * 18}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 20, -20, 0]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              repeatType: 'loop',
              delay: i * 0.7
            }}
          >
            ❤️
          </motion.span>
        ))}
      </motion.div>
      <h1 className="text-4xl font-black mb-8 text-orange-600 flex items-center gap-3 relative z-10">
        <span className="text-3xl animate-bounce">❤️</span> Your Favorites
      </h1>
      {/* Favorite Restaurants removed: only showing favorite menu items now */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-lg font-black shadow animate-pulse">💖</span>
          Favorite Menu Items
        </h2>
        <AnimatePresence>
        {favMenuItems.length === 0 ? (
          <motion.div className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <span className="text-6xl mb-4 animate-bounce">🍽️</span>
            <p className="text-gray-500 text-lg font-semibold mb-2">No favorite menu items yet.</p>
            <p className="text-gray-400">Start adding your cravings to favorites!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favMenuItems.map((item, i) => (
              <motion.div
                key={item._id}
                className="relative"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(255, 107, 107, 0.15)' }}
              >
                <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow animate-pulse">FAV</span>
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
