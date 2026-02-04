// Data Service - Replaces all backend API calls with local data
import { menuItems } from './menuItems';
import { restaurants } from './restaurants';

// ==================== STORAGE HELPERS ====================
const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

// ==================== MENU ITEMS ====================
export const getMenuItems = () => {
  return Promise.resolve([...menuItems]);
};

export const getMenuItemById = (id) => {
  const item = menuItems.find(m => m._id === id);
  return Promise.resolve(item || null);
};

export const getMenuItemsByCategory = (category) => {
  if (category === 'All') return getMenuItems();
  const items = menuItems.filter(m => m.category === category);
  return Promise.resolve(items);
};

export const getMenuItemsByRestaurant = (restaurantId) => {
  const items = menuItems.filter(m => m.restaurant === restaurantId);
  return Promise.resolve(items);
};

export const updateMenuItem = (id, updates) => {
  const index = menuItems.findIndex(m => m._id === id);
  if (index !== -1) {
    menuItems[index] = { ...menuItems[index], ...updates };
    return Promise.resolve(menuItems[index]);
  }
  return Promise.reject(new Error('Menu item not found'));
};

export const deleteMenuItem = (id) => {
  const index = menuItems.findIndex(m => m._id === id);
  if (index !== -1) {
    menuItems.splice(index, 1);
    return Promise.resolve({ success: true });
  }
  return Promise.reject(new Error('Menu item not found'));
};

// ==================== RESTAURANTS ====================
export const getRestaurants = () => {
  return Promise.resolve([...restaurants]);
};

export const getRestaurantById = (id) => {
  const restaurant = restaurants.find(r => r._id === id);
  return Promise.resolve(restaurant || null);
};

export const getFeaturedRestaurants = () => {
  const featured = restaurants.filter(r => r.isFeatured);
  return Promise.resolve(featured);
};

// ==================== ORDERS ====================
export const getOrders = () => {
  const orders = getFromStorage('orders', []);
  return Promise.resolve(orders);
};

export const getOrdersByUser = (userId) => {
  const orders = getFromStorage('orders', []);
  const userOrders = orders.filter(o => o.userId === userId);
  return Promise.resolve(userOrders);
};

export const getOrderById = (orderId) => {
  const orders = getFromStorage('orders', []);
  const order = orders.find(o => o._id === orderId);
  return Promise.resolve(order || null);
};

export const createOrder = (orderData) => {
  const orders = getFromStorage('orders', []);
  const newOrder = {
    _id: 'order_' + Date.now(),
    orderNumber: 'ORD' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    ...orderData,
    status: 'pending',
    paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'paid',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  setToStorage('orders', orders);
  return Promise.resolve(newOrder);
};

export const updateOrderStatus = (orderId, status) => {
  const orders = getFromStorage('orders', []);
  const index = orders.findIndex(o => o._id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    setToStorage('orders', orders);
    return Promise.resolve(orders[index]);
  }
  return Promise.reject(new Error('Order not found'));
};

// ==================== USERS / AUTH ====================
export const getUsers = () => {
  const users = getFromStorage('users', []);
  return Promise.resolve(users);
};

export const getUserByEmail = (email) => {
  const users = getFromStorage('users', []);
  const user = users.find(u => u.email === email);
  return Promise.resolve(user || null);
};

export const createUser = (userData) => {
  const users = getFromStorage('users', []);
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return Promise.reject(new Error('User already exists'));
  }
  const newUser = {
    _id: 'user_' + Date.now(),
    ...userData,
    isAdmin: userData.email === 'admin@foodapp.com', // Make admin@foodapp.com an admin
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  setToStorage('users', users);
  return Promise.resolve(newUser);
};

export const login = async (email, password) => {
  const users = getFromStorage('users', []);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = 'local_token_' + Date.now();
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
  throw new Error('Invalid email or password');
};

export const signup = async (name, email, password) => {
  const users = getFromStorage('users', []);
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  const newUser = {
    _id: 'user_' + Date.now(),
    name,
    email,
    password,
    isAdmin: email === 'admin@foodapp.com',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  setToStorage('users', users);
  
  const token = 'local_token_' + Date.now();
  const { password: _, ...userWithoutPassword } = newUser;
  return { token, user: userWithoutPassword };
};

// ==================== RATINGS ====================
export const getRatings = () => {
  const ratings = getFromStorage('ratings', []) || [];
  // ensure newest ratings first
  ratings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const stats = calculateRatingStats(ratings);
  return Promise.resolve({ ratings, stats });
};

export const getRatingStats = () => {
  const ratings = getFromStorage('ratings', []);
  return Promise.resolve(calculateRatingStats(ratings));
};

const calculateRatingStats = (ratings) => {
  if (ratings.length === 0) {
    return { average: 4.5, total: 0 };
  }
  const total = ratings.length;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  const average = sum / total;
  return { average: Math.round(average * 10) / 10, total };
};

export const createRating = (ratingData) => {
  const ratings = getFromStorage('ratings', []);
  const newRating = {
    _id: 'rating_' + Date.now(),
    ...ratingData,
    createdAt: new Date().toISOString()
  };
  ratings.unshift(newRating);
  setToStorage('ratings', ratings);
  return Promise.resolve(newRating);
};

export const deleteRating = (ratingId) => {
  const ratings = getFromStorage('ratings', []);
  const index = ratings.findIndex(r => r._id === ratingId);
  if (index !== -1) {
    ratings.splice(index, 1);
    setToStorage('ratings', ratings);
    return Promise.resolve({ success: true });
  }
  return Promise.reject(new Error('Rating not found'));
};

// ==================== COUPONS ====================
const defaultCoupons = [
  { code: 'SAVE10', discount: 10, minOrder: 200, description: '10% off on orders above ₹200' },
  { code: 'SAVE20', discount: 20, minOrder: 500, description: '20% off on orders above ₹500' },
  { code: 'FIRST50', discount: 50, minOrder: 300, description: '50% off on your first order above ₹300' },
  { code: 'FOODIE15', discount: 15, minOrder: 400, description: '15% off on orders above ₹400' }
];

export const getCoupons = () => {
  return Promise.resolve(defaultCoupons);
};

export const validateCoupon = (code, orderTotal) => {
  const coupon = defaultCoupons.find(c => c.code === code.toUpperCase());
  if (!coupon) {
    return Promise.reject(new Error('Invalid coupon code'));
  }
  if (orderTotal < coupon.minOrder) {
    return Promise.reject(new Error(`Minimum order of ₹${coupon.minOrder} required`));
  }
  return Promise.resolve(coupon);
};

// ==================== EXPORT ALL ====================
const dataService = {
  // Menu Items
  getMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem,
  
  // Restaurants
  getRestaurants,
  getRestaurantById,
  getFeaturedRestaurants,
  
  // Orders
  getOrders,
  getOrdersByUser,
  getOrderById,
  createOrder,
  updateOrderStatus,
  
  // Users / Auth
  getUsers,
  getUserByEmail,
  createUser,
  login,
  signup,
  
  // Ratings
  getRatings,
  getRatingStats,
  createRating,
  deleteRating,
  
  // Coupons
  getCoupons,
  validateCoupon
};

export default dataService;
