import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import dataService from '../data/dataService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
import MapPicker from '../components/MapPicker';
import Cart from '../components/Cart';

// Fake Payment Modal Component
const FakePaymentModal = ({ isOpen, onClose, onSuccess, amount, paymentMethod }) => {
  const [step, setStep] = useState('select'); // 'select' | 'processing' | 'success'
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedBank('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setUpiId('');
    }
  }, [isOpen]);

  const banks = [
    { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏛️' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏢' },
    { id: 'axis', name: 'Axis Bank', logo: '🏣' },
    { id: 'kotak', name: 'Kotak Mahindra', logo: '🏤' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
  ];

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', logo: '🅶' },
    { id: 'phonepe', name: 'PhonePe', logo: '📱' },
    { id: 'paytm', name: 'Paytm', logo: '💳' },
    { id: 'bhim', name: 'BHIM UPI', logo: '🇮🇳' },
    { id: 'amazonpay', name: 'Amazon Pay', logo: '📦' },
  ];

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess({
          success: true,
          paymentId: 'demo_pay_' + Date.now(),
          method: paymentMethod,
          bank: selectedBank
        });
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Secure Payment</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-2xl font-bold mt-2">₹{amount.toFixed(2)}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' && (
            <>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Enter Card Details</h4>
                  
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 pl-12 focus:border-blue-500 focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                      <span className="absolute left-3 top-3 text-2xl">💳</span>
                    </div>
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/'))}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                        placeholder="•••"
                      />
                    </div>
                  </div>

                  {/* Card Type Icons */}
                  <div className="flex gap-3 mt-2">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-semibold">VISA</div>
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold">MasterCard</div>
                    <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-semibold">RuPay</div>
                  </div>

                  {/* Or select bank */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-3">Or select your bank for Net Banking</p>
                    <div className="grid grid-cols-3 gap-2">
                      {banks.slice(0, 6).map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-2 border-2 rounded-lg text-center transition ${
                            selectedBank === bank.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl">{bank.logo}</span>
                          <p className="text-xs text-gray-600 mt-1 truncate">{bank.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Pay via UPI</h4>
                  
                  {/* UPI ID */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Enter UPI ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                        placeholder="yourname@upi"
                      />
                    </div>
                  </div>

                  {/* Or Select UPI App */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-3">Or pay using UPI App</p>
                    <div className="grid grid-cols-5 gap-2">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedBank(app.id)}
                          className={`p-3 border-2 rounded-lg text-center transition ${
                            selectedBank === app.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl">{app.logo}</span>
                          <p className="text-[10px] text-gray-600 mt-1">{app.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QR Code Option */}
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-gray-600 text-center mb-3">Scan QR to Pay</p>
                    <div className="bg-white p-4 rounded-lg mx-auto w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-xs text-gray-500">Demo QR Code</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={paymentMethod === 'card' && !cardNumber && !selectedBank}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition"
              >
                Pay ₹{amount.toFixed(2)}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secured by 256-bit SSL encryption (Demo Mode)
              </p>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Processing Payment...</h4>
              <p className="text-sm text-gray-500 mt-2">Please wait while we verify your payment</p>
              <div className="flex justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-green-600">Payment Successful!</h4>
              <p className="text-sm text-gray-500 mt-2">Redirecting to order confirmation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cash',
    deliveryTime: 'asap'
  });
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle fake payment success
  const handleFakePaymentSuccess = async (paymentResult) => {
    setShowPaymentModal(false);
    
    try {
      const orderPayload = {
        ...pendingOrderPayload,
        paymentId: paymentResult.paymentId,
        paymentStatus: 'paid',
        userId: user?._id
      };

      const order = await dataService.createOrder(orderPayload);

      setConfirmedOrder(order);
      setShowModal(true);
      clearCart();
      toast.success('Payment successful! Order placed.');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Order placement failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter email address');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: cart.items.map(({ _id, name, quantity, price }) => ({ 
          menuItem: _id, 
          name,
          quantity,
          price 
        })),
        totalAmount: total,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        deliveryTime: formData.deliveryTime,
        userId: user?._id,
        userName: user?.name
      };

      // include coordinates when available
      if (typeof formData.latitude === 'number') orderPayload.latitude = formData.latitude;
      if (typeof formData.longitude === 'number') orderPayload.longitude = formData.longitude;

      // Handle online payment - show fake payment modal
      if (formData.paymentMethod === 'card' || formData.paymentMethod === 'upi') {
        setPendingOrderPayload(orderPayload);
        setShowPaymentModal(true);
        setLoading(false);
        return;
      }

      // Cash on delivery - place order directly
      const order = await dataService.createOrder(orderPayload);

      // Show confirmation modal with order details
      setConfirmedOrder(order);
      setShowModal(true);
      clearCart();
      
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Order placement failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <Cart />
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Your Order</h1>

      {/* Display Cart Component */}
      <div className="mb-8">
        <Cart />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
          
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Enter your complete delivery address"
                required
              />
              <MapPicker
                initialAddress={formData.address}
                onSelect={({ address, latitude, longitude }) => setFormData({ ...formData, address: address || formData.address, latitude, longitude })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., +1 234 567 8900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., your-email@example.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">We'll send order confirmation and updates to this email</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="styled-select w-full"
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI/Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Delivery Time</label>
              <select
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="styled-select w-full"
              >
                <option value="asap">As Soon As Possible (30-45 min)</option>
                <option value="1hour">In 1 Hour</option>
                <option value="2hours">In 2 Hours</option>
                <option value="evening">This Evening (6-8 PM)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-green-600 text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
              💡 Add more items from recently ordered to quickly reorder your favorites!
            </p>
          </div>
        </div>
      </div>
    </div>
    <OrderConfirmationModal open={showModal} order={confirmedOrder} onClose={() => setShowModal(false)} />
    <FakePaymentModal 
      isOpen={showPaymentModal}
      onClose={() => {
        setShowPaymentModal(false);
        setLoading(false);
        toast.info('Payment cancelled');
      }}
      onSuccess={handleFakePaymentSuccess}
      amount={total}
      paymentMethod={formData.paymentMethod}
    />
    </>
  );
}
