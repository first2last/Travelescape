import React, { useState, useEffect } from 'react';
import { X, MapPin, CheckCircle, UploadCloud } from 'lucide-react';
import { addCustomCity } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const FieldInput = ({ type = 'text', name, placeholder, value, onChange, textarea }) => {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    width: '100%', padding: '0.9rem 1.1rem',
    background: '#1a1a22',
    border: `1px solid ${focused ? '#ff0044' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '10px', color: '#ffffff', fontSize: '0.95rem',
    outline: 'none', fontFamily: 'Roboto, sans-serif',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 12px rgba(255, 0, 68, 0.25)' : 'none',
    resize: textarea ? 'vertical' : 'none', display: 'block'
  };
  if (textarea) {
    return <textarea name={name} placeholder={placeholder} value={value} onChange={onChange} rows={4}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={baseStyle} />;
  }
  return <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={baseStyle} />;
};

const AddCityModal = ({ onClose }) => {
  const { user, addUserCity } = useAuth();
  const [formData, setFormData] = useState({ name: '', lat: '', lng: '', founded: '', history: '', places: '', thumbnail: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim() || !formData.lat || !formData.lng) {
      setError('City name, latitude, and longitude are required.'); return;
    }
    const parsedLat = parseFloat(formData.lat);
    const parsedLng = parseFloat(formData.lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) { setError('Lat/Lng must be valid numbers.'); return; }
    if (parsedLat < -90 || parsedLat > 90) { setError('Latitude must be between -90 and 90.'); return; }
    if (parsedLng < -180 || parsedLng > 180) { setError('Longitude must be between -180 and 180.'); return; }

    try {
      const city = { ...formData, lat: parsedLat, lng: parsedLng, id: `custom_${Date.now()}`, isCustom: true };
      addUserCity(city);    // save to user's localStorage
      addCustomCity(city);  // inject into globe/explore
      setSuccess(true);
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      setError('Failed to add city. Please try again.');
    }
  };

  const labelStyle = { display: 'block', color: '#aaaaaa', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '520px', maxHeight: '92vh', overflowY: 'auto', background: '#12121a', borderRadius: '18px', border: '1px solid rgba(255, 0, 68, 0.35)', boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(255, 0, 68, 0.1)', padding: '2.5rem', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 1rem', background: 'rgba(255, 0, 68, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 0, 68, 0.4)' }}>
            <MapPin size={28} color="#ff0044" />
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: 'Poppins, sans-serif' }}>Add Your City</h2>
          <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Logged in as <span style={{ color: '#00ffcc', fontWeight: 600 }}>{user?.email}</span>
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 0, 68, 0.1)', border: '1px solid rgba(255, 0, 68, 0.5)', color: '#ff6688', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', gap: '1rem', color: '#00ffcc', textAlign: 'center' }}>
            <CheckCircle size={56} />
            <h3 style={{ color: '#00ffcc', fontSize: '1.3rem', margin: 0, fontFamily: 'Poppins, sans-serif' }}>City Added!</h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Your pin is now live on the globe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>City Name *</label>
                <FieldInput name="name" placeholder="e.g. My Hometown" value={formData.name} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Latitude *</label>
                  <FieldInput name="lat" placeholder="e.g. 28.6139" value={formData.lat} onChange={handleChange} />
                </div>
                <div>
                  <label style={labelStyle}>Longitude *</label>
                  <FieldInput name="lng" placeholder="e.g. 77.2090" value={formData.lng} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Year Established</label>
                <FieldInput name="founded" placeholder="e.g. 1648 or Ancient" value={formData.founded} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Image URL</label>
                <FieldInput name="thumbnail" placeholder="https://..." value={formData.thumbnail} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Places to Visit</label>
                <FieldInput name="places" placeholder="e.g. Central Park, Old Fort, Lake View" value={formData.places} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Brief History</label>
                <FieldInput name="history" placeholder="Write a short history of your city..." value={formData.history} onChange={handleChange} textarea />
              </div>
              <button type="submit" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #ff0044, #cc0033)', color: '#ffffff', fontWeight: 700, fontSize: '1rem', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(255, 0, 68, 0.4)', transition: 'opacity 0.2s, transform 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <UploadCloud size={18} /> Add City to Globe
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCityModal;
