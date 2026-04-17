import React from 'react';
import { Globe, Compass, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0a0a0b',
      borderTop: '1px solid rgba(0, 255, 204, 0.1)',
      padding: '5rem 5% 3rem',
      position: 'relative',
      zIndex: 100,
      fontFamily: 'var(--font-body)',
    }}>
      {/* Decorative gradient bleed */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '30%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)', boxShadow: '0 0 15px var(--neon-cyan)' }} />
      
      <div style={{
        maxWidth: 'var(--layout-max-width)',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '4rem'
      }}>
        
        {/* Brand Column */}
        <div style={{ flex: '1 1 350px' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '1.2rem', display: 'inline-block' }}>
            TravelScape
          </h2>
          <p style={{ color: '#888', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: '85%' }}>
            A next-generation hyper-realistic geospatial engine designed to uncover the world's most breathtaking destinations. Explore coordinates entirely within a 3D interface.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <SocialIcon Icon={Globe} />
            <SocialIcon Icon={Compass} />
            <SocialIcon Icon={MapPin} />
          </div>
        </div>

        {/* Links Column */}
        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ color: '#eee', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem', fontWeight: 700 }}>Platform Hub</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <FooterLink label="Explore Engine" />
            <FooterLink label="Interactive Globe" />
            <FooterLink label="Top Destinations" />
            <FooterLink label="Live Metrics" />
          </ul>
        </div>

        {/* Links Column */}
        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ color: '#eee', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem', fontWeight: 700 }}>Company</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <FooterLink label="About Us" />
            <FooterLink label="Careers" />
            <FooterLink label="Privacy Policy" />
            <FooterLink label="Terms of Service" />
          </ul>
        </div>

      </div>

      {/* Copyright Line */}
      <div style={{
        maxWidth: 'var(--layout-max-width)',
        margin: '0 auto',
        marginTop: '4rem',
        paddingTop: '2.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ color: '#555', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} TravelScape Systems. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffcc', boxShadow: '0 0 10px #00ffcc' }}></span>
          <span style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>System Online</span>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon }) => (
  <a 
    href="#" 
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#aaa',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = 'rgba(0, 255, 204, 0.1)';
      e.currentTarget.style.borderColor = 'rgba(0, 255, 204, 0.5)';
      e.currentTarget.style.color = '#00ffcc';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 255, 204, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.color = '#aaa';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <Icon size={20} />
  </a>
);

const FooterLink = ({ label }) => (
  <li>
    <a 
      href="#" 
      style={{ 
        color: '#777', 
        fontSize: '0.95rem',
        transition: 'all 0.2s ease',
        display: 'inline-block'
      }}
      onMouseOver={(e) => {
        e.target.style.color = '#00ffcc';
        e.target.style.textShadow = '0 0 10px rgba(0, 255, 204, 0.4)';
        e.target.style.transform = 'translateX(4px)';
      }}
      onMouseOut={(e) => {
         e.target.style.color = '#777';
         e.target.style.textShadow = 'none';
         e.target.style.transform = 'translateX(0)';
      }}
    >
      {label}
    </a>
  </li>
);

export default Footer;
