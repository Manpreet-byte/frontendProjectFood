import React, { createContext, useContext, useEffect, useState } from 'react';


const FavoritesContext = createContext();


export function FavoritesProvider({ children }) {
  // Separate favorites for menu items and restaurants
  const [itemFavorites, setItemFavorites] = useState(() => {
    const stored = localStorage.getItem('itemFavorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [restaurantFavorites, setRestaurantFavorites] = useState(() => {
    const stored = localStorage.getItem('restaurantFavorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('itemFavorites', JSON.stringify(itemFavorites));
  }, [itemFavorites]);
  useEffect(() => {
    localStorage.setItem('restaurantFavorites', JSON.stringify(restaurantFavorites));
  }, [restaurantFavorites]);

  // Menu item favorites
  const addFavoriteItem = (itemId) => {
    setItemFavorites((prev) => prev.includes(itemId) ? prev : [...prev, itemId]);
  };
  const removeFavoriteItem = (itemId) => {
    setItemFavorites((prev) => prev.filter(id => id !== itemId));
  };
  const isFavoriteItem = (itemId) => itemFavorites.includes(itemId);

  // Restaurant favorites
  const addFavoriteRestaurant = (restaurantId) => {
    setRestaurantFavorites((prev) => prev.includes(restaurantId) ? prev : [...prev, restaurantId]);
  };
  const removeFavoriteRestaurant = (restaurantId) => {
    setRestaurantFavorites((prev) => prev.filter(id => id !== restaurantId));
  };
  const isFavoriteRestaurant = (restaurantId) => restaurantFavorites.includes(restaurantId);

  return (
    <FavoritesContext.Provider value={{
      itemFavorites,
      restaurantFavorites,
      addFavoriteItem,
      removeFavoriteItem,
      isFavoriteItem,
      addFavoriteRestaurant,
      removeFavoriteRestaurant,
      isFavoriteRestaurant
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
