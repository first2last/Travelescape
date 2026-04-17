import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { fetchCities } from '../utils/api';
import DestinationCard from '../components/DestinationCard';
import CityModal from '../components/CityModal';

const Explore = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const loadCities = () => fetchCities().then(setCities);

  useEffect(() => {
    loadCities();
    window.addEventListener('cities_updated', loadCities);
    return () => window.removeEventListener('cities_updated', loadCities);
  }, []);

  return (
    <div id="explore-section" style={{ padding: '6rem 0 10rem', background: '#090909', position: 'relative' }}>
      {/* Decorative Blur Orbs */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(0, 255, 204, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(255, 0, 255, 0.03) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="content-wrap" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '1rem', display: 'inline-block' }}>
            Explore Destinations
          </h2>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Browse our curated collection of global destinations. Click any card to dive deeper.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {cities.map(city => (
            <DestinationCard
              key={city.id}
              id={city.id}
              imageSrc={city.thumbnail}
              title={city.name}
              lat={city.lat}
              lng={city.lng}
              onClick={() => setSelectedCity(city)}
            />
          ))}
        </div>
      </div>

      {selectedCity && ReactDOM.createPortal(
        <CityModal city={selectedCity} onClose={() => setSelectedCity(null)} />,
        document.body
      )}
    </div>
  );
};

export default Explore;
