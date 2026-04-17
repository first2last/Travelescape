import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, X, MapPin, ArrowRight, Plus, Monitor } from 'lucide-react';
import { fetchCities } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CityModal from '../components/CityModal';
import AuthModal from '../components/AuthModal';
import AddCityModal from '../components/AddCityModal';

// ─── One-Time Desktop Hint Popup ─────────────────────────────────────────────
const DesktopHintPopup = ({ onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem',
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(8px)',
    animation: 'hintFadeIn 0.35s ease both'
  }}>
    <style>{`
      @keyframes hintFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes hintSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
    `}</style>
    <div style={{
      background: 'linear-gradient(145deg, #141420, #0e0e18)',
      border: '1px solid rgba(0,255,204,0.22)',
      borderRadius: '22px',
      padding: '2.2rem 2rem 1.8rem',
      maxWidth: '320px', width: '100%',
      position: 'relative', textAlign: 'center',
      boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(0,255,204,0.06)',
      animation: 'hintSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both'
    }}>
      {/* Close X */}
      <button onClick={onClose} style={{
        position: 'absolute', top: '14px', right: '14px',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%', width: '30px', height: '30px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
        transition: 'all 0.2s'
      }}
        onTouchStart={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        onTouchEnd={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
      >
        <X size={15} />
      </button>

      {/* Icon */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 1.1rem',
        background: 'rgba(0,255,204,0.08)',
        border: '1px solid rgba(0,255,204,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Monitor size={24} color="#00ffcc" />
      </div>

      <h3 style={{
        color: '#fff', fontSize: '1.1rem', fontWeight: 800,
        fontFamily: 'Poppins, sans-serif', margin: '0 0 0.6rem', letterSpacing: '-0.3px'
      }}>
        Best on Desktop
      </h3>
      <p style={{
        color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.6,
        margin: '0 0 1.4rem'
      }}>
        TravelScape features an interactive 3D globe and rich UI best experienced on a desktop or larger screen.
      </p>

      <button onClick={onClose} style={{
        width: '100%', padding: '0.75rem',
        background: '#00ffcc', color: '#000',
        fontWeight: 800, fontSize: '0.9rem',
        borderRadius: '12px', border: 'none', cursor: 'pointer',
        boxShadow: '0 0 18px rgba(0,255,204,0.3)',
        letterSpacing: '0.3px', transition: 'opacity 0.2s'
      }}
        onTouchStart={e => e.currentTarget.style.opacity = '0.8'}
        onTouchEnd={e => e.currentTarget.style.opacity = '1'}
      >
        Got it!
      </button>
    </div>
  </div>
);

// ─── Filters ─────────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'India'];

const filterMap = {
  Asia: ['Tokyo', 'Bali', 'Bangkok', 'Singapore', 'Dubai', 'Seoul', 'Hong Kong'],
  Europe: ['Paris', 'Rome', 'Zurich', 'Amsterdam', 'Barcelona', 'London', 'Prague', 'Reykjavik'],
  Americas: ['New York', 'Los Angeles', 'San Francisco', 'Banff', 'Vancouver', 'Rio de Janeiro', 'Machu Picchu', 'Buenos Aires', 'Santiago'],
  Africa: ['Cape Town', 'Nairobi', 'Marrakech', 'Cairo'],
  Oceania: ['Sydney', 'Melbourne', 'Queenstown', 'Auckland'],
  India: ['New Delhi', 'Mumbai', 'Jaipur', 'Leh', 'Goa'],
};

// ─── CSS Globe — with real visible rotation ───────────────────────────────────
const CSSGlobe = () => (
  <>
    <style>{`
      /* Horizontal stripe sweep — simulates the globe surface rotating (slowed to 18s) */
      @keyframes globeSurfaceSpin {
        from { background-position: 0% 50%; }
        to   { background-position: 200% 50%; }
      }
      /* Blinking desktop note */
      @keyframes noteBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      /* Outer glow pulse */
      @keyframes globePulse {
        0%, 100% { box-shadow: 0 0 30px rgba(0,255,204,0.3), 0 0 60px rgba(0,255,204,0.1); }
        50%       { box-shadow: 0 0 55px rgba(0,255,204,0.55), 0 0 100px rgba(0,255,204,0.18); }
      }
      /* Orbit dot circling */
      @keyframes orbitDot {
        from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
        to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
      }
      @keyframes orbitDot2 {
        from { transform: rotate(120deg) translateX(95px) rotate(-120deg); }
        to   { transform: rotate(480deg) translateX(95px) rotate(-480deg); }
      }
      /* Location pin float */
      @keyframes pinFloat {
        0%, 100% { transform: translateY(0px); opacity: 1; }
        50%       { transform: translateY(-5px); opacity: 0.8; }
      }
    `}</style>

    <div style={{ position: 'relative', width: '190px', height: '190px', margin: '0 auto' }}>

      {/* ── Sphere ── */}
      <div style={{
        width: '190px', height: '190px', borderRadius: '50%',
        /* Base radial gradient gives 3D depth */
        background: 'radial-gradient(circle at 35% 32%, rgba(0,255,204,0.22) 0%, rgba(0,100,110,0.45) 38%, rgba(0,18,28,0.97) 100%)',
        border: '1.5px solid rgba(0,255,204,0.4)',
        animation: 'globePulse 3s ease-in-out infinite',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Rotating longitude stripes — this is what creates the "spinning" effect */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(0,255,204,0.07) 0px,
            rgba(0,255,204,0.07) 1px,
            transparent 1px,
            transparent 24px
          )`,
          backgroundSize: '200% 100%',
          animation: 'globeSurfaceSpin 18s linear infinite',
        }} />

        {/* Static latitude lines (horizontal) */}
        {[38, 70, 95, 120, 152].map(top => (
          <div key={top} style={{
            position: 'absolute', left: 0, right: 0, top: `${top}px`,
            height: '1px', background: 'rgba(0,255,204,0.13)'
          }} />
        ))}

        {/* Specular highlight */}
        <div style={{
          position: 'absolute', top: '12%', left: '18%',
          width: '45px', height: '45px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* ── Orbit dot 1 (cyan) ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '10px', height: '10px', marginTop: '-5px', marginLeft: '-5px',
        animation: 'orbitDot 5s linear infinite',
      }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: '#00ffcc', boxShadow: '0 0 12px #00ffcc, 0 0 24px rgba(0,255,204,0.5)'
        }} />
      </div>

      {/* ── Orbit dot 2 (magenta) ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '8px', height: '8px', marginTop: '-4px', marginLeft: '-4px',
        animation: 'orbitDot2 8s linear infinite',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#ff44ff', boxShadow: '0 0 10px #ff44ff'
        }} />
      </div>

      {/* ── Floating location pins ── */}
      {[
        { top: '22%', left: '58%', delay: '0s' },
        { top: '52%', left: '28%', delay: '0.9s' },
        { top: '68%', left: '64%', delay: '1.7s' },
      ].map((dot, i) => (
        <div key={i} style={{
          position: 'absolute', top: dot.top, left: dot.left,
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#00ffcc', boxShadow: '0 0 10px #00ffcc',
          animation: `pinFloat 2.6s ease-in-out ${dot.delay} infinite`
        }} />
      ))}
    </div>
  </>
);

// ─── Swipeable Destination Card ───────────────────────────────────────────────
const DestCard = ({ city, onOpen }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={() => onOpen(city)}
      style={{
        /* Fixed card dimensions — critical for the flex row to work */
        width: '260px',
        flexShrink: 0,
        height: '400px',
        borderRadius: '24px',
        overflow: 'hidden', position: 'relative', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 0.18s cubic-bezier(0.16,1,0.3,1), box-shadow 0.18s',
        boxShadow: pressed ? '0 4px 20px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.55)',
        scrollSnapAlign: 'start',  /* moved here from wrapper */
        willChange: 'transform',
      }}
    >
      <img
        src={city.thumbnail}
        alt={city.name}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)'
      }} />

      {/* Country badge */}
      <div style={{
        position: 'absolute', top: '14px', right: '14px',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,255,204,0.4)',
        padding: '3px 10px', borderRadius: '20px',
        color: '#00ffcc', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px'
      }}>
        {city.country}
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
        <h3 style={{
          color: '#fff', fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px',
          fontFamily: 'Poppins, sans-serif', lineHeight: 1.1, letterSpacing: '-0.5px',
          textShadow: '0 2px 10px rgba(0,0,0,0.9)'
        }}>
          {city.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.85rem' }}>
          <MapPin size={12} color="rgba(255,255,255,0.45)" />
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>
            {city.lat?.toFixed(1)}°, {city.lng?.toFixed(1)}°
          </span>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(0,255,204,0.15)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,255,204,0.5)',
          color: '#00ffcc', padding: '8px 16px', borderRadius: '30px',
          fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}>
          Explore <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MobileHome = () => {
  const { user } = useAuth();
  const [cities, setCities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  // Show popup only once per session (not on every page navigation)
  const [showHint, setShowHint] = useState(() => !sessionStorage.getItem('ts_hint_shown'));
  const scrollRef = useRef(null);

  const dismissHint = () => {
    sessionStorage.setItem('ts_hint_shown', '1');
    setShowHint(false);
  };

  const loadCities = () => fetchCities().then(data => { setCities(data); setFiltered(data); });

  useEffect(() => {
    loadCities();
    window.addEventListener('cities_updated', loadCities);
    return () => window.removeEventListener('cities_updated', loadCities);
  }, []);

  useEffect(() => {
    let result = cities;
    if (search) {
      result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    } else if (activeFilter !== 'All') {
      const names = filterMap[activeFilter] || [];
      result = result.filter(c => names.includes(c.name));
    }
    setFiltered(result);
  }, [search, activeFilter, cities]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setSuggestions(
      val.length > 1
        ? cities.filter(c => c.name.toLowerCase().startsWith(val.toLowerCase())).slice(0, 5)
        : []
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090909', paddingBottom: '90px', overflowX: 'hidden' }}>
      <style>{`
        .card-scroll::-webkit-scrollbar { display: none; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        @keyframes heroFade { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        padding: '4.5rem 1.5rem 1.5rem', textAlign: 'center',
        animation: 'heroFade 0.8s cubic-bezier(0.16,1,0.3,1) both'
      }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <CSSGlobe />
        </div>

        {/* Desktop note — blinking */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '5px 14px', marginBottom: '1.2rem'
        }}>
          <Monitor size={12} color="rgba(255,255,255,0.35)" />
          <span style={{
            color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.2px',
            animation: 'noteBlink 2s ease-in-out infinite'
          }}>
            Best experienced on desktop or larger screens
          </span>
        </div>

        <h1 style={{
          fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.1, margin: '0 0 0.65rem',
          fontFamily: 'Poppins, sans-serif', letterSpacing: '-1px',
          background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 40%, #00ffcc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>
          Explore the<br />World
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.6rem' }}>
          Discover stunning destinations around the globe
        </p>

        {/* ── Search bar ── */}
        <div style={{ position: 'relative', maxWidth: '360px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px',
            padding: '0.8rem 1.1rem',
          }}>
            <Search size={16} color="rgba(255,255,255,0.35)" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search destinations..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#fff', fontSize: '0.93rem', fontFamily: 'Roboto, sans-serif',
              }}
            />
            {search && (
              <X size={15} color="rgba(255,255,255,0.35)" style={{ cursor: 'pointer', flexShrink: 0 }}
                onClick={() => { setSearch(''); setSuggestions([]); }} />
            )}
          </div>

          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: '#1a1a22', borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden', zIndex: 50,
              boxShadow: '0 16px 40px rgba(0,0,0,0.75)'
            }}>
              {suggestions.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSearch(s.name); setSuggestions([]); setSelectedCity(s); }}
                  style={{
                    padding: '0.8rem 1.1rem', display: 'flex', alignItems: 'center', gap: '10px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
                  }}
                  onTouchStart={e => e.currentTarget.style.background = 'rgba(0,255,204,0.08)'}
                  onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={13} color="#00ffcc" />
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{s.name}</div>
                    <div style={{ color: '#555', fontSize: '0.72rem' }}>{s.country}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="filter-scroll" style={{
        display: 'flex', gap: '8px', overflowX: 'auto',
        padding: '0 1.5rem 1rem', scrollbarWidth: 'none'
      }}>
        {FILTERS.map(f => {
          const active = activeFilter === f;
          return (
            <button key={f} onClick={() => { setActiveFilter(f); setSearch(''); }} style={{
              flexShrink: 0,
              padding: '7px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              background: active ? '#00ffcc' : 'rgba(255,255,255,0.07)',
              color: active ? '#000' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${active ? '#00ffcc' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: active ? '0 0 14px rgba(0,255,204,0.4)' : 'none',
            }}>
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Featured Swipeable Cards ── */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'Poppins, sans-serif' }}>
            {activeFilter === 'All' ? 'Featured' : activeFilter}
          </h2>
          <span style={{ color: '#00ffcc', fontSize: '0.78rem', fontWeight: 600 }}>
            {filtered.length} destinations
          </span>
        </div>

        {/* Horizontal scroll strip — cards must be direct children with fixed width */}
        <div
          ref={scrollRef}
          className="card-scroll"
          style={{
            display: 'flex',
            flexDirection: 'row',        /* explicit: never wrap */
            flexWrap: 'nowrap',
            gap: '14px',
            overflowX: 'scroll',         /* scroll, not auto — more reliable on mobile */
            overflowY: 'visible',
            padding: '6px 1.5rem 14px',
            scrollbarWidth: 'none',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
          }}
        >
          {(() => {
            let featured = filtered.slice(0, 12);
            if (activeFilter === 'All' && !search && filtered.length > 0) {
              const targetNames = ['Paris', 'Tokyo', 'Goa', 'New York', 'Jaipur', 'Bali', 'London', 'Dubai', 'Mumbai', 'Rome', 'Sydney'];
              const customFeatured = [];
              targetNames.forEach(name => {
                const c = filtered.find(city => city.name === name);
                if (c) customFeatured.push(c);
              });
              // Fill any remaining slots up to 12
              const remaining = filtered.filter(c => !customFeatured.includes(c));
              featured = [...customFeatured, ...remaining].slice(0, 12);
            }
            return featured.map(city => (
              <DestCard key={city.id} city={city} onOpen={setSelectedCity} />
            ));
          })()}
        </div>
      </div>

      {/* ── All Destinations Grid ── */}
      {filtered.length > 0 && (
        <div id="explore-section" style={{ padding: '0.5rem 1.5rem 1.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'Poppins, sans-serif' }}>
            All Destinations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {filtered.map(city => (
              <div
                key={city.id}
                onClick={() => setSelectedCity(city)}
                style={{
                  borderRadius: '14px', overflow: 'hidden', position: 'relative',
                  height: '155px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)',
                }}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={city.thumbnail} alt={city.name} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 60%)'
                }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px' }}>
                  <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif', lineHeight: 1.2 }}>{city.name}</div>
                  <div style={{ color: '#00ffcc', fontSize: '0.68rem', fontWeight: 600, marginTop: '2px' }}>{city.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add City FAB ── */}
      <button
        onClick={() => user ? setShowAddModal(true) : setShowAuthModal(true)}
        style={{
          position: 'fixed', bottom: '82px', right: '20px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#00ffcc', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 22px rgba(0,255,204,0.55)',
          zIndex: 900, transition: 'transform 0.2s'
        }}
        onTouchStart={e => e.currentTarget.style.transform = 'scale(0.88)'}
        onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Add Your City"
      >
        <Plus size={24} color="#000" strokeWidth={2.5} />
      </button>

      {/* ── Modals ── */}
      {selectedCity && ReactDOM.createPortal(
        <CityModal city={selectedCity} onClose={() => setSelectedCity(null)} />,
        document.body
      )}
      {showAuthModal && ReactDOM.createPortal(
        <AuthModal onClose={() => setShowAuthModal(false)} />,
        document.body
      )}
      {showAddModal && ReactDOM.createPortal(
        <AddCityModal onClose={() => setShowAddModal(false)} />,
        document.body
      )}

      {/* ── One-time desktop hint popup ── */}
      {showHint && ReactDOM.createPortal(
        <DesktopHintPopup onClose={dismissHint} />,
        document.body
      )}
    </div>
  );
};

export default MobileHome;
