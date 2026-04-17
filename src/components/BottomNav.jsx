import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User } from 'lucide-react';

const BottomNav = ({ onLoginClick }) => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { label: 'Home', icon: Home, to: '/', id: 'home' },
    { label: 'Explore', icon: Compass, to: '/#explore-section', id: 'explore', scroll: true },
    { label: 'Wishlist', icon: Heart, to: '/wishlist', id: 'wishlist' },
    { label: 'Account', icon: User, to: null, id: 'account', action: onLoginClick },
  ];

  const isActive = (tab) => {
    if (tab.id === 'home') return path === '/';
    if (tab.id === 'wishlist') return path === '/wishlist';
    return false;
  };

  return (
    <>
      <style>{`
        @keyframes tabGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(0,255,204,0.4); }
          50% { box-shadow: 0 0 18px rgba(0,255,204,0.7); }
        }
        .bottom-nav-tab:active {
          transform: scale(0.88);
        }
      `}</style>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '68px',
        background: 'rgba(10, 10, 14, 0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,255,204,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;

          const inner = (
            <div
              className="bottom-nav-tab"
              onClick={tab.action || undefined}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '3px', padding: '8px 20px', borderRadius: '14px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                background: active ? 'rgba(0,255,204,0.08)' : 'transparent',
                animation: active ? 'tabGlow 2s ease-in-out infinite' : 'none'
              }}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.7}
                color={active ? '#00ffcc' : 'rgba(255,255,255,0.45)'}
                style={{ transition: 'all 0.25s' }}
              />
              <span style={{
                fontSize: '10px', fontWeight: active ? 700 : 400,
                color: active ? '#00ffcc' : 'rgba(255,255,255,0.4)',
                letterSpacing: active ? '0.5px' : '0',
                transition: 'all 0.25s', fontFamily: 'Roboto, sans-serif'
              }}>
                {tab.label}
              </span>
              {active && (
                <div style={{
                  width: '4px', height: '4px', background: '#00ffcc',
                  borderRadius: '50%', boxShadow: '0 0 8px #00ffcc',
                  position: 'absolute'
                }} />
              )}
            </div>
          );

          if (tab.to && !tab.action) {
            return (
              <Link
                key={tab.id}
                to={tab.to}
                style={{ textDecoration: 'none', position: 'relative', display: 'flex' }}
                onClick={tab.scroll ? (e) => {
                  e.preventDefault();
                  const el = document.getElementById('explore-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } : undefined}
              >
                {inner}
              </Link>
            );
          }

          return <div key={tab.id} style={{ position: 'relative', display: 'flex' }}>{inner}</div>;
        })}
      </nav>
    </>
  );
};

export default BottomNav;
