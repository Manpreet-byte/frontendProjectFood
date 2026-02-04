import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthGoogleSuccess from './pages/AuthGoogleSuccess';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import FavoritesPage from './pages/FavoritesPage';
import Restaurant from './pages/Restaurant';
import RatingsPage from './pages/RatingsPage';
import Profile from './pages/Profile';
import Help from './pages/Help';

function PrivateRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
                  <Route path="/restaurant" element={<Restaurant />} />
                  <Route path="/rate" element={<RatingsPage />} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/admin-dashboard" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
                  <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/google/success" element={<AuthGoogleSuccess />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
