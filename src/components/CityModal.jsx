import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, MapPin, Tag, Plane, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import AuthModal from './AuthModal';

const CityModal = ({ city, onClose }) => {
  const { user, toggleWishlist, isWishlisted } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const wishlisted = isWishlisted(city?.id);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!city) return null;

  const handleWishlist = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toggleWishlist(city);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem'
        }}
        onClick={onClose}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        `}</style>

        <div
          style={{
            width: '100%', maxWidth: '900px', maxHeight: '90vh',
            background: 'rgba(12, 12, 14, 0.98)',
            borderRadius: '24px',
            border: '1px solid rgba(0, 255, 204, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 204, 0.05)',
            overflowY: 'auto', position: 'relative',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, transition: 'all 0.2s',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,0,0,0.2)'; e.currentTarget.style.borderColor = '#ff4444'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <X size={20} />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            title={user ? (wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist') : 'Login to add to Wishlist'}
            style={{
              position: 'absolute', top: '20px', right: '70px',
              background: wishlisted ? 'rgba(255, 60, 100, 0.25)' : 'rgba(0,0,0,0.5)',
              border: `1px solid ${wishlisted ? 'rgba(255,60,100,0.6)' : 'rgba(255,255,255,0.1)'}`,
              color: wishlisted ? '#ff3c64' : '#aaa',
              width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, transition: 'all 0.2s',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,60,100,0.25)';
              e.currentTarget.style.borderColor = 'rgba(255,60,100,0.6)';
              e.currentTarget.style.color = '#ff3c64';
            }}
            onMouseOut={(e) => {
              if (!wishlisted) {
                e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#aaa';
              }
            }}
          >
            <Heart size={18} fill={wishlisted ? '#ff3c64' : 'none'} />
          </button>

          {/* Header Image */}
          <div style={{ width: '100%', height: isMobile ? '240px' : '350px', backgroundImage: `url(${city.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, rgba(12,12,14,1) 0%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: isMobile ? '1rem' : '2rem', left: isMobile ? '1.5rem' : '2.5rem', right: isMobile ? '1.5rem' : 'auto' }}>
              <h2 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', margin: 0, color: '#fff', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.8)', lineHeight: 1.1 }}>{city.name}</h2>
              <div style={{ display: 'flex', gap: isMobile ? '8px' : '15px', alignItems: 'center', marginTop: '5px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--neon-cyan)', fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{city.country}</span>
                <span style={{ color: '#666' }}>•</span>
                <span style={{ color: '#aaa', fontSize: isMobile ? '0.85rem' : '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={isMobile ? 12 : 16} /> {city.lat.toFixed(2)} / {city.lng.toFixed(2)}
                </span>
                {user && (
                  <>
                    {/* hidden on tiny screens to save space, but visible otherwise */}
                    {!isMobile && <span style={{ color: '#666' }}>•</span>}
                    <span style={{ color: wishlisted ? '#ff3c64' : '#555', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={13} fill={wishlisted ? '#ff3c64' : 'none'} />
                      {wishlisted ? 'Wishlisted' : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: isMobile ? '1.5rem' : '2.5rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)', gap: isMobile ? '1.5rem' : '3rem' }}>

            {/* Main Column */}
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--neon-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--neon-cyan)' }}></span>
                Brief History
              </h3>
              <p style={{ color: '#aaa', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>{city.details.history}</p>

              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--neon-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--neon-cyan)' }}></span>
                Notable Places to Visit
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                {city.details.places.map((place, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', borderLeft: '2px solid rgba(0, 255, 204, 0.3)', color: '#ddd', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} style={{ color: 'var(--neon-cyan)' }} /> {place}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div style={{ background: 'rgba(0, 255, 204, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(0, 255, 204, 0.1)' }}>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#777', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>Founded In</h4>
                  <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 600 }}>{city.details.founded}</div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#777', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} /> Best Time To Visit
                  </h4>
                  <div style={{ color: '#00ffcc', fontSize: '1.1rem', fontWeight: 500, textShadow: '0 0 10px rgba(0,255,204,0.3)' }}>{city.details.bestTime}</div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#777', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={14} /> Tags
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {city.details.traits.map((trait, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: '#bbb', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wishlist CTA */}
                <button
                  onClick={handleWishlist}
                  style={{
                    width: '100%', padding: '0.9rem', marginBottom: '1rem',
                    background: wishlisted ? 'rgba(255,60,100,0.15)' : 'rgba(255,255,255,0.05)',
                    color: wishlisted ? '#ff3c64' : '#aaa',
                    border: `1px solid ${wishlisted ? 'rgba(255,60,100,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                    fontSize: '0.9rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,60,100,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,60,100,0.6)'; e.currentTarget.style.color = '#ff3c64'; }}
                  onMouseOut={(e) => {
                    if (!wishlisted) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#aaa'; }
                  }}
                >
                  <Heart size={16} fill={wishlisted ? '#ff3c64' : 'none'} />
                  {user ? (wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist') : 'Login to Wishlist'}
                </button>

                {/* Travel Now */}
                <a href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '1rem', background: 'var(--neon-cyan)', color: '#000', fontWeight: 800, fontSize: '1rem', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 0 20px rgba(0, 255, 204, 0.3)', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'var(--neon-cyan)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Plane size={20} /> Travel Now
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth gate if user tries to wishlist without logging in */}
      {showAuthModal && ReactDOM.createPortal(
        <AuthModal onClose={() => setShowAuthModal(false)} />,
        document.body
      )}
    </>
  );
};

export default CityModal;
