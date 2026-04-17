import React from 'react';

const DestinationCard = ({ id, imageSrc, title, lat, lng, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
      position: 'relative',
      height: '380px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
      borderRadius: '20px',
      background: 'rgba(15, 15, 17, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-12px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 255, 204, 0.15)';
      e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.4)';
      const bg = e.currentTarget.querySelector('.card-bg');
      if (bg) {
        bg.style.transform = 'scale(1.12)';
        bg.style.opacity = '0.7';
      }
      const titleEl = e.currentTarget.querySelector('.card-title');
      if (titleEl) {
        titleEl.style.textShadow = '0 0 15px rgba(255,255,255,0.6)';
      }
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
      const bg = e.currentTarget.querySelector('.card-bg');
      if (bg) {
        bg.style.transform = 'scale(1)';
        bg.style.opacity = '0.35';
      }
      const titleEl = e.currentTarget.querySelector('.card-title');
      if (titleEl) {
        titleEl.style.textShadow = '0 4px 10px rgba(0,0,0,0.9)';
      }
    }}
    >
      <div 
        className="card-bg"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          zIndex: 0
        }} 
      />
      
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '2rem 1.5rem',
        background: 'linear-gradient(to top, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.6) 60%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '1.6rem', margin: '0 0 0.25rem', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.9)', letterSpacing: '-0.5px', transition: 'text-shadow 0.3s ease' }}>{title}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', margin: 0, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.5px' }}>
              LAT/LONG DATA
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--neon-cyan)', margin: 0, fontSize: '0.9rem', fontWeight: 800, textShadow: '0 0 10px rgba(0,255,204,0.3)' }}>
              {lat.toFixed(3)}° N
            </p>
            <p style={{ color: 'var(--neon-cyan)', margin: 0, fontSize: '0.9rem', fontWeight: 800, textShadow: '0 0 10px rgba(0,255,204,0.3)' }}>
              {lng.toFixed(3)}° E
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
