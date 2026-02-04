import React, { useEffect, useState } from 'react';
import dataService from '../data/dataService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersData, menuData] = await Promise.all([
        dataService.getOrders(),
        dataService.getMenuItems()
      ]);

      setOrders(ordersData);
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await dataService.updateOrderStatus(orderId, newStatus);

      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const toggleMenuAvailability = async (itemId, currentStatus) => {
    try {
      await dataService.updateMenuItem(itemId, { available: !currentStatus });

      setMenuItems(menuItems.map(item =>
        item._id === itemId ? { ...item, available: !currentStatus } : item
      ));
      toast.success('Menu item updated');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await dataService.deleteMenuItem(itemId);

      setMenuItems(menuItems.filter(item => item._id !== itemId));
      toast.success('Menu item deleted');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'orders'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'menu'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Menu Items ({menuItems.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">All Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Customer: {order.user?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {order.user?.email || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Placed: {new Date(order.placedAt || order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`styled-select font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3 bg-gray-50 p-3 rounded">
                    <p className="font-semibold mb-2">Items:</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm mb-1">
                        <span>{item.menuItem?.name || 'Unknown Item'} × {item.quantity}</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.address && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Address:</strong> {order.address}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${order.total?.toFixed(2) || order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Menu Management</h2>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 p-3 rounded"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span>Category: {item.category}</span>
                      <span className="font-semibold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleMenuAvailability(item._id, item.available)}
                    className={`px-4 py-2 rounded font-medium ${
                      item.available
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  >
                    {item.available ? '✓ Available' : '✗ Unavailable'}
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                  >
                    Delete
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
