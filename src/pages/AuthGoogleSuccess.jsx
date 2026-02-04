import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGoogleSuccess() {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const finish = async () => {
      try {
        if (token) {
          await setUserFromToken(token);
        } else {
          // For frontend-only version, check localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            // User already logged in
            navigate('/');
            return;
          }
        }
        navigate('/');
      } catch (err) {
        console.error('Auth google finish error', err);
        navigate('/login');
      }
    };

    finish();
  }, [navigate, setUserFromToken]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl">Signing you in...</h2>
    </div>
  );
}
