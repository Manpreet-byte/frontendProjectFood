import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart, itemCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevItemCount = useRef(itemCount);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bounce animation when cart items change
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = itemCount || cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-2">FO</div>
          <span className="font-black text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:opacity-75 transition">
            FoodOrder
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link 
                to="/" 
                className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
              >
                Home
              </Link>
              
              {user.isAdmin ? (
                <Link 
                  to="/admin-dashboard" 
                  className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/menu" 
                    className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
                  >
                    Menu
                  </Link>
                  <Link
                    to="/restaurant"
                    className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
                  >
                    Restaurants
                  </Link>
                  <Link
                    to="/rate"
                    className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
                  >
                    Reviews
                  </Link>
                  <Link
                    to="/favorites"
                    className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
                  >
                    Favorites
                  </Link>
                  <Link 
                    to="/checkout" 
                    className={`relative text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold flex items-center gap-2 group ${cartBounce ? 'animate-wiggle' : ''}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className={`absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${cartBounce ? 'animate-pop-in' : ''}`}>
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-600"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=f97316&color=fff`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user.email}</p>
                  </div>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Saved Addresses
                      </Link>
                      <Link
                        to="/profile?tab=settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/restaurant"
                className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
              >
                Restaurants
              </Link>
              <Link
                to="/rate"
                className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
              >
                Reviews
              </Link>
              <Link
                to="/help"
                className="text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold"
              >
                Help
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <div className="flex gap-3">
                <Link 
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 px-5 py-2 rounded-lg font-semibold border-2 border-orange-600 transition transform hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2 rounded-lg font-semibold transition transform hover:scale-105 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Dark Mode Toggle Mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-2 group"
          >
            <span className={`h-1 w-6 bg-gray-800 dark:bg-white group-hover:bg-orange-600 transition transform ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`h-1 w-6 bg-gray-800 dark:bg-white group-hover:bg-orange-600 transition ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-1 w-6 bg-gray-800 dark:bg-white group-hover:bg-orange-600 transition transform ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto px-6 py-6 space-y-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=f97316&color=fff`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-orange-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>

                <Link 
                  to="/" 
                  className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏠 Home
                </Link>
                {!user.isAdmin && (
                  <>
                    <Link 
                      to="/customer-dashboard" 
                      className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🍽️ Menu
                    </Link>
                    <Link
                      to="/restaurant"
                      className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🏪 Restaurants
                    </Link>
                    <Link
                      to="/rate"
                      className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ⭐ Reviews
                    </Link>
                    <Link 
                      to="/checkout" 
                      className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2 relative"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🛒 Cart {cartItemCount > 0 && `(${cartItemCount})`}
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                  </>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/restaurant"
                  className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏪 Restaurants
                </Link>
                <Link
                  to="/rate"
                  className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⭐ Reviews
                </Link>
                <Link
                  to="/help"
                  className="block text-gray-700 dark:text-gray-200 hover:text-orange-600 font-semibold py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ❓ Help
                </Link>
                <Link 
                  to="/login"
                  className="block text-orange-600 border-2 border-orange-600 px-4 py-2 rounded-lg font-semibold text-center transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold text-center transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
