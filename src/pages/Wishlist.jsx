import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Heart, MapPin, Trash2, Plane, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CityModal from '../components/CityModal';
import AuthModal from '../components/AuthModal';

const Wishlist = () => {
  const { user, wishlist, toggleWishlist } = useAuth();
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Not logged in state
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#090909', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(255,60,100,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,60,100,0.3)' }}>
          <Heart size={36} color="#ff3c64" />
        </div>
        <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Your Wishlist</h2>
        <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.6 }}>
          Login to save your favourite destinations and access them anytime.
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '1rem 2rem', background: 'var(--neon-cyan)', color: '#000', fontWeight: 700, fontSize: '1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(0,255,204,0.3)', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,204,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,204,0.3)'; }}
        >
          <LogIn size={20} /> Login to Access Wishlist
        </button>

        {showAuthModal && ReactDOM.createPortal(
          <AuthModal onClose={() => setShowAuthModal(false)} />,
          document.body
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#090909', padding: '8rem 2rem 6rem', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(255,60,100,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Heart size={32} color="#ff3c64" fill="#ff3c64" />
            <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>My Wishlist</h1>
          </div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            <span style={{ color: '#00ffcc', fontWeight: 600 }}>{user.email.split('@')[0]}</span> · {wishlist.length} destination{wishlist.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(255,60,100,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,60,100,0.2)' }}>
              <Heart size={36} color="#ff3c64" />
            </div>
            <h3 style={{ color: '#555', fontSize: '1.4rem', margin: 0 }}>No destinations saved yet</h3>
            <p style={{ color: '#444', fontSize: '1rem' }}>Open a city card and click the ♥ button to add it here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {wishlist.map(city => (
              <div
                key={city.id}
                style={{
                  background: '#111117', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  overflow: 'hidden', transition: 'all 0.3s',
                  cursor: 'pointer', position: 'relative'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,60,100,0.3)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,60,100,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Thumbnail */}
                <div
                  onClick={() => setSelectedCity(city)}
                  style={{ height: '200px', backgroundImage: `url(${city.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,17,23,1) 0%, transparent 60%)' }} />
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.5rem' }} onClick={() => setSelectedCity(city)}>
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.4rem', fontFamily: 'Poppins, sans-serif' }}>{city.name}</h3>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <span style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>{city.country}</span>
                    <span style={{ color: '#444' }}>·</span>
                    <span style={{ color: '#555', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {city.lat?.toFixed(2)}, {city.lng?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Row */}
                <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: '0.75rem' }}>
                  <a
                    href="https://www.makemytrip.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.7rem', background: 'var(--neon-cyan)', color: '#000', fontWeight: 700, fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--neon-cyan)'; }}
                  >
                    <Plane size={14} /> Book Now
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(city); }}
                    style={{ padding: '0.7rem 1rem', background: 'rgba(255,60,100,0.1)', border: '1px solid rgba(255,60,100,0.3)', color: '#ff3c64', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,60,100,0.2)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,60,100,0.1)'; }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCity && ReactDOM.createPortal(
        <CityModal city={selectedCity} onClose={() => setSelectedCity(null)} />,
        document.body
      )}
    </div>
  );
};

export default Wishlist;
