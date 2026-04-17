import React from 'react';

const Button = ({ label, onClick, variant = 'primary', style }) => {
  const baseStyle = {
    padding: '0.85rem 2rem',
    borderRadius: '30px',
    border: 'none',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontSize: '0.85rem',
    backdropFilter: 'blur(10px)',
  };

  const variants = {
    primary: {
      background: 'rgba(0, 255, 204, 0.05)',
      color: '#00ffcc',
      border: '1px solid rgba(0, 255, 204, 0.4)',
      boxShadow: '0 0 20px rgba(0, 255, 204, 0.1)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-main)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
    }
  };

  return (
    <button 
      onClick={onClick} 
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        if(variant === 'primary') {
          e.target.style.background = 'rgba(0, 255, 204, 0.15)';
          e.target.style.boxShadow = '0 8px 30px rgba(0, 255, 204, 0.3)';
          e.target.style.borderColor = 'rgba(0, 255, 204, 0.8)';
        }
        if(variant === 'outline') {
          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        }
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        if(variant === 'primary') {
          e.target.style.background = 'rgba(0, 255, 204, 0.05)';
          e.target.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.1)';
          e.target.style.borderColor = 'rgba(0, 255, 204, 0.4)';
        }
        if(variant === 'outline') {
          e.target.style.background = 'transparent';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
      }}
    >
      {label}
    </button>
  );
};

export default Button;
