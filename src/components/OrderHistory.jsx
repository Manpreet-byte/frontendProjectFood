import React, { useEffect, useState } from 'react';
import dataService from '../data/dataService';
import { useAuth } from '../context/AuthContext';

// Helper function to format time ago
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '') + ' ago';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '') + ' ago';
  
  return 'Just now';
};

// Status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Preparing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await dataService.getOrdersByUser(user?._id);
        // Resolve menu item details (orders store menuItem as id)
        const allMenuItems = await dataService.getMenuItems();
        const itemsMap = {};
        allMenuItems.forEach(mi => { itemsMap[mi._id] = mi; });

        const resolved = (userOrders || []).map((ord) => ({
          ...ord,
          items: (ord.items || []).map(({ menuItem, quantity }) => {
            const resolvedItem = typeof menuItem === 'string' ? itemsMap[menuItem] : menuItem;
            return {
              menuItem: resolvedItem || { _id: (typeof menuItem === 'string' ? menuItem : (menuItem && menuItem._id) || 'unknown'), name: (resolvedItem && resolvedItem.name) || (menuItem && menuItem.name) || 'Item', price: (resolvedItem && resolvedItem.price) || (menuItem && menuItem.price) || 0, imageUrl: (resolvedItem && (resolvedItem.imageUrl || resolvedItem.image)) || null },
              quantity: quantity || 1
            };
          })
        }));

        setOrders(resolved);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p className="text-gray-600">Start ordering to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Order History ({orders.length})</h2>
      {orders.map(order => (
        <div key={order._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Order ID:</span> {order._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-sm text-gray-500">
                {timeAgo(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">${order.totalAmount.toFixed(2)}</p>
              {order.paymentMethod && (
                <p className="text-sm text-gray-600 capitalize mt-1">
                  {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'card' ? 'Card Payment' : 
                   'UPI/Wallet'}
                </p>
              )}
            </div>
          </div>

          {order.address && (
            <div className="mb-3 pb-3 border-b">
              <p className="text-sm font-medium text-gray-700">Delivery Address:</p>
              <p className="text-sm text-gray-600">{order.address}</p>
              {order.phone && <p className="text-sm text-gray-600 mt-1">📞 {order.phone}</p>}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered:</p>
            <ul className="space-y-1">
              {order.items.map(({ menuItem, quantity }) => (
                <li key={menuItem._id} className="text-sm text-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={menuItem.imageUrl || menuItem.image || 'https://via.placeholder.com/64?text=🍽️'}
                      alt={menuItem.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <div>{menuItem.name} <span className="text-gray-500">× {quantity}</span></div>
                      <div className="text-xs text-gray-500">₹{menuItem.price?.toFixed(2)}</div>
                    </div>
                  </div>
                  <span className="font-medium">${(menuItem.price * quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Timeline */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600">Order Placed</span>
              
              <div className="flex-1 h-0.5 bg-gray-200">
                <div className={`h-full ${order.status === 'Preparing' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${order.status === 'Preparing' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">Preparing</span>
              
              <div className="flex-1 h-0.5 bg-gray-200">
                <div className={`h-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">Delivered</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
