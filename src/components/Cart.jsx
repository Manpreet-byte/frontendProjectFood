import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dataService from '../data/dataService';
import { toast } from 'react-toastify';

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    addToCart, 
    updateItemNotes,
    savedItems,
    saveForLater,
    moveToCart,
    removeSavedItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryFee,
    total,
    itemCount
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemNotes, setItemNotes] = useState({});

  // Fetch recent orders to show order history
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user) {
        setLoadingRecent(false);
        return;
      }
      
      setLoadingRecent(true);
      try {
        const orders = await dataService.getOrdersByUser(user._id);
        
        if (!orders || orders.length === 0) {
          setRecentItems([]);
          setLoadingRecent(false);
          return;
        }
        
        // Extract unique menu items from recent orders (last 3 orders)
        const recentOrders = orders.slice(0, 3);
        const itemsMap = new Map();
        
        recentOrders.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
              if (item && item.menuItem && !itemsMap.has(item.menuItem)) {
                // Get full menu item details
                itemsMap.set(item.menuItem, {
                  _id: item.menuItem,
                  name: item.name,
                  price: item.price
                });
              }
            });
          }
        });
        
        const items = Array.from(itemsMap.values()).slice(0, 6);
        setRecentItems(items);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        setRecentItems([]);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentOrders();
  }, [user]);

  const handleAddRecentItem = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`, { autoClose: 1500 });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setCouponLoading(true);
    
    // Simulated coupon validation - in production, validate against backend
    const validCoupons = {
      'WELCOME10': { code: 'WELCOME10', discount: 10, description: '10% off your order' },
      'SAVE20': { code: 'SAVE20', discount: 20, description: '20% off your order' },
      'FIRSTORDER': { code: 'FIRSTORDER', discount: 15, description: '15% off first order' },
      'FREESHIP': { code: 'FREESHIP', discount: 5, description: '5% off + Free delivery' }
    };
    
    setTimeout(() => {
      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        applyCoupon(coupon);
        toast.success(`Coupon applied! ${coupon.description}`);
        setCouponCode('');
      } else {
        toast.error('Invalid coupon code');
      }
      setCouponLoading(false);
    }, 500);
  };

  const handleUpdateNotes = (itemId, notes) => {
    setItemNotes(prev => ({ ...prev, [itemId]: notes }));
    if (updateItemNotes) {
      updateItemNotes(itemId, notes);
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item._id);
    toast.info(`${item.name} removed from cart`, { autoClose: 1500 });
  };

  const handleSaveForLater = (item) => {
    if (saveForLater) {
      saveForLater(item);
      toast.success(`${item.name} saved for later`, { autoClose: 1500 });
    }
  };

  const handleMoveToCart = (item) => {
    if (moveToCart) {
      moveToCart(item);
      toast.success(`${item.name} moved to cart`, { autoClose: 1500 });
    }
  };

  // Empty cart view
  if (cart.items.length === 0) {
    return (
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Your Cart
          </h2>
        </div>

        <div className="p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Browse Menu
          </button>
        </div>

        {/* Saved for Later Section */}
        {savedItems && savedItems.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved for Later ({savedItems.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md transition">
                  <img 
                    src={item.imageUrl || item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=🍽️'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-orange-600 font-bold text-sm">₹{item.price?.toFixed(2)}</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="text-xs bg-orange-500 text-white px-2 py-1 rounded-lg hover:bg-orange-600 transition"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeSavedItem && removeSavedItem(item._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Ordered Section */}
        {user && recentItems.length > 0 && (
          <div className="border-t p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Order Again
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentItems.map((item) => (
                <div key={item._id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 flex gap-3 border border-green-200 hover:shadow-md transition">
                  <img 
                    src={item.imageUrl || item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=🍽️'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-green-600 font-bold text-sm">₹{item.price?.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddRecentItem(item)}
                      className="mt-1 text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Cart with items view
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Your Cart
          </h2>
          <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-bold">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Free Delivery Progress */}
      {subtotal < 500 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Add <span className="text-orange-600 font-bold">₹{(500 - subtotal).toFixed(2)}</span> more for <span className="text-green-600 font-bold">FREE delivery!</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {subtotal >= 500 && (
        <div className="bg-green-50 p-3 border-b flex items-center gap-2 text-green-700">
          <span className="text-xl">🎉</span>
          <p className="text-sm font-medium">You've unlocked <span className="font-bold">FREE delivery!</span></p>
        </div>
      )}

      {/* Cart Items */}
      <div className="divide-y max-h-[400px] overflow-y-auto">
        {cart.items.map((item) => (
          <div 
            key={item._id} 
            className="p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex gap-4">
              {/* Item Image */}
              <div className="relative">
                <img 
                  src={item.imageUrl || item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl shadow-md"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/96?text=🍽️'; }}
                />
                {item.isVeg !== undefined && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {item.isVeg ? '🌱' : '🍖'}
                  </span>
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">₹{item.price?.toFixed(2)} each</p>
                  </div>
                  <p className="font-bold text-xl text-orange-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => item.quantity > 1 ? updateQuantity(item._id, item.quantity - 1) : handleRemoveItem(item)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-orange-100 text-orange-600 font-bold text-xl transition"
                    >
                      {item.quantity === 1 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : '−'}
                    </button>
                    <span className="w-12 h-10 flex items-center justify-center font-bold text-lg bg-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-orange-100 text-orange-600 font-bold text-xl transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
                      className="text-gray-400 hover:text-orange-500 transition p-2"
                      title="Add notes"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {saveForLater && (
                      <button
                        onClick={() => handleSaveForLater(item)}
                        className="text-gray-400 hover:text-orange-500 transition p-2"
                        title="Save for later"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-gray-400 hover:text-red-500 transition p-2"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Special Instructions */}
                {expandedItem === item._id && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Add special instructions (e.g., less spicy, no onions)"
                      value={itemNotes[item._id] || item.notes || ''}
                      onChange={(e) => handleUpdateNotes(item._id, e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                )}

                {/* Show existing notes */}
                {(item.notes || itemNotes[item._id]) && expandedItem !== item._id && (
                  <p className="mt-2 text-xs text-gray-500 italic flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    {itemNotes[item._id] || item.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="p-4 bg-gray-50 border-t">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-100 rounded-xl p-3 border border-green-300">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎟️</span>
              <div>
                <p className="font-bold text-green-800">{appliedCoupon.code}</p>
                <p className="text-xs text-green-600">{appliedCoupon.description}</p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-red-500 hover:text-red-700 font-medium text-sm"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🎟️</span>
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {couponLoading ? '...' : 'Apply'}
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Try: WELCOME10, SAVE20, FIRSTORDER
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-white border-t space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedCoupon.discount}%)</span>
            <span className="font-medium">-₹{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            Delivery Fee
            {deliveryFee === 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">FREE</span>}
          </span>
          <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600 line-through' : ''}`}>
            {deliveryFee === 0 ? '₹40.00' : `₹${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        
        <div className="pt-3 border-t flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Total</span>
          <span className="text-3xl font-black text-orange-600">₹{total.toFixed(2)}</span>
        </div>

        {/* Estimated Delivery */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Estimated delivery: <span className="font-semibold text-gray-700">30-45 mins</span></span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4 bg-gray-50 border-t">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="w-full mt-2 text-orange-600 py-2 font-medium hover:text-orange-700 transition"
        >
          + Add More Items
        </button>
      </div>

      {/* Saved for Later Section */}
      {savedItems && savedItems.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved for Later ({savedItems.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg p-2 flex gap-2 shadow-sm">
                <img 
                  src={item.imageUrl || item.image} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=🍽️'; }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-orange-600 font-bold text-sm">₹{item.price?.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 transition self-center"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Ordered */}
      {user && recentItems.length > 0 && (
        <div className="border-t p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Add - Order Again
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentItems.slice(0, 4).map((item) => (
              <div key={item._id} className="flex-shrink-0 w-28 text-center">
                <div className="relative">
                  <img 
                    src={item.imageUrl || item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl mx-auto shadow-md"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=🍽️'; }}
                  />
                  <button
                    onClick={() => handleAddRecentItem(item)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition transform hover:scale-110"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs font-medium mt-3 truncate">{item.name}</p>
                <p className="text-xs text-orange-600 font-bold">₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
