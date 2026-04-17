import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import MobileHome from './pages/MobileHome';
import Explore from './pages/Explore';
import Wishlist from './pages/Wishlist';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { useIsMobile } from './hooks/useIsMobile';
import AuthModal from './components/AuthModal';

// Inner app that can use hooks
function AppInner() {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isMobile) {
    return (
      <>
        <Routes>
          <Route path="/" element={<MobileHome />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
        <BottomNav onLoginClick={() => setShowAuthModal(true)} />

        {showAuthModal && ReactDOM.createPortal(
          <AuthModal onClose={() => setShowAuthModal(false)} />,
          document.body
        )}
      </>
    );
  }

  // Desktop layout — unchanged
  return (
    <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="/" element={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Home />
              <Explore />
            </div>
          } />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}

export default App;
