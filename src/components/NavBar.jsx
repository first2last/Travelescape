import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Compass, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const NavBar = () => {
  const [hovered, setHovered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '80px',
          zIndex: 100
        }}
      >
        <nav style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(17, 17, 17, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 255, 204, 0.2)',
          transform: hovered ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src="/images/travelscape_icon.png" alt="TravelScape" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px' }} className="text-gradient">
              TravelScape
            </span>
          </Link>

          <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center', margin: 0, fontWeight: 500, color: '#fff', padding: 0 }}>
            <li><Link to="/" style={{ color: '#fff' }}>Home</Link></li>
            <li>
              <span
                onClick={() => {
                  // If not on home, navigate then scroll. If on home, just scroll.
                  const el = document.getElementById('explore-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#explore-section';
                  }
                }}
                style={{ color: '#fff', cursor: 'pointer' }}
              >
                Explore
              </span>
            </li>
            <li><Link to="/wishlist" style={{ color: '#fff' }}>Wishlist</Link></li>
          </ul>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: '#fff' }}>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  background: 'rgba(0, 255, 204, 0.1)', padding: '6px 12px', 
                  borderRadius: '20px', border: '1px solid rgba(0, 255, 204, 0.3)' 
                }}>
                  <span style={{ width: '6px', height: '6px', background: '#00ffcc', borderRadius: '50%', boxShadow: '0 0 8px #00ffcc' }}></span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#00ffcc' }}>
                    {user.email.split('@')[0].toUpperCase()}
                  </span>
                </div>
                <LogOut 
                  size={20} 
                  onClick={logout} 
                  style={{ cursor: 'pointer', color: '#aaa', transition: 'color 0.2s' }} 
                  onMouseOver={e => e.currentTarget.style.color = '#ff4444'}
                  onMouseOut={e => e.currentTarget.style.color = '#aaa'}
                  title="Logout"
                />
              </div>
            ) : (
              <div 
                onClick={() => setShowAuthModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  cursor: 'pointer', transition: 'opacity 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = 0.7}
                onMouseOut={e => e.currentTarget.style.opacity = 1}
              >
                <User size={22} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>LOGIN</span>
              </div>
            )}

            <Menu size={24} style={{ cursor: 'pointer', display: 'none' }} className="mobile-menu" />
          </div>
        </nav>
      </div>

      {/* Portal: render modal directly to document.body, outside the 80px NavBar clip zone */}
      {showAuthModal && ReactDOM.createPortal(
        <AuthModal onClose={() => setShowAuthModal(false)} />,
        document.body
      )}
    </>
  );
};

export default NavBar;
