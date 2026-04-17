import React, { createContext, useState, useContext, useEffect } from 'react';
import { setUserCities } from '../utils/api';

const AuthContext = createContext();

const getKey = (email, type) => `travelscape_${type}_${email}`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [userCities, setUserCitiesState] = useState([]);

  // Load session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('travelscape_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      loadUserData(parsed.email);
    }
  }, []);

  const loadUserData = (email) => {
    // Load wishlist
    const saved = localStorage.getItem(getKey(email, 'wishlist'));
    const wl = saved ? JSON.parse(saved) : [];
    setWishlist(wl);

    // Load user cities and inject into api
    const savedCities = localStorage.getItem(getKey(email, 'cities'));
    const cities = savedCities ? JSON.parse(savedCities) : [];
    setUserCitiesState(cities);
    setUserCities(cities); // sync into api.js module pool
    window.dispatchEvent(new Event('cities_updated'));
  };

  const login = (email) => {
    const session = { email, timestamp: Date.now() };
    setUser(session);
    localStorage.setItem('travelscape_user', JSON.stringify(session));
    loadUserData(email);
  };

  const logout = () => {
    setUser(null);
    setWishlist([]);
    setUserCitiesState([]);
    setUserCities([]); // clear custom cities from api
    localStorage.removeItem('travelscape_user');
    window.dispatchEvent(new Event('cities_updated'));
  };

  const addUserCity = (city) => {
    if (!user) return;
    const updated = [...userCities, city];
    setUserCitiesState(updated);
    localStorage.setItem(getKey(user.email, 'cities'), JSON.stringify(updated));
  };

  const toggleWishlist = (city) => {
    if (!user) return;
    const exists = wishlist.find(c => c.id === city.id);
    const updated = exists
      ? wishlist.filter(c => c.id !== city.id)
      : [...wishlist, city];
    setWishlist(updated);
    localStorage.setItem(getKey(user.email, 'wishlist'), JSON.stringify(updated));
  };

  const isWishlisted = (cityId) => wishlist.some(c => c.id === cityId);

  return (
    <AuthContext.Provider value={{ user, login, logout, wishlist, toggleWishlist, isWishlisted, addUserCity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
