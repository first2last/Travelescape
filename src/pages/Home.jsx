import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Canvas } from '@react-three/fiber';
import Globe from '../components/Globe';
import Button from '../components/Button';
import { fetchCities } from '../utils/api';
import CityModal from '../components/CityModal';
import AddCityModal from '../components/AddCityModal';
import AuthModal from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusCityId, setFocusCityId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const loadCities = () => fetchCities().then(setCities);

  useEffect(() => {
    loadCities();
    window.addEventListener('cities_updated', loadCities);
    return () => window.removeEventListener('cities_updated', loadCities);
  }, []);

  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Ensure active keyboard scrolling visually keeps the item in view
  useEffect(() => {
    if (showDropdown && activeIndex >= 0) {
      const el = document.getElementById(`city-item-${activeIndex}`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex, showDropdown]);

  return (
    <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', background: '#090909' }}>
      
      {/* Ambient Background Glows */}
      <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0, 255, 204, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '15%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(255, 0, 255, 0.04) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }} />

      {/* UI Left Panel Strictly Bounded */}
      <div style={{
        flex: '0 0 460px',
        marginLeft: '8vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 10,
        position: 'relative'
      }}>
        
        {/* Floating Futuristic Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '6px 14px', 
          background: 'rgba(0, 255, 204, 0.05)', 
          border: '1px solid rgba(0, 255, 204, 0.2)', 
          borderRadius: '30px', 
          width: 'fit-content',
          marginBottom: '1.5rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 255, 204, 0.1)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffcc', boxShadow: '0 0 10px #00ffcc' }}></span>
          <span style={{ color: '#00ffcc', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Interactive 3D Engine</span>
        </div>

        {/* Dynamic Heading */}
        <h1 className="text-gradient" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
          Explore The<br />Unseen.
        </h1>
        
        {/* Structural Subtitle */}
        <p style={{ color: '#aaa', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '3rem', fontWeight: 400, maxWidth: '95%' }}>
          Spin the globe, find your next adventure, and experience the world's most breathtaking locations through our hyper-realistic geospatial engine.
        </p>
        
        {/* Glassmorphism Control Panel Wrapper */}
        <div style={{ 
          background: 'rgba(20, 20, 22, 0.65)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 50
        }}>
          <div style={{ color: '#777', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>
            Set Target Coordinates
          </div>
          
          {/* Autocomplete Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search a famous location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
                setActiveIndex(-1); // Reset keyboard tracking
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveIndex(prev => (prev < filteredCities.length - 1 ? prev + 1 : prev));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
                } else if (e.key === 'Enter' && filteredCities.length > 0) {
                  e.preventDefault();
                  const targetCity = activeIndex >= 0 ? filteredCities[activeIndex] : filteredCities[0];
                  setSearchTerm(targetCity.name);
                  setFocusCityId(targetCity.id);
                  setShowDropdown(false);
                  setActiveIndex(-1);
                  e.target.blur(); // Cleanly exit input
                }
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                fontSize: '1.1rem',
                background: 'rgba(10, 10, 10, 0.8)',
                border: '1px solid rgba(0,255,204,0.3)',
                color: '#fff',
                borderRadius: '8px',
                outline: 'none',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5), 0 4px 15px rgba(0,0,0,0.3)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.target.style.borderColor = 'rgba(0,255,204,0.7)'}
              onMouseOut={e => e.target.style.borderColor = 'rgba(0,255,204,0.3)'}
            />
            {showDropdown && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(25, 25, 25, 0.95)',
                border: '1px solid rgba(0,255,204,0.3)',
                borderRadius: '8px',
                marginTop: '8px',
                maxHeight: '220px',
                overflowY: 'auto',
                padding: '0.5rem 0',
                zIndex: 20,
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                backdropFilter: 'blur(15px)'
              }}>
                {filteredCities.length > 0 ? filteredCities.map((city, index) => {
                  const isActive = index === activeIndex;
                  return (
                  <li
                    key={city.id}
                    id={`city-item-${index}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      setSearchTerm(city.name);
                      setFocusCityId(city.id);
                      setShowDropdown(false);
                      setActiveIndex(-1);
                    }}
                    onMouseOver={() => setActiveIndex(index)}
                    style={{
                      padding: '0.85rem 1.25rem',
                      cursor: 'pointer',
                      color: isActive ? '#fff' : '#eee',
                      fontWeight: '500',
                      transition: 'all 0.1s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: isActive ? 'rgba(0,255,204,0.15)' : 'transparent',
                      paddingLeft: isActive ? '1.75rem' : '1.25rem'
                    }}
                  >
                    {city.name}, <span style={{ color: isActive ? '#fff' : 'var(--neon-cyan)', fontSize: '0.9em', fontWeight: '400' }}>{city.country}</span>
                  </li>
                )}) : (
                  <li style={{ padding: '0.75rem 1.25rem', color: '#777' }}>No locations found...</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Button label="Start Journey" onClick={() => {
            const el = document.getElementById('explore-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
          <Button label="+ Add Your City" onClick={() => {
            if (user) {
              setShowAddCityModal(true);
            } else {
              setShowAuthModal(true);
            }
          }} />
          {focusCityId && (
            <button 
              onClick={() => {
                setFocusCityId(null);
                setSearchTerm('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: 0.6,
                transition: 'opacity 0.2s',
                textDecoration: 'underline',
                textUnderlineOffset: '4px'
              }}
              onMouseOver={e => e.target.style.opacity = 1}
              onMouseOut={e => e.target.style.opacity = 0.6}
            >
              Reset Globe
            </button>
          )}
        </div>
      </div>

      {/* 3D Scene Container Automatically Flexing Right */}
      <div style={{ flex: '1', position: 'relative', height: '100%', marginLeft: '2rem', zIndex: 1 }}>
        <Canvas 
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          onPointerMissed={() => {
            setFocusCityId(null);
            setSearchTerm('');
          }}
        >
          <Globe 
            cities={cities} 
            focusCityId={focusCityId} 
            onOpenModal={setSelectedCity} 
            onInteract={() => {
              setFocusCityId(null);
              setSearchTerm('');
            }}
          />
        </Canvas>
      </div>

      {/* Modal Layer — portaled to body to escape overflow:hidden container */}
      {selectedCity && ReactDOM.createPortal(
        <CityModal city={selectedCity} onClose={() => setSelectedCity(null)} />,
        document.body
      )}
      
      {/* City Builder Tool Layer — portaled to body */}
      {showAddCityModal && ReactDOM.createPortal(
        <AddCityModal onClose={() => setShowAddCityModal(false)} />,
        document.body
      )}

      {/* Auth gate — shown when user clicks Add Your City without being logged in */}
      {showAuthModal && ReactDOM.createPortal(
        <AuthModal onClose={() => setShowAuthModal(false)} />,
        document.body
      )}
    </div>
  );
};

export default Home;
